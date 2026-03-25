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
exports.getPricingRules = exports.calculatePrice = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const calculatePrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { works } = req.body; // Expects array of works with config and files
        // Fetch all pricing rules and binding options for efficiency
        const pricingRules = yield prisma.pricingRule.findMany();
        const bindingOptions = yield prisma.bindingOption.findMany();
        let orderTotal = 0;
        const pricedWorks = works.map((work) => {
            let workTotal = 0;
            // Calculate printing cost
            // 1. Determine sheets needed.
            // If SINGLE side: sheets = totalPageCount
            // If DOUBLE side: sheets = ceil(totalPageCount / 2)
            const totalPagesInWork = work.files.reduce((sum, file) => sum + (file.pageCount || 1), 0);
            let sheets = 0;
            if (work.printSide === 'DOUBLE') {
                sheets = Math.ceil(totalPagesInWork / 2);
            }
            else {
                sheets = totalPagesInWork;
            }
            // Find matching rule
            const rule = pricingRules.find(r => r.pageSize === work.pageSize &&
                r.colorType === work.colorType &&
                r.printSide === work.printSide);
            const basePrice = rule ? rule.basePrice : 0; // Default or error?
            const printCost = basePrice * sheets * (work.copies || 1);
            workTotal += printCost;
            // Binding Cost
            if (work.bindingType && work.bindingType !== 'NONE') {
                const binding = bindingOptions.find(b => b.name.toUpperCase() === work.bindingType.toUpperCase() || b.name === work.bindingType);
                if (binding) {
                    workTotal += binding.price * (work.copies || 1); // Binding per copy? Usually yes.
                }
            }
            orderTotal += workTotal;
            return Object.assign(Object.assign({}, work), { pricing: {
                    sheets,
                    basePrice,
                    printCost,
                    total: workTotal
                } });
        });
        res.json({
            works: pricedWorks,
            totalAmount: orderTotal
        });
    }
    catch (error) {
        console.error('Pricing Error:', error);
        res.status(500).json({ error: 'Failed to calculate price' });
    }
});
exports.calculatePrice = calculatePrice;
const getPricingRules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rules = yield prisma.pricingRule.findMany();
        const bindingOptions = yield prisma.bindingOption.findMany();
        const paperTypes = yield prisma.paperType.findMany();
        const gsmOptions = yield prisma.gSMOption.findMany();
        res.json({ rules, bindingOptions, paperTypes, gsmOptions });
    }
    catch (error) {
        console.error('Failed to fetch pricing rules:', error);
        res.status(500).json({ error: 'Failed to fetch pricing rules' });
    }
});
exports.getPricingRules = getPricingRules;
