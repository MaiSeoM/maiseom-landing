import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Request, Response } from 'express';

type RawRequest = Request & {
  rawBody?: Buffer;
  rawBodyBuffer?: Buffer;
};

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  async checkout(@Body('priceId') priceId: string) {
    const userId = process.env.DEMO_USER_ID || (await this.billingService.getDefaultUserId());
    return this.billingService.createCheckout(priceId, userId);
  }

  @Post('webhook')
  async webhook(@Req() req: RawRequest, @Res() res: Response, @Headers('stripe-signature') signature: string) {
    const buffer = req.rawBody || req.rawBodyBuffer || Buffer.from(JSON.stringify(req.body));
    const result = await this.billingService.handleWebhook(buffer, signature);
    res.json(result);
  }
}
