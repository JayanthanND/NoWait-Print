import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const calculatePrice = async (req: Request, res: Response) => {
    try {
        const { works } = req.body; // Expects array of works with config and files

        // Fetch all pricing rules and binding options for efficiency
        const pricingRules = await prisma.pricingRule.findMany();
        const bindingOptions = await prisma.bindingOption.findMany();

        let orderTotal = 0;
        const pricedWorks = works.map((work: any) => {
            let workTotal = 0;

            // Calculate printing cost
            // 1. Determine sheets needed.
            // If SINGLE side: sheets = totalPageCount
            // If DOUBLE side: sheets = ceil(totalPageCount / 2)

            const totalPagesInWork = work.files.reduce((sum: number, file: any) => sum + (file.pageCount || 1), 0);
            let sheets = 0;

            if (work.printSide === 'DOUBLE') {
                sheets = Math.ceil(totalPagesInWork / 2);
            } else {
                sheets = totalPagesInWork;
            }

            // Find matching rule
            const rule = pricingRules.find(r =>
                r.pageSize === work.pageSize &&
                r.colorType === work.colorType &&
                r.printSide === work.printSide
            );

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

            return {
                ...work,
                pricing: {
                    sheets,
                    basePrice,
                    printCost,
                    total: workTotal
                }
            };
        });

        res.json({
            works: pricedWorks,
            totalAmount: orderTotal
        });

    } catch (error) {
        console.error('Pricing Error:', error);
        res.status(500).json({ error: 'Failed to calculate price' });
    }
};

export const getPricingRules = async (req: Request, res: Response) => {
    try {
        const rules = await prisma.pricingRule.findMany();
        const bindingOptions = await prisma.bindingOption.findMany();
        const paperTypes = await prisma.paperType.findMany();
        const gsmOptions = await prisma.gSMOption.findMany();
        res.json({ rules, bindingOptions, paperTypes, gsmOptions });
    } catch (error) {
        console.error('Failed to fetch pricing rules:', error);
        res.status(500).json({ error: 'Failed to fetch pricing rules' });
    }
};
