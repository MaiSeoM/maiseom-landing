import { z } from "zod";

export const subscriptionPlans = [
  {
    id: "essential",
    name: "Essentiel",
    price: 49,
    interval: "mois",
    features: [
      "1 site",
      "Audit mensuel",
      "1 rappel automatique"
    ],
    stripePriceId: process.env.STRIPE_PRICE_ESSENTIAL || "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    interval: "mois",
    features: [
      "3 sites",
      "Audit hebdomadaire",
      "Modifications proposées",
      "Alertes temps réel"
    ],
    stripePriceId: process.env.STRIPE_PRICE_PRO || "",
  },
  {
    id: "ultimate",
    name: "Ultime",
    price: 399,
    interval: "mois",
    features: [
      "Sites illimités",
      "Audit quotidien",
      "Contenu IA",
      "Modifications auto"
    ],
    stripePriceId: process.env.STRIPE_PRICE_ULTIMATE || "",
  },
] as const;

export const AuditStatus = z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED"]);

export type AuditStatus = z.infer<typeof AuditStatus>;

export const ApiConfigSchema = z.object({
  apiUrl: z.string().url(),
  workerToken: z.string().min(8),
});

export type ApiConfig = z.infer<typeof ApiConfigSchema>;
