'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useAppSettings } from '@/app/providers';
import { Order, getOrders } from '@/lib/types';

export default function ConfirmPage() {
  const { t } = useAppSettings();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadLastOrder = async () => {
      try {
        const orders = await getOrders();
        if (orders.length > 0) {
          setOrder(orders[orders.length - 1]); // Get the last order
        }
      } catch (error) {
        console.error(error);
      }
    };
    void loadLastOrder();
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-background px-6 py-12 text-foreground">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <h1 className="text-3xl font-bold mb-4">{t.orderSummary}</h1>
          <p className="text-slate-600 dark:text-slate-300">{t.emptyCart}</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t.backToWelcome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.lastOrder}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{order.phone}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              QR Code
            </div>
            <div className="inline-flex items-center justify-center rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <QRCode value={order.qrCode} size={192} />
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{order.qrCode}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-xl font-semibold mb-4">{t.orderSummary}</h2>
            <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>{t.orderId}</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.phoneNumber}</span>
                <span>{order.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.totalPrice}</span>
                <span>{order.total.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between">
                <span>{t.timestamp}</span>
                <span>{new Date(order.timestamp).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t.backToWelcome}
          </Link>
        </div>
      </div>
    </div>
  );
}
