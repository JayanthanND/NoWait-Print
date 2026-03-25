import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getShop = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let shop;

        // If shopId is "default" or not provided, get the first shop
        if (id === 'default' || !id) {
            shop = await prisma.shop.findFirst();
        } else {
            shop = await prisma.shop.findUnique({
                where: { id }
            });
        }

        if (!shop) {
            // Fallback if no specific shop found, just get any shop to unblock user flow
            shop = await prisma.shop.findFirst();
            if (!shop) return res.status(404).json({ error: 'Shop not found' });
        }

        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
