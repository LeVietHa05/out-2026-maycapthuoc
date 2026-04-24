'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAppSettings } from '@/app/providers';
import { useCart } from '@/app/cart-context';
import { Medicine, getMedicines } from '@/lib/types';

export default function ListPage() {
  const { t } = useAppSettings();
  const { items, addItem, updateItem, removeItem, totalItems, clearCart } = useCart();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedicines = async () => {
      setLoading(true);
      try {
        const loadedMedicines = await getMedicines();
        setMedicines(loadedMedicines);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void loadMedicines();
  }, []);

  const cartItems = useMemo(() => {
    return medicines.filter((medicine) => items[medicine.id] > 0);
  }, [items, medicines]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, medicine) => {
      const quantity = items[medicine.id] || 0;
      return sum + medicine.price * quantity;
    }, 0);
  }, [cartItems, items]);

  if (loading) {
    return <div className="p-8">{t.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t.listPlaceholderTitle}</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{t.listPlaceholderDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                {t.backToWelcome}
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {t.checkout}
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
            <div className="grid gap-6">
              {medicines.map((medicine) => {
                const quantity = items[medicine.id] || 0;
                return (
                  <div
                    key={medicine.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="grid gap-4 md:grid-cols-[120px_1fr] items-center">
                      <div className="relative h-28 w-full overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800">
                        <img src={medicine.image} alt={medicine.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold">{medicine.name}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{medicine.dosage}</p>
                          </div>
                          <div className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                            {medicine.price.toLocaleString()} đ
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{medicine.uses}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => updateItem(medicine.id, Math.max(0, quantity - 1))}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center text-lg font-semibold">{quantity}</span>
                          <button
                            onClick={() => addItem(medicine.id, 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => addItem(medicine.id, 1)}
                            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            {t.addToCart}
                          </button>
                          {quantity > 0 && (
                            <button
                              onClick={() => removeItem(medicine.id)}
                              className="rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-950"
                            >
                              {t.removeFromCart}
                            </button>
                          )}
                          <Link
                            href={`/detail/${medicine.id}`}
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                          >
                            {t.viewDetails}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky top-6 self-start rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-semibold mb-4">{t.cartTotal}</h2>
              {cartItems.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">{t.emptyCart}</p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between gap-2 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
                        <div>
                          <p className="font-semibold">{medicine.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.quantity}: {items[medicine.id]}</p>
                        </div>
                        <p className="font-semibold">{(medicine.price * (items[medicine.id] || 0)).toLocaleString()} đ</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.quantity} tổng: {totalItems}</p>
                    <p className="mt-2 text-xl font-semibold">{t.subtotal}: {cartTotal.toLocaleString()} đ</p>
                  </div>
                  <Link
                    href="/checkout"
                    className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {t.checkout}
                  </Link>
                  <button
                    onClick={clearCart}
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                  >
                    {t.emptyCart}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
