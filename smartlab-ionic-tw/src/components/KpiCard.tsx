import React from 'react';
import { IonIcon } from '@ionic/react';

export interface KpiCardProps {
  title: string;
  value: number;
  icon: string;
  iconBgColor?: string;
  badgeColor?: string;
  ariaLabel?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  badgeColor = 'text-blue-600',
  ariaLabel,
}) => {
  return (
    <article
      aria-label={ariaLabel || `${title}: ${value}`}
      className="group relative cursor-pointer select-none rounded-xl border-2 border-slate-900 bg-white p-4 shadow-brutal transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-700">
          {title}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 ${iconBgColor} shadow-brutal-sm transition-transform duration-150 group-hover:rotate-6`}
        >
          <IonIcon icon={icon} className={`text-base font-bold ${badgeColor}`} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 font-mono text-3xl font-black text-slate-900 transition-colors group-hover:text-blue-700">
        {value}
      </p>
    </article>
  );
};
