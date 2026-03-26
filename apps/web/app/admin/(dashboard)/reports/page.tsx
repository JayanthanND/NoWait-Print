"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Download,
  TrendingUp,
  IndianRupee,
  FileText,
  Printer,
  Users,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { fetchReportData } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [reportData, setReportData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
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
          const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : 30;
          const data = await fetchReportData(shop.id, days);
          setReportData(data);
        }
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeRange, supabase]);

  if (loading && !reportData) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const totalRevenue = reportData?.revenueData?.reduce((acc: number, curr: any) => acc + (curr.revenue || 0), 0) || 0;
  const totalOrders = reportData?.orderVolumeData?.reduce((acc: number, curr: any) => acc + (curr.orders || 0), 0) || 0;

  const insights = [
    {
      title: "Peak Performance",
      value: "Good",
      description: "Consistent order flow across terminals",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Popular Service",
      value: "B&W Printing",
      description: "Primary driver of volume this month",
      trend: "neutral",
      icon: FileText,
    },
    {
      title: "Avg. Order Value",
      value: totalOrders > 0 ? `₹${Math.round(totalRevenue / totalOrders)}` : "₹0",
      description: "Revenue per order on average",
      trend: "up",
      icon: IndianRupee,
    },
    {
      title: "Printer Network",
      value: reportData?.printerUtilization?.length || 0,
      description: "Active printing terminals online",
      trend: "up",
      icon: Users,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Reports & Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your shop&apos;s performance and insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>Live data</span>
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
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {totalOrders.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>{timeRange} period</span>
                  </div>
                </div>
                <div className="rounded-lg bg-chart-1/10 p-3">
                  <FileText className="h-6 w-6 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Service Points</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {reportData?.printerUtilization?.length || 0}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>Active printers</span>
                  </div>
                </div>
                <div className="rounded-lg bg-chart-2/10 p-3">
                  <Printer className="h-6 w-6 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Period</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{timeRange}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Performance metrics</span>
                  </div>
                </div>
                <div className="rounded-lg bg-warning/10 p-3">
                  <Users className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {reportData?.revenueData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={reportData.revenueData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="oklch(0.55 0.2 265)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="oklch(0.55 0.2 265)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.25 0.04 265)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.16 0.03 265)",
                          border: "1px solid oklch(0.25 0.04 265)",
                          borderRadius: "8px",
                          color: "oklch(0.92 0.01 260)",
                        }}
                        formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="oklch(0.55 0.2 265)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No revenue data for this period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Volume */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Order Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {reportData?.orderVolumeData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData.orderVolumeData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.25 0.04 265)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.16 0.03 265)",
                          border: "1px solid oklch(0.25 0.04 265)",
                          borderRadius: "8px",
                          color: "oklch(0.92 0.01 260)",
                        }}
                        formatter={(value: any) => [Number(value || 0), "Orders"]}
                      />
                      <Bar
                        dataKey="orders"
                        fill="oklch(0.65 0.15 200)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No order data for this period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Printer Utilization */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Printer Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                {reportData?.printerUtilization?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.printerUtilization}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {reportData.printerUtilization.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.16 0.03 265)",
                          border: "1px solid oklch(0.25 0.04 265)",
                          borderRadius: "8px",
                          color: "oklch(0.92 0.01 260)",
                        }}
                        formatter={(value: any) => [`${Number(value || 0)}%`, "Usage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No printer data available
                  </div>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {reportData?.printerUtilization?.map((printer: any) => (
                  <div key={printer.name} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: printer.color }}
                    />
                    <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                      {printer.name}
                    </span>
                    <span className="ml-auto text-xs font-medium text-foreground">
                      {printer.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Insights */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Shop Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {insights.map((insight) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={insight.title}
                      className="flex items-start gap-3 rounded-lg border border-border p-4"
                    >
                      <div className="rounded-lg bg-secondary p-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {insight.title}
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {insight.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
