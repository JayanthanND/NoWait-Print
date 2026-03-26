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

interface OrdersChartProps {
  initialData: any[];
}

export function OrdersChart({ initialData }: OrdersChartProps) {
  const data = initialData || [];

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
        <div className="h-64 flex items-center justify-center">
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available for today.</p>
          ) : (
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
                  tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 10 }}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
