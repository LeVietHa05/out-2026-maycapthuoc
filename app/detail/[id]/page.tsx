'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSettings } from '@/app/providers';
import { useCart } from '@/app/cart-context';
import { Medicine } from '@/lib/types';

export default function DetailPage() {
  const params = useParams();
  const { t } = useAppSettings();
  const { addItem } = useCart();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const id = Number(params?.id);

  useEffect(() => {
    const loadMedicine = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/medicines.json');
        const data: Medicine[] = await response.json();
        const localMedicines = localStorage.getItem('medicines');
        const list = localMedicines ? JSON.parse(localMedicines) : data;
        const found = list.find((item: Medicine) => item.id === id) || null;
        setMedicine(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (!Number.isNaN(id)) {
      void loadMedicine();
    }
  }, [id]);

  if (loading) {
    return <div className="p-8">{t.loading}</div>;
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background px-6 py-12 text-foreground">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <p className="text-xl font-semibold">Thuốc không tồn tại</p>
          <Link
            href="/list"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t.backToWelcome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img src={medicine.image} alt={medicine.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-5">
              <div>
                <h1 className="text-4xl font-bold">{medicine.name}</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{medicine.dosage} · {medicine.price.toLocaleString()} đ</p>
              </div>
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                <p>{medicine.uses}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{medicine.pharmacology}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold mb-2">{t.indications}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{medicine.indications}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold mb-2">{t.contraindications}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{medicine.contraindications}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold mb-2">{t.sideEffects}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{medicine.sideEffects}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold mb-2">{t.interactions}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{medicine.interactions}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold mb-2">{t.warnings}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{medicine.warnings}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold mb-2">{t.overdoseHandling}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{medicine.overdoseHandling}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => addItem(medicine.id, 1)}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {t.addToCart}
                </button>
                <Link
                  href="/list"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  {t.backToWelcome}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
