"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Users,
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const staff = [
  {
    id: "STF-001",
    name: "Rahul Kumar",
    email: "rahul@quickprint.com",
    phone: "+91 98765 43210",
    role: "owner",
    status: "active",
    lastActive: "Online now",
    ordersToday: 15,
    joinedDate: "Jan 2023",
  },
  {
    id: "STF-002",
    name: "Priya Singh",
    email: "priya@quickprint.com",
    phone: "+91 87654 32109",
    role: "manager",
    status: "active",
    lastActive: "2 min ago",
    ordersToday: 23,
    joinedDate: "Mar 2023",
  },
  {
    id: "STF-003",
    name: "Amit Verma",
    email: "amit@quickprint.com",
    phone: "+91 76543 21098",
    role: "operator",
    status: "active",
    lastActive: "15 min ago",
    ordersToday: 18,
    joinedDate: "Jun 2023",
  },
  {
    id: "STF-004",
    name: "Sneha Patel",
    email: "sneha@quickprint.com",
    phone: "+91 65432 10987",
    role: "operator",
    status: "inactive",
    lastActive: "2 days ago",
    ordersToday: 0,
    joinedDate: "Sep 2023",
  },
  {
    id: "STF-005",
    name: "Vikash Sharma",
    email: "vikash@quickprint.com",
    phone: "+91 54321 09876",
    role: "operator",
    status: "active",
    lastActive: "5 min ago",
    ordersToday: 12,
    joinedDate: "Nov 2023",
  },
];

const roleConfig = {
  owner: {
    label: "Owner",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    icon: ShieldAlert,
    permissions: "Full access to all features and settings",
  },
  manager: {
    label: "Manager",
    color: "text-warning",
    bgColor: "bg-warning/10",
    icon: ShieldCheck,
    permissions: "Manage orders, staff, and view reports",
  },
  operator: {
    label: "Operator",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    icon: Shield,
    permissions: "Process orders and manage printers",
  },
};

export default function StaffPage() {
  const activeStaff = staff.filter((s) => s.status === "active").length;
  const totalOrders = staff.reduce((acc, s) => acc + s.ordersToday, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage team members and their access permissions
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-2/10 p-2">
                  <Users className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {staff.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {activeStaff}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-1/10 p-2">
                  <Clock className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalOrders}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Orders Processed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {staff.map((member) => {
                const role = roleConfig[member.role as keyof typeof roleConfig];
                const RoleIcon = role.icon;
                const isActive = member.status === "active";
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between",
                      !isActive && "opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback
                          className={cn(
                            "text-sm font-medium",
                            member.role === "owner"
                              ? "bg-chart-1/10 text-chart-1"
                              : member.role === "manager"
                              ? "bg-warning/10 text-warning"
                              : "bg-secondary text-foreground"
                          )}
                        >
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">
                            {member.name}
                          </p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "gap-1 font-medium",
                              role.bgColor,
                              role.color
                            )}
                          >
                            <RoleIcon className="h-3 w-3" />
                            {role.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>{member.email}</span>
                          <span>{member.phone}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {role.permissions}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 pl-16 sm:pl-0">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">
                          {member.ordersToday}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Orders today
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              member.lastActive === "Online now"
                                ? "bg-success"
                                : "bg-muted-foreground"
                            )}
                          />
                          <span className="text-sm text-muted-foreground">
                            {member.lastActive}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Joined {member.joinedDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isActive}
                          disabled={member.role === "owner"}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="mr-2 h-4 w-4" />
                              View Activity
                            </DropdownMenuItem>
                            {member.role !== "owner" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Roles & Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(roleConfig).map(([key, role]) => {
                const Icon = role.icon;
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-border p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("rounded-lg p-2", role.bgColor)}>
                        <Icon className={cn("h-5 w-5", role.color)} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {role.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {staff.filter((s) => s.role === key).length} members
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.permissions}
                    </p>
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
