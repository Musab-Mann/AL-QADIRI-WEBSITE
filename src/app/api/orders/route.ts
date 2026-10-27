import { NextResponse } from 'next/server';
import { placeOrder, OrderValidationError, type PlaceOrderInput } from '@/server/orders.ts';

export const runtime = 'nodejs';

// The published site keeps no order database; its checkout hands the order to WhatsApp instead.
const ORDERS_SAVED = process.env.NEXT_PUBLIC_ORDER_MODE !== 'whatsapp';

export async function POST(request: Request) {
  if (!ORDERS_SAVED) {
    return NextResponse.json(
      { error: 'Orders from this site are sent on WhatsApp. Please use the WhatsApp button.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 400 });
  }

  try {
    const order = placeOrder(body as PlaceOrderInput);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message, field: error.field }, { status: 400 });
    }
    console.error('Order placement failed:', error);
    return NextResponse.json({ error: 'Your order could not be placed. Please try again.' }, { status: 500 });
  }
}
