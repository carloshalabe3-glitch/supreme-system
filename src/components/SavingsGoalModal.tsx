'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { SavingsGoal } from '@/lib/types';
import { generateId, GOAL_COLORS } from '@/lib/utils';
import { addSavingsGoal } from '@/lib/storage';

interface Props {
  onClose: () => void;
  onSave: () => void;
}

export default function SavingsGoalModal({ onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState(GOAL_COLORS[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) return;
    const g: SavingsGoal = {
      id: generateId(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || '0'),
      targetDate,
      color,
      createdAt: new Date().toISOString(),
    };
    addSavingsGoal(g);
    onSave();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">New Savings Goal</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Goal name (e.g. Emergency Fund)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />

          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Target amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Current amount saved (optional)"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500"
          />

          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Target date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs mb-2 block">Color</label>
            <div className="flex gap-2">
              {GOAL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium text-sm transition-colors mt-1"
          >
            Create Goal
          </button>
        </form>
      </div>
    </div>
  );
}
