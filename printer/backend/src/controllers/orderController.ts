import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { shopId, mobile, works, totalAmount } = req.body;

        const order = await prisma.order.create({
            data: {
                shopId,
                mobile,
                totalAmount,
                status: 'PENDING',
                works: {
                    create: works.map((work: any) => ({
                        pageSize: work.pageSize,
                        colorType: work.colorType,
                        printSide: work.printSide,
                        copies: work.copies,
                        bindingType: work.bindingType,
                        paperType: work.paperType,
                        gsm: work.gsm,
                        calculatedPrice: work.calculatedPrice,
                        files: {
                            create: work.files.map((file: any) => ({
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
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                works: {
                    include: {
                        files: true
                    }
                }
            }
        });

        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
