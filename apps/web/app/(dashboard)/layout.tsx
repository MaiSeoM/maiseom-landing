import { ReactNode } from "react";
import { DashboardSidebar } from "../../components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-10">
        <DashboardSidebar />
        <main className="flex-1 space-y-8">{children}</main>
      </div>
    </div>
  );
}
