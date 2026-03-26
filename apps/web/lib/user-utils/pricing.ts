import { Work, WorkProperties } from "../types";

// Helper function to calculate price per option
export function calculateOptionPrice(
  baseWork: Work,
  propertyKey: keyof WorkProperties,
  propertyValue: any,
  pricingRules: any[] = [],
  bindingOptions: any[] = []
): number {
  const testWork = {
    ...baseWork,
    properties: {
      ...baseWork.properties,
      [propertyKey]: propertyValue,
    },
  };
  return calculateWorkPrice(testWork, pricingRules, bindingOptions);
}

export function calculateWorkPrice(
  work: Work,
  pricingRules: any[] = [],
  bindingOptions: any[] = []
): number {
  const { files, properties } = work;
  
  if (files.length === 0) return 0;

  // 1. Base price per page lookup from dynamic rules
  // Example rule matches: colorType='COLOR', pageSize='A4', printSide='SINGLE'
  const rule = pricingRules.find(r => 
    r.page_size === properties.paperSize.toUpperCase() &&
    r.color_type === (properties.color ? 'COLOR' : 'BW') &&
    r.print_side === properties.sided.toUpperCase()
  );

  // Fallback to reasonable defaults if rule not found
  let pricePerPage = rule ? parseFloat(rule.base_price) : (properties.color ? 10 : 2);

  // 2. Paper type multiplier (can be moved to DB later)
  const paperTypeMultipliers: Record<string, number> = {
    regular: 1,
    glossy: 2,
    matte: 1.8,
  };
  pricePerPage *= paperTypeMultipliers[properties.paperType] || 1;

  // 3. GSM multiplier (can be moved to DB later)
  const gsmMultipliers: Record<string, number> = {
    "80": 1,
    "100": 1.2,
    "120": 1.5,
  };
  pricePerPage *= gsmMultipliers[properties.gsm] || 1;

  // 4. Page Calculation
  // Total pages = sum of (pageCount of each file)
  const totalPages = files.reduce((sum, file) => sum + (file.pageCount || 1), 0);
  
  // Note: Double sided rules are already handled by the rule lookup (different price per page)
  let totalPrice = pricePerPage * totalPages * properties.copies;

  // 5. Binding cost from dynamic options
  const binding = bindingOptions.find(b => b.name.toLowerCase() === properties.binding.toLowerCase());
  totalPrice += binding ? parseFloat(binding.price) : 0;

  return Math.round(totalPrice * 100) / 100; // Round to 2 decimals
}

export function calculateTotalPrice(works: Work[]): number {
  return works.reduce((sum, work) => sum + work.price, 0);
}
