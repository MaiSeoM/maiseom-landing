import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import Link from "next/link";
import { fetchProjects } from "../../../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProjectForm } from "../../../components/forms/project-form";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  const { projects = [] } = await fetchProjects();

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-white">Vos projets</h1>
          <p className="text-slate-300">Ajoutez vos domaines pour lancer des audits récurrents.</p>
        </div>
        <ProjectForm />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project: any) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.domain}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-300">
                Dernier audit :
                {project.lastAudit ? ` ${new Date(project.lastAudit).toLocaleDateString()}` : " jamais"}
              </p>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href={`/dashboard/projects/${project.id}`}>Voir</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/audits?project=${project.id}`}>Historique</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Pas encore de projet</CardTitle>
              <CardDescription>Ajoutez votre premier domaine pour lancer un audit.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
