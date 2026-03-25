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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shopId, mobile, works, totalAmount } = req.body;
        const order = yield prisma.order.create({
            data: {
                shopId,
                mobile,
                totalAmount,
                status: 'PENDING',
                works: {
                    create: works.map((work) => ({
                        pageSize: work.pageSize,
                        colorType: work.colorType,
                        printSide: work.printSide,
                        copies: work.copies,
                        bindingType: work.bindingType,
                        paperType: work.paperType,
                        gsm: work.gsm,
                        calculatedPrice: work.calculatedPrice,
                        files: {
                            create: work.files.map((file) => ({
                                originalName: file.originalName,
                                filePath: file.filePath,
                                fileType: file.fileType,
                                pageCount: file.pageCount,
                                printablePages: file.printablePages,
                            }))
                        }
                    }))
                }
            },
            include: {
                works: {
                    include: {
                        files: true
                    }
                }
            }
        });
        res.json(order);
    }
    catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});
exports.createOrder = createOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield prisma.order.findUnique({
            where: { id },
            include: {
                works: {
                    include: {
                        files: true
                    }
                }
            }
        });
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getOrder = getOrder;
