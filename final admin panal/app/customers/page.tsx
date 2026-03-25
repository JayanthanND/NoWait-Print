"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Phone,
  FileText,
  IndianRupee,
  Eye,
  Crown,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const customers = [
  {
    id: "CUS-001",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    totalOrders: 47,
    totalSpend: 12450,
    tier: "elite",
    lastOrder: "2 min ago",
    avgOrderValue: 265,
  },
  {
    id: "CUS-002",
    name: "Amit Patel",
    phone: "+91 87654 32109",
    totalOrders: 28,
    totalSpend: 8920,
    tier: "gold",
    lastOrder: "1 hour ago",
    avgOrderValue: 318,
  },
  {
    id: "CUS-003",
    name: "Sneha Gupta",
    phone: "+91 76543 21098",
    totalOrders: 12,
    totalSpend: 3240,
    tier: "normal",
    lastOrder: "2 hours ago",
    avgOrderValue: 270,
  },
  {
    id: "CUS-004",
    name: "Raj Kumar",
    phone: "+91 65432 10987",
    totalOrders: 34,
    totalSpend: 9870,
    tier: "gold",
    lastOrder: "3 hours ago",
    avgOrderValue: 290,
  },
  {
    id: "CUS-005",
    name: "Anita Desai",
    phone: "+91 54321 09876",
    totalOrders: 8,
    totalSpend: 2100,
    tier: "normal",
    lastOrder: "1 day ago",
    avgOrderValue: 262,
  },
  {
    id: "CUS-006",
    name: "Vikram Singh",
    phone: "+91 43210 98765",
    totalOrders: 52,
    totalSpend: 15680,
    tier: "elite",
    lastOrder: "30 min ago",
    avgOrderValue: 301,
  },
  {
    id: "CUS-007",
    name: "Meera Reddy",
    phone: "+91 32109 87654",
    totalOrders: 19,
    totalSpend: 5430,
    tier: "gold",
    lastOrder: "5 hours ago",
    avgOrderValue: 286,
  },
  {
    id: "CUS-008",
    name: "Suresh Nair",
    phone: "+91 21098 76543",
    totalOrders: 3,
    totalSpend: 890,
    tier: "normal",
    lastOrder: "2 days ago",
    avgOrderValue: 297,
  },
];

const tierConfig = {
  normal: {
    label: "Normal",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    icon: null,
  },
  gold: {
    label: "Gold",
    color: "text-warning",
    bgColor: "bg-warning/10",
    icon: Star,
  },
  elite: {
    label: "Elite",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    icon: Crown,
  },
};

export default function CustomersPage() {
  const totalCustomers = customers.length;
  const eliteCustomers = customers.filter((c) => c.tier === "elite").length;
  const goldCustomers = customers.filter((c) => c.tier === "gold").length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpend, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your customer base
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-2/10 p-2">
                  <Users className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalCustomers}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Customers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-1/10 p-2">
                  <Crown className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {eliteCustomers}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Elite Members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-2">
                  <Star className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {goldCustomers}
                  </p>
                  <p className="text-sm text-muted-foreground">Gold Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{(totalRevenue / 1000).toFixed(1)}k
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lifetime Revenue
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone number..."
            className="pl-10"
          />
        </div>

        {/* Customers Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4 text-center">Orders</th>
                    <th className="px-6 py-4 text-right">Total Spend</th>
                    <th className="px-6 py-4 text-right">Avg. Order</th>
                    <th className="px-6 py-4">Last Order</th>
                    <th className="px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {customers.map((customer) => {
                    const tier = tierConfig[customer.tier as keyof typeof tierConfig];
                    const TierIcon = tier.icon;
                    return (
                      <tr
                        key={customer.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback
                                className={cn(
                                  "text-sm font-medium",
                                  customer.tier === "elite"
                                    ? "bg-chart-1/10 text-chart-1"
                                    : customer.tier === "gold"
                                    ? "bg-warning/10 text-warning"
                                    : "bg-secondary text-foreground"
                                )}
                              >
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {customer.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {customer.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "gap-1 font-medium",
                              tier.bgColor,
                              tier.color
                            )}
                          >
                            {TierIcon && <TierIcon className="h-3 w-3" />}
                            {tier.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {customer.totalOrders}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-foreground">
                            ₹{customer.totalSpend.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm text-muted-foreground">
                            ₹{customer.avgOrderValue}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {customer.lastOrder}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Order History
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="mr-2 h-4 w-4" />
                                Update Tier
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
          </CardContent>
        </Card>

        {/* Tier Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Loyalty Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <div className="rounded-lg bg-muted/50 p-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Normal</p>
                  <p className="text-sm text-muted-foreground">
                    0-10 orders or less than ₹2,500 spent
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4">
                <div className="rounded-lg bg-warning/10 p-2">
                  <Star className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Gold</p>
                  <p className="text-sm text-muted-foreground">
                    11-30 orders or ₹2,500-₹10,000 spent
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-chart-1/20 bg-chart-1/5 p-4">
                <div className="rounded-lg bg-chart-1/10 p-2">
                  <Crown className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Elite</p>
                  <p className="text-sm text-muted-foreground">
                    31+ orders or ₹10,000+ spent
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
