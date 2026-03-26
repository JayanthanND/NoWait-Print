"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updatePrinter, deletePrinter, createPrinter } from "@/lib/supabase/actions";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig = {
  online: { label: "Online", color: "text-success", bgColor: "bg-success/10" },
  printing: { label: "Printing", color: "text-chart-1", bgColor: "bg-chart-1/10" },
  offline: { label: "Offline", color: "text-destructive", bgColor: "bg-destructive/10" },
  maintenance: { label: "Maintenance", color: "text-warning", bgColor: "bg-warning/10" },
};

export function PrintersClient({ initialPrinters, shopId }: { initialPrinters: any[], shopId: string }) {
  const [printers, setPrinters] = useState(initialPrinters || []);
  const [loading, setLoading] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPrinter, setNewPrinter] = useState({
    name: "",
    type: "B&W",
    status: "online",
  });

  const router = useRouter();

  const handleToggleStatus = async (printerId: string, currentStatus: string) => {
    setLoading(printerId);
    try {
      const newStatus = currentStatus === "offline" ? "online" : "offline";
      await updatePrinter(printerId, { status: newStatus });
      setPrinters(prev => prev.map(p => p.id === printerId ? { ...p, status: newStatus } : p));
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (printerId: string) => {
    if (!confirm("Are you sure you want to remove this printer?")) return;
    setLoading(printerId);
    try {
      await deletePrinter(printerId);
      setPrinters(prev => prev.filter(p => p.id !== printerId));
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleAddPrinter = async () => {
    if (!newPrinter.name) return;
    setLoading("adding");
    try {
      const created = await createPrinter({
        shop_id: shopId,
        ...newPrinter
      });
      setPrinters(prev => [...prev, created]);
      setIsAddDialogOpen(false);
      setNewPrinter({ name: "", type: "B&W", status: "online" });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const onlinePrinters = printers.filter((p) => p.status !== "offline").length;
  const totalQueue = printers.reduce((acc, p) => acc + (p.queue_count || 0), 0);
  const todayPages = 0; // This would need historical data

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Printers</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor your connected printers
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Printer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Wifi className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{onlinePrinters}/{printers.length}</p>
                <p className="text-sm text-muted-foreground">Printers Online</p>
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
                <p className="text-2xl font-bold text-foreground">{totalQueue}</p>
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
                <p className="text-2xl font-bold text-foreground">{todayPages}</p>
                <p className="text-sm text-muted-foreground">Pages Printed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printers Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {printers.map((printer) => {
          const status = statusConfig[printer.status as keyof typeof statusConfig] || statusConfig.online;
          const isProcessing = loading === printer.id;

          return (
            <Card key={printer.id} className={cn("relative overflow-hidden", printer.status === "offline" && "opacity-75")}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-lg p-3", printer.status === "offline" ? "bg-muted" : "bg-secondary")}>
                      <Printer className={cn("h-6 w-6", printer.status === "offline" ? "text-muted-foreground" : "text-foreground")} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">{printer.name}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className={cn("gap-1.5 font-normal", status.bgColor, status.color)}>
                          <Circle className="h-2 w-2 fill-current" />
                          {status.label}
                        </Badge>
                        <Badge variant="outline" className="gap-1 font-normal">
                          {printer.type === "Color" ? <Palette className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                          {printer.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleToggleStatus(printer.id, printer.status)}>
                        <Power className="mr-2 h-4 w-4" />
                        {printer.status === "offline" ? "Connect" : "Disconnect"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(printer.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-3 text-center">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{printer.queue_count || 0}</p>
                    <p className="text-xs text-muted-foreground">In Queue</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Active</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Printer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Printer</DialogTitle>
            <DialogDescription>Enter the details of the printer to add to your shop.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newPrinter.name}
                onChange={(e) => setNewPrinter({ ...newPrinter, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g. HP LaserJet 1020"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select
                value={newPrinter.type}
                onValueChange={(value) => setNewPrinter({ ...newPrinter, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B&W">Black & White (Laser)</SelectItem>
                  <SelectItem value="Color">Color (Inkjet/Laser)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPrinter} disabled={loading === "adding" || !newPrinter.name}>
              {loading === "adding" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Printer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
