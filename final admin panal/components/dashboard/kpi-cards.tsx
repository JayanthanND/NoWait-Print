"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Printer,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
  {
    title: "Orders Today",
    value: "47",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Pending Orders",
    value: "8",
    change: "-3",
    trend: "down",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "In Printing",
    value: "3",
    change: "Active",
    trend: "neutral",
    icon: Printer,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Revenue Today",
    value: "12,450",
    change: "+18%",
    trend: "up",
    icon: IndianRupee,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export function KpiCards() {
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
                <div className="flex items-baseline gap-2">
                  {kpi.title === "Revenue Today" && (
                    <span className="text-2xl font-semibold text-foreground">
                      ₹
                    </span>
                  )}
                  <span className="text-3xl font-bold text-foreground">
                    {kpi.value}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {kpi.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-success" />
                  )}
                  {kpi.trend === "down" && kpi.title === "Pending Orders" && (
                    <TrendingDown className="h-4 w-4 text-success" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      kpi.trend === "up" && "text-success",
                      kpi.trend === "down" &&
                        kpi.title === "Pending Orders" &&
                        "text-success",
                      kpi.trend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {kpi.change}
                  </span>
                  {kpi.trend !== "neutral" && (
                    <span className="text-xs text-muted-foreground">
                      vs yesterday
                    </span>
                  )}
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
