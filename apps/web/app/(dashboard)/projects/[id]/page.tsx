import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { fetchProject } from "../../../../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  const project = await fetchProject(params.id);
  if (!project || !project.id) {
    notFound();
  }
  const audits = project.audits || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">{project.name}</h1>
          <p className="text-slate-300">{project.domain}</p>
        </div>
        <form action={`${process.env.API_URL || "http://localhost:4000"}/audits`} method="post">
          <input type="hidden" name="projectId" value={project.id} />
          <Button type="submit">Lancer un audit</Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des audits</CardTitle>
          <CardDescription>Suivez les scores et recommandations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Score SEO</th>
                  <th className="px-4 py-3">Score IA</th>
                  <th className="px-4 py-3">Rapport</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit: any) => (
                  <tr key={audit.id} className="border-t border-white/5">
                    <td className="px-4 py-3">{new Date(audit.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{audit.seoScore ?? "-"}</td>
                    <td className="px-4 py-3">{audit.aiScore ?? "-"}</td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/audits?audit=${audit.id}`}>Voir</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {audits.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Aucun audit enregistré pour le moment.
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
