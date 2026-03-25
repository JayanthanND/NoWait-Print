"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Store,
  Clock,
  QrCode,
  Bell,
  Copy,
  Download,
  RefreshCw,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Banknote,
  Building2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [shopInfo, setShopInfo] = useState({
    name: "QuickPrint Express",
    storeId: "1024",
    address: "123 Main Street, Near Metro Station, Mumbai 400001",
    phone: "+91 98765 43210",
    email: "contact@quickprint.com",
    website: "https://quickprint.com",
  });

  const [businessHours, setBusinessHours] = useState([
    { day: "Monday", open: "09:00", close: "21:00", isOpen: true },
    { day: "Tuesday", open: "09:00", close: "21:00", isOpen: true },
    { day: "Wednesday", open: "09:00", close: "21:00", isOpen: true },
    { day: "Thursday", open: "09:00", close: "21:00", isOpen: true },
    { day: "Friday", open: "09:00", close: "21:00", isOpen: true },
    { day: "Saturday", open: "10:00", close: "20:00", isOpen: true },
    { day: "Sunday", open: "10:00", close: "18:00", isOpen: false },
  ]);

  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderReady: true,
    paymentReceived: true,
    printerOffline: true,
    lowStock: true,
    dailyReport: false,
  });

  const [paymentMethods, setPaymentMethods] = useState({
    upiPayments: true,
    cashAtPickup: true,
  });

  const [upiDetails, setUpiDetails] = useState({
    upiId: "quickprint@ybl",
    isActive: true,
    lastUpdated: "Jan 15, 2026",
  });

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "QuickPrint Express Pvt Ltd",
    bankName: "HDFC Bank",
    accountNumber: "50100123456789",
    ifscCode: "HDFC0001234",
  });

  const [isEditingBank, setIsEditingBank] = useState(false);

  const togglePaymentMethod = (key: keyof typeof paymentMethods) => {
    setPaymentMethods((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDayOpen = (index: number) => {
    setBusinessHours((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, isOpen: !day.isOpen } : day
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your shop profile and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Shop Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Shop Profile</CardTitle>
              </div>
              <CardDescription>
                Basic information about your printing shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  value={shopInfo.name}
                  onChange={(e) =>
                    setShopInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeId">Store ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="storeId"
                    value={shopInfo.storeId}
                    disabled
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(shopInfo.storeId)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy store ID</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Address
                  </span>
                </Label>
                <Textarea
                  id="address"
                  value={shopInfo.address}
                  onChange={(e) =>
                    setShopInfo((prev) => ({ ...prev, address: e.target.value }))
                  }
                  rows={2}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    value={shopInfo.phone}
                    onChange={(e) =>
                      setShopInfo((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={shopInfo.email}
                    onChange={(e) =>
                      setShopInfo((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Website
                  </span>
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={shopInfo.website}
                  onChange={(e) =>
                    setShopInfo((prev) => ({ ...prev, website: e.target.value }))
                  }
                />
              </div>
              <Button className="w-full gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">QR Code Management</CardTitle>
              </div>
              <CardDescription>
                Manage your shop&apos;s customer QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center rounded-lg border border-border bg-muted/30 p-6">
                <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-card border border-border">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-6 w-6 rounded-sm",
                          Math.random() > 0.5 ? "bg-foreground" : "bg-card"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  QuickPrint Express
                </p>
                <p className="text-xs text-muted-foreground">Store #1024</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      QR Code Link
                    </p>
                    <p className="text-xs text-muted-foreground">
                      https://print.app/shop/1024
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard("https://print.app/shop/1024")
                    }
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
                <p className="text-sm text-foreground">
                  <strong>Tip:</strong> Print and display this QR code at your
                  shop counter. Customers can scan it to upload files and place
                  orders directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Business Hours</CardTitle>
            </div>
            <CardDescription>
              Set your shop&apos;s operating hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {businessHours.map((day, index) => (
                <div
                  key={day.day}
                  className={cn(
                    "flex items-center justify-between rounded-lg border border-border p-4",
                    !day.isOpen && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={() => toggleDayOpen(index)}
                    />
                    <span className="w-24 font-medium text-foreground">
                      {day.day}
                    </span>
                  </div>
                  {day.isOpen ? (
                    <div className="flex items-center gap-3">
                      <Select
                        value={day.open}
                        onValueChange={(value) =>
                          setBusinessHours((prev) =>
                            prev.map((d, i) =>
                              i === index ? { ...d, open: value } : d
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={i} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={day.close}
                        onValueChange={(value) =>
                          setBusinessHours((prev) =>
                            prev.map((d, i) =>
                              i === index ? { ...d, close: value } : d
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={i} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="font-normal">
                      Closed
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payments & Payouts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Payments & Payouts</CardTitle>
            </div>
            <CardDescription>
              Manage payment methods and payout settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Methods */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                Payment Methods
              </h4>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      UPI Payments
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Accept payments via UPI apps
                    </p>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.upiPayments}
                  onCheckedChange={() => togglePaymentMethod("upiPayments")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Cash at Pickup
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Allow customers to pay when collecting orders
                    </p>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.cashAtPickup}
                  onCheckedChange={() => togglePaymentMethod("cashAtPickup")}
                />
              </div>
            </div>

            <Separator />

            {/* UPI Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                UPI Details
              </h4>
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  value={upiDetails.upiId}
                  onChange={(e) =>
                    setUpiDetails((prev) => ({
                      ...prev,
                      upiId: e.target.value,
                    }))
                  }
                  placeholder="yourname@upi"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Status</p>
                  <p className="text-xs text-muted-foreground">
                    {upiDetails.isActive
                      ? "Currently active"
                      : "Currently inactive"}
                  </p>
                </div>
                <Badge
                  variant={upiDetails.isActive ? "default" : "secondary"}
                  className="font-normal"
                >
                  {upiDetails.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {upiDetails.lastUpdated}
              </p>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save UPI Details
              </Button>
            </div>

            <Separator />

            {/* Bank Account Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  Bank Account Details
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => setIsEditingBank(!isEditingBank)}
                >
                  <Pencil className="h-4 w-4" />
                  {isEditingBank ? "Cancel" : "Edit"}
                </Button>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-4">
                    {isEditingBank ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="accountHolderName">
                            Account Holder Name
                          </Label>
                          <Input
                            id="accountHolderName"
                            value={bankDetails.accountHolderName}
                            onChange={(e) =>
                              setBankDetails((prev) => ({
                                ...prev,
                                accountHolderName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={bankDetails.bankName}
                            onChange={(e) =>
                              setBankDetails((prev) => ({
                                ...prev,
                                bankName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={bankDetails.accountNumber}
                            onChange={(e) =>
                              setBankDetails((prev) => ({
                                ...prev,
                                accountNumber: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            value={bankDetails.ifscCode}
                            onChange={(e) =>
                              setBankDetails((prev) => ({
                                ...prev,
                                ifscCode: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <Button
                          className="gap-2"
                          onClick={() => setIsEditingBank(false)}
                        >
                          <Save className="h-4 w-4" />
                          Save Bank Details
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Account Holder Name
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {bankDetails.accountHolderName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Bank Name
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {bankDetails.bankName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Account Number
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            ••••••••
                            {bankDetails.accountNumber.slice(-4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            IFSC Code
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {bankDetails.ifscCode}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">
                Notification Preferences
              </CardTitle>
            </div>
            <CardDescription>
              Choose which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    New Orders
                  </p>
                  <p className="text-xs text-muted-foreground">
                    When a new order is received
                  </p>
                </div>
                <Switch
                  checked={notifications.newOrders}
                  onCheckedChange={() => toggleNotification("newOrders")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Order Ready
                  </p>
                  <p className="text-xs text-muted-foreground">
                    When an order is ready for pickup
                  </p>
                </div>
                <Switch
                  checked={notifications.orderReady}
                  onCheckedChange={() => toggleNotification("orderReady")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Payment Received
                  </p>
                  <p className="text-xs text-muted-foreground">
                    When a payment is confirmed
                  </p>
                </div>
                <Switch
                  checked={notifications.paymentReceived}
                  onCheckedChange={() => toggleNotification("paymentReceived")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Printer Offline
                  </p>
                  <p className="text-xs text-muted-foreground">
                    When a printer goes offline
                  </p>
                </div>
                <Switch
                  checked={notifications.printerOffline}
                  onCheckedChange={() => toggleNotification("printerOffline")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Low Stock Alert
                  </p>
                  <p className="text-xs text-muted-foreground">
                    When supplies are running low
                  </p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={() => toggleNotification("lowStock")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Daily Report
                  </p>
                  <p className="text-xs text-muted-foreground">
                    End of day summary email
                  </p>
                </div>
                <Switch
                  checked={notifications.dailyReport}
                  onCheckedChange={() => toggleNotification("dailyReport")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
