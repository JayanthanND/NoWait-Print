"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Printer,
  Circle,
  MoreVertical,
  Settings,
  Power,
  RefreshCw,
  Trash2,
  Plus,
  Wifi,
  WifiOff,
  Palette,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const printers = [
  {
    id: "PRT-001",
    name: "HP LaserJet Pro M404",
    model: "HP LaserJet Pro",
    status: "printing",
    type: "color",
    connection: "network",
    ipAddress: "192.168.1.101",
    queue: 3,
    pagesTotal: 15420,
    pagesToday: 142,
    tonerLevel: 68,
    isDefault: true,
    lastActive: "2 min ago",
  },
  {
    id: "PRT-002",
    name: "Canon ImageClass MF445",
    model: "Canon ImageClass",
    status: "online",
    type: "bw",
    connection: "network",
    ipAddress: "192.168.1.102",
    queue: 0,
    pagesTotal: 28340,
    pagesToday: 89,
    tonerLevel: 45,
    isDefault: false,
    lastActive: "5 min ago",
  },
  {
    id: "PRT-003",
    name: "Epson EcoTank L3250",
    model: "Epson EcoTank",
    status: "online",
    type: "color",
    connection: "usb",
    ipAddress: null,
    queue: 1,
    pagesTotal: 8920,
    pagesToday: 34,
    tonerLevel: 82,
    isDefault: false,
    lastActive: "12 min ago",
  },
  {
    id: "PRT-004",
    name: "Brother HL-L2350DW",
    model: "Brother HL-L2350",
    status: "offline",
    type: "bw",
    connection: "network",
    ipAddress: "192.168.1.104",
    queue: 0,
    pagesTotal: 45210,
    pagesToday: 0,
    tonerLevel: 12,
    isDefault: false,
    lastActive: "2 hours ago",
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

export default function PrintersPage() {
  const onlinePrinters = printers.filter((p) => p.status !== "offline").length;
  const totalQueue = printers.reduce((acc, p) => acc + p.queue, 0);
  const todayPages = printers.reduce((acc, p) => acc + p.pagesToday, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Printers</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor your connected printers
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Printer
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Wifi className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {onlinePrinters}/{printers.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Printers Online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-1/10 p-2">
                  <FileText className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalQueue}
                  </p>
                  <p className="text-sm text-muted-foreground">Jobs in Queue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-2/10 p-2">
                  <Printer className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {todayPages}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pages Printed Today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Printers Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {printers.map((printer) => {
            const status =
              statusConfig[printer.status as keyof typeof statusConfig];
            return (
              <Card
                key={printer.id}
                className={cn(
                  "relative overflow-hidden",
                  printer.status === "offline" && "opacity-75"
                )}
              >
                {printer.isDefault && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    Default
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "rounded-lg p-3",
                          printer.status === "offline"
                            ? "bg-muted"
                            : "bg-secondary"
                        )}
                      >
                        <Printer
                          className={cn(
                            "h-6 w-6",
                            printer.status === "offline"
                              ? "text-muted-foreground"
                              : "text-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {printer.name}
                        </CardTitle>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "gap-1.5 font-normal",
                              status.bgColor,
                              status.color
                            )}
                          >
                            <Circle className="h-2 w-2 fill-current" />
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className="gap-1 font-normal">
                            {printer.type === "color" ? (
                              <Palette className="h-3 w-3" />
                            ) : (
                              <FileText className="h-3 w-3" />
                            )}
                            {printer.type === "color" ? "Color" : "B&W"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Printer Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Test Print
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Power className="mr-2 h-4 w-4" />
                          {printer.status === "offline"
                            ? "Reconnect"
                            : "Disconnect"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Connection Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {printer.connection === "network" ? (
                        <>
                          <Wifi className="h-4 w-4" />
                          <span>{printer.ipAddress}</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-4 w-4" />
                          <span>USB Connected</span>
                        </>
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      {printer.lastActive}
                    </span>
                  </div>

                  {/* Queue & Stats */}
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/30 p-3 text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {printer.queue}
                      </p>
                      <p className="text-xs text-muted-foreground">In Queue</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {printer.pagesToday}
                      </p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {(printer.pagesTotal / 1000).toFixed(1)}k
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  {/* Toner Level */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Toner Level</span>
                      <span
                        className={cn(
                          "font-medium",
                          printer.tonerLevel < 20
                            ? "text-destructive"
                            : printer.tonerLevel < 40
                            ? "text-warning"
                            : "text-foreground"
                        )}
                      >
                        {printer.tonerLevel}%
                      </span>
                    </div>
                    <Progress
                      value={printer.tonerLevel}
                      className={cn(
                        "h-2",
                        printer.tonerLevel < 20
                          ? "[&>div]:bg-destructive"
                          : printer.tonerLevel < 40
                          ? "[&>div]:bg-warning"
                          : "[&>div]:bg-success"
                      )}
                    />
                  </div>

                  {/* Default Toggle */}
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Set as Default
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Auto-assign new orders to this printer
                      </p>
                    </div>
                    <Switch
                      checked={printer.isDefault}
                      disabled={printer.status === "offline"}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
