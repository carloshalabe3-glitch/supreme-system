import { Transaction, Subscription, SubscriptionFrequency } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getMonthlySubscriptionCost(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => {
      if (s.frequency === 'monthly') return sum + s.amount;
      if (s.frequency === 'yearly') return sum + s.amount / 12;
      if (s.frequency === 'weekly') return sum + s.amount * 4.33;
      return sum;
    }, 0);
}

export function getMonthTransactions(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  return transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getLast6MonthsData(transactions: Transaction[]) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const txs = getMonthTransactions(transactions, d.getFullYear(), d.getMonth());
    months.push({
      month: label,
      income: getTotalIncome(txs),
      expenses: getTotalExpenses(txs),
    });
  }
  return months;
}

export function frequencyLabel(f: SubscriptionFrequency): string {
  return { monthly: 'Monthly', yearly: 'Yearly', weekly: 'Weekly' }[f];
}

export const INCOME_CATEGORIES = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investment' },
  { value: 'other_income', label: 'Other' },
];

export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'housing', label: 'Housing' },
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'education', label: 'Education' },
  { value: 'other_expense', label: 'Other' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  salary: '#6366f1',
  freelance: '#8b5cf6',
  investment: '#a78bfa',
  other_income: '#c4b5fd',
  food: '#f59e0b',
  transport: '#3b82f6',
  housing: '#10b981',
  health: '#ef4444',
  entertainment: '#ec4899',
  shopping: '#f97316',
  utilities: '#06b6d4',
  education: '#84cc16',
  other_expense: '#6b7280',
};

export const GOAL_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#8b5cf6',
];
