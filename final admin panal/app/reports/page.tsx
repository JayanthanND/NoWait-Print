"use client";

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
  TrendingDown,
  IndianRupee,
  FileText,
  Printer,
  Users,
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

const revenueData = [
  { date: "Jan 1", revenue: 12500 },
  { date: "Jan 5", revenue: 15200 },
  { date: "Jan 10", revenue: 18900 },
  { date: "Jan 15", revenue: 14200 },
  { date: "Jan 20", revenue: 21500 },
  { date: "Jan 25", revenue: 19800 },
  { date: "Jan 30", revenue: 24500 },
];

const orderVolumeData = [
  { day: "Mon", orders: 45 },
  { day: "Tue", orders: 52 },
  { day: "Wed", orders: 48 },
  { day: "Thu", orders: 61 },
  { day: "Fri", orders: 55 },
  { day: "Sat", orders: 72 },
  { day: "Sun", orders: 38 },
];

const printerUtilizationData = [
  { name: "HP LaserJet", value: 35, color: "oklch(0.55 0.2 265)" },
  { name: "Canon ImageClass", value: 28, color: "oklch(0.65 0.15 200)" },
  { name: "Epson EcoTank", value: 22, color: "oklch(0.7 0.18 145)" },
  { name: "Brother HL", value: 15, color: "oklch(0.75 0.15 85)" },
];

const insights = [
  {
    title: "Peak Hours",
    value: "10 AM - 2 PM",
    description: "Highest order volume during lunch hours",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Popular Service",
    value: "B&W Printing",
    description: "68% of all print jobs are black & white",
    trend: "neutral",
    icon: FileText,
  },
  {
    title: "Avg. Order Value",
    value: "₹287",
    description: "+12% compared to last month",
    trend: "up",
    icon: IndianRupee,
  },
  {
    title: "Repeat Customers",
    value: "42%",
    description: "Strong customer retention rate",
    trend: "up",
    icon: Users,
  },
];

export default function ReportsPage() {
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
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
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
                    ₹1,26,600
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+18.2% vs last period</span>
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
                    1,247
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.5% vs last period</span>
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
                  <p className="text-sm text-muted-foreground">Pages Printed</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    42,850
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+15.3% vs last period</span>
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
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">156</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                    <TrendingDown className="h-3 w-3" />
                    <span>-3.2% vs last period</span>
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
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
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
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0.03 265)",
                        border: "1px solid oklch(0.25 0.04 265)",
                        borderRadius: "8px",
                        color: "oklch(0.92 0.01 260)",
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
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
              </div>
            </CardContent>
          </Card>

          {/* Order Volume */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Order Volume by Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={orderVolumeData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.25 0.04 265)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
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
                      formatter={(value: number) => [value, "Orders"]}
                    />
                    <Bar
                      dataKey="orders"
                      fill="oklch(0.65 0.15 200)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={printerUtilizationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {printerUtilizationData.map((entry, index) => (
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
                      formatter={(value: number) => [`${value}%`, "Usage"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {printerUtilizationData.map((printer) => (
                  <div key={printer.name} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: printer.color }}
                    />
                    <span className="text-xs text-muted-foreground">
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
                Summary Insights
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
