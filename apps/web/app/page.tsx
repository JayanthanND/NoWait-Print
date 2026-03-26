import { ArrowRight, Printer, Zap, Shield, Clock, Smartphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-primary/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Printer className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">NoWait-Print</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
          </nav>
          <Button variant="outline" className="border-white/10 hover:bg-white/10" asChild>
            <Link href="/user">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-48">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] opacity-30 animate-pulse delay-700" />
          </div>
          
          <div className="container relative mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Next-Gen Printing Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Skip The Queue. <br />
              <span className="text-primary">Print Smarter.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Upload documents from your phone, configure printing options, 
              and pick up your prints instantly. No wait, no hassle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <Button size="lg" className="h-14 px-10 text-lg gap-2 rounded-full" asChild>
                <Link href="/user">
                  Start Printing Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-white/10 hover:bg-white/5" asChild>
                <Link href="/admin/login">Admin Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Mobile First</h3>
                <p className="text-zinc-400">Scan QR codes at our kiosks and upload files directly from your smartphone.</p>
              </div>
              <div className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant pickup</h3>
                <p className="text-zinc-400">Your documents are processed in real-time. Ready when you arrive.</p>
              </div>
              <div className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="h-12 w-12 rounded-2xl bg-success/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Printing</h3>
                <p className="text-zinc-400">End-to-end encryption for your documents. Automatically deleted after printing.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center">
              <Printer className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-lg font-bold">NoWait-Print</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 NoWait-Print. Developed for JayanthanND.</p>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/admin/login" className="hover:text-white">Admin Login</Link>
            <Link href="/user" className="hover:text-white">User Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
