"use client";

import { useEffect, useState, useCallback } from "react";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersFilters } from "@/components/admin/orders/orders-filters";
import { OrderDetailDrawer } from "@/components/admin/orders/order-detail-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { type Order, type OrderFile, type OrderStatus, type PaymentStatus, type BindingType } from "@/lib/data/orders";
import { createClient } from "@/lib/supabase/client";
import { updateOrderStatus } from "@/lib/supabase/actions";
import { toast } from "sonner";

export function OrdersClient({ shopId }: { shopId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          works (
            *,
            files (*)
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedOrders: Order[] = data.map((dbOrder: any) => {
          let totalPages = 0;
          const mappedFiles: OrderFile[] = [];
          
          dbOrder.works.forEach((work: any) => {
            work.files.forEach((file: any) => {
              totalPages += file.page_count;
              mappedFiles.push({
                id: file.id,
                name: file.original_name,
                pages: file.page_count,
                copies: work.copies,
                colorMode: work.color_type.toLowerCase() as "bw" | "color",
                paperSize: work.page_size as "A4" | "A3" | "Letter" | "Legal",
                orientation: "portrait", 
                doubleSided: work.print_side === "DOUBLE",
              });
            });
          });

          const primaryBinding = dbOrder.works[0]?.binding_type?.toLowerCase() || 'none';
          
          return {
            id: dbOrder.id,
            customerId: "CUS-" + dbOrder.id.substring(0, 5).toUpperCase(),
            customerName: "Customer " + dbOrder.mobile.substring(dbOrder.mobile.length - 4),
            customerPhone: dbOrder.mobile,
            status: dbOrder.status.toLowerCase() as OrderStatus,
            paymentStatus: dbOrder.payment_status.toLowerCase() as PaymentStatus,
            paymentMethod: "upi", 
            files: mappedFiles,
            totalPages: totalPages,
            bindingType: primaryBinding as BindingType,
            amount: Number(dbOrder.total_amount),
            otp: dbOrder.id.substring(0, 4).toUpperCase(),
            assignedPrinter: null,
            createdAt: dbOrder.created_at,
            updatedAt: dbOrder.updated_at,
          };
        });

        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, supabase]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus.toUpperCase());
      setOrders((prev: Order[]) => prev.map(o => o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: Order | null) => prev ? { ...prev, status: newStatus as OrderStatus } : null);
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage and process customer print orders
          </p>
        </div>
        <Button onClick={fetchOrders} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      <OrdersFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentChange={setPaymentFilter}
      />

      <Card>
        <CardContent className="p-0">
          {loading && orders.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <OrdersTable 
              orders={filteredOrders} 
              onViewOrder={setSelectedOrder} 
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredOrders.length > 0 ? 1 : 0}</span> to{" "}
          <span className="font-medium">{filteredOrders.length}</span> of{" "}
          <span className="font-medium">{filteredOrders.length}</span> orders
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm font-medium">Page 1 of 1</span>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <OrderDetailDrawer
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
