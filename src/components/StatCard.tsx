import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

export default function StatCard({ label, value, icon, trend, trendUp, color }: StatCardProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
        <span className={`p-2 rounded-xl ${color}`}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
