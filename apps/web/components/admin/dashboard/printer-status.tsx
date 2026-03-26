"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const printers = [
  {
    name: "HP LaserJet Pro",
    status: "printing",
    type: "Color",
    queue: 3,
  },
  {
    name: "Canon ImageClass",
    status: "online",
    type: "B&W",
    queue: 0,
  },
  {
    name: "Epson EcoTank",
    status: "online",
    type: "Color",
    queue: 1,
  },
  {
    name: "Brother HL-L2350",
    status: "offline",
    type: "B&W",
    queue: 0,
  },
];

const statusConfig = {
  online: {
    label: "Online",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  printing: {
    label: "Printing",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  offline: {
    label: "Offline",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

export function PrinterStatus({ initialPrinters }: { initialPrinters?: any[] }) {
  const printers = initialPrinters || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Printer Status
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {printers.filter((p: any) => p.status !== "offline").length}/
            {printers.length} Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {printers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No printers configured</p>
        )}
        {printers.map((printer: any) => {
          const status = statusConfig[printer.status as keyof typeof statusConfig] || statusConfig.offline;
          return (
            <div
              key={printer.id || printer.name}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary p-2">
                  <Printer className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {printer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{printer.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {printer.queue_count > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {printer.queue_count} in queue
                  </span>
                )}
                <Badge
                  variant="secondary"
                  className={cn("gap-1.5", status.bgColor, status.color)}
                >
                  <Circle className="h-2 w-2 fill-current" />
                  {status.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
