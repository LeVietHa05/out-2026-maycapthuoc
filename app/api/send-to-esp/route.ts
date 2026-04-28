import { NextRequest, NextResponse } from 'next/server';
import { addToQueue } from '@/lib/queue';

export async function POST(request: NextRequest) {
  try {
    const { msg } = await request.json();
    addToQueue(msg);
    console.log('Added to queue:', msg);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to queue:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}