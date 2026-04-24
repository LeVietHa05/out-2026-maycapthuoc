'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  deleteMedicine,
  deleteOrder,
  getMedicines,
  getOrders,
  Medicine,
  Order,
  updateMedicine,
} from '@/lib/types';
import { useAppSettings } from '@/app/providers';

export default function AdminPage() {
  const { t } = useAppSettings();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'medicines' | 'orders'>('medicines');
  const [loading, setLoading] = useState(true);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [medicineData, orderData] = await Promise.all([getMedicines(), getOrders()]);
        if (isActive) {
          setMedicines(medicineData);
          setOrders(orderData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadData();
    return () => {
      isActive = false;
    };
  }, []);

  const handleSaveMedicine = async () => {
    if (!editingMedicine) return;

    const updated = medicines.some((m) => m.id === editingMedicine.id)
      ? medicines.map((m) => (m.id === editingMedicine.id ? editingMedicine : m))
      : [...medicines, editingMedicine];

    setMedicines(updated);
    setEditingMedicine(null);
    setShowForm(false);

    try {
      await updateMedicine(editingMedicine);
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleDeleteMedicine = async (id: number) => {
    const updatedMedicines = medicines.filter((m) => m.id !== id);
    setMedicines(updatedMedicines);

    try {
      await deleteMedicine(id);
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const handleAddMedicine = () => {
    const newMedicine: Medicine = {
      id: Math.max(...medicines.map((m) => m.id), 0) + 1,
      name: '',
      image: '',
      dosage: '',
      uses: '',
      pharmacology: '',
      indications: '',
      contraindications: '',
      sideEffects: '',
      interactions: '',
      warnings: '',
      overdoseHandling: '',
      price: 0,
    };
    setEditingMedicine(newMedicine);
    setShowForm(true);
  };

  const handleDeleteOrder = async (id: string) => {
    const updatedOrders = orders.filter((o) => o.id !== id);
    setOrders(updatedOrders);

    try {
      await deleteOrder(id);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  if (loading) {
    return <div className="p-8">{t.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t.adminTitle}</h1>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {t.backToWelcome}
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap mb-8">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`block w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'medicines'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700'
            }`}
          >
            {t.manageMedicines} ({medicines.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700'
            }`}
          >
            {t.viewOrders} ({orders.length})
          </button>
        </div>

        {activeTab === 'medicines' && (
          <div>
            <button
              onClick={handleAddMedicine}
              className="mb-6 w-full max-w-xs rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
            >
              + {t.addNewMedicine}
            </button>

            {showForm && editingMedicine && (
              <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h2 className="text-xl font-bold mb-4">
                  {medicines.some((m) => m.id === editingMedicine.id)
                    ? t.editMedicine
                    : t.addNewMedicine}
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder={t.medicineName}
                    value={editingMedicine.name}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                    className="rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder={t.imageUrl}
                    value={editingMedicine.image}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, image: e.target.value })}
                    className="rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder={t.dosage}
                    value={editingMedicine.dosage}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, dosage: e.target.value })}
                    className="rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder={t.uses}
                    value={editingMedicine.uses}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, uses: e.target.value })}
                    className="rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="number"
                    placeholder={t.price}
                    value={editingMedicine.price}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, price: Number(e.target.value) })}
                    className="rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <textarea
                    placeholder={t.pharmacology}
                    value={editingMedicine.pharmacology}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, pharmacology: e.target.value })}
                    className="col-span-1 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:col-span-2"
                    rows={2}
                  />
                  <textarea
                    placeholder={t.indications}
                    value={editingMedicine.indications}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, indications: e.target.value })}
                    className="col-span-1 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:col-span-2"
                    rows={2}
                  />
                  <textarea
                    placeholder={t.contraindications}
                    value={editingMedicine.contraindications}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, contraindications: e.target.value })}
                    className="col-span-1 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:col-span-2"
                    rows={2}
                  />
                  <textarea
                    placeholder={t.sideEffects}
                    value={editingMedicine.sideEffects}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, sideEffects: e.target.value })}
                    className="col-span-1 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:col-span-2"
                    rows={2}
                  />
                  <textarea
                    placeholder={t.interactions}
                    value={editingMedicine.interactions}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, interactions: e.target.value })}
                    className="col-span-1 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:col-span-2"
                    rows={2}
                  />
                  <textarea
                    placeholder={t.warnings}
                    value={editingMedicine.warnings}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, warnings: e.target.value })}
                    className="col-span-1 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:col-span-2"
                    rows={2}
                  />
                  <textarea
                    placeholder={t.overdoseHandling}
                    value={editingMedicine.overdoseHandling}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, overdoseHandling: e.target.value })}
                    className="col-span-1 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:col-span-2"
                    rows={2}
                  />
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleSaveMedicine}
                    className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                  >
                    {t.save}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingMedicine(null);
                    }}
                    className="w-full rounded-full bg-slate-400 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-500 sm:w-auto"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
              <table className="w-full min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
                <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">{t.medicineName}</th>
                    <th className="px-4 py-3">{t.dosage}</th>
                    <th className="px-4 py-3">{t.price}</th>
                    <th className="px-4 py-3">{t.uses}</th>
                    <th className="px-4 py-3 text-center">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <tr key={medicine.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                      <td className="px-4 py-3">{medicine.id}</td>
                      <td className="px-4 py-3 font-semibold">{medicine.name}</td>
                      <td className="px-4 py-3">{medicine.dosage}</td>
                      <td className="px-4 py-3">{medicine.price } đ</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{medicine.uses}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setEditingMedicine(medicine);
                            setShowForm(true);
                          }}
                          className="mr-2 inline-flex rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                        >
                          {t.editMedicine}
                        </button>
                        <button
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          className="inline-flex rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                        >
                          {t.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                {t.noOrders}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                <table className="w-full min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
                  <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <tr>
                      <th className="px-4 py-3">{t.orderId}</th>
                      <th className="px-4 py-3">{t.phoneNumber}</th>
                      <th className="px-4 py-3">{t.totalPrice}</th>
                      <th className="px-4 py-3">{t.qrContent}</th>
                      <th className="px-4 py-3">{t.timestamp}</th>
                      <th className="px-4 py-3 text-center">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                        <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                        <td className="px-4 py-3">{order.phone}</td>
                        <td className="px-4 py-3 font-semibold">{order.total.toLocaleString()} đ</td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-600 dark:text-slate-400">{order.qrCode}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{new Date(order.timestamp).toLocaleString('vi-VN')}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                          >
                            {t.delete}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
