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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        // 1. Create Default Shop
        const existingShop = yield prisma.shop.findFirst({
            where: { name: "Default Print Shop" }
        });
        let shop;
        if (existingShop) {
            shop = existingShop;
            console.log(`Shop already exists: ${shop.name} (${shop.id})`);
        }
        else {
            shop = yield prisma.shop.create({
                data: {
                    name: "Default Print Shop",
                    upiId: "shop@upi",
                    bankDetails: "Bank Name, Acc: 1234567890, IFSC: BANK0000123"
                }
            });
            console.log(`Created shop: ${shop.name} (${shop.id})`);
        }
        // 2. Create Pricing Rules (Dummy Data)
        const pricingRules = [
            { pageSize: 'A4', colorType: 'BW', printSide: 'SINGLE', basePrice: 2.00 },
            { pageSize: 'A4', colorType: 'BW', printSide: 'DOUBLE', basePrice: 3.00 },
            { pageSize: 'A4', colorType: 'COLOR', printSide: 'SINGLE', basePrice: 10.00 },
            { pageSize: 'A4', colorType: 'COLOR', printSide: 'DOUBLE', basePrice: 15.00 },
            { pageSize: 'A3', colorType: 'BW', printSide: 'SINGLE', basePrice: 5.00 },
            { pageSize: 'A3', colorType: 'BW', printSide: 'DOUBLE', basePrice: 8.00 },
            { pageSize: 'A3', colorType: 'COLOR', printSide: 'SINGLE', basePrice: 20.00 },
            { pageSize: 'A3', colorType: 'COLOR', printSide: 'DOUBLE', basePrice: 35.00 },
        ];
        for (const rule of pricingRules) {
            yield prisma.pricingRule.upsert({
                where: {
                    pageSize_colorType_printSide: {
                        pageSize: rule.pageSize,
                        colorType: rule.colorType,
                        printSide: rule.printSide
                    }
                },
                update: {
                    basePrice: rule.basePrice
                },
                create: rule
            });
        }
        console.log('Seeded pricing rules');
        // 3. Create Binding Options
        const bindingOptions = [
            { name: 'Spiral Binding', price: 30.00 },
            { name: 'Staple', price: 5.00 },
            { name: 'Tape Binding', price: 10.00 },
            { name: 'Hard Cover', price: 150.00 }
        ];
        for (const option of bindingOptions) {
            const existingOption = yield prisma.bindingOption.findFirst({
                where: { name: option.name }
            });
            if (existingOption) {
                yield prisma.bindingOption.update({
                    where: { id: existingOption.id },
                    data: { price: option.price }
                });
            }
            else {
                yield prisma.bindingOption.create({ data: option });
            }
        }
        console.log('Seeded binding options');
        // 4. Create Paper Types
        const paperTypes = [
            { name: 'Regular Paper', price: 0.00 },
            { name: 'Glossy Photo Paper', price: 5.00 },
            { name: 'Matte Photo Paper', price: 4.00 }
        ];
        for (const type of paperTypes) {
            const existingType = yield prisma.paperType.findFirst({
                where: { name: type.name }
            });
            if (existingType) {
                yield prisma.paperType.update({
                    where: { id: existingType.id },
                    data: { price: type.price }
                });
            }
            else {
                yield prisma.paperType.create({ data: type });
            }
        }
        console.log('Seeded paper types');
        // 5. Create GSM Options
        const gsmOptions = [
            { value: '80 GSM (Standard)', price: 0.00 },
            { value: '100 GSM (Premium)', price: 1.00 },
            { value: '120 GSM (Thick)', price: 2.00 }
        ];
        for (const option of gsmOptions) {
            const existingOption = yield prisma.gSMOption.findFirst({
                where: { value: option.value }
            });
            if (existingOption) {
                yield prisma.gSMOption.update({
                    where: { id: existingOption.id },
                    data: { price: option.price }
                });
            }
            else {
                yield prisma.gSMOption.create({ data: option });
            }
        }
        console.log('Seeded GSM options');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
