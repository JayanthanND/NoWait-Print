"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  MoreHorizontal,
  Eye,
  Printer,
  CheckCircle,
  XCircle,
  FileText,
  BookOpen,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  statusConfig,
  paymentStatusConfig,
  bindingConfig,
  type Order,
} from "@/lib/data/orders";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => Promise<void>;
}

export function OrdersTable({ orders, onViewOrder, onUpdateStatus }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="w-12 px-4 py-3">
              <Checkbox
                checked={selectedOrders.length === orders.length}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all orders"
              />
            </th>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Files</th>
            <th className="px-4 py-3">Binding</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">OTP</th>
            <th className="px-4 py-3">Printer</th>
            <th className="w-12 px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const paymentStatus = paymentStatusConfig[order.paymentStatus];
            const binding = bindingConfig[order.bindingType];
            const isSelected = selectedOrders.includes(order.id);

            return (
              <tr
                key={order.id}
                className={cn(
                  "transition-colors hover:bg-muted/30",
                  isSelected && "bg-primary/5"
                )}
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelectOrder(order.id)}
                    aria-label={`Select order ${order.id}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-medium text-foreground">
                      {order.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(order.id)}
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy order ID</span>
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="secondary"
                    className={cn("font-medium", status.bgColor, status.color)}
                  >
                    {status.label}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.customerPhone}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {order.files.length}{" "}
                      {order.files.length === 1 ? "file" : "files"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({order.totalPages} pg)
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {order.bindingType !== "none" ? (
                    <Badge variant="outline" className="gap-1 font-normal">
                      <BookOpen className="h-3 w-3" />
                      {binding.label}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-foreground">
                    ₹{order.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
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
                    <span className="text-xs uppercase text-muted-foreground">
                      {order.paymentMethod}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <code className="rounded bg-muted px-2 py-1 text-sm font-mono font-semibold text-foreground">
                    {order.otp}
                  </code>
                </td>
                <td className="px-4 py-3">
                  {order.assignedPrinter ? (
                    <div className="flex items-center gap-2">
                      <Printer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {order.assignedPrinter}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not assigned
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewOrder(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        Assign Printer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Update Payment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "ready")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Ready
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onUpdateStatus(order.id, "cancelled")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
