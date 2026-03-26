import { AdminLayout } from "@/components/admin/admin-layout";
import { KpiCards } from "@/components/admin/dashboard/kpi-cards";
import { OrdersChart } from "@/components/admin/dashboard/orders-chart";
import { PrinterStatus } from "@/components/admin/dashboard/printer-status";
import { AlertsCard } from "@/components/admin/dashboard/alerts-card";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { ShareShopCard } from "@/components/admin/dashboard/share-shop-card";
import { createClient } from "@/lib/supabase/server";
import { 
  getDashboardStats, 
  getRecentOrders, 
  getOrdersOverTime, 
  getShopByOwner,
  getPrinters,
  getNotifications 
} from "@/lib/supabase/queries";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const shop = await getShopByOwner(user.id);
  if (!shop) return null;

  const [stats, orders, chartData, printers, notifications] = await Promise.all([
    getDashboardStats(shop.id),
    getRecentOrders(shop.id, 5),
    getOrdersOverTime(shop.id),
    getPrinters(shop.id),
    getNotifications(shop.id)
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to <span className="text-primary font-semibold">{shop.name}</span>! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* KPI Cards */}
        <KpiCards initialStats={stats} />

        {/* Share Shop QR Card */}
        <ShareShopCard shopName={shop.name} shopSlug={shop.slug || shop.id} />

        {/* Charts and Status Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <OrdersChart initialData={chartData} />
          <PrinterStatus initialPrinters={printers} />
        </div>

        {/* Alerts */}
        <AlertsCard initialNotifications={notifications} />

        {/* Recent Orders */}
        <RecentOrders initialOrders={orders} />
      </div>
    </AdminLayout>
  );
}
