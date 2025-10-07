import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { fetchDashboard } from "../../../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  const data = await fetchDashboard();
  const { stats = {}, latestAudits = [] } = data;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Tableau de bord</h1>
        <p className="text-slate-300">Suivez vos scores SEO et IA en temps réel.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Sites", value: stats.projects || 0, description: "Nombre de domaines suivis" },
          { title: "Score SEO moyen", value: stats.seoScore || 0, description: "Basé sur les audits récents" },
          { title: "Score IA moyen", value: stats.aiScore || 0, description: "Prêt pour les IA conversationnelles" },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-white">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Derniers audits</CardTitle>
            <CardDescription>Les cinq audits les plus récents et leurs scores.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/audits">Voir tout</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Projet</th>
                  <th className="px-4 py-3">Score SEO</th>
                  <th className="px-4 py-3">Score IA</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {latestAudits.map((audit: any) => (
                  <tr key={audit.id} className="border-t border-white/5">
                    <td className="px-4 py-3">{audit.project?.domain}</td>
                    <td className="px-4 py-3">{audit.seoScore ?? "-"}</td>
                    <td className="px-4 py-3">{audit.aiScore ?? "-"}</td>
                    <td className="px-4 py-3 capitalize">{audit.status?.toLowerCase()}</td>
                  </tr>
                ))}
                {latestAudits.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Aucun audit pour le moment. Lancez votre premier audit depuis la page projets.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
