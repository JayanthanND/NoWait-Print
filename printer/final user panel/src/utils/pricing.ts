import { Work, WorkProperties, PricingRule, BindingOption, PaperType, GSMOption } from "../types";

// Helper function to calculate price per option
export function calculateOptionPrice(
  baseWork: Work,
  propertyKey: keyof WorkProperties,
  propertyValue: any,
  pricingRules: PricingRule[] = [],
  bindingOptions: BindingOption[] = [],
  paperTypes: PaperType[] = [],
  gsmOptions: GSMOption[] = []
): number {
  if (pricingRules.length === 0 && bindingOptions.length === 0 && paperTypes.length === 0 && gsmOptions.length === 0) {
    return 0;
  }

  const props = { ...baseWork.properties, [propertyKey]: propertyValue };

  // If it's a binding option
  if (propertyKey === 'binding') {
    const binding = bindingOptions.find(b =>
      b.name.toLowerCase() === (propertyValue as string).toLowerCase() ||
      b.name.toUpperCase() === (propertyValue as string).toUpperCase()
    );
    return binding ? binding.price : 0;
  }

  // If it's a paper type option
  if (propertyKey === 'paperType') {
    const type = paperTypes.find(t =>
      t.name.toLowerCase() === (propertyValue as string).toLowerCase() ||
      t.name.toUpperCase() === (propertyValue as string).toUpperCase()
    );
    return type ? type.price : 0;
  }

  // If it's a GSM option
  if (propertyKey === 'gsm') {
    const option = gsmOptions.find(g =>
      g.value.toLowerCase() === (propertyValue as string).toLowerCase() ||
      g.value.toUpperCase() === (propertyValue as string).toUpperCase()
    );
    return option ? option.price : 0;
  }

  // If it's a printing option (size, color, sided)
  const rule = pricingRules.find(r =>
    r.pageSize.toUpperCase() === props.paperSize.toUpperCase() &&
    r.colorType.toUpperCase() === (props.color ? 'COLOR' : 'BW') &&
    r.printSide.toUpperCase() === props.sided.toUpperCase()
  );

  return rule ? rule.basePrice : 0;
}

export function calculateWorkPrice(
  work: Work,
  pricingRules: PricingRule[] = [],
  bindingOptions: BindingOption[] = [],
  paperTypes: PaperType[] = [],
  gsmOptions: GSMOption[] = []
): number {
  const { files, properties } = work;

  if (files.length === 0) return 0;

  // Estimate pages or use actual
  let totalPageCount = 0;
  if (files.length > 0) {
    totalPageCount = files.reduce((sum, file) => sum + (file.pageCount || 5), 0); // Default to 5 if not analyzed yet
  }

  let basePrice = 2; // Default fallback

  // If rules are provided, find the matching rule
  if (pricingRules.length > 0) {
    const rule = pricingRules.find(r =>
      r.pageSize.toUpperCase() === properties.paperSize.toUpperCase() &&
      r.colorType.toUpperCase() === (properties.color ? 'COLOR' : 'BW') &&
      r.printSide.toUpperCase() === properties.sided.toUpperCase()
    );
    if (rule) {
      basePrice = rule.basePrice;
    }
  } else {
    // Fallback logic
    let pricePerPage = 2;
    const sizeMultipliers: Record<string, number> = { a4: 1, a3: 2, letter: 1, legal: 1.2 };
    pricePerPage *= sizeMultipliers[properties.paperSize] || 1;
    if (properties.color) pricePerPage *= 4;
    basePrice = pricePerPage;
  }

  // Calculate print cost
  let totalPrintCost = 0;
  let sheets = (properties.sided === "double") ? Math.ceil(totalPageCount / 2) : totalPageCount;
  totalPrintCost = basePrice * sheets * properties.copies;

  // Add Paper type cost
  let paperTypeCost = 0;
  if (paperTypes.length > 0) {
    const type = paperTypes.find(t => t.name.toLowerCase() === properties.paperType.toLowerCase() || t.name.toUpperCase() === properties.paperType.toUpperCase());
    if (type) paperTypeCost = type.price * sheets * properties.copies;
  }

  // Add GSM cost
  let gsmCost = 0;
  if (gsmOptions.length > 0) {
    const option = gsmOptions.find(g => g.value.toLowerCase() === properties.gsm.toLowerCase() || g.value.toUpperCase() === properties.gsm.toUpperCase());
    if (option) gsmCost = option.price * sheets * properties.copies;
  }

  // Binding cost
  let bindingCost = 0;
  if (bindingOptions.length > 0) {
    const binding = bindingOptions.find(b => b.name.toLowerCase() === properties.binding.toLowerCase() || b.name.toUpperCase() === properties.binding.toUpperCase());
    if (binding) bindingCost = binding.price * properties.copies;
  } else {
    const bindingCosts: Record<string, number> = { none: 0, staple: 5, spiral: 30, thermal: 50 };
    bindingCost = (bindingCosts[properties.binding] || 0) * properties.copies;
  }

  return Math.round((totalPrintCost + paperTypeCost + gsmCost + bindingCost) * 100) / 100;
}

export function calculateTotalPrice(works: Work[]): number {
  return works.reduce((sum, work) => sum + work.price, 0);
}
