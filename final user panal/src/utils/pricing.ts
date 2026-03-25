import { Work, WorkProperties } from "../types";

// Helper function to calculate price per option
export function calculateOptionPrice(
  baseWork: Work,
  propertyKey: keyof WorkProperties,
  propertyValue: any
): number {
  const testWork = {
    ...baseWork,
    properties: {
      ...baseWork.properties,
      [propertyKey]: propertyValue,
    },
  };
  return calculateWorkPrice(testWork);
}

export function calculateWorkPrice(work: Work): number {
  const { files, properties } = work;
  
  if (files.length === 0) return 0;

  // Base price per page
  let pricePerPage = 2; // ₹2 base

  // Paper size multiplier
  const sizeMultipliers: Record<string, number> = {
    a4: 1,
    a3: 2,
    letter: 1,
    legal: 1.2,
  };
  pricePerPage *= sizeMultipliers[properties.paperSize] || 1;

  // Color printing
  if (properties.color) {
    pricePerPage *= 4; // Color costs 4x more
  }

  // Paper type
  const paperTypeMultipliers: Record<string, number> = {
    regular: 1,
    glossy: 2,
    matte: 1.8,
  };
  pricePerPage *= paperTypeMultipliers[properties.paperType] || 1;

  // GSM
  const gsmMultipliers: Record<string, number> = {
    "80": 1,
    "100": 1.2,
    "120": 1.5,
  };
  pricePerPage *= gsmMultipliers[properties.gsm] || 1;

  // Estimate 5 pages per file (in real app, would parse PDF)
  const estimatedPages = files.length * 5;
  
  // Double sided reduces cost slightly
  const effectivePages = properties.sided === "double" ? estimatedPages * 0.7 : estimatedPages;

  let totalPrice = pricePerPage * effectivePages * properties.copies;

  // Binding cost
  const bindingCosts: Record<string, number> = {
    none: 0,
    staple: 5,
    spiral: 30,
    thermal: 50,
  };
  totalPrice += bindingCosts[properties.binding] || 0;

  return Math.round(totalPrice * 100) / 100; // Round to 2 decimals
}

export function calculateTotalPrice(works: Work[]): number {
  return works.reduce((sum, work) => sum + work.price, 0);
}
