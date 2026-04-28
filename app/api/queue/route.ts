import { NextResponse } from 'next/server';
import { getNextOrder } from '@/lib/queue';

export async function GET() {
  const order = getNextOrder();
  return NextResponse.json({ order });
}