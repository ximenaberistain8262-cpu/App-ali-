import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

type ChangeTypeKey =
  | 'disenoPieza'
  | 'material'
  | 'metodoEnsamble'
  | 'formulaActivos'
  | 'etiquetadoRegulacion';

type PriorityLevel = 'rutina' | 'estacional' | 'critico';
type RiskLevel = 'bajo' | 'medio' | 'alto' | '';
type ApprovalStatus = 'aprobar' | 'rechazar' | null;

type TechnicalCheckKey =
  | 'compatibilidad'
  | 'hermeticidad'
  | 'ifraUe'
  | 'sensorial'
  | 'artesInci'
  | 'lineaLlenado';

interface CostRow {
  id: string;
  concepto: string;
  costoActual: string;
  costoNuevo: string;
}

interface ApprovalRow {
  rol: string;
  nombre: string;
  firma: string;
  fecha: string;
  observaciones: string;
  estado: ApprovalStatus;
}

interface EngineeringChangeFormState {
  noSolicitud: string;
  fecha: string;
  prioridad: PriorityLevel;
  solicitante: string;
  area: string;
  coleccion: string;
  sitioPlanta: string;
  tipoCambio: Record<ChangeTypeKey, boolean>;
  piezaAfectada: string;
  codigo: string;
  loteReferencia: string;
  revisionCambio: string;
  causaRaiz: string;
  descripcionProblema: string;
  justificacionTecnica: string;
  costos: CostRow[];
  volumenAnual: string;
  costoHerramental: string;
  nivelRiesgo: RiskLevel;
  areaAfectada: string;
  fechaObjetivo: string;
  estrategiaInventario: string;
  validacionesTecnicas: Record<TechnicalCheckKey, boolean>;
  planMitigacion: string;
  aprobaciones: ApprovalRow[];
}

const STORAGE_KEY = 'dior_parfums_ecr_agile_v3';

const createInitialState = (): EngineeringChangeFormState => ({
  noSolicitud: '',
  fecha: '',
  prioridad: 'estacional',
  solicitante: '',
  area: '',
  coleccion: '',
  sitioPlanta: '',
  tipoCambio: {
    disenoPieza: false,
    material: false,
    metodoEnsamble: false,
    formulaActivos: false,
    etiquetadoRegulacion: false,
  },
  piezaAfectada: '',
  codigo: '',
  loteReferencia: '',
  revisionCambio: '',
  causaRaiz: '',
  descripcionProblema: '',
  justificacionTecnica: '',
  costos: [
    { id: 'row-1', concepto: '', costoActual: '', costoNuevo: '' },
    { id: 'row-2', concepto: '', costoActual: '', costoNuevo: '' },
    { id: 'row-3', concepto: '', costoActual: '', costoNuevo: '' },
  ],
  volumenAnual: '',
  costoHerramental: '',
  nivelRiesgo: '',
  areaAfectada: '',
  fechaObjetivo: '',
  estrategiaInventario: '',
  validacionesTecnicas: {
    compatibilidad: false,
    hermeticidad: false,
    ifraUe: false,
    sensorial: false,
    artesInci: false,
    lineaLlenado: false,
  },
  planMitigacion: '',
  aprobaciones: [
    { rol: 'Ingeniería', nombre: '', firma: '', fecha: '', observaciones: '', estado: null },
    { rol: 'Calidad', nombre: '', firma: '', fecha: '', observaciones: '', estado: null },
    { rol: 'Producción', nombre: '', firma: '', fecha: '', observaciones: '', estado: null },
    { rol: 'Finanzas', nombre: '', firma: '', fecha: '', observaciones: '', estado: null },
    { rol: 'Asuntos Regulatorios', nombre: '', firma: '', fecha: '', observaciones: '', estado: null },
    { rol: 'Dirección Packaging', nombre: '', firma: '', fecha: '', observaciones: '', estado: null },
  ],
});

const COLLECTIONS = [
  "J'adore",
  'Miss Dior',
  'Sauvage',
  'Rouge Dior',
  'Dior Forever',
  'Capture Totale',
  'Dior Prestige',
  'La Collection Privée',
];

const PLANT_SITES = [
  'Saint-Jean-de-Braye — Parfums',
  'Chartres — Cosméticos',
  'París — Lab Formulación',
  'Proveedor Externo',
];

const ROOT_CAUSES = [
  'Desviación en proveedor',
  'Optimización de peso / ecodiseño',
  'Actualización normativa (IFRA / UE)',
  'Incidencia en línea de llenado',
  'Mejora de estabilidad / sensorial',
  'Sustitución de materia prima',
];

const AFFECTED_AREAS = [
  'Alta Perfumería',
  'Maquillaje',
  'Tratamiento Facial (Skincare)',
  'Packaging Primario',
  'Packaging Secundario',
  'Envasado y Llenado',
  'Calidad y Estabilidad',
  'Dirección Financiera',
];

const INVENTORY_STRATEGIES = [
  'Agotar stock actual',
  'Reacondicionar lote',
  'Cuarentena inmediata',
  'Transición paralela',
  'No aplica',
];

const HEADER_AREAS = [
  'Alta Perfumería',
  'Maquillaje',
  'Tratamiento Facial',
  'Packaging y Envases',
  'Control de Calidad',
  'Envasado y Producción',
  'Asuntos Regulatorios',
];

const PART_SUGGESTIONS = [
  "Frasco J'adore 100 ml",
  'Válvula atomizadora crimpada',
  'Estuche Rouge Dior',
  'Tapa magnética lacada',
  'Gotero vidrio Prestige',
  'Bomba airless Capture Totale',
];

