"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

export function ProjectForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", domain: "" });
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:4000"}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Impossible de créer le projet");
      toast.success("Projet ajouté");
      setForm({ name: "", domain: "" });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline">
        Ajouter un domaine
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      </div>
      <div>
        <Label htmlFor="domain">Domaine</Label>
        <Input id="domain" value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))} required />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Ajout..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
