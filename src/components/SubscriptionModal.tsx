'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Subscription, SubscriptionFrequency } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { addSubscription } from '@/lib/storage';

interface Props {
  onClose: () => void;
  onSave: () => void;
}

const FREQUENCIES: { value: SubscriptionFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
];

export default function SubscriptionModal({ onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount || !nextBillingDate) return;
    const s: Subscription = {
      id: generateId(),
      name,
      amount: parseFloat(amount),
      frequency,
      nextBillingDate,
      category,
      active: true,
      createdAt: new Date().toISOString(),
    };
    addSubscription(s);
    onSave();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Add Subscription</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Service name (e.g. Netflix)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Category (e.g. Streaming)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />

          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Next billing date</label>
            <input
              type="date"
              value={nextBillingDate}
              onChange={(e) => setNextBillingDate(e.target.value)}
              required
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium text-sm transition-colors mt-1"
          >
            Save Subscription
          </button>
        </form>
      </div>
    </div>
  );
}
