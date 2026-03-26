"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Printer offline",
    message: "Brother HL-L2350 has been offline for 15 minutes",
    time: "15 min ago",
  },
  {
    id: 2,
    type: "info",
    title: "Low paper stock",
    message: "A4 paper stock is running low (50 sheets remaining)",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "error",
    title: "Payment failed",
    message: "UPI payment for Order #1247 failed - customer notified",
    time: "2 hours ago",
  },
];

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
  },
  error: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
  info: {
    icon: Info,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2/20",
  },
};

export function AlertsCard({ initialNotifications }: { initialNotifications?: any[] }) {
  const alerts = initialNotifications || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Operational Alerts
          </CardTitle>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            {alerts.length} Active
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No active alerts</p>
        )}
        {alerts.map((alert: any) => {
          const config = alertConfig[alert.type as keyof typeof alertConfig] || alertConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={cn(
                "relative flex gap-3 rounded-lg border p-3",
                config.bgColor,
                config.borderColor
              )}
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.color)} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground/70">{new Date(alert.created_at).toLocaleTimeString()}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
