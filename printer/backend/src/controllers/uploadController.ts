import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

// Configure Multer
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });
export const uploadMiddleware = upload.array('files');

export const analyzeFile = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const analyzedFiles = await Promise.all(files.map(async (file) => {
            let pageCount = 1;
            const fileType = path.extname(file.originalname).toLowerCase().replace('.', '');

            if (fileType === 'pdf') {
                try {
                    const buffer = fs.readFileSync(file.path);
                    const pdfDoc = await PDFDocument.load(buffer);
                    pageCount = pdfDoc.getPageCount();
                } catch (e) {
                    console.error(`Error reading PDF ${file.originalname}:`, e);
                    // Fallback to 1 if corrupt or unreadable, or handle error
                }
            } else if (['jpg', 'jpeg', 'png', 'webp'].includes(fileType)) {
                // Images are 1 page by default
                pageCount = 1;
                // Optional: Validate image with sharp
                try {
                    await sharp(file.path).metadata();
                } catch (e) {
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
        }));

        res.json({ files: analyzedFiles });
    } catch (error) {
        console.error('File Analysis Error:', error);
        res.status(500).json({ error: 'Failed to analyze files' });
    }
};
