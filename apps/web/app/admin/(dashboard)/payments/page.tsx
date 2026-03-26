"use client";

import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { fetchTransactions } from "@/lib/supabase/actions";

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
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: shop } = await supabase
          .from("shops")
          .select("id")
          .eq("owner_id", user.id)
          .single();

        if (shop) {
          const data = await fetchTransactions(shop.id, 50);
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, [supabase]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.customer.toLowerCase().includes(search.toLowerCase()) || 
                         t.id.toLowerCase().includes(search.toLowerCase()) ||
                         t.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayRevenue = filteredTransactions
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const pendingAmount = filteredTransactions
    .filter((t) => t.status === "pending")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

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
                  <p className="text-sm text-muted-foreground">Period Revenue</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ₹{todayRevenue.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>Real-time</span>
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
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {filteredTransactions.length}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>In database</span>
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
                    {filteredTransactions.filter((t) => t.status === "pending").length}{" "}
                    awaiting confirmed
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
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ₹{filteredTransactions
                      .filter((t) => t.status === "failed")
                      .reduce((acc, t) => acc + Number(t.amount), 0)
                      .toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {filteredTransactions.filter((t) => t.status === "failed").length}{" "}
                    failed attempts
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
              placeholder="Search customers, IDs..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Filter Date
          </Button>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
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
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn) => {
                      const status =
                        statusConfig[txn.status as keyof typeof statusConfig] || statusConfig.pending;
                      const method =
                        methodConfig[txn.method as keyof typeof methodConfig] || methodConfig.upi;
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
                              {Number(txn.amount).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "font-medium capitalize",
                                status.bgColor,
                                status.color
                              )}
                            >
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(txn.timestamp)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Payment Methods Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(methodConfig).map(([key, config]) => {
                const Icon = config.icon;
                const filtered = transactions.filter(t => t.method === key && t.status === 'completed');
                const total = filtered.reduce((acc, t) => acc + Number(t.amount), 0);
                return (
                  <div key={key} className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <div className={cn("rounded-lg p-3", config.color.replace('text-', 'bg-') + '/10')}>
                      <Icon className={cn("h-6 w-6", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                      <p className="text-xl font-bold text-foreground truncate">
                        ₹{total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {filtered.length} completed
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
