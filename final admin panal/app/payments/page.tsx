"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  IndianRupee,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "TXN-8901",
    orderId: "ORD-1251",
    customer: "Priya Sharma",
    method: "upi",
    amount: 245,
    status: "pending",
    timestamp: "2025-01-31T10:30:00Z",
  },
  {
    id: "TXN-8900",
    orderId: "ORD-1250",
    customer: "Amit Patel",
    method: "upi",
    amount: 420,
    status: "completed",
    timestamp: "2025-01-31T10:28:00Z",
  },
  {
    id: "TXN-8899",
    orderId: "ORD-1249",
    customer: "Sneha Gupta",
    method: "cash",
    amount: 180,
    status: "completed",
    timestamp: "2025-01-31T10:22:00Z",
  },
  {
    id: "TXN-8898",
    orderId: "ORD-1248",
    customer: "Raj Kumar",
    method: "upi",
    amount: 375,
    status: "completed",
    timestamp: "2025-01-31T10:10:00Z",
  },
  {
    id: "TXN-8897",
    orderId: "ORD-1247",
    customer: "Anita Desai",
    method: "cash",
    amount: 890,
    status: "completed",
    timestamp: "2025-01-31T09:40:00Z",
  },
  {
    id: "TXN-8896",
    orderId: "ORD-1246",
    customer: "Vikram Singh",
    method: "upi",
    amount: 50,
    status: "completed",
    timestamp: "2025-01-31T09:32:00Z",
  },
  {
    id: "TXN-8895",
    orderId: "ORD-1245",
    customer: "Meera Reddy",
    method: "upi",
    amount: 4000,
    status: "refunded",
    timestamp: "2025-01-31T08:45:00Z",
  },
  {
    id: "TXN-8894",
    orderId: "ORD-1244",
    customer: "Suresh Nair",
    method: "cash",
    amount: 300,
    status: "pending",
    timestamp: "2025-01-31T10:35:00Z",
  },
  {
    id: "TXN-8893",
    orderId: "ORD-1243",
    customer: "Kavita Joshi",
    method: "card",
    amount: 560,
    status: "completed",
    timestamp: "2025-01-31T08:15:00Z",
  },
  {
    id: "TXN-8892",
    orderId: "ORD-1242",
    customer: "Rohit Mehta",
    method: "upi",
    amount: 1250,
    status: "failed",
    timestamp: "2025-01-31T07:50:00Z",
  },
];

const statusConfig = {
  completed: {
    label: "Completed",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  pending: {
    label: "Pending",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  failed: {
    label: "Failed",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  refunded: {
    label: "Refunded",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
};

const methodConfig = {
  upi: { label: "UPI", icon: Smartphone, color: "text-chart-1" },
  cash: { label: "Cash", icon: Banknote, color: "text-success" },
  card: { label: "Card", icon: CreditCard, color: "text-chart-2" },
};

export default function PaymentsPage() {
  const todayRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);
  const monthRevenue = 287450;
  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((acc, t) => acc + t.amount, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Payments & Transactions
            </h1>
            <p className="text-sm text-muted-foreground">
              Track payments and transaction history
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s Revenue</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ₹{todayRevenue.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+18% vs yesterday</span>
                  </div>
                </div>
                <div className="rounded-lg bg-success/10 p-3">
                  <IndianRupee className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ₹{(monthRevenue / 1000).toFixed(1)}k
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+12% vs last month</span>
                  </div>
                </div>
                <div className="rounded-lg bg-chart-1/10 p-3">
                  <TrendingUp className="h-6 w-6 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ₹{pendingAmount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {transactions.filter((t) => t.status === "pending").length}{" "}
                    transactions
                  </p>
                </div>
                <div className="rounded-lg bg-warning/10 p-3">
                  <CreditCard className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Today</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ₹{transactions
                      .filter((t) => t.status === "failed")
                      .reduce((acc, t) => acc + t.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {transactions.filter((t) => t.status === "failed").length}{" "}
                    transactions
                  </p>
                </div>
                <div className="rounded-lg bg-destructive/10 p-3">
                  <ArrowDownRight className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-36">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-y border-border bg-muted/30">
                  <tr className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Order</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Method</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {transactions.map((txn) => {
                    const status =
                      statusConfig[txn.status as keyof typeof statusConfig];
                    const method =
                      methodConfig[txn.method as keyof typeof methodConfig];
                    const MethodIcon = method.icon;
                    return (
                      <tr
                        key={txn.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <code className="text-sm font-medium text-foreground">
                            {txn.id}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm text-chart-1">
                            {txn.orderId}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground">
                            {txn.customer}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MethodIcon
                              className={cn("h-4 w-4", method.color)}
                            />
                            <span className="text-sm font-medium text-foreground">
                              {method.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              txn.status === "refunded"
                                ? "text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            {txn.status === "refunded" && "-"}₹
                            {txn.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-medium",
                              status.bgColor,
                              status.color
                            )}
                          >
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(txn.timestamp)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Payment Methods Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="rounded-lg bg-chart-1/10 p-3">
                  <Smartphone className="h-6 w-6 text-chart-1" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">UPI</p>
                  <p className="text-xl font-bold text-foreground">
                    ₹
                    {transactions
                      .filter(
                        (t) => t.method === "upi" && t.status === "completed"
                      )
                      .reduce((acc, t) => acc + t.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {
                      transactions.filter(
                        (t) => t.method === "upi" && t.status === "completed"
                      ).length
                    }{" "}
                    transactions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="rounded-lg bg-success/10 p-3">
                  <Banknote className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Cash</p>
                  <p className="text-xl font-bold text-foreground">
                    ₹
                    {transactions
                      .filter(
                        (t) => t.method === "cash" && t.status === "completed"
                      )
                      .reduce((acc, t) => acc + t.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {
                      transactions.filter(
                        (t) => t.method === "cash" && t.status === "completed"
                      ).length
                    }{" "}
                    transactions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="rounded-lg bg-chart-2/10 p-3">
                  <CreditCard className="h-6 w-6 text-chart-2" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Card</p>
                  <p className="text-xl font-bold text-foreground">
                    ₹
                    {transactions
                      .filter(
                        (t) => t.method === "card" && t.status === "completed"
                      )
                      .reduce((acc, t) => acc + t.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {
                      transactions.filter(
                        (t) => t.method === "card" && t.status === "completed"
                      ).length
                    }{" "}
                    transactions
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
