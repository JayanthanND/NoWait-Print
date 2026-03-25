"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Copy,
  FileText,
  User,
  Phone,
  CreditCard,
  Printer,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Order,
  statusConfig,
  paymentStatusConfig,
  bindingConfig,
} from "@/lib/data/orders";

interface OrderDetailDrawerProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailDrawer({
  order,
  open,
  onClose,
}: OrderDetailDrawerProps) {
  if (!order) return null;

  const status = statusConfig[order.status];
  const paymentStatus = paymentStatusConfig[order.paymentStatus];
  const binding = bindingConfig[order.bindingType];

  const timeline = [
    {
      status: "created",
      label: "Order Created",
      time: order.createdAt,
      completed: true,
    },
    {
      status: "payment",
      label: "Payment Received",
      time: order.paymentStatus === "paid" ? order.updatedAt : null,
      completed: order.paymentStatus === "paid",
    },
    {
      status: "processing",
      label: "Processing",
      time:
        order.status !== "pending" && order.status !== "cancelled"
          ? order.updatedAt
          : null,
      completed: ["processing", "printing", "ready", "completed"].includes(
        order.status
      ),
    },
    {
      status: "printing",
      label: "Printing",
      time: ["printing", "ready", "completed"].includes(order.status)
        ? order.updatedAt
        : null,
      completed: ["printing", "ready", "completed"].includes(order.status),
    },
    {
      status: "ready",
      label: "Ready for Pickup",
      time: ["ready", "completed"].includes(order.status)
        ? order.updatedAt
        : null,
      completed: ["ready", "completed"].includes(order.status),
    },
    {
      status: "completed",
      label: "Completed",
      time: order.status === "completed" ? order.updatedAt : null,
      completed: order.status === "completed",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate printable pages based on settings
  const calculatePrintablePages = () => {
    return order.files.reduce((total, file) => {
      const pagesPerSheet = file.doubleSided ? 2 : 1;
      const sheets = Math.ceil(file.pages / pagesPerSheet);
      return total + sheets * file.copies;
    }, 0);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl p-0">
        <SheetHeader className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SheetTitle className="text-lg font-semibold">
                Order {order.id}
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(order.id)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy order ID</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Badge
              variant="secondary"
              className={cn("font-medium", status.bgColor, status.color)}
            >
              {status.label}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "font-medium",
                paymentStatus.bgColor,
                paymentStatus.color
              )}
            >
              {paymentStatus.label}
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-6 p-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Customer Information
              </h3>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {order.customerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* OTP */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Pickup OTP
              </h3>
              <div className="flex items-center gap-4">
                <code className="rounded-lg bg-primary/10 px-6 py-3 text-2xl font-mono font-bold text-primary">
                  {order.otp}
                </code>
                <p className="text-xs text-muted-foreground">
                  Customer must provide this OTP to collect the order
                </p>
              </div>
            </div>

            <Separator />

            {/* Files */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Files ({order.files.length})
                </h3>
                <span className="text-xs text-muted-foreground">
                  {calculatePrintablePages()} sheets to print
                </span>
              </div>
              <div className="space-y-2">
                {order.files.map((file, index) => (
                  <div
                    key={file.id}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded bg-secondary p-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{file.pages} pages</span>
                            <span>•</span>
                            <span>
                              {file.copies} {file.copies === 1 ? "copy" : "copies"}
                            </span>
                            <span>•</span>
                            <span className={cn(
                              file.colorMode === "color" ? "text-chart-1" : ""
                            )}>
                              {file.colorMode === "color" ? "Color" : "B&W"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded bg-secondary/50 px-2 py-1.5">
                        <span className="text-muted-foreground">Size: </span>
                        <span className="font-medium text-foreground">
                          {file.paperSize}
                        </span>
                      </div>
                      <div className="rounded bg-secondary/50 px-2 py-1.5">
                        <span className="text-muted-foreground">Orient: </span>
                        <span className="font-medium text-foreground capitalize">
                          {file.orientation}
                        </span>
                      </div>
                      <div className="rounded bg-secondary/50 px-2 py-1.5">
                        <span className="text-muted-foreground">Sides: </span>
                        <span className="font-medium text-foreground">
                          {file.doubleSided ? "Double" : "Single"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Binding */}
            {order.bindingType !== "none" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Binding
                </h3>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {binding.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Single binding across all {order.files.length} files
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Payment Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Payment Summary
              </h3>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Payment Method
                    </span>
                  </div>
                  <span className="text-sm font-medium uppercase text-foreground">
                    {order.paymentMethod}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    ₹{order.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Printer Assignment */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Printer Assignment
              </h3>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <Printer className="h-5 w-5 text-muted-foreground" />
                {order.assignedPrinter ? (
                  <span className="text-sm font-medium text-foreground">
                    {order.assignedPrinter}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Not assigned yet
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Order Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Order Timeline
              </h3>
              <div className="space-y-0">
                {timeline.map((item, index) => (
                  <div key={item.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          item.completed
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={cn(
                            "h-8 w-0.5",
                            item.completed ? "bg-success/30" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          item.completed
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </p>
                      {item.time && (
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.time)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Notes</h3>
                <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/10 p-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
                  <p className="text-sm text-foreground">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions Footer */}
        <div className="sticky bottom-0 border-t border-border bg-card p-4">
          <div className="flex gap-3">
            {order.status === "pending" && (
              <Button className="flex-1">Start Processing</Button>
            )}
            {order.status === "processing" && (
              <Button className="flex-1">Start Printing</Button>
            )}
            {order.status === "printing" && (
              <Button className="flex-1">Mark Ready</Button>
            )}
            {order.status === "ready" && (
              <Button className="flex-1">Complete Order</Button>
            )}
            <Button variant="outline">Print Receipt</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
