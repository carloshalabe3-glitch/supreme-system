'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { getSubscriptions, deleteSubscription, updateSubscription } from '@/lib/storage';
import { Subscription } from '@/lib/types';
import { getMonthlySubscriptionCost, frequencyLabel } from '@/lib/utils';
import SubscriptionModal from '@/components/SubscriptionModal';
import { useCurrency } from '@/lib/currency';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { format } = useCurrency();

  function load() {
    setSubscriptions(getSubscriptions());
  }

  useEffect(() => { load(); }, []);

  function handleDelete(id: string) {
    deleteSubscription(id);
    load();
  }

  function handleToggle(sub: Subscription) {
    updateSubscription({ ...sub, active: !sub.active });
    load();
  }

  const monthlyTotal = getMonthlySubscriptionCost(subscriptions);
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage recurring charges</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Subscription
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-zinc-400 text-xs mb-1">Monthly cost</p>
          <p className="text-2xl font-bold text-white">{format(monthlyTotal)}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-zinc-400 text-xs mb-1">Yearly cost</p>
          <p className="text-2xl font-bold text-white">{format(yearlyTotal)}</p>
        </div>
      </div>

      {/* List */}
      {subscriptions.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center text-zinc-500 text-sm">
          No subscriptions yet — add your first one
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subscriptions.map((s) => (
            <div
              key={s.id}
              className={`bg-zinc-900 rounded-2xl p-5 flex flex-col gap-3 ${!s.active ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold">{s.name}</h3>
                  {s.category && <p className="text-zinc-500 text-xs mt-0.5">{s.category}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(s)}
                    className={`transition-colors ${s.active ? 'text-emerald-400' : 'text-zinc-600'}`}
                    title={s.active ? 'Deactivate' : 'Activate'}
                  >
                    {s.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-zinc-600 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-white">{format(s.amount)}</p>
                  <p className="text-zinc-500 text-xs">{frequencyLabel(s.frequency)}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-xs">Next billing</p>
                  <p className="text-zinc-300 text-xs">{new Date(s.nextBillingDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-xs">
                  ≈ {format(
                    s.frequency === 'monthly' ? s.amount :
                    s.frequency === 'yearly' ? s.amount / 12 :
                    s.amount * 4.33
                  )}/mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <SubscriptionModal onClose={() => setShowModal(false)} onSave={load} />}
    </div>
  );
}
