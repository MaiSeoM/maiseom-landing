"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          MaiSeoM
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-200">
          <Link href="/pricing" className="hover:text-white">
            Tarifs
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-white">
                Tableau de bord
              </Link>
              <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                Se déconnecter
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Se connecter</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
