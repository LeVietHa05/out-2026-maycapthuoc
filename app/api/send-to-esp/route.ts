import { NextRequest, NextResponse } from 'next/server';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var io: any;
}

export async function POST(request: NextRequest) {
  try {
    const { msg } = await request.json();

    if (global.io) {
      global.io.emit('/esp/pills', { msg });
      console.log('Sent to ESP32:', msg);
    } else {
      console.error('Socket.IO not initialized');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending to ESP32:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}