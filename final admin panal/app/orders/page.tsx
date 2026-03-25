"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersFilters } from "@/components/orders/orders-filters";
import { OrderDetailDrawer } from "@/components/orders/order-detail-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { type Order } from "@/lib/data/orders";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">
              Manage and process customer print orders
            </p>
          </div>
        </div>

        {/* Filters */}
        <OrdersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentChange={setPaymentFilter}
        />

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <OrdersTable onViewOrder={setSelectedOrder} />
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">8</span> of{" "}
            <span className="font-medium">128</span> orders
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-medium">Page 1 of 16</span>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </AdminLayout>
  );
}
