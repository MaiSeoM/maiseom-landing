import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { subscriptionPlans } from "@maiseom/config";

const heroHighlights = [
  "Analyse technique SEO complète",
  "Optimisation IA pour ChatGPT, Bard, Perplexity",
  "Modifications automatiques en un clic",
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.25fr,1fr]">
        <div className="space-y-6">
          <Badge>IA + SEO unifiés</Badge>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Boostez vos positions SEO et vos citations IA en quelques clics.
          </h1>
          <p className="text-lg text-slate-300">
            MaiSeoM audite votre site, propose des optimisations prêtes à déployer et surveille en continu votre visibilité sur
            Google et les assistants IA.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Démarrer gratuitement</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="#fonctionnalites">Explorer les fonctionnalités</Link>
            </Button>
          </div>
          <ul className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            {heroHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-lg border border-white/10 bg-slate-900/60 p-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="border border-emerald-400/30 bg-slate-900/70">
          <CardHeader>
            <CardTitle>MaiSeoM en action</CardTitle>
            <CardDescription>
              Un aperçu des scores générés après un audit automatique.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-black/50 p-4">
              <p className="text-sm text-slate-400">Score SEO</p>
              <p className="text-3xl font-semibold text-emerald-400">92 / 100</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/50 p-4">
              <p className="text-sm text-slate-400">Score IA SEO</p>
              <p className="text-3xl font-semibold text-sky-400">88 / 100</p>
            </div>
            <p className="text-xs text-slate-400">
              Des recommandations concrètes sur les schémas, la vitesse, les entités et les extraits conversationnels.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="fonctionnalites" className="mt-24 space-y-12">
        <h2 className="text-3xl font-semibold text-white">Fonctionnalités clés</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Audits SEO complets",
              description:
                "Analysez vos balises, performances, Core Web Vitals et conformité mobile en un clic.",
            },
            {
              title: "IA SEO Ready",
              description:
                "Optimisez votre site pour être cité par ChatGPT, Perplexity, Bing Copilot et autres IA conversationnelles.",
            },
            {
              title: "Workers Python",
              description:
                "Une file BullMQ et des workers scalables qui crawlent et scorent vos pages en profondeur.",
            },
            {
              title: "Alertes intelligentes",
              description:
                "Connectez votre Search Console et recevez des alertes Slack/email si le CTR chute.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-24 space-y-6">
        <h2 className="text-3xl font-semibold text-white">Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.interval}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-white">{plan.price}€</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <Button asChild className="mt-6">
                <Link href={`/dashboard?plan=${plan.id}`}>Choisir {plan.name}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
