import { ReactNode } from "react";
import { Header } from "../../components/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MaiSeoM. Tous droits réservés.</p>
          <nav className="flex flex-wrap items-center gap-4">
            <a href="/legal/mentions-legales">Mentions légales</a>
            <a href="/legal/cgu">CGU</a>
            <a href="/legal/cgv">CGV</a>
            <a href="/legal/confidentialite">Confidentialité</a>
            <a href="/legal/cookies">Cookies</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
