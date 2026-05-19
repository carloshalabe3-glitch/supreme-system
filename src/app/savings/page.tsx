'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, PlusCircle } from 'lucide-react';
import { getSavingsGoals, deleteSavingsGoal } from '@/lib/storage';
import { SavingsGoal } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import SavingsGoalModal from '@/components/SavingsGoalModal';
import AddFundsModal from '@/components/AddFundsModal';

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addFundsGoal, setAddFundsGoal] = useState<SavingsGoal | null>(null);

  function load() {
    setGoals(getSavingsGoals());
  }

  useEffect(() => { load(); }, []);

  function handleDelete(id: string) {
    deleteSavingsGoal(id);
    load();
  }

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const overallPct = totalTarget > 0 ? Math.min(100, (totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <p className="text-zinc-400 text-sm mt-1">Track your financial milestones</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Summary bar */}
      {goals.length > 0 && (
        <div className="bg-zinc-900 rounded-2xl p-5 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-400 text-sm">Overall progress</span>
            <span className="text-white text-sm font-medium">{overallPct.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{formatCurrency(totalSaved)} saved</span>
            <span>{formatCurrency(totalTarget)} target</span>
          </div>
        </div>
      )}

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center text-zinc-500 text-sm">
          No savings goals yet — create your first one
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {goals.map((g) => {
            const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
            const daysLeft = Math.ceil(
              (new Date(g.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            const remaining = g.targetAmount - g.currentAmount;

            return (
              <div key={g.id} className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                    <h3 className="text-white font-semibold">{g.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="text-zinc-600 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white font-bold">{formatCurrency(g.currentAmount)}</span>
                    <span className="text-zinc-500">of {formatCurrency(g.targetAmount)}</span>
                  </div>
                  <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: g.color }}
                    />
                  </div>
                  <p className="text-zinc-500 text-xs mt-1.5">{pct.toFixed(1)}% complete</p>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-800 rounded-xl px-3 py-2">
                    <p className="text-zinc-500 text-xs">Remaining</p>
                    <p className="text-white font-medium">{formatCurrency(remaining > 0 ? remaining : 0)}</p>
                  </div>
                  <div className="bg-zinc-800 rounded-xl px-3 py-2">
                    <p className="text-zinc-500 text-xs">Target date</p>
                    <p className={`font-medium text-sm ${daysLeft < 0 ? 'text-rose-400' : daysLeft < 30 ? 'text-amber-400' : 'text-white'}`}>
                      {daysLeft < 0 ? 'Overdue' : `${daysLeft}d left`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAddFundsGoal(g)}
                  className="flex items-center justify-center gap-2 border border-zinc-700 hover:border-indigo-500 hover:text-indigo-400 text-zinc-400 rounded-xl py-2 text-sm transition-colors"
                >
                  <PlusCircle size={15} /> Add Funds
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && <SavingsGoalModal onClose={() => setShowCreateModal(false)} onSave={load} />}
      {addFundsGoal && (
        <AddFundsModal
          goal={addFundsGoal}
          onClose={() => setAddFundsGoal(null)}
          onSave={load}
        />
      )}
    </div>
  );
}
