import React, { useMemo, useRef, useState } from 'react';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react';
import {
  addOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  closeOutline,
  layersOutline,
  timeOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { FilterOption, Incident, IncidentPriority } from '../types/incident';
import { useIncidentsStorage } from '../hooks/useIncidentsStorage';
import { KpiCard } from '../components/KpiCard';
import { IncidentItem } from '../components/IncidentItem';

const Home: React.FC = () => {
  const history = useHistory();

  // Gestión de incidencias persistidas mediante Custom Hook (Mejora 2)
  const {
    incidents,
    addIncident,
    toggleIncidentStatus,
    deleteIncident,
  } = useIncidentsStorage();

  // Estados UI
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todas');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados del formulario modal
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<IncidentPriority>('media');

  // Referencia para control de IonList
  const listRef = useRef<HTMLIonListElement | null>(null);

  // Métricas memoizadas
  const metrics = useMemo(() => {
    const total = incidents.length;
    const pending = incidents.filter((item) => item.status === 'pendiente').length;
    const resolved = incidents.filter((item) => item.status === 'resuelta').length;
    const critical = incidents.filter(
      (item) => item.status === 'pendiente' && item.priority === 'alta'
    ).length;
    return { total, pending, resolved, critical };
  }, [incidents]);

  // Filtrado reactivo combinado
  const filteredIncidents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return incidents.filter((item) => {
      const matchesStatus = activeFilter === 'todas' || item.status === activeFilter;
      const matchesQuery =
        normalizedQuery === '' ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery) ||
        item.id.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [incidents, activeFilter, searchQuery]);

  // Gesto nativo Pull-to-Refresh
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      setToastMessage('Estado sincronizado con el servidor');
      event.detail.complete();
    }, 700);
  };

  const handleToggleStatus = async (id: string) => {
    toggleIncidentStatus(id);
    await listRef.current?.closeSlidingItems();
    setToastMessage('Estado de incidencia actualizado');
  };

  const handleDeleteIncident = async (id: string) => {
    deleteIncident(id);
    await listRef.current?.closeSlidingItems();
    setToastMessage(`Incidencia ${id} eliminada`);
  };

  const handleViewDetail = (id: string) => {
    history.push(`/incident/${id}`);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setToastMessage('El título y la ubicación son obligatorios');
      return;
    }

    const newIncident: Incident = {
      id: `INC-${Math.floor(104 + Math.random() * 895)}`,
      title: title.trim(),
      location: location.trim(),
      description: description.trim() || 'Sin observaciones adicionales.',
      priority,
      status: 'pendiente',
      createdAt: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    addIncident(newIncident);
    setTitle('');
    setLocation('');
    setDescription('');
    setPriority('media');
    setIsModalOpen(false);
    setToastMessage(`Incidencia ${newIncident.id} registrada`);
  };

  return (
    <IonPage className="min-h-screen">
      {/* Cabecera con estética neo-brutalista de alto contraste */}
      <IonHeader className="ion-no-border">
        <IonToolbar
          className="border-b-4 border-slate-900 bg-amber-400"
          style={{ '--background': '#facc15', '--color': '#0f172a' }}
        >
          <IonTitle className="font-mono text-xl font-black uppercase tracking-tight text-slate-900">
            ⚡ SmartLab Monitor
          </IonTitle>
          <IonButtons slot="end">
            <div className="mr-3 flex items-center gap-2">
              <span className="hidden text-xs font-black uppercase text-slate-900 sm:inline">
                Pendientes:
              </span>
              <span className="rounded-lg border-2 border-slate-900 bg-slate-900 px-3 py-1 font-mono text-sm font-black text-amber-300 shadow-brutal-sm">
                {metrics.pending}
              </span>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-100">
        {/* Pull-to-refresh nativo */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingText="Desliza para sincronizar"
            refreshingSpinner="crescent"
            refreshingText="Sincronizando..."
          />
        </IonRefresher>

        {/* Layout estructurado con unidades de viewport (min-h-[100vh] y min-h-[88vh]) */}
        <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-5xl flex-col justify-between px-4 pb-24 pt-5 sm:px-6">
          <main className="space-y-6">
            {/* Bloque 1: Panel KPI modularizado con Brutalismo */}
            <section aria-label="Resumen de métricas de incidencias">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-mono text-xs font-black uppercase tracking-widest text-slate-900">
                  Panel de Control Operativo
                </h2>
                <span className="rounded-md border border-slate-900 bg-white px-2 py-0.5 font-mono text-[11px] font-black uppercase text-slate-700 shadow-brutal-sm">
                  En Vivo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
                <KpiCard
                  title="Total"
                  value={metrics.total}
                  icon={layersOutline}
                  iconBgColor="bg-blue-200"
                  badgeColor="text-blue-900"
                />
                <KpiCard
                  title="Pendientes"
                  value={metrics.pending}
                  icon={timeOutline}
                  iconBgColor="bg-amber-200"
                  badgeColor="text-amber-900"
                />
                <KpiCard
                  title="Críticas"
                  value={metrics.critical}
                  icon={alertCircleOutline}
                  iconBgColor="bg-rose-200"
                  badgeColor="text-rose-900"
                />
                <KpiCard
                  title="Resueltas"
                  value={metrics.resolved}
                  icon={checkmarkCircleOutline}
                  iconBgColor="bg-emerald-200"
                  badgeColor="text-emerald-900"
                />
              </div>
            </section>

            {/* Bloque 2: Buscador y Segmento con micro-interacciones brutalistas */}
            <section aria-label="Filtros y Búsqueda" className="space-y-3">
              <div className="rounded-xl border-2 border-slate-900 bg-white p-1 shadow-brutal transition-all focus-within:shadow-brutal-lg">
                <IonSearchbar
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value ?? '')}
                  placeholder="Buscar por código, título o aula..."
                  debounce={200}
                  className="px-0 py-0"
                  aria-label="Buscar incidencias por texto"
                />
              </div>

              {/* Segmentos con estilo tipo tabs neo-brutalistas */}
              <div className="flex flex-wrap gap-2">
                {(['todas', 'pendiente', 'resuelta'] as FilterOption[]).map((tab) => {
                  const count =
                    tab === 'todas'
                      ? metrics.total
                      : tab === 'pendiente'
                      ? metrics.pending
                      : metrics.resolved;
                  const isSelected = activeFilter === tab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveFilter(tab)}
                      className={`flex items-center gap-2 rounded-lg border-2 border-slate-900 px-4 py-2 font-mono text-xs font-black uppercase transition-all duration-150 min-h-[44px] ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-brutal translate-x-0.5 translate-y-0.5'
                          : 'bg-white text-slate-800 shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span>{tab}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[11px] font-black ${
                          isSelected ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Bloque 3: Listado interactivo con layout adaptado (min-h-[45vh]) */}
            <section aria-label="Listado de incidencias" className="min-h-[45vh]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-mono text-xs font-black uppercase tracking-wider text-slate-900">
                  Incidencias Registradas ({filteredIncidents.length})
                </h2>
                <span className="font-mono text-xs font-bold text-slate-500">
                  ↔ Desliza para resolver o borrar
                </span>
              </div>

              {filteredIncidents.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-900 bg-white p-10 text-center shadow-brutal">
                  <p className="font-mono text-sm font-black text-slate-700">
                    No se han encontrado incidencias con el filtro seleccionado.
                  </p>
                </div>
              ) : (
                <IonList ref={listRef} lines="none" className="bg-transparent p-0">
                  {filteredIncidents.map((incident) => (
                    <IncidentItem
                      key={incident.id}
                      incident={incident}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteIncident}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </IonList>
              )}
            </section>
          </main>

          {/* Pie de página brutalista */}
          <footer className="mt-8 border-t-2 border-slate-900 pt-4 text-center">
            <p className="font-mono text-xs font-bold text-slate-600">
              SmartLab Incident Manager · DAM 2º · Interfaces Multiplataforma
            </p>
          </footer>
        </div>

        {/* FAB con estilo neo-brutalista interactivo */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="mb-4 mr-4">
          <IonFabButton
            onClick={() => setIsModalOpen(true)}
            aria-label="Registrar nueva incidencia"
            className="border-2 border-slate-900 shadow-brutal-md transition-all duration-150 hover:scale-105 active:scale-95 min-h-[52px] min-w-[52px]"
            style={{
              '--background': '#facc15',
              '--color': '#0f172a',
            }}
          >
            <IonIcon icon={addOutline} className="text-2xl font-black" />
          </IonFabButton>
        </IonFab>

        {/* Modal de creación con estilo neo-brutalista e interacciones por teclado */}
        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar
              className="border-b-4 border-slate-900 bg-amber-400"
              style={{ '--background': '#facc15', '--color': '#0f172a' }}
            >
              <IonTitle className="font-mono font-black uppercase text-slate-900">
                ➕ Nueva Incidencia
              </IonTitle>
              <IonButtons slot="end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Cerrar modal"
                  className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-900 bg-white font-bold text-slate-900 shadow-brutal-sm transition-all hover:bg-rose-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <IonIcon icon={closeOutline} className="text-xl" />
                </button>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding bg-slate-100">
            <div className="mx-auto max-w-lg min-h-[60vh] flex flex-col justify-between py-2">
              <form onSubmit={handleCreateIncident} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-xs font-black uppercase text-slate-800">
                    Título de la Incidencia *
                  </label>
                  <div className="rounded-xl border-2 border-slate-900 bg-white shadow-brutal-sm focus-within:shadow-brutal">
                    <IonInput
                      placeholder="Ej. Switch de red sin sincronismo"
                      value={title}
                      onIonInput={(e) => setTitle(e.detail.value ?? '')}
                      required
                      aria-label="Título de la incidencia"
                      className="px-3"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs font-black uppercase text-slate-800">
                    Aula o Ubicación *
                  </label>
                  <div className="rounded-xl border-2 border-slate-900 bg-white shadow-brutal-sm focus-within:shadow-brutal">
                    <IonInput
                      placeholder="Ej. Aula 204 - Redes"
                      value={location}
                      onIonInput={(e) => setLocation(e.detail.value ?? '')}
                      required
                      aria-label="Ubicación de la incidencia"
                      className="px-3"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs font-black uppercase text-slate-800">
                    Nivel de Prioridad *
                  </label>
                  <div className="rounded-xl border-2 border-slate-900 bg-white shadow-brutal-sm focus-within:shadow-brutal">
                    <IonSelect
                      value={priority}
                      onIonChange={(e) => setPriority(e.detail.value as IncidentPriority)}
                      aria-label="Prioridad de la incidencia"
                      className="px-3"
                    >
                      <IonSelectOption value="alta">Alta (Crítica)</IonSelectOption>
                      <IonSelectOption value="media">Media (Operativa)</IonSelectOption>
                      <IonSelectOption value="baja">Baja (Mantenimiento)</IonSelectOption>
                    </IonSelect>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs font-black uppercase text-slate-800">
                    Descripción Técnica
                  </label>
                  <div className="rounded-xl border-2 border-slate-900 bg-white shadow-brutal-sm focus-within:shadow-brutal">
                    <IonTextarea
                      rows={4}
                      placeholder="Indica síntomas o detalles de la incidencia..."
                      value={description}
                      onIonInput={(e) => setDescription(e.detail.value ?? '')}
                      aria-label="Descripción técnica de la incidencia"
                      className="px-3"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full min-h-[48px] rounded-xl border-2 border-slate-900 bg-blue-600 px-4 py-3 font-mono text-sm font-black uppercase text-white shadow-brutal transition-all duration-150 hover:-translate-y-0.5 hover:shadow-brutal-lg hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    aria-label="Registrar incidencia en la base de datos"
                  >
                    Guardar Incidencia
                  </button>
                </div>
              </form>
            </div>
          </IonContent>
        </IonModal>

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

export default Home;
