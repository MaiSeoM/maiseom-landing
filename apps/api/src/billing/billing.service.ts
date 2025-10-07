import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../common/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  async getDefaultUserId() {
    const user = await this.prisma.user.findFirst();
    if (!user) {
      throw new Error('No user available');
    }
    return user.id;
  }

  async createCheckout(priceId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const customer = await this.ensureCustomer(user);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.WEB_URL || 'http://localhost:3000'}/dashboard?checkout=success`,
      cancel_url: `${process.env.WEB_URL || 'http://localhost:3000'}/dashboard/billing`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string | string[] | undefined) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return { received: true };
    }
    const event = this.stripe.webhooks.constructEvent(rawBody, signature as string, webhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.upsertSubscription(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: SubscriptionStatus.CANCELED },
        });
        break;
      }
      default:
        break;
    }

    return { received: true };
  }

  private async ensureCustomer(user: { id: string; email: string | null }) {
    const existing = await this.prisma.subscription.findFirst({ where: { userId: user.id } });
    if (existing?.stripeCustomerId) {
      return existing.stripeCustomerId;
    }
    const customer = await this.stripe.customers.create({
      email: user.email || undefined,
      metadata: { userId: user.id },
    });
    await this.prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        stripeCustomerId: customer.id,
        plan: SubscriptionPlan.ESSENTIAL,
        status: SubscriptionStatus.INCOMPLETE,
      },
      update: {
        stripeCustomerId: customer.id,
      },
    });
    return customer.id;
  }

  private async upsertSubscription(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price?.id || '';
    const plan = this.mapPlan(priceId);
    await this.prisma.subscription.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        stripeSubscriptionId: subscription.id,
        status: this.mapStatus(subscription.status),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        plan,
      },
    });
  }

  private mapPlan(priceId: string): SubscriptionPlan {
    if (priceId === process.env.STRIPE_PRICE_PRO) return SubscriptionPlan.PRO;
    if (priceId === process.env.STRIPE_PRICE_ULTIMATE) return SubscriptionPlan.ULTIMATE;
    return SubscriptionPlan.ESSENTIAL;
  }

  private mapStatus(status: string): SubscriptionStatus {
    const normalized = status.toUpperCase() as keyof typeof SubscriptionStatus;
    return SubscriptionStatus[normalized] || SubscriptionStatus.INCOMPLETE;
  }
}