const PROBLEM_SUGGESTIONS = [
  'Microfuga en válvula al 2.º disparo',
  'Desviación de tono en laca o vidrio',
  'Torque insuficiente en cierre',
  'Inestabilidad de fase a 45 °C',
  'Actualización de texto INCI / lote',
];

const PROPOSAL_SUGGESTIONS = [
  'Empaque de silicona grado cosmético',
  'Ajuste de tolerancia en cuello ±0.15 mm',
  'Sustitución de pigmento aprobado UE',
  'Actualización de arte gráfico e INCI',
  'Refuerzo de crimpado en línea',
];

const COST_CONCEPT_SUGGESTIONS = [
  'Vidrio flint reciclado',
  'Bomba spray / válvula',
  'Pigmento mineral / activo',
  'Estuche cartón certificado',
  'Baño metálico / lacado',
];

const MITIGATION_SUGGESTIONS = [
  'Prueba de vacío en 50 muestras antes del llenado',
  'Estabilidad acelerada 45 °C por 4 semanas',
  'Validación sensorial con panel experto',
  'Inspección 100 % en recepción de lote',
];

const TECHNICAL_CHECKS: { key: TechnicalCheckKey; label: string }[] = [
  { key: 'compatibilidad', label: 'Compatibilidad envase–fórmula' },
  { key: 'hermeticidad', label: 'Hermeticidad al vacío' },
  { key: 'ifraUe', label: 'Cumplimiento IFRA / UE' },
  { key: 'sensorial', label: 'Validación sensorial / olfativa' },
  { key: 'artesInci', label: 'Artes gráficas e INCI' },
  { key: 'lineaLlenado', label: 'Recalificación de llenado' },
];

