"use client";

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function initAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      setUser(user);

      // Fetch shop
      const { data: shopData } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (!shopData && !window.location.pathname.includes("/admin/setup")) {
        router.push("/admin/setup");
        return;
      }
      setShop(shopData);

      // Fetch notifications if shop exists
      if (shopData) {
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("shop_id", shopData.id)
          .order("created_at", { ascending: false })
          .limit(10);

        setNotifications(notifs || []);
      }

      setLoading(false);
    }
    initAdmin();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header shop={shop} user={user} notifications={notifications} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
