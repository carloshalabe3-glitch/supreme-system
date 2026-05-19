'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { SavingsGoal } from '@/lib/types';
import { updateSavingsGoal } from '@/lib/storage';
import { useCurrency } from '@/lib/currency';

interface Props {
  goal: SavingsGoal;
  onClose: () => void;
  onSave: () => void;
}

export default function AddFundsModal({ goal, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('');
  const { format } = useCurrency();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const add = parseFloat(amount);
    if (!add || add <= 0) return;
    updateSavingsGoal({ ...goal, currentAmount: goal.currentAmount + add });
    onSave();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Add Funds</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <p className="text-zinc-400 text-sm mb-4">
          {goal.name} &mdash; {format(goal.currentAmount)} saved so far
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount to add"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium text-sm transition-colors"
          >
            Add Funds
          </button>
        </form>
      </div>
    </div>
  );
}
