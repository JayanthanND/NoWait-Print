export type OrderStatus =
  | "pending"
  | "processing"
  | "printing"
  | "ready"
  | "completed"
  | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "upi" | "cash" | "card";
export type BindingType = "none" | "spiral" | "hardcover" | "staple" | "tape";

export interface OrderFile {
  id: string;
  name: string;
  pages: number;
  copies: number;
  colorMode: "bw" | "color";
  paperSize: "A4" | "A3" | "Letter" | "Legal";
  orientation: "portrait" | "landscape";
  doubleSided: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  files: OrderFile[];
  totalPages: number;
  bindingType: BindingType;
  amount: number;
  otp: string;
  assignedPrinter: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const orders: Order[] = [
  {
    id: "ORD-1251",
    customerId: "CUS-001",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "upi",
    files: [
      {
        id: "F1",
        name: "Project_Report.pdf",
        pages: 12,
        copies: 1,
        colorMode: "bw",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: true,
      },
      {
        id: "F2",
        name: "Charts.pdf",
        pages: 3,
        copies: 1,
        colorMode: "color",
        paperSize: "A4",
        orientation: "landscape",
        doubleSided: false,
      },
    ],
    totalPages: 15,
    bindingType: "spiral",
    amount: 245,
    otp: "4521",
    assignedPrinter: null,
    createdAt: "2025-01-31T10:30:00Z",
    updatedAt: "2025-01-31T10:30:00Z",
  },
  {
    id: "ORD-1250",
    customerId: "CUS-002",
    customerName: "Amit Patel",
    customerPhone: "+91 87654 32109",
    status: "printing",
    paymentStatus: "paid",
    paymentMethod: "upi",
    files: [
      {
        id: "F3",
        name: "Thesis_Final.pdf",
        pages: 42,
        copies: 1,
        colorMode: "bw",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: true,
      },
    ],
    totalPages: 42,
    bindingType: "hardcover",
    amount: 420,
    otp: "7834",
    assignedPrinter: "HP LaserJet Pro",
    createdAt: "2025-01-31T10:25:00Z",
    updatedAt: "2025-01-31T10:28:00Z",
  },
  {
    id: "ORD-1249",
    customerId: "CUS-003",
    customerName: "Sneha Gupta",
    customerPhone: "+91 76543 21098",
    status: "ready",
    paymentStatus: "paid",
    paymentMethod: "cash",
    files: [
      {
        id: "F4",
        name: "ID_Card.jpg",
        pages: 1,
        copies: 2,
        colorMode: "color",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: false,
      },
      {
        id: "F5",
        name: "Passport_Photo.jpg",
        pages: 1,
        copies: 4,
        colorMode: "color",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: false,
      },
      {
        id: "F6",
        name: "Application_Form.pdf",
        pages: 2,
        copies: 1,
        colorMode: "bw",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: false,
      },
    ],
    totalPages: 8,
    bindingType: "none",
    amount: 180,
    otp: "2156",
    assignedPrinter: "Epson EcoTank",
    createdAt: "2025-01-31T10:15:00Z",
    updatedAt: "2025-01-31T10:22:00Z",
  },
  {
    id: "ORD-1248",
    customerId: "CUS-004",
    customerName: "Raj Kumar",
    customerPhone: "+91 65432 10987",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "upi",
    files: [
      {
        id: "F7",
        name: "Business_Plan.pdf",
        pages: 25,
        copies: 1,
        colorMode: "color",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: true,
      },
    ],
    totalPages: 25,
    bindingType: "spiral",
    amount: 375,
    otp: "9012",
    assignedPrinter: "HP LaserJet Pro",
    createdAt: "2025-01-31T09:45:00Z",
    updatedAt: "2025-01-31T10:10:00Z",
  },
  {
    id: "ORD-1247",
    customerId: "CUS-005",
    customerName: "Anita Desai",
    customerPhone: "+91 54321 09876",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "cash",
    files: [
      {
        id: "F8",
        name: "Annual_Report_2024.pdf",
        pages: 45,
        copies: 1,
        colorMode: "color",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: true,
      },
      {
        id: "F9",
        name: "Financial_Statements.pdf",
        pages: 8,
        copies: 1,
        colorMode: "bw",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: true,
      },
      {
        id: "F10",
        name: "Charts_Graphs.pdf",
        pages: 5,
        copies: 1,
        colorMode: "color",
        paperSize: "A3",
        orientation: "landscape",
        doubleSided: false,
      },
      {
        id: "F11",
        name: "Appendix.pdf",
        pages: 2,
        copies: 1,
        colorMode: "bw",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: false,
      },
    ],
    totalPages: 60,
    bindingType: "hardcover",
    amount: 890,
    otp: "5678",
    assignedPrinter: "Canon ImageClass",
    createdAt: "2025-01-31T09:00:00Z",
    updatedAt: "2025-01-31T09:40:00Z",
  },
  {
    id: "ORD-1246",
    customerId: "CUS-006",
    customerName: "Vikram Singh",
    customerPhone: "+91 43210 98765",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "upi",
    files: [
      {
        id: "F12",
        name: "Resume.pdf",
        pages: 2,
        copies: 5,
        colorMode: "bw",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: false,
      },
    ],
    totalPages: 10,
    bindingType: "staple",
    amount: 50,
    otp: "3344",
    assignedPrinter: "Canon ImageClass",
    createdAt: "2025-01-31T10:32:00Z",
    updatedAt: "2025-01-31T10:32:00Z",
  },
  {
    id: "ORD-1245",
    customerId: "CUS-007",
    customerName: "Meera Reddy",
    customerPhone: "+91 32109 87654",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "upi",
    files: [
      {
        id: "F13",
        name: "Brochure.pdf",
        pages: 8,
        copies: 100,
        colorMode: "color",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: true,
      },
    ],
    totalPages: 800,
    bindingType: "none",
    amount: 4000,
    otp: "1122",
    assignedPrinter: null,
    createdAt: "2025-01-31T08:30:00Z",
    updatedAt: "2025-01-31T08:45:00Z",
    notes: "Customer cancelled - changed requirements",
  },
  {
    id: "ORD-1244",
    customerId: "CUS-008",
    customerName: "Suresh Nair",
    customerPhone: "+91 21098 76543",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "cash",
    files: [
      {
        id: "F14",
        name: "Lecture_Notes.pdf",
        pages: 120,
        copies: 1,
        colorMode: "bw",
        paperSize: "A4",
        orientation: "portrait",
        doubleSided: true,
      },
    ],
    totalPages: 120,
    bindingType: "spiral",
    amount: 300,
    otp: "6677",
    assignedPrinter: null,
    createdAt: "2025-01-31T10:35:00Z",
    updatedAt: "2025-01-31T10:35:00Z",
  },
];

export const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-warning",
    bgColor: "bg-warning/10",
    description: "Awaiting processing",
  },
  processing: {
    label: "Processing",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    description: "Being prepared for printing",
  },
  printing: {
    label: "Printing",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    description: "Currently printing",
  },
  ready: {
    label: "Ready",
    color: "text-success",
    bgColor: "bg-success/10",
    description: "Ready for pickup",
  },
  completed: {
    label: "Completed",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    description: "Order delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    description: "Order cancelled",
  },
};

export const paymentStatusConfig = {
  paid: {
    label: "Paid",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  pending: {
    label: "Pending",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  failed: {
    label: "Failed",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  refunded: {
    label: "Refunded",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
};

export const bindingConfig = {
  none: { label: "No Binding", icon: null },
  spiral: { label: "Spiral", icon: "spiral" },
  hardcover: { label: "Hardcover", icon: "book" },
  staple: { label: "Staple", icon: "pin" },
  tape: { label: "Tape", icon: "tape" },
};
