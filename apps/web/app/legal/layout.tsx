import { ReactNode } from "react";
import { Header } from "../../components/header";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 text-slate-200">{children}</main>
    </div>
  );
}
