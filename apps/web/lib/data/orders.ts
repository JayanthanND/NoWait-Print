export type OrderStatus = "pending" | "processing" | "printing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";
export type BindingType = "none" | "staple" | "spiral" | "thermal";

export type OrderFile = {
  id: string;
  name: string;
  pages: number;
  copies: number;
  colorMode: "bw" | "color";
  paperSize: "A4" | "A3" | "Letter" | "Legal";
  orientation: string;
  doubleSided: boolean;
  filePath?: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  files: OrderFile[];
  totalPages: number;
  bindingType: BindingType;
  amount: number;
  otp: string;
  assignedPrinter: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: string;
};

export const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/10" },
  processing: { label: "Processing", color: "text-indigo-500", bgColor: "bg-indigo-50" },
  printing: { label: "Printing", color: "text-chart-1", bgColor: "bg-chart-1/10" },
  ready: { label: "Ready", color: "text-chart-2", bgColor: "bg-chart-2/10" },
  completed: { label: "Completed", color: "text-success", bgColor: "bg-success/10" },
  cancelled: { label: "Cancelled", color: "text-destructive", bgColor: "bg-destructive/10" },
};

export const paymentStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/10" },
  paid: { label: "Paid", color: "text-success", bgColor: "bg-success/10" },
  failed: { label: "Failed", color: "text-destructive", bgColor: "bg-destructive/10" },
};

export const bindingConfig: Record<string, { label: string }> = {
  none: { label: "No Binding" },
  staple: { label: "Staple Binding" },
  spiral: { label: "Spiral Binding" },
  thermal: { label: "Thermal Binding" },
};
