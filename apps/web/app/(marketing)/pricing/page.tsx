import { subscriptionPlans } from "@maiseom/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold text-white">Choisissez votre plan</h1>
        <p className="mt-3 text-slate-300">
          Des audits réguliers, des recommandations IA et une automatisation complète selon vos besoins.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.interval}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold text-white">{plan.price}€</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
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
    </div>
  );
}
