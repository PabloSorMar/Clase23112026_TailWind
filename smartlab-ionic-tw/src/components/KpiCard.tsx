import React from 'react';
import { IonIcon } from '@ionic/react';

export interface KpiCardProps {
  title: string;
  value: number;
  icon: string;
  iconColorClass: string;
  valueColorClass: string;
  ariaLabel?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  iconColorClass,
  valueColorClass,
  ariaLabel,
}) => {
  return (
    <article
      aria-label={ariaLabel || `${title}: ${value}`}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-medium">{title}</span>
        <IonIcon icon={icon} className={`text-lg ${iconColorClass}`} aria-hidden="true" />
      </div>
      <p className={`mt-2 text-2xl font-bold ${valueColorClass}`}>{value}</p>
    </article>
  );
};
