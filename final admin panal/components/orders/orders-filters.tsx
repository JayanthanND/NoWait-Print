"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  paymentFilter: string;
  onPaymentChange: (value: string) => void;
}

export function OrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
}: OrdersFiltersProps) {
  const hasFilters =
    searchQuery || statusFilter !== "all" || paymentFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("all");
    onPaymentChange("all");
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="printing">Printing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Filter */}
        <Select value={paymentFilter} onValueChange={onPaymentChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Active Filters Count */}
        {hasFilters && (
          <Badge variant="secondary" className="font-normal">
            {[
              searchQuery ? 1 : 0,
              statusFilter !== "all" ? 1 : 0,
              paymentFilter !== "all" ? 1 : 0,
            ].reduce((a, b) => a + b, 0)}{" "}
            filters active
          </Badge>
        )}

        {/* Export */}
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
