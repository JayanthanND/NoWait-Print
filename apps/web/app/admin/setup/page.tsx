"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Printer } from "lucide-react";

export default function ShopSetupPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkExistingShop() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (shop) {
        router.push("/admin");
      } else {
        setChecking(false);
        setEmail(user.email || "");
      }
    }
    checkExistingShop();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("shops").insert([
      {
        owner_id: user.id,
        name,
        address,
        phone,
        email,
      },
    ]);

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  if (checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 selection:bg-primary/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-50 animate-pulse" />
        </div>
      <Card className="w-full max-w-lg relative bg-zinc-900 border-white/5 text-white">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Printer className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Setup Your Shop</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your shop details to get started with NoWait-Print.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Shop Name</Label>
              <Input
                id="name"
                placeholder="e.g. Rahul's Print Hub"
                className="bg-zinc-800 border-white/5 text-white placeholder:text-zinc-600 h-12 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-zinc-300">Shop Address</Label>
              <Input
                id="address"
                placeholder="Full address of your shop"
                className="bg-zinc-800 border-white/5 text-white placeholder:text-zinc-600 h-12 focus:ring-primary"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  className="bg-zinc-800 border-white/5 text-white placeholder:text-zinc-600 h-12 focus:ring-primary"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Public Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@shopprint.com"
                  className="bg-zinc-800 border-white/5 text-white placeholder:text-zinc-600 h-12 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Details...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
