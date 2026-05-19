'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionType } from '@/lib/types';
import { generateId, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/utils';
import { addTransaction } from '@/lib/storage';

interface Props {
  onClose: () => void;
  onSave: () => void;
}

export default function TransactionModal({ onClose, onSave }: Props) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !category || !description || !date) return;
    const t: Transaction = {
      id: generateId(),
      type,
      amount: parseFloat(amount),
      category: category as Transaction['category'],
      description,
      date,
      createdAt: new Date().toISOString(),
    };
    addTransaction(t);
    onSave();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Add Transaction</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Type toggle */}
          <div className="flex rounded-lg overflow-hidden border border-zinc-700">
            {(['income', 'expense'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setCategory(''); }}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                  type === t
                    ? t === 'income'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium text-sm transition-colors mt-1"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
