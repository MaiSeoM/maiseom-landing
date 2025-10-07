import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { subscriptionPlans } from "@maiseom/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { getStripePortalUrl } from "../../../lib/stripe";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  const portalUrl = await getStripePortalUrl();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Facturation</h1>
        <p className="text-slate-300">Gérez votre abonnement, vos factures et vos moyens de paiement.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Portail client Stripe</CardTitle>
          <CardDescription>Accédez à l’historique de facturation et mettez à jour votre abonnement.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href={portalUrl} target="_blank" rel="noreferrer">
              Ouvrir le portail client
            </a>
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Mettre à niveau</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.interval}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-3xl font-semibold text-white">{plan.price}€</p>
                <ul className="space-y-1 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <form action={`${process.env.API_URL || "http://localhost:4000"}/billing/checkout`} method="post">
                  <input type="hidden" name="priceId" value={plan.stripePriceId} />
                  <Button type="submit" className="w-full">
                    Choisir {plan.name}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
