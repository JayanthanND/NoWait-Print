"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { time: "6 AM", orders: 2 },
  { time: "8 AM", orders: 8 },
  { time: "10 AM", orders: 15 },
  { time: "12 PM", orders: 22 },
  { time: "2 PM", orders: 18 },
  { time: "4 PM", orders: 25 },
  { time: "6 PM", orders: 30 },
  { time: "8 PM", orders: 12 },
];

export function OrdersChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Orders Over Time
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-chart-1" />
              Today
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="time"
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
                labelStyle={{ color: "oklch(0.6 0.02 260)" }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="oklch(0.55 0.2 265)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
