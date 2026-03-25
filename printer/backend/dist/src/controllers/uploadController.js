"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFile = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pdf_lib_1 = require("pdf-lib");
const sharp_1 = __importDefault(require("sharp"));
// Configure Multer
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
exports.uploadMiddleware = upload.array('files');
const analyzeFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const analyzedFiles = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            let pageCount = 1;
            const fileType = path_1.default.extname(file.originalname).toLowerCase().replace('.', '');
            if (fileType === 'pdf') {
                try {
                    const buffer = fs_1.default.readFileSync(file.path);
                    const pdfDoc = yield pdf_lib_1.PDFDocument.load(buffer);
                    pageCount = pdfDoc.getPageCount();
                }
                catch (e) {
                    console.error(`Error reading PDF ${file.originalname}:`, e);
                    // Fallback to 1 if corrupt or unreadable, or handle error
                }
            }
            else if (['jpg', 'jpeg', 'png', 'webp'].includes(fileType)) {
                // Images are 1 page by default
                pageCount = 1;
                // Optional: Validate image with sharp
                try {
                    yield (0, sharp_1.default)(file.path).metadata();
                }
                catch (e) {
                    console.error(`Error reading Image ${file.originalname}:`, e);
                }
            }
            return {
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                size: file.size,
                mimetype: file.mimetype,
                pageCount: pageCount,
                // Frontend might send specific requirements, but here we just return raw page count.
                // Printable pages will be calculated when user configures settings (single/double side).
                // Initially, printablePages = pageCount.
                printablePages: pageCount
            };
        })));
        res.json({ files: analyzedFiles });
    }
    catch (error) {
        console.error('File Analysis Error:', error);
        res.status(500).json({ error: 'Failed to analyze files' });
    }
});
exports.analyzeFile = analyzeFile;