function parseNumericCost(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function App() {
  const [form, setForm] = useState<EngineeringChangeFormState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as EngineeringChangeFormState;
        if (parsed && Array.isArray(parsed.costos) && Array.isArray(parsed.aprobaciones)) {
          return parsed;
        }
      }
    } catch {
      // Ignorar errores de almacenamiento local
    }
    return createInitialState();
  });

  const [openSections, setOpenSections] = useState({
    problema: true,
    costos: true,
    riesgo: true,
    aprobaciones: true,
  });

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning';
    message: string;
  } | null>(null);

  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 5000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const allExpanded = Object.values(openSections).every(Boolean);

  const toggleAllSections = () => {
    const next = !allExpanded;
    setOpenSections({
      problema: next,
      costos: next,
      riesgo: next,
      aprobaciones: next,
    });
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTipoCambio = (key: ChangeTypeKey) => {
    setForm((prev) => ({
      ...prev,
      tipoCambio: {
        ...prev.tipoCambio,
        [key]: !prev.tipoCambio[key],
      },
    }));
  };

  const handleTechnicalCheck = (key: TechnicalCheckKey) => {
    setForm((prev) => ({
      ...prev,
      validacionesTecnicas: {
        ...prev.validacionesTecnicas,
        [key]: !prev.validacionesTecnicas[key],
      },
    }));
  };

  const handleCostChange = (
    id: string,
    field: 'concepto' | 'costoActual' | 'costoNuevo',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      costos: prev.costos.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }));
  };

  const handleAddCostRow = () => {
    setForm((prev) => ({
      ...prev,
      costos: [
        ...prev.costos,
        {
          id: `row-${Date.now()}`,
          concepto: '',
          costoActual: '',
          costoNuevo: '',
        },
      ],
    }));
  };

  const handleRemoveCostRow = (id: string) => {
    setForm((prev) => {
      if (prev.costos.length <= 1) return prev;
      return {
        ...prev,
        costos: prev.costos.filter((row) => row.id !== id),
      };
    });
  };

  const handleApprovalChange = (
    index: number,
    field: 'nombre' | 'firma' | 'fecha' | 'observaciones',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      aprobaciones: prev.aprobaciones.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleApprovalStatus = (index: number, target: 'aprobar' | 'rechazar') => {
    setForm((prev) => ({
      ...prev,
      aprobaciones: prev.aprobaciones.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          estado: item.estado === target ? null : target,
        };
      }),
    }));
  };

  const costSummary = useMemo(() => {
    const rowTotals = form.costos.reduce(
      (acc, row) => {
        const hasActual = row.costoActual.trim() !== '';
        const hasNuevo = row.costoNuevo.trim() !== '';
        const actual = hasActual ? parseNumericCost(row.costoActual) : 0;
        const nuevo = hasNuevo ? parseNumericCost(row.costoNuevo) : 0;
        const diff = hasActual || hasNuevo ? nuevo - actual : 0;
        return {
          totalActual: acc.totalActual + actual,
          totalNuevo: acc.totalNuevo + nuevo,
          totalDiferencia: acc.totalDiferencia + diff,
        };
      },
      { totalActual: 0, totalNuevo: 0, totalDiferencia: 0 }
    );

    const volumen = Math.max(0, parseNumericCost(form.volumenAnual));
    const herramental = parseNumericCost(form.costoHerramental);
    const impactoAnual = rowTotals.totalDiferencia * volumen + herramental;

    return {
      ...rowTotals,
      volumen,
      herramental,
      impactoAnual,
    };
  }, [form.costos, form.volumenAnual, form.costoHerramental]);

  const approvalSummary = useMemo(() => {
    const approved = form.aprobaciones.filter((a) => a.estado === 'aprobar').length;
    const rejected = form.aprobaciones.filter((a) => a.estado === 'rechazar').length;
    const pending = form.aprobaciones.length - approved - rejected;
    return { approved, rejected, pending, total: form.aprobaciones.length };
  }, [form.aprobaciones]);

  const checkedValidationsCount = useMemo(
    () => Object.values(form.validacionesTecnicas).filter(Boolean).length,
    [form.validacionesTecnicas]
  );

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setFeedback({
        type: 'success',
        message: 'Borrador guardado en el registro técnico de Parfums Christian Dior.',
      });
    } catch {
      setFeedback({
        type: 'warning',
        message: 'No se pudo guardar en el almacenamiento local.',
      });
    }
  };

  const handleResetForm = () => {
    const fresh = createInitialState();
    setForm(fresh);
    setValidationErrors({});
    setSubmittedAt(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar errores de almacenamiento local
    }
    setFeedback({
      type: 'success',
      message: 'Documento restablecido.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {};

    if (!form.noSolicitud.trim()) errors.noSolicitud = true;
    if (!form.fecha.trim()) errors.fecha = true;
    if (!form.solicitante.trim()) errors.solicitante = true;
    if (!form.piezaAfectada.trim()) errors.piezaAfectada = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setOpenSections((prev) => ({ ...prev, problema: true }));
      setSubmittedAt(null);
      setFeedback({
        type: 'warning',
        message:
          'Completa los campos requeridos: No. Solicitud, Fecha, Solicitante y Pieza afectada.',
      });
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // Ignorar errores de almacenamiento local
    }

    setSubmittedAt(
      new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date())
    );

    setFeedback({
      type: 'success',
      message: `Solicitud ${form.noSolicitud} remitida al comité técnico de Parfums Christian Dior.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#EFECE6] py-8 px-4 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-5xl bg-white border border-[#D8D4CC] rounded-none overflow-hidden">
        {/* Cabecera Couture Noir Dior */}
        <div className="bg-[#111111] px-6 sm:px-12 py-5 text-center border-b border-[#2A2A2A]">
          <div className="font-serif text-3xl sm:text-4xl font-semibold tracking-[0.42em] text-[#FAF9F6] pl-[0.42em]">
            DIOR
          </div>
          <p className="mt-1.5 text-[11px] tracking-[0.26em] text-[#9E9B95] font-sans">
            Parfums &amp; Beauté · Ingeniería de Formulación, Packaging y Regulación
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 space-y-7">
          {/* Título del documento y metadatos */}
          <header className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 border-b border-[#141414] pb-3.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#141414]">
                Solicitud de Cambio de Ingeniería
              </h1>
              <div className="flex items-center gap-5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={toggleAllSections}
                  className="text-xs font-medium tracking-wide text-[#5C5953] hover:text-[#141414] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] px-1 py-0.5"
                >
                  {allExpanded ? 'Contraer secciones' : 'Expandir secciones'}
                </button>
                <span className="text-[#CFCAC0]" aria-hidden="true">
                  ·
                </span>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-medium tracking-wide text-[#706D66] hover:text-[#141414] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] px-1 py-0.5"
                >
                  Limpiar documento
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Fila 1: No. Solicitud, Fecha y Prioridad */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-4 items-end">
                <div className="lg:col-span-4 flex items-baseline gap-3">
                  <label
                    htmlFor="no-solicitud"
                    className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                  >
                    No. Solicitud
                  </label>
                  <input
                    id="no-solicitud"
                    type="text"
                    maxLength={24}
                    value={form.noSolicitud}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, noSolicitud: e.target.value }));
                      if (validationErrors.noSolicitud) {
                        setValidationErrors((prev) => ({ ...prev, noSolicitud: false }));
                      }
                    }}
                    placeholder="PCD-2026-001"
                    className={`w-full bg-transparent border-b py-1 px-1 text-sm font-mono text-[#141414] placeholder:text-[#A39F97] focus:outline-none transition-colors ${
                      validationErrors.noSolicitud
                        ? 'border-[#141414] bg-[#F7F5F0]'
                        : 'border-[#CFCAC0] focus:border-[#141414]'
                    }`}
                  />
                </div>

                <div className="lg:col-span-3 flex items-baseline gap-3">
                  <label
                    htmlFor="fecha"
                    className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                  >
                    Fecha
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, fecha: e.target.value }));
                      if (validationErrors.fecha) {
                        setValidationErrors((prev) => ({ ...prev, fecha: false }));
                      }
                    }}
                    className={`w-full bg-transparent border-b py-1 px-1 text-sm font-mono text-[#141414] focus:outline-none transition-colors ${
                      validationErrors.fecha
                        ? 'border-[#141414] bg-[#F7F5F0]'
                        : 'border-[#CFCAC0] focus:border-[#141414]'
                    }`}
                  />
                </div>

                <div className="lg:col-span-5 flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <span className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0">
                    Prioridad
                  </span>
                  <div
                    className="inline-flex border border-[#CFCAC0] bg-[#FAF9F6] p-0.5"
                    role="group"
                    aria-label="Prioridad de solicitud"
                  >
                    {(
                      [
                        { value: 'rutina', label: 'Rutina' },
                        { value: 'estacional', label: 'Estacional' },
                        { value: 'critico', label: 'Crítico' },
                      ] as const
                    ).map((item) => {
                      const active = form.prioridad === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, prioridad: item.value }))
                          }
                          className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] ${
                            active
                              ? 'bg-[#141414] text-[#FAF9F6]'
                              : 'text-[#5C5953] hover:text-[#141414]'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fila 2: Solicitante y Área */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-4 items-end">
                <div className="sm:col-span-7 flex items-baseline gap-3">
                  <label
                    htmlFor="solicitante"
                    className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                  >
                    Solicitante
                  </label>
                  <input
                    id="solicitante"
                    type="text"
                    maxLength={60}
                    value={form.solicitante}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, solicitante: e.target.value }));
                      if (validationErrors.solicitante) {
                        setValidationErrors((prev) => ({ ...prev, solicitante: false }));
                      }
                    }}
                    placeholder="Nombre y apellido"
                    className={`w-full bg-transparent border-b py-1 px-1 text-sm text-[#141414] placeholder:text-[#A39F97] focus:outline-none transition-colors ${
                      validationErrors.solicitante
                        ? 'border-[#141414] bg-[#F7F5F0]'
                        : 'border-[#CFCAC0] focus:border-[#141414]'
                    }`}
                  />
                </div>

                <div className="sm:col-span-5 flex items-baseline gap-3">
                  <label
                    htmlFor="area"
                    className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                  >
                    Área
                  </label>
                  <div className="relative w-full">
                    <select
                      id="area"
                      value={form.area}
                      onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
                      className="w-full appearance-none bg-transparent border-b border-[#CFCAC0] py-1 pl-1 pr-7 text-sm text-[#141414] focus:border-[#141414] focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="">Seleccionar área</option>
                      {HEADER_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#706D66]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* Fila 3: Línea / Colección y Planta / Sitio */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-4 items-end">
                <div className="sm:col-span-6 flex items-baseline gap-3">
                  <label
                    htmlFor="coleccion"
                    className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                  >
                    Colección
                  </label>
                  <div className="relative w-full">
                    <select
                      id="coleccion"
                      value={form.coleccion}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, coleccion: e.target.value }))
                      }
                      className="w-full appearance-none bg-transparent border-b border-[#CFCAC0] py-1 pl-1 pr-7 text-sm text-[#141414] focus:border-[#141414] focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="">Seleccionar línea</option>
                      {COLLECTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#706D66]"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6 flex items-baseline gap-3">
                  <label
                    htmlFor="sitio-planta"
                    className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                  >
                    Planta / Sitio
                  </label>
                  <div className="relative w-full">
                    <select
                      id="sitio-planta"
                      value={form.sitioPlanta}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, sitioPlanta: e.target.value }))
                      }
                      className="w-full appearance-none bg-transparent border-b border-[#CFCAC0] py-1 pl-1 pr-7 text-sm text-[#141414] focus:border-[#141414] focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="">Seleccionar sede</option>
                      {PLANT_SITES.map((site) => (
                        <option key={site} value={site}>
                          {site}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#706D66]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* Fila 4: Tipo de cambio */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                <span className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0">
                  Tipo de cambio
                </span>

                {(
                  [
                    { key: 'disenoPieza', label: 'Diseño de pieza' },
                    { key: 'material', label: 'Material' },
                    { key: 'metodoEnsamble', label: 'Método de ensamble' },
                    { key: 'formulaActivos', label: 'Fórmula / Activos' },
                    { key: 'etiquetadoRegulacion', label: 'Etiquetado / Regulación' },
                  ] as const
                ).map((item) => (
                  <label
                    key={item.key}
                    className="inline-flex items-center gap-2 text-sm text-[#1F1F1F] cursor-pointer select-none min-h-9"
                  >
                    <input
                      type="checkbox"
                      checked={form.tipoCambio[item.key]}
                      onChange={() => handleTipoCambio(item.key)}
                      className="h-4 w-4 rounded-none border-[#9E9B95] accent-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </header>

          {/* Sección 1: Descripción técnica del problema */}
          <section className="border border-[#D8D4CC] rounded-none overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('problema')}
              aria-expanded={openSections.problema}
              className="w-full flex items-center gap-3 bg-[#F5F3EE] hover:bg-[#ECE9E1] px-5 py-2.5 text-left border-b border-[#D8D4CC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#141414]"
            >
              <ChevronDown
                className={`w-4 h-4 text-[#141414] shrink-0 transition-transform duration-150 ${
                  openSections.problema ? 'rotate-0' : '-rotate-90'
                }`}
                aria-hidden="true"
              />
              <span className="font-serif text-lg font-semibold tracking-wide text-[#141414]">
                1. Descripción técnica del problema
              </span>
            </button>

            {openSections.problema && (
              <div className="p-5 sm:p-6 space-y-5 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-4 items-end">
                  <div className="sm:col-span-7 flex items-baseline gap-3">
                    <label
                      htmlFor="pieza-afectada"
                      className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                    >
                      Pieza afectada
                    </label>
                    <input
                      id="pieza-afectada"
                      type="text"
                      list="part-suggestions"
                      maxLength={60}
                      value={form.piezaAfectada}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, piezaAfectada: e.target.value }));
                        if (validationErrors.piezaAfectada) {
                          setValidationErrors((prev) => ({ ...prev, piezaAfectada: false }));
                        }
                      }}
                      placeholder="Frasco / Válvula / Estuche"
                      className={`w-full bg-transparent border-b py-1 px-1 text-sm text-[#141414] placeholder:text-[#A39F97] focus:outline-none transition-colors ${
                        validationErrors.piezaAfectada
                          ? 'border-[#141414] bg-[#F7F5F0]'
                          : 'border-[#CFCAC0] focus:border-[#141414]'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-5 flex items-baseline gap-3">
                    <label
                      htmlFor="codigo-pieza"
                      className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                    >
                      Código SKU
                    </label>
                    <input
                      id="codigo-pieza"
                      type="text"
                      maxLength={24}
                      value={form.codigo}
                      onChange={(e) => setForm((prev) => ({ ...prev, codigo: e.target.value }))}
                      placeholder="PCD-3348-A"
                      className="w-full bg-transparent border-b border-[#CFCAC0] py-1 px-1 text-sm font-mono text-[#141414] placeholder:text-[#A39F97] focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-4 items-end">
                  <div className="sm:col-span-4 flex items-baseline gap-3">
                    <label
                      htmlFor="lote-referencia"
                      className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                    >
                      Lote / Ref.
                    </label>
                    <input
                      id="lote-referencia"
                      type="text"
                      maxLength={20}
                      value={form.loteReferencia}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, loteReferencia: e.target.value }))
                      }
                      placeholder="LOT-4F09"
                      className="w-full bg-transparent border-b border-[#CFCAC0] py-1 px-1 text-sm font-mono text-[#141414] placeholder:text-[#A39F97] focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-baseline gap-3">
                    <label
                      htmlFor="revision-cambio"
                      className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                    >
                      Revisión
                    </label>
                    <input
                      id="revision-cambio"
                      type="text"
                      maxLength={12}
                      value={form.revisionCambio}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, revisionCambio: e.target.value }))
                      }
                      placeholder="A → B"
                      className="w-full bg-transparent border-b border-[#CFCAC0] py-1 px-1 text-sm font-mono text-[#141414] placeholder:text-[#A39F97] focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-5 flex items-baseline gap-3">
                    <label
                      htmlFor="causa-raiz"
                      className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                    >
                      Causa raíz
                    </label>
                    <div className="relative w-full">
                      <select
                        id="causa-raiz"
                        value={form.causaRaiz}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, causaRaiz: e.target.value }))
                        }
                        className="w-full appearance-none bg-transparent border-b border-[#CFCAC0] py-1 pl-1 pr-7 text-sm text-[#141414] focus:border-[#141414] focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="">Seleccionar causa</option>
                        {ROOT_CAUSES.map((cause) => (
                          <option key={cause} value={cause}>
                            {cause}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#706D66]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Campos breves de ingreso rápido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="descripcion-problema"
                      className="block text-xs font-medium tracking-wide text-[#5C5953]"
                    >
                      Descripción breve del problema
                    </label>
                    <input
                      id="descripcion-problema"
                      type="text"
                      list="problem-suggestions"
                      maxLength={140}
                      value={form.descripcionProblema}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, descripcionProblema: e.target.value }))
                      }
                      placeholder="Ej. Microfuga en válvula al 2.º disparo"
                      className="w-full rounded-none border border-[#D8D4CC] bg-[#FAF9F6] px-3 py-2 text-sm text-[#141414] placeholder:text-[#A39F97] focus:bg-white focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="justificacion-tecnica"
                      className="block text-xs font-medium tracking-wide text-[#5C5953]"
                    >
                      Cambio propuesto (resumen)
                    </label>
                    <input
                      id="justificacion-tecnica"
                      type="text"
                      list="proposal-suggestions"
                      maxLength={140}
                      value={form.justificacionTecnica}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, justificacionTecnica: e.target.value }))
                      }
                      placeholder="Ej. Empaque de silicona grado cosmético"
                      className="w-full rounded-none border border-[#D8D4CC] bg-[#FAF9F6] px-3 py-2 text-sm text-[#141414] placeholder:text-[#A39F97] focus:bg-white focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Sección 2: Impacto de costos y volumen financiero */}
          <section className="border border-[#D8D4CC] rounded-none overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('costos')}
              aria-expanded={openSections.costos}
              className="w-full flex items-center justify-between gap-3 bg-[#F5F3EE] hover:bg-[#ECE9E1] px-5 py-2.5 text-left border-b border-[#D8D4CC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#141414]"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`w-4 h-4 text-[#141414] shrink-0 transition-transform duration-150 ${
                    openSections.costos ? 'rotate-0' : '-rotate-90'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-serif text-lg font-semibold tracking-wide text-[#141414]">
                  2. Impacto de costos y volumen
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums text-[#5C5953] whitespace-nowrap">
                Unitario: $ {formatCurrency(costSummary.totalDiferencia)}
              </span>
            </button>

            {openSections.costos && (
              <div className="p-5 sm:p-6 bg-white space-y-5">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm min-w-[640px]">
                    <thead>
                      <tr className="bg-[#FAF9F6] border-y border-[#D8D4CC] text-[#5C5953]">
                        <th className="py-2 px-3 text-left text-xs font-medium tracking-wide w-[36%]">
                          Concepto
                        </th>
                        <th className="py-2 px-3 text-right text-xs font-medium tracking-wide border-l border-[#E6E3DC] w-[16%]">
                          Costo Actual
                        </th>
                        <th className="py-2 px-3 text-right text-xs font-medium tracking-wide border-l border-[#E6E3DC] w-[16%]">
                          Costo Nuevo
                        </th>
                        <th className="py-2 px-3 text-right text-xs font-medium tracking-wide border-l border-[#E6E3DC] w-[16%]">
                          Diferencia
                        </th>
                        <th className="py-2 px-3 text-right text-xs font-medium tracking-wide border-l border-[#E6E3DC] w-[12%]">
                          Var. %
                        </th>
                        <th className="py-2 px-2 w-[4%]" aria-label="Acciones" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE7E0]">
                      {form.costos.map((row, idx) => {
                        const hasValues =
                          row.costoActual.trim() !== '' || row.costoNuevo.trim() !== '';
                        const actual = parseNumericCost(row.costoActual);
                        const nuevo = parseNumericCost(row.costoNuevo);
                        const diff = nuevo - actual;
                        const pct = actual !== 0 ? (diff / actual) * 100 : null;

                        return (
                          <tr key={row.id} className="hover:bg-[#FAF9F6] transition-colors">
                            <td className="py-1.5 pr-3">
                              <input
                                type="text"
                                list="cost-concept-suggestions"
                                maxLength={50}
                                aria-label={`Concepto fila ${idx + 1}`}
                                value={row.concepto}
                                onChange={(e) =>
                                  handleCostChange(row.id, 'concepto', e.target.value)
                                }
                                placeholder={`Ej. Bomba spray / Vidrio ${idx + 1}`}
                                className="w-full bg-transparent py-1 px-2 text-sm text-[#141414] placeholder:text-[#A39F97] focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 px-3 border-l border-[#EAE7E0]">
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-xs text-[#9E9B95] font-mono">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  aria-label={`Costo actual fila ${idx + 1}`}
                                  value={row.costoActual}
                                  onChange={(e) =>
                                    handleCostChange(row.id, 'costoActual', e.target.value)
                                  }
                                  placeholder="0.00"
                                  className="w-full text-right bg-transparent py-1 px-1 text-sm font-mono tabular-nums text-[#141414] placeholder:text-[#A39F97] focus:outline-none"
                                />
                              </div>
                            </td>
                            <td className="py-1.5 px-3 border-l border-[#EAE7E0]">
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-xs text-[#9E9B95] font-mono">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  aria-label={`Costo nuevo fila ${idx + 1}`}
                                  value={row.costoNuevo}
                                  onChange={(e) =>
                                    handleCostChange(row.id, 'costoNuevo', e.target.value)
                                  }
                                  placeholder="0.00"
                                  className="w-full text-right bg-transparent py-1 px-1 text-sm font-mono tabular-nums text-[#141414] placeholder:text-[#A39F97] focus:outline-none"
                                />
                              </div>
                            </td>
                            <td className="py-1.5 px-3 border-l border-[#EAE7E0] text-right font-mono tabular-nums text-sm">
                              {hasValues ? (
                                <span
                                  className={
                                    diff !== 0
                                      ? 'text-[#141414] font-semibold'
                                      : 'text-[#706D66]'
                                  }
                                >
                                  {diff > 0 ? '+' : ''}${formatCurrency(diff)}
                                </span>
                              ) : (
                                <span className="text-[#CFCAC0]">—</span>
                              )}
                            </td>
                            <td className="py-1.5 px-3 border-l border-[#EAE7E0] text-right font-mono tabular-nums text-xs text-[#5C5953]">
                              {hasValues && pct !== null ? (
                                <span>
                                  {pct > 0 ? '+' : ''}
                                  {pct.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-[#CFCAC0]">—</span>
                              )}
                            </td>
                            <td className="py-1.5 pl-1 text-right">
                              {form.costos.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCostRow(row.id)}
                                  aria-label={`Eliminar fila ${idx + 1}`}
                                  className="p-1 text-[#9E9B95] hover:text-[#141414] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
                                >
                                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleAddCostRow}
                    className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-[#5C5953] hover:text-[#141414] py-1.5 px-2.5 border border-[#D8D4CC] hover:border-[#141414] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Agregar concepto</span>
                  </button>
                </div>

                {/* Parámetros de proyección financiera */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-4 border-t border-[#EAE7E0] items-end">
                  <div className="sm:col-span-4 space-y-1">
                    <label
                      htmlFor="volumen-anual"
                      className="block text-xs font-medium tracking-wide text-[#5C5953]"
                    >
                      Volumen anual (uds.)
                    </label>
                    <input
                      id="volumen-anual"
                      type="number"
                      min="0"
                      step="100"
                      value={form.volumenAnual}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, volumenAnual: e.target.value }))
                      }
                      placeholder="150000"
                      className="w-full border-b border-[#CFCAC0] bg-transparent py-1 px-1 text-sm font-mono tabular-nums text-[#141414] placeholder:text-[#A39F97] focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label
                      htmlFor="costo-herramental"
                      className="block text-xs font-medium tracking-wide text-[#5C5953]"
                    >
                      Moldes / CapEx
                    </label>
                    <div className="flex items-center gap-1 border-b border-[#CFCAC0] focus-within:border-[#141414] transition-colors">
                      <span className="text-xs text-[#9E9B95] font-mono">$</span>
                      <input
                        id="costo-herramental"
                        type="number"
                        step="0.01"
                        value={form.costoHerramental}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, costoHerramental: e.target.value }))
                        }
                        placeholder="0.00"
                        className="w-full bg-transparent py-1 px-1 text-sm font-mono tabular-nums text-[#141414] placeholder:text-[#A39F97] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4 bg-[#FAF9F6] border border-[#D8D4CC] px-4 py-2 flex items-baseline justify-between gap-3">
                    <span className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap">
                      Total Estimado Anual
                    </span>
                    <span className="font-mono tabular-nums text-base font-semibold text-[#141414]">
                      $ {formatCurrency(costSummary.impactoAnual)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Sección 3: Análisis de riesgo y cumplimiento */}
          <section className="border border-[#D8D4CC] rounded-none overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('riesgo')}
              aria-expanded={openSections.riesgo}
              className="w-full flex items-center justify-between gap-3 bg-[#F5F3EE] hover:bg-[#ECE9E1] px-5 py-2.5 text-left border-b border-[#D8D4CC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#141414]"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`w-4 h-4 text-[#141414] shrink-0 transition-transform duration-150 ${
                    openSections.riesgo ? 'rotate-0' : '-rotate-90'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-serif text-lg font-semibold tracking-wide text-[#141414]">
                  3. Análisis de riesgo y cumplimiento
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums text-[#5C5953] whitespace-nowrap">
                Controles: {checkedValidationsCount} / {TECHNICAL_CHECKS.length}
              </span>
            </button>

            {openSections.riesgo && (
              <div className="p-5 sm:p-6 bg-white space-y-5">
                {/* Nivel de riesgo y fecha objetivo */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  <div className="lg:col-span-7 flex flex-wrap items-center gap-x-7 gap-y-2">
                    <span className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0 min-w-28">
                      Nivel de riesgo
                    </span>

                    <div
                      className="flex flex-wrap items-center gap-6"
                      role="radiogroup"
                      aria-label="Nivel de riesgo"
                    >
                      {(
                        [
                          { value: 'bajo', label: 'Bajo' },
                          { value: 'medio', label: 'Medio' },
                          { value: 'alto', label: 'Alto' },
                        ] as const
                      ).map((option) => (
                        <label
                          key={option.value}
                          className="inline-flex items-center gap-2 text-sm text-[#1F1F1F] cursor-pointer select-none min-h-9"
                        >
                          <input
                            type="radio"
                            name="nivelRiesgo"
                            value={option.value}
                            checked={form.nivelRiesgo === option.value}
                            onChange={() =>
                              setForm((prev) => ({ ...prev, nivelRiesgo: option.value }))
                            }
                            className="h-4 w-4 border-[#9E9B95] accent-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex items-baseline gap-3">
                    <label
                      htmlFor="fecha-objetivo"
                      className="text-xs font-medium tracking-wide text-[#5C5953] whitespace-nowrap shrink-0"
                    >
                      Fecha objetivo
                    </label>
                    <input
                      id="fecha-objetivo"
                      type="date"
                      value={form.fechaObjetivo}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, fechaObjetivo: e.target.value }))
                      }
                      className="w-full bg-transparent border-b border-[#CFCAC0] py-1 px-1 text-sm font-mono text-[#141414] focus:border-[#141414] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Área afectada y Estrategia de inventario */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="area-afectada"
                      className="block text-xs font-medium tracking-wide text-[#5C5953]"
                    >
                      Área afectada
                    </label>
                    <div className="relative">
                      <select
                        id="area-afectada"
                        value={form.areaAfectada}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, areaAfectada: e.target.value }))
                        }
                        className="w-full appearance-none rounded-none border border-[#D8D4CC] bg-[#FAF9F6] py-2 pl-3 pr-9 text-sm text-[#141414] focus:bg-white focus:border-[#141414] focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="">Seleccionar</option>
                        {AFFECTED_AREAS.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706D66]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="estrategia-inventario"
                      className="block text-xs font-medium tracking-wide text-[#5C5953]"
                    >
                      Inventario actual
                    </label>
                    <div className="relative">
                      <select
                        id="estrategia-inventario"
                        value={form.estrategiaInventario}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            estrategiaInventario: e.target.value,
                          }))
                        }
                        className="w-full appearance-none rounded-none border border-[#D8D4CC] bg-[#FAF9F6] py-2 pl-3 pr-9 text-sm text-[#141414] focus:bg-white focus:border-[#141414] focus:outline-none cursor-pointer transition-colors"
                      >
                        <option value="">Seleccionar acción</option>
                        {INVENTORY_STRATEGIES.map((strategy) => (
                          <option key={strategy} value={strategy}>
                            {strategy}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706D66]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Matriz de controles técnicos y regulatorios */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium tracking-wide text-[#5C5953]">
                    Controles requeridos
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-1.5 border border-[#EAE7E0] bg-[#FAF9F6] px-4 py-3">
                    {TECHNICAL_CHECKS.map((check) => (
                      <label
                        key={check.key}
                        className="inline-flex items-center gap-2 text-sm text-[#1F1F1F] cursor-pointer select-none min-h-8"
                      >
                        <input
                          type="checkbox"
                          checked={form.validacionesTecnicas[check.key]}
                          onChange={() => handleTechnicalCheck(check.key)}
                          className="h-4 w-4 rounded-none border-[#9E9B95] accent-[#141414] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
                        />
                        <span>{check.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Plan de mitigación corto */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="plan-mitigacion"
                    className="block text-xs font-medium tracking-wide text-[#5C5953]"
                  >
                    Acción de mitigación breve
                  </label>
                  <input
                    id="plan-mitigacion"
                    type="text"
                    list="mitigation-suggestions"
                    maxLength={140}
                    value={form.planMitigacion}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, planMitigacion: e.target.value }))
                    }
                    placeholder="Ej. Prueba de vacío en 50 muestras antes del llenado"
                    className="w-full rounded-none border border-[#D8D4CC] bg-[#FAF9F6] px-3 py-2 text-sm text-[#141414] placeholder:text-[#A39F97] focus:bg-white focus:border-[#141414] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Sección 4: Matriz de aprobaciones */}
          <section className="border border-[#D8D4CC] rounded-none overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('aprobaciones')}
              aria-expanded={openSections.aprobaciones}
              className="w-full flex flex-wrap items-center justify-between gap-3 bg-[#F5F3EE] hover:bg-[#ECE9E1] px-5 py-2.5 text-left border-b border-[#D8D4CC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#141414]"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`w-4 h-4 text-[#141414] shrink-0 transition-transform duration-150 ${
                    openSections.aprobaciones ? 'rotate-0' : '-rotate-90'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-serif text-lg font-semibold tracking-wide text-[#141414]">
                  4. Matriz de aprobaciones
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-[#5C5953]">
                <span>
                  Aprobadas: {approvalSummary.approved}/{approvalSummary.total}
                </span>
                <span aria-hidden="true">·</span>
                <span>Pendientes: {approvalSummary.pending}</span>
                {approvalSummary.rejected > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#141414] font-semibold">
                      Rechazos: {approvalSummary.rejected}
                    </span>
                  </>
                )}
              </div>
            </button>

            {openSections.aprobaciones && (
              <div className="p-5 sm:p-6 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm min-w-[760px]">
                    <thead>
                      <tr className="bg-[#FAF9F6] border-y border-[#D8D4CC] text-[#5C5953]">
                        <th className="py-2 px-3 text-left text-xs font-medium tracking-wide w-[18%]">
                          Rol
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-medium tracking-wide w-[20%]">
                          Nombre
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-medium tracking-wide w-[12%]">
                          Firma
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-medium tracking-wide w-[14%]">
                          Fecha
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-medium tracking-wide w-[16%]">
                          Nota breve
                        </th>
                        <th className="py-2 pl-3 text-left text-xs font-medium tracking-wide w-[20%]">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE7E0]">
                      {form.aprobaciones.map((row, idx) => (
                        <tr key={row.rol} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-2.5 px-3 font-medium text-[#141414] whitespace-nowrap">
                            {row.rol}
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              maxLength={40}
                              aria-label={`Nombre para ${row.rol}`}
                              value={row.nombre}
                              onChange={(e) =>
                                handleApprovalChange(idx, 'nombre', e.target.value)
                              }
                              placeholder="Nombre"
                              className="w-full bg-transparent border-b border-[#D8D4CC] py-1 px-1 text-sm text-[#141414] placeholder:text-[#A39F97] focus:border-[#141414] focus:outline-none transition-colors"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              maxLength={10}
                              aria-label={`Firma para ${row.rol}`}
                              value={row.firma}
                              onChange={(e) =>
                                handleApprovalChange(idx, 'firma', e.target.value)
                              }
                              placeholder="Iniciales"
                              className="w-full bg-transparent border-b border-[#D8D4CC] py-1 px-1 text-sm font-mono text-[#141414] placeholder:text-[#A39F97] focus:border-[#141414] focus:outline-none transition-colors"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="date"
                              aria-label={`Fecha de firma para ${row.rol}`}
                              value={row.fecha}
                              onChange={(e) =>
                                handleApprovalChange(idx, 'fecha', e.target.value)
                              }
                              className="w-full bg-transparent border-b border-[#D8D4CC] py-1 px-1 text-xs font-mono text-[#141414] focus:border-[#141414] focus:outline-none transition-colors"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              maxLength={45}
                              aria-label={`Observaciones para ${row.rol}`}
                              value={row.observaciones}
                              onChange={(e) =>
                                handleApprovalChange(idx, 'observaciones', e.target.value)
                              }
                              placeholder="Opcional"
                              className="w-full bg-transparent border-b border-[#D8D4CC] py-1 px-1 text-xs text-[#141414] placeholder:text-[#A39F97] focus:border-[#141414] focus:outline-none transition-colors"
                            />
                          </td>
                          <td className="py-2 pl-3">
                            <div className="flex items-center gap-4">
                              <label className="inline-flex items-center gap-1.5 text-xs text-[#1F1F1F] cursor-pointer select-none min-h-9">
                                <input
                                  type="checkbox"
                                  checked={row.estado === 'aprobar'}
                                  onChange={() => handleApprovalStatus(idx, 'aprobar')}
                                  className="h-4 w-4 rounded-none border-[#9E9B95] accent-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
                                />
                                <span>Aprobar</span>
                              </label>

                              <label className="inline-flex items-center gap-1.5 text-xs text-[#706D66] cursor-pointer select-none min-h-9">
                                <input
                                  type="checkbox"
                                  checked={row.estado === 'rechazar'}
                                  onChange={() => handleApprovalStatus(idx, 'rechazar')}
                                  className="h-4 w-4 rounded-none border-[#9E9B95] accent-[#5C5953] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
                                />
                                <span>Rechazar</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Resumen de envío confirmado */}
          {submittedAt && (
            <div className="border border-[#141414] bg-[#FAF9F6] p-4 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#D8D4CC] pb-2">
                <span className="font-serif text-base font-semibold text-[#141414]">
                  Registro de envío · {form.noSolicitud}
                </span>
                <span className="text-xs font-mono text-[#5C5953]">{submittedAt}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C5953] pt-1">
                <span>Solicitante: {form.solicitante}</span>
                {form.coleccion && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Colección: {form.coleccion}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Impacto Anual: $ {formatCurrency(costSummary.impactoAnual)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Aprobaciones: {approvalSummary.approved}/{approvalSummary.total}
                </span>
              </div>
            </div>
          )}

          {/* Mensaje de retroalimentación Dior */}
          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`border px-4 py-3 text-sm ${
                feedback.type === 'success'
                  ? 'border-[#111111] bg-[#111111] text-[#FAF9F6]'
                  : 'border-[#9E9B95] bg-[#F5F3EE] text-[#141414]'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Botones finales estilo Maison Dior */}
          <footer className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-4 pt-3 border-t border-[#D8D4CC]">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-7 py-3 rounded-none border border-[#141414] bg-white text-xs font-semibold tracking-[0.14em] uppercase text-[#141414] hover:bg-[#F5F3EE] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]"
            >
              Guardar Borrador
            </button>

            <button
              type="submit"
              className="px-10 py-3 rounded-none border border-[#111111] bg-[#111111] text-xs font-semibold tracking-[0.14em] uppercase text-[#FAF9F6] hover:bg-[#2B2B2B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:ring-offset-2"
            >
              Enviar
            </button>
          </footer>
          {/* Listas desplegables de sugerencias rápidas */}
          <datalist id="part-suggestions">
            {PART_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <datalist id="problem-suggestions">
            {PROBLEM_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <datalist id="proposal-suggestions">
            {PROPOSAL_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <datalist id="cost-concept-suggestions">
            {COST_CONCEPT_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <datalist id="mitigation-suggestions">
            {MITIGATION_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </form>
      </main>
    </div>
  );
}
