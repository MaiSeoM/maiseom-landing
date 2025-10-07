import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { fetchAudits } from "../../../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";

export default async function AuditsPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  const { audits = [] } = await fetchAudits();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Rapports d’audit</h1>
        <p className="text-slate-300">
          Consultez les recommandations générées par les workers Python et validez les actions proposées.
        </p>
      </header>

      <div className="space-y-6">
        {audits.map((audit: any) => (
          <Card key={audit.id}>
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{audit.project?.name || audit.project?.domain}</CardTitle>
                <CardDescription>
                  Score SEO {audit.seoScore ?? "-"} / Score IA {audit.aiScore ?? "-"}
                </CardDescription>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-slate-200">{audit.status?.toLowerCase()}</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Résumé</h3>
                <p className="text-sm text-slate-300">{audit.summary || "En attente du worker."}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Recommandations</h3>
                <pre className="overflow-auto rounded-lg bg-black/60 p-4 text-xs text-slate-300">
                  {JSON.stringify(audit.recommendations, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
        {audits.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Aucun audit</CardTitle>
              <CardDescription>Lancez un audit depuis un projet pour voir apparaître les recommandations ici.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
