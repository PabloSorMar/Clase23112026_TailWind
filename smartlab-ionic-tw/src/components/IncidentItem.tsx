import React from 'react';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/react';
import { checkmarkCircleOutline, chevronForwardOutline, trashOutline } from 'ionicons/icons';
import { Incident, IncidentPriority } from '../types/incident';

export interface IncidentItemProps {
  incident: Incident;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
}

export const PRIORITY_BADGE_STYLES: Record<IncidentPriority, string> = {
  alta: 'bg-rose-200 text-rose-950 border-2 border-slate-900 shadow-brutal-sm',
  media: 'bg-amber-200 text-amber-950 border-2 border-slate-900 shadow-brutal-sm',
  baja: 'bg-emerald-200 text-emerald-950 border-2 border-slate-900 shadow-brutal-sm',
};

export const IncidentItem: React.FC<IncidentItemProps> = ({
  incident,
  onToggleStatus,
  onDelete,
  onViewDetail,
}) => {
  const isResolved = incident.status === 'resuelta';

  return (
    <IonItemSliding
      className="mb-3 overflow-hidden rounded-xl border-2 border-slate-900 bg-white shadow-brutal transition-all duration-150 hover:-translate-y-0.5 hover:shadow-brutal-lg"
      aria-label={`Incidencia ${incident.id}: ${incident.title}`}
    >
      <IonItem
        lines="none"
        className="w-full"
        style={{
          '--padding-start': '16px',
          '--inner-padding-end': '16px',
          '--background': isResolved ? '#f8fafc' : '#ffffff',
        }}
      >
        <div className="w-full py-3.5">
          {/* Fila superior: ID con estilo tag brutalista, Prioridad y Fecha */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md border-2 border-slate-900 bg-slate-900 px-2 py-0.5 font-mono text-xs font-black text-white shadow-brutal-sm">
                {incident.id}
              </span>
              <span
                className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                  PRIORITY_BADGE_STYLES[incident.priority]
                }`}
              >
                {incident.priority}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-500">
              🕒 {incident.createdAt}
            </span>
          </div>

          {/* Título de la incidencia con interacción clara hacia la ficha */}
          <div
            onClick={() => onViewDetail(incident.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onViewDetail(incident.id);
              }
            }}
            className="group mt-2.5 flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 border-transparent p-1 transition-all duration-150 hover:border-slate-900 hover:bg-amber-100/60 focus:border-slate-900 focus:outline-none focus:ring-0"
            aria-label={`Ver detalles técnicos de ${incident.title}`}
          >
            <h3
              className={`text-base font-black transition-colors ${
                isResolved
                  ? 'text-slate-400 line-through'
                  : 'text-slate-900 group-hover:text-blue-900'
              }`}
            >
              {incident.title}
            </h3>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-slate-900 bg-white shadow-brutal-sm transition-transform duration-150 group-hover:translate-x-1">
              <IonIcon
                icon={chevronForwardOutline}
                className="text-sm font-bold text-slate-900"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="mt-1 text-sm font-medium text-slate-600 line-clamp-2">
            {incident.description}
          </p>

          {/* Fila inferior: Ubicación y botón interactivo de estado */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 border-slate-200 pt-2.5">
            <span className="text-xs font-bold text-slate-600">
              Ubicación:{' '}
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-900 border border-slate-300">
                {incident.location}
              </span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(incident.id);
              }}
              className={`flex items-center gap-1.5 rounded-lg border-2 border-slate-900 px-3 py-1 text-xs font-black shadow-brutal-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none min-h-[36px] ${
                isResolved
                  ? 'bg-emerald-300 text-emerald-950'
                  : 'bg-amber-300 text-amber-950'
              }`}
              aria-label={`Estado actual: ${incident.status}. Pulsa para alternar.`}
            >
              <span className="h-2 w-2 rounded-full border border-slate-900 bg-slate-900"></span>
              {isResolved ? 'RESUELTA' : 'PENDIENTE'}
            </button>
          </div>
        </div>
      </IonItem>

      {/* Acciones de Swipe en Ionic con colores y contraste brutalista */}
      <IonItemOptions side="end">
        <IonItemOption
          color="success"
          aria-label="Marcar como resuelta o pendiente"
          onClick={() => onToggleStatus(incident.id)}
          className="font-bold border-l-2 border-slate-900"
        >
          <IonIcon slot="icon-only" icon={checkmarkCircleOutline} />
        </IonItemOption>
        <IonItemOption
          color="danger"
          aria-label="Eliminar incidencia"
          onClick={() => onDelete(incident.id)}
          className="font-bold border-l-2 border-slate-900"
        >
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};
