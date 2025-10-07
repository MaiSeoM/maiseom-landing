"use client";

import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

type Providers = Record<string, ClientSafeProvider>;

export default function SignInForm() {
  const [providers, setProviders] = useState<Providers>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProviders().then((p) => {
      if (p) setProviders(p);
    });
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    if (result?.error) {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold text-white">Connexion</h1>
        <p className="mt-2 text-sm text-slate-300">Retrouvez vos audits et recommandations en un clic.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <div className="mt-6 space-y-2">
          {Object.values(providers)
            .filter((provider) => provider.type === "oauth")
            .map((provider) => (
              <Button key={provider.id} variant="outline" className="w-full" onClick={() => signIn(provider.id)}>
                Continuer avec {provider.name}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}
