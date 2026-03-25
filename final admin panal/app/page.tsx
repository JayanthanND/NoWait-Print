import { AdminLayout } from "@/components/admin/admin-layout";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { OrdersChart } from "@/components/dashboard/orders-chart";
import { PrinterStatus } from "@/components/dashboard/printer-status";
import { AlertsCard } from "@/components/dashboard/alerts-card";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening at your shop today.
          </p>
        </div>

        {/* KPI Cards */}
        <KpiCards />

        {/* Charts and Status Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <OrdersChart />
          <PrinterStatus />
        </div>

        {/* Alerts */}
        <AlertsCard />

        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </AdminLayout>
  );
}
