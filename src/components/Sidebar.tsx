'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  RefreshCw,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';
import { useCurrency } from '@/lib/currency';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { href: '/savings', label: 'Savings Goals', icon: PiggyBank },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currency, rate, setCurrency, setRate } = useCurrency();
  const [editingRate, setEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState(String(rate));

  function handleRateSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(rateInput);
    if (!isNaN(val) && val > 0) setRate(val);
    setEditingRate(false);
  }

  return (
    <aside className="w-56 shrink-0 bg-zinc-900 min-h-screen flex flex-col py-6 px-4 gap-1">
      <div className="flex items-center gap-2 px-2 mb-8">
        <TrendingUp className="text-indigo-400" size={22} />
        <span className="font-bold text-white text-lg tracking-tight">FinanceTracker</span>
      </div>

      {/* Currency toggle */}
      <p className="text-zinc-500 text-xs px-1 mb-1">Currency</p>
      <div className="flex rounded-lg overflow-hidden border border-zinc-700 mb-2">
        {(['USD', 'MXN'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`flex-1 py-2 text-xs font-bold transition-colors ${
              currency === c ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Exchange rate (only relevant when MXN is active) */}
      <div className="mb-6 px-1">
        {editingRate ? (
          <form onSubmit={handleRateSubmit} className="flex gap-1">
            <input
              autoFocus
              type="number"
              step="0.01"
              min="0.01"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="w-full bg-zinc-800 text-white text-xs rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button type="submit" className="text-indigo-400 text-xs font-medium hover:text-indigo-300">
              OK
            </button>
          </form>
        ) : (
          <button
            onClick={() => { setRateInput(String(rate)); setEditingRate(true); }}
            className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors"
          >
            1 USD = {rate} MXN ✎
          </button>
        )}
      </div>

      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
