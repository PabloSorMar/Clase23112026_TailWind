import React, { useState, useEffect } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
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
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Incidencia no encontrada</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-slate-50">
          <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base text-slate-600">
              No se ha encontrado ninguna incidencia con el identificador{' '}
              <strong className="text-slate-800">{id}</strong>.
            </p>
            <IonButton
              className="mt-4"
              fill="solid"
              color="primary"
              onClick={() => history.replace('/home')}
            >
              Volver al Listado
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const handleSaveDescription = (e: React.FormEvent) => {
    e.preventDefault();
    updateIncident(incident.id, { description: description.trim() });
    setToastMessage('Descripción actualizada correctamente');
  };

  const handleToggleState = () => {
    toggleIncidentStatus(incident.id);
    setToastMessage('Estado de la incidencia actualizado');
  };

  return (
    <IonPage>
      {/* Cabecera con botón de retorno nativo */}
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/home"
              icon={arrowBackOutline}
              text="Volver"
              aria-label="Volver al listado de incidencias"
            />
          </IonButtons>
          <IonTitle className="font-semibold tracking-tight">Ficha Técnica: {incident.id}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          {/* Tarjeta de Ficha Técnica */}
          <IonCard className="m-0 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <IonCardHeader className="border-b border-slate-100 bg-slate-50/60 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-600">
                    {incident.id}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      PRIORITY_BADGE_STYLES[incident.priority]
                    }`}
                  >
                    Prioridad {incident.priority}
                  </span>
                </div>

                <IonChip
                  color={incident.status === 'resuelta' ? 'success' : 'warning'}
                  className="m-0 h-7 text-xs font-semibold cursor-pointer"
                  onClick={handleToggleState}
                  aria-label={`Estado actual: ${incident.status}. Clic para alternar.`}
                >
                  <IonIcon
                    icon={
                      incident.status === 'resuelta'
                        ? checkmarkCircleOutline
                        : alertCircleOutline
                    }
                    className="mr-1"
                  />
                  {incident.status === 'resuelta' ? 'Resuelta' : 'Pendiente'}
                </IonChip>
              </div>

              <IonCardTitle className="mt-3 text-xl font-bold text-slate-900">
                {incident.title}
              </IonCardTitle>
              <IonCardSubtitle className="text-xs text-slate-500 mt-1">
                Registrada a las {incident.createdAt}
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent className="pt-5 space-y-6">
              {/* Información de Metadatos */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <IonIcon
                    icon={locationOutline}
                    className="text-xl text-blue-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="block text-xs font-medium text-slate-500">
                      Ubicación / Aula
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {incident.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <IonIcon
                    icon={timeOutline}
                    className="text-xl text-amber-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="block text-xs font-medium text-slate-500">
                      Hora de Registro
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {incident.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulario de edición de descripción */}
              <form onSubmit={handleSaveDescription} className="space-y-4">
                <div>
                  <label
                    htmlFor="incident-description"
                    className="block text-sm font-semibold text-slate-700 mb-1"
                  >
                    Descripción Técnica (editable)
                  </label>
                  <IonItem className="rounded-xl border border-slate-200">
                    <IonTextarea
                      id="incident-description"
                      aria-label="Descripción técnica de la incidencia"
                      rows={5}
                      value={description}
                      onIonInput={(e) => setDescription(e.detail.value ?? '')}
                      placeholder="Describe los detalles de la incidencia..."
                      required
                    />
                  </IonItem>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <IonButton
                    type="submit"
                    color="primary"
                    className="min-h-[44px] font-semibold"
                    aria-label="Guardar cambios de la descripción"
                  >
                    <IonIcon slot="start" icon={saveOutline} />
                    Guardar Cambios
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Notificación Toast */}
        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2000}
          position="bottom"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default IncidentDetail;
