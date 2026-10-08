import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { INITIAL_MENU } from '@/data/menu';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerName, customerPhone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart items cannot be empty' }, { status: 400 });
    }

    // SERVER-SIDE PRICE VALIDATION: Never trust client totals!
    let calculatedSubtotal = 0;

    for (const cartItem of items) {
      const dbItem = INITIAL_MENU.find((m) => m.id === cartItem.menuItemId);
      if (!dbItem) {
        return NextResponse.json(
          { success: false, message: `Invalid item: ${cartItem.name}` },
          { status: 400 }
        );
      }

      let unitPrice = dbItem.price;
      if (cartItem.selectedSize && dbItem.sizeVariants) {
        const variant = dbItem.sizeVariants.find((v) => v.name === cartItem.selectedSize);
        if (variant) unitPrice = variant.price;
      }

      calculatedSubtotal += unitPrice * cartItem.quantity;
    }

    // Apply GST 5%
    const calculatedGst = Math.round(calculatedSubtotal * 0.05);
    const finalAmountInRupees = calculatedSubtotal + calculatedGst;
    const amountInPaise = finalAmountInRupees * 100;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If keys configured, instantiate Razorpay
    if (keyId && keySecret && !keyId.includes('YOUR_')) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          customerName: customerName || 'Z Cafe Guest',
          customerPhone: customerPhone || '9876543210',
        },
      };

      const rzpOrder = await razorpay.orders.create(options);

      return NextResponse.json({
        success: true,
        order: rzpOrder,
        amount: finalAmountInRupees,
        token: `Z-${Math.floor(100 + Math.random() * 900)}`,
      });
    }

    // Dev / Test simulation fallback
    return NextResponse.json({
      success: true,
      order: {
        id: `order_sim_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        status: 'created',
      },
      amount: finalAmountInRupees,
      token: `Z-${Math.floor(100 + Math.random() * 900)}`,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
