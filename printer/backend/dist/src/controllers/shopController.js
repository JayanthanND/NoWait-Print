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
exports.getShop = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let shop;
        // If shopId is "default" or not provided, get the first shop
        if (id === 'default' || !id) {
            shop = yield prisma.shop.findFirst();
        }
        else {
            shop = yield prisma.shop.findUnique({
                where: { id }
            });
        }
        if (!shop) {
            // Fallback if no specific shop found, just get any shop to unblock user flow
            shop = yield prisma.shop.findFirst();
            if (!shop)
                return res.status(404).json({ error: 'Shop not found' });
        }
        res.json(shop);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getShop = getShop;
