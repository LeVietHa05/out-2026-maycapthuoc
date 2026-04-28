import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { Order } from '@/lib/types';

const ordersFilePath = process.platform === 'win32'
  ? join(process.cwd(), 'tmp', 'orders.json')
  : '/tmp/orders.json';

async function ensureOrdersFile() {
  const dir = dirname(ordersFilePath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(ordersFilePath);
  } catch {
    await fs.writeFile(ordersFilePath, '[]', 'utf8');
  }
}

async function readOrders(): Promise<Order[]> {
  await ensureOrdersFile();
  const file = await fs.readFile(ordersFilePath, 'utf8');
  return JSON.parse(file) as Order[];
}

async function writeOrders(orders: Order[]) {
  await ensureOrdersFile();
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
}

export async function GET() {
  const orders = await readOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const order = (await request.json()) as Order;
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
  return NextResponse.json(order);
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id: string };
  const orders = await readOrders();
  const filtered = orders.filter((item) => item.id !== id);
  await writeOrders(filtered);
  return NextResponse.json({ success: true });
}
