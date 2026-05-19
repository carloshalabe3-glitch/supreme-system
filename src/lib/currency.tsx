'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'MXN';

// USD is the base currency; MXN amounts = USD * rate
const DEFAULT_RATE = 17.5;

interface CurrencyContextType {
  currency: Currency;
  rate: number;
  setCurrency: (c: Currency) => void;
  setRate: (r: number) => void;
  // convert a stored (USD-base) amount to display currency
  convert: (amount: number) => number;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  rate: DEFAULT_RATE,
  setCurrency: () => {},
  setRate: () => {},
  convert: (n) => n,
  format: (n) => `$${n.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [rate, setRateState] = useState(DEFAULT_RATE);

  useEffect(() => {
    const saved = localStorage.getItem('ft_currency') as Currency | null;
    if (saved === 'USD' || saved === 'MXN') setCurrencyState(saved);
    const savedRate = parseFloat(localStorage.getItem('ft_rate') ?? '');
    if (!isNaN(savedRate) && savedRate > 0) setRateState(savedRate);
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    localStorage.setItem('ft_currency', c);
  }

  function setRate(r: number) {
    setRateState(r);
    localStorage.setItem('ft_rate', String(r));
  }

  function convert(amount: number): number {
    return currency === 'MXN' ? amount * rate : amount;
  }

  function format(amount: number): string {
    return new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(convert(amount));
  }

  return (
    <CurrencyContext.Provider value={{ currency, rate, setCurrency, setRate, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
