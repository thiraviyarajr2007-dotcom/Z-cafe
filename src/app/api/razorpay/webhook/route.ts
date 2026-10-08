import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // Handle payment.captured or order.paid
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      console.log('Webhook: Payment confirmed for order:', paymentEntity.order_id);
      // Here in production with Firebase Admin SDK, we update the order document status to 'paid'
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ message: 'Webhook processing error' }, { status: 500 });
  }
}
