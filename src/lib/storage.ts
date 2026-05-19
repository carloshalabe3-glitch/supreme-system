import { Transaction, Subscription, SavingsGoal } from './types';

const KEYS = {
  transactions: 'ft_transactions',
  subscriptions: 'ft_subscriptions',
  savingsGoals: 'ft_savings_goals',
};

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Transactions
export const getTransactions = (): Transaction[] =>
  load<Transaction>(KEYS.transactions).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

export const addTransaction = (t: Transaction): void => {
  const all = load<Transaction>(KEYS.transactions);
  save(KEYS.transactions, [...all, t]);
};

export const deleteTransaction = (id: string): void => {
  const all = load<Transaction>(KEYS.transactions);
  save(KEYS.transactions, all.filter((t) => t.id !== id));
};

export const updateTransaction = (updated: Transaction): void => {
  const all = load<Transaction>(KEYS.transactions);
  save(KEYS.transactions, all.map((t) => (t.id === updated.id ? updated : t)));
};

// Subscriptions
export const getSubscriptions = (): Subscription[] =>
  load<Subscription>(KEYS.subscriptions);

export const addSubscription = (s: Subscription): void => {
  const all = load<Subscription>(KEYS.subscriptions);
  save(KEYS.subscriptions, [...all, s]);
};

export const deleteSubscription = (id: string): void => {
  const all = load<Subscription>(KEYS.subscriptions);
  save(KEYS.subscriptions, all.filter((s) => s.id !== id));
};

export const updateSubscription = (updated: Subscription): void => {
  const all = load<Subscription>(KEYS.subscriptions);
  save(KEYS.subscriptions, all.map((s) => (s.id === updated.id ? updated : s)));
};

// Savings Goals
export const getSavingsGoals = (): SavingsGoal[] =>
  load<SavingsGoal>(KEYS.savingsGoals);

export const addSavingsGoal = (g: SavingsGoal): void => {
  const all = load<SavingsGoal>(KEYS.savingsGoals);
  save(KEYS.savingsGoals, [...all, g]);
};

export const deleteSavingsGoal = (id: string): void => {
  const all = load<SavingsGoal>(KEYS.savingsGoals);
  save(KEYS.savingsGoals, all.filter((g) => g.id !== id));
};

export const updateSavingsGoal = (updated: SavingsGoal): void => {
  const all = load<SavingsGoal>(KEYS.savingsGoals);
  save(KEYS.savingsGoals, all.map((g) => (g.id === updated.id ? updated : g)));
};
