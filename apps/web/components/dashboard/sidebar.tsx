"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import { cn } from "../../lib/utils";
import { LayoutDashboard, Globe, CreditCard, FileText } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projets", icon: Globe },
  { href: "/dashboard/billing", label: "Facturation", icon: CreditCard },
  { href: "/dashboard/audits", label: "Rapports", icon: FileText },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden w-64 flex-shrink-0 rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:block">
      <div className="mb-6">
        <p className="text-lg font-semibold text-white">MaiSeoM</p>
        <p className="text-xs text-slate-400">Audits SEO & IA SEO</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-brand/20 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-10 space-y-2 text-xs text-slate-400">
        <p>{session?.user?.email}</p>
        <Button variant="ghost" className="w-full justify-start px-3 text-xs" onClick={() => signOut({ callbackUrl: "/" })}>
          Se déconnecter
        </Button>
      </div>
    </aside>
  );
}
