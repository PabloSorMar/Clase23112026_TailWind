import React, { useState, useEffect } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  locationOutline,
  timeOutline,
  alertCircleOutline,
  saveOutline,
} from 'ionicons/icons';
import { useIncidentsStorage } from '../hooks/useIncidentsStorage';
import { PRIORITY_BADGE_STYLES } from '../components/IncidentItem';

interface RouteParams {
  id: string;
}

const IncidentDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const { getIncidentById, updateIncident, toggleIncidentStatus } = useIncidentsStorage();

  const incident = getIncidentById(id);

  const [description, setDescription] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (incident) {
      setDescription(incident.description);
    }
  }, [incident]);

  if (!incident) {
    return (
      <IonPage className="min-h-screen">
        <IonHeader className="ion-no-border">
          <IonToolbar
            className="border-b-4 border-slate-900 bg-amber-400"
            style={{ '--background': '#facc15', '--color': '#0f172a' }}
          >
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle className="font-mono font-black uppercase">Incidencia no encontrada</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-slate-100">
          <div className="mx-auto mt-12 max-w-lg min-h-[40vh] flex flex-col justify-center rounded-2xl border-2 border-slate-900 bg-white p-8 text-center shadow-brutal">
            <p className="font-mono text-base font-bold text-slate-800">
              No se ha encontrado ninguna incidencia con el identificador{' '}
              <span className="rounded bg-slate-900 px-2 py-0.5 text-white">{id}</span>.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => history.replace('/home')}
                className="rounded-xl border-2 border-slate-900 bg-blue-600 px-6 py-3 font-mono font-black uppercase text-white shadow-brutal transition-all hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Volver al Listado
              </button>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const isResolved = incident.status === 'resuelta';

  const handleSaveDescription = (e: React.FormEvent) => {
    e.preventDefault();
    updateIncident(incident.id, { description: description.trim() });
    setToastMessage('Descripción técnica actualizada con éxito');
  };

  const handleToggleState = () => {
    toggleIncidentStatus(incident.id);
    setToastMessage('Estado de la incidencia actualizado');
  };

  return (
    <IonPage className="min-h-screen">
      {/* Cabecera con botón de retorno nativo y estilo neo-brutalista */}
      <IonHeader className="ion-no-border">
        <IonToolbar
          className="border-b-4 border-slate-900 bg-amber-400"
          style={{ '--background': '#facc15', '--color': '#0f172a' }}
        >
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/home"
              icon={arrowBackOutline}
              text="Volver"
              aria-label="Volver al listado de incidencias"
              className="font-mono font-black text-slate-900"
            />
          </IonButtons>
          <IonTitle className="font-mono font-black uppercase tracking-tight text-slate-900">
            Ficha: {incident.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-100">
        {/* Layout estructurado con viewport height (min-h-[88vh]) */}
        <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-3xl flex-col justify-between px-4 py-8 sm:px-6">
          <main className="space-y-6">
            {/* Tarjeta de Ficha Técnica con Neo-Brutalismo */}
            <article className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-brutal-lg sm:p-8">
              {/* Encabezado de la Ficha */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-900 pb-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border-2 border-slate-900 bg-slate-900 px-3 py-1 font-mono text-sm font-black text-amber-300 shadow-brutal-sm">
                    {incident.id}
                  </span>
                  <span
                    className={`rounded-lg px-3 py-1 font-mono text-xs font-black uppercase tracking-wider ${
                      PRIORITY_BADGE_STYLES[incident.priority]
                    }`}
                  >
                    Prioridad {incident.priority}
                  </span>
                </div>

                {/* Botón interactivo de alternancia de estado */}
                <button
                  type="button"
                  onClick={handleToggleState}
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-slate-900 px-4 py-1.5 font-mono text-xs font-black shadow-brutal transition-all duration-150 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                    isResolved
                      ? 'bg-emerald-300 text-emerald-950'
                      : 'bg-amber-300 text-amber-950'
                  }`}
                  aria-label={`Estado actual: ${incident.status}. Clic para alternar.`}
                >
                  <IonIcon
                    icon={isResolved ? checkmarkCircleOutline : alertCircleOutline}
                    className="text-lg font-bold"
                  />
                  <span>{isResolved ? 'ESTADO: RESUELTA' : 'ESTADO: PENDIENTE'}</span>
                </button>
              </div>

              {/* Título y detalles principales */}
              <div className="mt-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {incident.title}
                </h1>
                <p className="mt-1 font-mono text-xs font-bold text-slate-500">
                  Registrada el {incident.createdAt} por el equipo de guardia
                </p>
              </div>

              {/* Bloques de Metadatos */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border-2 border-slate-900 bg-blue-50 p-3.5 shadow-brutal-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-900 bg-blue-200">
                    <IonIcon icon={locationOutline} className="text-xl text-blue-900" />
                  </div>
                  <div>
                    <span className="block font-mono text-[11px] font-bold uppercase text-slate-500">
                      Ubicación / Aula
                    </span>
                    <span className="font-mono text-sm font-black text-slate-900">
                      {incident.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border-2 border-slate-900 bg-amber-50 p-3.5 shadow-brutal-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-200">
                    <IonIcon icon={timeOutline} className="text-xl text-amber-900" />
                  </div>
                  <div>
                    <span className="block font-mono text-[11px] font-bold uppercase text-slate-500">
                      Hora de Reporte
                    </span>
                    <span className="font-mono text-sm font-black text-slate-900">
                      {incident.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulario de edición con estilo brutalista e interacciones */}
              <form onSubmit={handleSaveDescription} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="detail-description"
                    className="block font-mono text-xs font-black uppercase tracking-wider text-slate-900"
                  >
                    Descripción Técnica (Editable)
                  </label>
                  <div className="rounded-xl border-2 border-slate-900 bg-white p-2 shadow-brutal-sm transition-all focus-within:shadow-brutal">
                    <IonTextarea
                      id="detail-description"
                      rows={5}
                      value={description}
                      onIonInput={(e) => setDescription(e.detail.value ?? '')}
                      placeholder="Detalla los síntomas o la resolución..."
                      required
                      aria-label="Descripción técnica editable"
                      className="font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex min-h-[48px] items-center gap-2 rounded-xl border-2 border-slate-900 bg-blue-600 px-6 py-3 font-mono text-sm font-black uppercase text-white shadow-brutal transition-all duration-150 hover:-translate-y-0.5 hover:shadow-brutal-lg hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    aria-label="Guardar cambios en la descripción"
                  >
                    <IonIcon icon={saveOutline} className="text-lg" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>
            </article>
          </main>

          <footer className="mt-8 border-t-2 border-slate-900 pt-4 text-center">
            <p className="font-mono text-xs font-bold text-slate-600">
              SmartLab Incident Manager · Ficha de Auditoría Técnica
            </p>
          </footer>
        </div>

        {/* Notificación Toast */}
        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2200}
          position="bottom"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default IncidentDetail;
