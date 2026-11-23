import React from 'react';
import {
  IonChip,
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
  alta: 'bg-red-100 text-red-800 border-red-200',
  media: 'bg-amber-100 text-amber-800 border-amber-200',
  baja: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export const IncidentItem: React.FC<IncidentItemProps> = ({
  incident,
  onToggleStatus,
  onDelete,
  onViewDetail,
}) => {
  return (
    <IonItemSliding
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      aria-label={`Incidencia ${incident.id}: ${incident.title}`}
    >
      <IonItem
        lines="none"
        className="w-full cursor-pointer transition-colors hover:bg-slate-50/50"
        style={{
          '--padding-start': '16px',
          '--inner-padding-end': '16px',
          '--background': 'transparent',
        }}
      >
        <div className="w-full py-3">
          {/* Fila superior: ID, Prioridad y Fecha */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-blue-600">
                {incident.id}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  PRIORITY_BADGE_STYLES[incident.priority]
                }`}
              >
                {incident.priority}
              </span>
            </div>
            <span className="text-xs text-slate-400">{incident.createdAt}</span>
          </div>

          {/* Título de la incidencia con enlace/botón al detalle */}
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
            className="group mt-1.5 flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={`Ver detalles de ${incident.title}`}
          >
            <h3
              className={`text-base font-semibold transition-colors group-hover:text-blue-600 ${
                incident.status === 'resuelta'
                  ? 'text-slate-400 line-through'
                  : 'text-slate-900'
              }`}
            >
              {incident.title}
            </h3>
            <IonIcon
              icon={chevronForwardOutline}
              className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0"
              aria-hidden="true"
            />
          </div>

          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
            {incident.description}
          </p>

          {/* Fila inferior: Ubicación y Chip de estado */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
            <span className="text-xs font-medium text-slate-500">
              Ubicación:{' '}
              <strong className="text-slate-700">{incident.location}</strong>
            </span>

            <IonChip
              color={incident.status === 'resuelta' ? 'success' : 'warning'}
              className="m-0 h-6 min-h-[28px] text-xs font-semibold cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(incident.id);
              }}
              aria-label={`Estado: ${incident.status}. Clic para cambiar estado.`}
            >
              {incident.status === 'resuelta' ? 'Resuelta' : 'Pendiente'}
            </IonChip>
          </div>
        </div>
      </IonItem>

      {/* Opciones ocultas tras deslizamiento horizontal */}
      <IonItemOptions side="end">
        <IonItemOption
          color="success"
          aria-label="Marcar como resuelta o pendiente"
          onClick={() => onToggleStatus(incident.id)}
        >
          <IonIcon slot="icon-only" icon={checkmarkCircleOutline} />
        </IonItemOption>
        <IonItemOption
          color="danger"
          aria-label="Eliminar incidencia"
          onClick={() => onDelete(incident.id)}
        >
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};
