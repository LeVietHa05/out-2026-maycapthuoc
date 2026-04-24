'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Order, Medicine, addOrder } from '@/lib/types';
import { useAppSettings } from '@/app/providers';
import { useCart } from '@/app/cart-context';

const PHONE_PLACEHOLDER = '0987654321';

export default function CheckoutPage() {
  const { t } = useAppSettings();
  const { items, totalItems, updateItem, removeItem, clearCart } = useCart();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadMedicines = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/medicines.json');
        const data: Medicine[] = await response.json();
        const localMedicines = localStorage.getItem('medicines');
        setMedicines(localMedicines ? JSON.parse(localMedicines) : data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void loadMedicines();
  }, []);

  const cartItems = useMemo(
    () => medicines.filter((medicine) => items[medicine.id] > 0),
    [items, medicines]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, medicine) => sum + medicine.price * (items[medicine.id] || 0), 0),
    [cartItems, items]
  );

  const buildQrCode = () => {
    const quantities = [1, 2, 3, 4, 5, 6]
      .map((id) => `${id}:${items[id] || 0}`)
      .join(',');
    return `${PHONE_PLACEHOLDER},${quantities}`;
  };

  const handleSubmit = async () => {
    if (cartItems.length === 0) return;

    setSubmitting(true);
    const order: Order = {
      id: `ORD-${Date.now()}`,
      phone: PHONE_PLACEHOLDER,
      medicines: cartItems.reduce((acc, medicine) => {
        acc[medicine.id] = items[medicine.id] || 0;
        return acc;
      }, {} as Record<number, number>),
      total: cartTotal,
      timestamp: new Date().toISOString(),
      qrCode: buildQrCode(),
    };

    try {
      await addOrder(order);
      clearCart();
      router.push('/confirm');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">{t.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t.checkout}</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{t.orderSummary}</p>
            </div>
            <Link
              href="/list"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              {t.backToWelcome}
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {t.emptyCart}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
              <div className="space-y-4">
                {cartItems.map((medicine) => {
                  const quantity = items[medicine.id] || 0;
                  return (
                    <div key={medicine.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-xl font-semibold">{medicine.name}</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{medicine.dosage}</p>
                        </div>
                        <p className="text-lg font-semibold">{medicine.price.toLocaleString()} đ</p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => updateItem(medicine.id, quantity - 1)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-lg font-semibold">{quantity}</span>
                        <button
                          onClick={() => updateItem(medicine.id, quantity + 1)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(medicine.id)}
                          className="rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-950"
                        >
                          {t.removeFromCart}
                        </button>
                      </div>
                      <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                        {t.subtotal}: {(medicine.price * quantity).toLocaleString()} đ
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.quantity} tổng</p>
                    <p className="mt-2 text-3xl font-semibold">{totalItems}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.cartTotal}</p>
                    <p className="mt-2 text-3xl font-semibold">{cartTotal.toLocaleString()} đ</p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                  >
                    {submitting ? `${t.checkout}...` : t.receiveOrder}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
