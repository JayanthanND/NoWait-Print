"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  Save,
  HelpCircle,
  FileText,
  Palette,
  BookOpen,
  Layers,
  IndianRupee,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { 
  updatePricingRulesBatchAction, 
  updateShopSettingsAction,
  type PricingRuleInput
} from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PricingClient({ initialPricing, initialSettings, shopId }: { initialPricing: any[], initialSettings: any, shopId: string }) {
  const router = useRouter();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Flatten initialPricing into the expected structure
  const getInitialPrice = (type: string, size: string, isDouble: boolean, fallback: number) => {
    const printSide = isDouble ? 'DOUBLE' : 'SINGLE';
    const rule = initialPricing.find(p => 
      p.color_type?.toLowerCase() === type.toLowerCase() && 
      p.page_size === size && 
      p.print_side === printSide
    );
    return rule ? rule.base_price : fallback;
  };

  const [prices, setPrices] = useState({
    bwSingleA4: getInitialPrice('bw', 'A4', false, 2),
    bwDoubleA4: getInitialPrice('bw', 'A4', true, 3),
    colorSingleA4: getInitialPrice('color', 'A4', false, 10),
    colorDoubleA4: getInitialPrice('color', 'A4', true, 15),
    bwSingleA3: getInitialPrice('bw', 'A3', false, 5),
    bwDoubleA3: getInitialPrice('bw', 'A3', true, 8),
    colorSingleA3: getInitialPrice('color', 'A3', false, 20),
    colorDoubleA3: getInitialPrice('color', 'A3', true, 30),
    spiralBinding: getInitialPrice('binding', 'spiral', false, 30),
    hardcoverBinding: getInitialPrice('binding', 'hardcover', false, 150),
    stapleBinding: getInitialPrice('binding', 'staple', false, 5),
    tapeBinding: getInitialPrice('binding', 'tape', false, 10),
  });

  const [availability, setAvailability] = useState({
    colorPrinting: initialSettings?.colorPrinting ?? true,
    doubleSided: initialSettings?.doubleSided ?? true,
    a3Paper: initialSettings?.a3Paper ?? true,
    spiralBinding: initialSettings?.spiralBinding ?? true,
    hardcoverBinding: initialSettings?.hardcoverBinding ?? true,
    stapleBinding: initialSettings?.stapleBinding ?? true,
    tapeBinding: initialSettings?.tapeBinding ?? true,
    photoPaper: initialSettings?.photoPaper ?? false,
  });

  const handlePriceChange = (key: keyof typeof prices, value: string) => {
    setPrices((prev) => ({ ...prev, [key]: Number.parseFloat(value) || 0 }));
    setHasChanges(true);
  };

  const handleAvailabilityChange = (key: keyof typeof availability) => {
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Prepare rules for batch update
      const rulesToUpdate = [
        { pageSize: 'A4', colorType: 'BW', isDoubleSided: false, price: prices.bwSingleA4 },
        { pageSize: 'A4', colorType: 'BW', isDoubleSided: true, price: prices.bwDoubleA4 },
        { pageSize: 'A4', colorType: 'COLOR', isDoubleSided: false, price: prices.colorSingleA4 },
        { pageSize: 'A4', colorType: 'COLOR', isDoubleSided: true, price: prices.colorDoubleA4 },
        { pageSize: 'A3', colorType: 'BW', isDoubleSided: false, price: prices.bwSingleA3 },
        { pageSize: 'A3', colorType: 'BW', isDoubleSided: true, price: prices.bwDoubleA3 },
        { pageSize: 'A3', colorType: 'COLOR', isDoubleSided: false, price: prices.colorSingleA3 },
        { pageSize: 'A3', colorType: 'COLOR', isDoubleSided: true, price: prices.colorDoubleA3 },
        { pageSize: 'spiral', colorType: 'BINDING', isDoubleSided: false, price: prices.spiralBinding },
        { pageSize: 'hardcover', colorType: 'BINDING', isDoubleSided: false, price: prices.hardcoverBinding },
        { pageSize: 'staple', colorType: 'BINDING', isDoubleSided: false, price: prices.stapleBinding },
        { pageSize: 'tape', colorType: 'BINDING', isDoubleSided: false, price: prices.tapeBinding },
      ];

      // 2. Perform updates
      const [pricingResult, settingsResult] = await Promise.all([
        updatePricingRulesBatchAction(shopId, rulesToUpdate),
        updateShopSettingsAction(shopId, availability)
      ]);

      if (!pricingResult.success) throw new Error(pricingResult.error);
      if (!settingsResult.success) throw new Error(settingsResult.error);
      
      setHasChanges(false);
      router.refresh();
      toast.success("Pricing and settings updated successfully!");
    } catch (error: any) {
      console.error("Detailed Pricing Save Error:", error);
      const message = error.message || "Please try again.";
      toast.error(`Failed to save pricing: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Pricing & Print Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure pricing rules and print options for your shop
            </p>
          </div>
          <Button
            className="gap-2"
            disabled={!hasChanges || isSaving}
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Unsaved Changes Warning */}
        {hasChanges && (
          <Alert variant="destructive" className="border-warning/50 bg-warning/10 text-warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unsaved Changes</AlertTitle>
            <AlertDescription>
              You have unsaved changes. Make sure to save before leaving this
              page.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Print Pricing */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Print Pricing</CardTitle>
              </div>
              <CardDescription>
                Set prices per page for different print configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* A4 Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">A4</Badge>
                  <span className="text-sm text-muted-foreground">
                    Standard size
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bwSingleA4" className="text-sm">
                      B&W Single-sided
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="bwSingleA4"
                        type="number"
                        value={prices.bwSingleA4}
                        onChange={(e) =>
                          handlePriceChange("bwSingleA4", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bwDoubleA4" className="text-sm">
                      B&W Double-sided
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="bwDoubleA4"
                        type="number"
                        value={prices.bwDoubleA4}
                        onChange={(e) =>
                          handlePriceChange("bwDoubleA4", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colorSingleA4" className="text-sm">
                      <span className="flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-chart-1" />
                        Color Single-sided
                      </span>
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="colorSingleA4"
                        type="number"
                        value={prices.colorSingleA4}
                        onChange={(e) =>
                          handlePriceChange("colorSingleA4", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                        disabled={!availability.colorPrinting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colorDoubleA4" className="text-sm">
                      <span className="flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-chart-1" />
                        Color Double-sided
                      </span>
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="colorDoubleA4"
                        type="number"
                        value={prices.colorDoubleA4}
                        onChange={(e) =>
                          handlePriceChange("colorDoubleA4", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                        disabled={!availability.colorPrinting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* A3 Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">A3</Badge>
                  <span className="text-sm text-muted-foreground">
                    Large format
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bwSingleA3" className="text-sm">
                      B&W Single-sided
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="bwSingleA3"
                        type="number"
                        value={prices.bwSingleA3}
                        onChange={(e) =>
                          handlePriceChange("bwSingleA3", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                        disabled={!availability.a3Paper}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bwDoubleA3" className="text-sm">
                      B&W Double-sided
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="bwDoubleA3"
                        type="number"
                        value={prices.bwDoubleA3}
                        onChange={(e) =>
                          handlePriceChange("bwDoubleA3", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                        disabled={!availability.a3Paper}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colorSingleA3" className="text-sm">
                      <span className="flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-chart-1" />
                        Color Single-sided
                      </span>
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="colorSingleA3"
                        type="number"
                        value={prices.colorSingleA3}
                        onChange={(e) =>
                          handlePriceChange("colorSingleA3", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                        disabled={!availability.a3Paper || !availability.colorPrinting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colorDoubleA3" className="text-sm">
                      <span className="flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-chart-1" />
                        Color Double-sided
                      </span>
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="colorDoubleA3"
                        type="number"
                        value={prices.colorDoubleA3}
                        onChange={(e) =>
                          handlePriceChange("colorDoubleA3", e.target.value)
                        }
                        className="pl-9"
                        min="0"
                        step="0.5"
                        disabled={!availability.a3Paper || !availability.colorPrinting}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Binding Pricing */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Binding Pricing</CardTitle>
              </div>
              <CardDescription>
                Set prices for different binding options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Spiral Binding</p>
                      <p className="text-sm text-muted-foreground">Professional coil binding</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        value={prices.spiralBinding}
                        onChange={(e) => handlePriceChange("spiralBinding", e.target.value)}
                        className="pl-9"
                        min="0"
                        disabled={!availability.spiralBinding}
                      />
                    </div>
                    <Switch
                      checked={availability.spiralBinding}
                      onCheckedChange={() => handleAvailabilityChange("spiralBinding")}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Hardcover Binding</p>
                      <p className="text-sm text-muted-foreground">Premium hard binding</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        value={prices.hardcoverBinding}
                        onChange={(e) => handlePriceChange("hardcoverBinding", e.target.value)}
                        className="pl-9"
                        min="0"
                        disabled={!availability.hardcoverBinding}
                      />
                    </div>
                    <Switch
                      checked={availability.hardcoverBinding}
                      onCheckedChange={() => handleAvailabilityChange("hardcoverBinding")}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Staple Binding</p>
                      <p className="text-sm text-muted-foreground">Basic stapling (up to 20 pages)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        value={prices.stapleBinding}
                        onChange={(e) => handlePriceChange("stapleBinding", e.target.value)}
                        className="pl-9"
                        min="0"
                        disabled={!availability.stapleBinding}
                      />
                    </div>
                    <Switch
                      checked={availability.stapleBinding}
                      onCheckedChange={() => handleAvailabilityChange("stapleBinding")}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Tape Binding</p>
                      <p className="text-sm text-muted-foreground">Adhesive tape binding</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        value={prices.tapeBinding}
                        onChange={(e) => handlePriceChange("tapeBinding", e.target.value)}
                        className="pl-9"
                        min="0"
                        disabled={!availability.tapeBinding}
                      />
                    </div>
                    <Switch
                      checked={availability.tapeBinding}
                      onCheckedChange={() => handleAvailabilityChange("tapeBinding")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Availability</CardTitle>
            <CardDescription>
              Toggle which print options are available for customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-chart-1" />
                  <p className="text-sm font-medium text-foreground">Color Printing</p>
                </div>
                <Switch
                  checked={availability.colorPrinting}
                  onCheckedChange={() => handleAvailabilityChange("colorPrinting")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Double-sided</p>
                </div>
                <Switch
                  checked={availability.doubleSided}
                  onCheckedChange={() => handleAvailabilityChange("doubleSided")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">A3 Paper</p>
                </div>
                <Switch
                  checked={availability.a3Paper}
                  onCheckedChange={() => handleAvailabilityChange("a3Paper")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Photo Paper</p>
                </div>
                <Switch
                  checked={availability.photoPaper}
                  onCheckedChange={() => handleAvailabilityChange("photoPaper")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
