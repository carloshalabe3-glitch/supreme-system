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

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { href: '/savings', label: 'Savings Goals', icon: PiggyBank },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  return (
    <aside className="w-56 shrink-0 bg-zinc-900 min-h-screen flex flex-col py-6 px-4 gap-1">
      <div className="flex items-center gap-2 px-2 mb-8">
        <TrendingUp className="text-indigo-400" size={22} />
        <span className="font-bold text-white text-lg tracking-tight">FinanceTracker</span>
      </div>
      {/* Currency toggle */}
      <div className="flex rounded-lg overflow-hidden border border-zinc-700 mb-4">
        {(['USD', 'MXN'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
              currency === c ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
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
