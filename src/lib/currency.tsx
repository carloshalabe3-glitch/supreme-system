'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'MXN';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  format: (n) => `$${n.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('ft_currency') as Currency | null;
    if (saved === 'USD' || saved === 'MXN') setCurrencyState(saved);
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    localStorage.setItem('ft_currency', c);
  }

  function format(amount: number): string {
    return new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
