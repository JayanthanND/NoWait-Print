"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Printer,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardsProps {
  initialStats: {
    ordersToday: number;
    pendingOrders: number;
    printingOrders: number;
    revenueToday: number;
  };
}

export function KpiCards({ initialStats }: KpiCardsProps) {
  const kpis = [
    {
      title: "Orders Today",
      value: initialStats?.ordersToday || 0,
      icon: FileText,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Pending Orders",
      value: initialStats?.pendingOrders || 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "In Printing",
      value: initialStats?.printingOrders || 0,
      icon: Printer,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Revenue Today",
      value: initialStats?.revenueToday?.toLocaleString("en-IN") || 0,
      icon: IndianRupee,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <div className="flex items-baseline gap-1">
                  {kpi.title === "Revenue Today" && (
                    <span className="text-xl font-semibold text-foreground">
                      ₹
                    </span>
                  )}
                  <span className="text-3xl font-bold text-foreground">
                    {kpi.value}
                  </span>
                </div>
              </div>
              <div className={cn("rounded-lg p-3", kpi.bgColor)}>
                <kpi.icon className={cn("h-6 w-6", kpi.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
