"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Clock,
  Activity,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  createStaffProfile, 
  updateStaffStatus, 
  deleteStaffProfile 
} from "@/lib/supabase/actions";

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

export function StaffClient({ initialStaff, shopId }: { initialStaff: any[], shopId: string }) {
  const [staff, setStaff] = useState(initialStaff || []);
  const [loading, setLoading] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "operator",
  });
  
  const router = useRouter();
  const activeStaffCount = staff.filter((s) => s.status === "active").length;
  const totalOrders = 0; 

  const handleToggleStatus = async (staffId: string, currentStatus: string) => {
    setLoading(staffId);
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateStaffStatus(staffId, newStatus);
      setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: newStatus } : s));
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    setLoading(staffId);
    try {
      await deleteStaffProfile(staffId);
      setStaff(prev => prev.filter(s => s.id !== staffId));
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email) return;
    setLoading("adding");
    try {
      const created = await createStaffProfile({
        shop_id: shopId,
        ...newStaff,
        status: 'active'
      });
      setStaff(prev => [...prev, created]);
      setIsAddDialogOpen(false);
      setNewStaff({ name: "", email: "", phone: "", role: "operator" });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
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
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
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
                  {activeStaffCount}
                </p>
                <p className="text-sm text-muted-foreground">Active Members</p>
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
            {staff.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No staff members found</p>
            )}
            {staff.map((member) => {
              const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.operator;
              const RoleIcon = role.icon;
              const isActive = member.status === "active";
              const isProcessing = loading === member.id;

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
                          .map((n: string) => n[0])
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
                        <span>{member.email || "No email"}</span>
                        <span>{member.phone || "No phone"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {role.permissions}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pl-16 sm:pl-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            isActive ? "bg-success" : "bg-muted-foreground"
                          )}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isActive}
                        disabled={member.role === "owner" || isProcessing}
                        onCheckedChange={() => handleToggleStatus(member.id, member.status)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={isProcessing}
                          >
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <MoreVertical className="h-4 w-4" />}
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {member.role !== "owner" && (
                            <>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(member.id)}>
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

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Invite a new staff member to manage your shop.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="col-span-3"
                placeholder="Full Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="col-span-3"
                placeholder="email@example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select
                value={newStaff.role}
                onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStaff} disabled={loading === "adding" || !newStaff.name || !newStaff.email}>
              {loading === "adding" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
