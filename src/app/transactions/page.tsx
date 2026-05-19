'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { getTransactions, deleteTransaction } from '@/lib/storage';
import { Transaction } from '@/lib/types';
import {
  getTotalIncome,
  getTotalExpenses,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  CATEGORY_COLORS,
} from '@/lib/utils';
import TransactionModal from '@/components/TransactionModal';
import { useCurrency } from '@/lib/currency';

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { format } = useCurrency();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');

  function load() {
    setTransactions(getTransactions());
  }

  useEffect(() => { load(); }, []);

  function handleDelete(id: string) {
    deleteTransaction(id);
    load();
  }

  const filtered = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory && t.category !== filterCategory) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const income = getTotalIncome(filtered);
  const expenses = getTotalExpenses(filtered);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-zinc-400 text-sm mt-1">All your income and expenses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 rounded-xl p-4 flex items-center gap-3">
          <span className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingUp size={18} className="text-emerald-400" />
          </span>
          <div>
            <p className="text-zinc-400 text-xs">Total Income</p>
            <p className="text-emerald-400 font-bold">{format(income)}</p>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 flex items-center gap-3">
          <span className="p-2 rounded-lg bg-rose-500/10">
            <TrendingDown size={18} className="text-rose-400" />
          </span>
          <div>
            <p className="text-zinc-400 text-xs">Total Expenses</p>
            <p className="text-rose-400 font-bold">{format(expenses)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-500 flex-1 min-w-[180px]"
        />
        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 text-sm capitalize transition-colors ${
                filterType === t ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white bg-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            {transactions.length === 0 ? 'No transactions yet — add your first one' : 'No transactions match your filters'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Date</th>
                <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Description</th>
                <th className="text-left text-zinc-500 text-xs font-medium px-5 py-3">Category</th>
                <th className="text-right text-zinc-500 text-xs font-medium px-5 py-3">Amount</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const catLabel = ALL_CATEGORIES.find((c) => c.value === t.category)?.label ?? t.category;
                return (
                  <tr key={t.id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-3 text-zinc-400 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-white text-sm font-medium">{t.description}</td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[t.category]}22`,
                          color: CATEGORY_COLORS[t.category],
                        }}
                      >
                        {catLabel}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{format(t.amount)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-zinc-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} onSave={load} />}
    </div>
  );
}
