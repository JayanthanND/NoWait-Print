export interface FileItem {
  id: string;
  name: string;
  size: number;
  pageCount?: number;
  path?: string;
}

export interface WorkProperties {
  paperSize: string;
  color: boolean;
  sided: "single" | "double";
  copies: number;
  orientation: "portrait" | "landscape";
  paperType: string;
  gsm: string;
  binding: string;
  notes: string;
}

export interface Work {
  id: string;
  files: FileItem[];
  properties: WorkProperties;
  price: number;
}

export const DEFAULT_PROPERTIES: WorkProperties = {
  paperSize: "a4",
  color: false,
  sided: "single",
  copies: 1,
  orientation: "portrait",
  paperType: "regular",
  gsm: "80",
  binding: "none",
  notes: "",
};

export const PAPER_SIZES = [
  { value: "a4", label: "A4 (210 × 297 mm)" },
  { value: "a3", label: "A3 (297 × 420 mm)" },
  { value: "letter", label: "Letter (8.5 × 11 in)" },
  { value: "legal", label: "Legal (8.5 × 14 in)" },
];

export const PAPER_TYPES = [
  { value: "regular", label: "Regular Paper" },
  { value: "glossy", label: "Glossy Photo Paper" },
  { value: "matte", label: "Matte Photo Paper" },
];

export const GSM_OPTIONS = [
  { value: "80", label: "80 GSM (Standard)" },
  { value: "100", label: "100 GSM (Premium)" },
  { value: "120", label: "120 GSM (Thick)" },
];

export const BINDING_OPTIONS = [
  { value: "none", label: "No Binding" },
  { value: "staple", label: "Staple Binding" },
  { value: "spiral", label: "Spiral Binding" },
  { value: "thermal", label: "Thermal Binding" },
];

export interface PricingRule {
  id: string;
  pageSize: string;
  colorType: string;
  printSide: string;
  basePrice: number;
}

export interface BindingOption {
  id: string;
  name: string;
  price: number;
}

export interface PaperType {
  id: string;
  name: string;
  price: number;
}

export interface GSMOption {
  id: string;
  value: string;
  price: number;
}
