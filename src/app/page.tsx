'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, RefreshCw, Plus } from 'lucide-react';
import { getTransactions, getSubscriptions, getSavingsGoals } from '@/lib/storage';
import {
  formatCurrency,
  getTotalIncome,
  getTotalExpenses,
  getMonthlySubscriptionCost,
  getLast6MonthsData,
  CATEGORY_COLORS,
  EXPENSE_CATEGORIES,
} from '@/lib/utils';
import { Transaction, Subscription, SavingsGoal } from '@/lib/types';
import StatCard from '@/components/StatCard';
import TransactionModal from '@/components/TransactionModal';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showModal, setShowModal] = useState(false);

  function load() {
    setTransactions(getTransactions());
    setSubscriptions(getSubscriptions());
    setGoals(getSavingsGoals());
  }

  useEffect(() => { load(); }, []);

  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const balance = totalIncome - totalExpenses;
  const monthlySubscriptions = getMonthlySubscriptionCost(subscriptions);
  const chartData = getLast6MonthsData(transactions);

  const expenseByCategory = EXPENSE_CATEGORIES.map((cat) => ({
    name: cat.label,
    value: transactions
      .filter((t) => t.type === 'expense' && t.category === cat.value)
      .reduce((s, t) => s + t.amount, 0),
    color: CATEGORY_COLORS[cat.value],
  })).filter((d) => d.value > 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Your financial overview</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Balance"
          value={formatCurrency(balance)}
          icon={<Wallet size={18} className="text-indigo-400" />}
          color="bg-indigo-500/10"
          trendUp={balance >= 0}
          trend={balance >= 0 ? 'Positive balance' : 'Negative balance'}
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp size={18} className="text-emerald-400" />}
          color="bg-emerald-500/10"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown size={18} className="text-rose-400" />}
          color="bg-rose-500/10"
        />
        <StatCard
          label="Monthly Subs"
          value={formatCurrency(monthlySubscriptions)}
          icon={<RefreshCw size={18} className="text-amber-400" />}
          color="bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Income vs Expenses (6 months)</h2>
          {chartData.some((d) => d.income > 0 || d.expenses > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v) => formatCurrency(Number(v))}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#income)" strokeWidth={2} name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expenses)" strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">
              No transactions yet — add some to see your chart
            </div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Expense Breakdown</h2>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {expenseByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: 8 }}
                  formatter={(v) => formatCurrency(Number(v))}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 11 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">
              No expense data yet
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-zinc-500 text-sm">No transactions yet</p>
          ) : (
            <ul className="space-y-3">
              {recentTransactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{t.description}</p>
                    <p className="text-zinc-500 text-xs">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Savings Goals</h2>
          {goals.length === 0 ? (
            <p className="text-zinc-500 text-sm">No savings goals yet</p>
          ) : (
            <ul className="space-y-4">
              {goals.slice(0, 4).map((g) => {
                const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                return (
                  <li key={g.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm font-medium">{g.name}</span>
                      <span className="text-zinc-400 text-xs">
                        {formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: g.color }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} onSave={load} />}
    </div>
  );
}
