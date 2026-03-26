"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  printing: {
    label: "Printing",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  ready: {
    label: "Ready",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  completed: {
    label: "Completed",
    color: "text-success",
    bgColor: "bg-success/10",
  },
};

interface RecentOrdersProps {
  initialOrders: any[];
}

export function RecentOrders({ initialOrders }: RecentOrdersProps) {
  const orders = initialOrders || [];

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Recent Orders
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/admin/orders">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Files</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4 text-right">Amount</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status =
                    statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-medium text-foreground truncate max-w-[80px]">
                            {order.id.split('-')[0]}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              if (typeof navigator !== 'undefined') {
                                navigator.clipboard.writeText(order.id);
                              }
                            }}
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy order ID</span>
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {order.customer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {order.files} file{order.files > 1 ? "s" : ""}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({order.pages} pages)
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant="secondary"
                          className={cn(status.bgColor, status.color)}
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className="text-sm font-medium text-foreground">
                          ₹{order.amount}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground">
                          {order.time}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
