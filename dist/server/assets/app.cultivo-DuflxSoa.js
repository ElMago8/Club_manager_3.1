import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate, Outlet, Link } from "@tanstack/react-router";
import { t as cn, j as Route, B as Button, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from "./router-Rtc38bRC.js";
import * as RechartsPrimitive from "recharts";
import { PieChart, Pie, Cell, Label as Label$1 } from "recharts";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-Dt8gr3JP.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { Warehouse, LayoutGrid, Sprout, LayersIcon, Dna, Leaf, AlertTriangle, Activity, ArrowRight, Plus, Save, TestTube, FileText, BarChart3, TrendingUp, Timer, Upload, Pencil, MoreVertical, Eye, Trash2 } from "lucide-react";
import { g as getEnvironmentalLogs } from "./environmentalService-P3TfdmOW.js";
import { g as getGenetics } from "./geneticsService-1lKUW0eY.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
import { g as getMotherPlants } from "./motherPlantService-BEybLeEn.js";
import { e as getPlants } from "./plantService-BxfJ2ZYq.js";
import { g as getBatches, u as updateBatch, c as createBatch } from "./batchService-D6ZbIzbE.js";
import "date-fns";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const THEMES = { light: "", dark: ".dark" };
const ChartContext = React.createContext(null);
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx(ChartContext.Provider, { value: { config }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-chart": chartId,
      ref,
      className: cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChartStyle, { id: chartId, config }),
        /* @__PURE__ */ jsx(RechartsPrimitive.ResponsiveContainer, { children })
      ]
    }
  ) });
});
ChartContainer.displayName = "Chart";
const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config2]) => config2.theme || config2.color
  );
  if (!colorConfig.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
            const color = itemConfig.theme?.[theme] || itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).join("\n")}
}
`
        ).join("\n")
      }
    }
  );
};
const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartTooltipContent = React.forwardRef(
  ({
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey
  }, ref) => {
    const { config } = useChart();
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }
      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;
      if (labelFormatter) {
        return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: labelFormatter(value, payload) });
      }
      if (!value) {
        return null;
      }
      return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: value });
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey
    ]);
    if (!active || !payload?.length) {
      return null;
    }
    const nestLabel = payload.length === 1 && indicator !== "dot";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        ),
        children: [
          !nestLabel ? tooltipLabel : null,
          /* @__PURE__ */ jsx("div", { className: "grid gap-1.5", children: payload.filter((item) => item.type !== "none").map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                ),
                children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  itemConfig?.icon ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                        {
                          "h-2.5 w-2.5": indicator === "dot",
                          "w-1": indicator === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                          "my-0.5": nestLabel && indicator === "dashed"
                        }
                      ),
                      style: {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
                          nestLabel ? tooltipLabel : null,
                          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: itemConfig?.label || item.name })
                        ] }),
                        item.value && /* @__PURE__ */ jsx("span", { className: "font-mono font-medium tabular-nums text-foreground", children: item.value.toLocaleString() })
                      ]
                    }
                  )
                ] })
              },
              item.dataKey
            );
          }) })
        ]
      }
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";
const ChartLegendContent = React.forwardRef(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();
    if (!payload?.length) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        ),
        children: payload.filter((item) => item.type !== "none").map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              ),
              children: [
                itemConfig?.icon && !hideIcon ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-2 w-2 shrink-0 rounded-[2px]",
                    style: {
                      backgroundColor: item.color
                    }
                  }
                ),
                itemConfig?.label
              ]
            },
            item.value
          );
        })
      }
    );
  }
);
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) {
    return void 0;
  }
  const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
  let configLabelKey = key;
  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}
const geneticas = [{
  genetica: "Northern Lights",
  tipo: "Índica",
  rendimiento: "450 g/m²",
  estado: "activa",
  notas: "Buen comportamiento en sala 2."
}, {
  genetica: "Amnesia Haze",
  tipo: "Sativa",
  rendimiento: "500 g/m²",
  estado: "activa",
  notas: "Sensible a humedad alta."
}, {
  genetica: "Critical +",
  tipo: "Híbrida",
  rendimiento: "550 g/m²",
  estado: "en prueba",
  notas: "Ciclo corto · revisar floración."
}, {
  genetica: "White Widow",
  tipo: "Híbrida",
  rendimiento: "480 g/m²",
  estado: "archivada",
  notas: "Reemplazada por lote nuevo."
}];
const madres = [{
  madre: "Madre NL-01",
  sanitario: "óptimo",
  esquejes: 24,
  revision: "Vie · 10:00"
}, {
  madre: "Madre AH-02",
  sanitario: "observación",
  esquejes: 12,
  revision: "Hoy · 16:00"
}, {
  madre: "Madre CR-03",
  sanitario: "óptimo",
  esquejes: 30,
  revision: "Lun · 09:30"
}, {
  madre: "Madre WW-04",
  sanitario: "tratamiento",
  esquejes: 0,
  revision: "Mié · 11:00"
}];
const controlesCalidad = [{
  lote: "FL-2026-05-KB01",
  tipo: "Metales pesados",
  estado: "Aprobado",
  fecha: "2026-05-10",
  resultado: "< 0,5 ppm",
  archivo: "Informe metales pesados · PDF"
}, {
  lote: "FL-2026-05-KB01",
  tipo: "Microbiología",
  estado: "Aprobado",
  fecha: "2026-05-11",
  resultado: "Negativo",
  archivo: "Microbiología lote FL-2026-05-KB01 · PDF"
}, {
  lote: "FL-2026-04-AH02",
  tipo: "Potencia",
  estado: "Observado",
  fecha: "2026-05-08",
  resultado: "18,2 % THC",
  archivo: "Potencia lote FL-2026-04-AH02 · PDF"
}, {
  lote: "FL-2026-04-AH02",
  tipo: "Pesticidas",
  estado: "Retenido",
  fecha: "2026-05-09",
  resultado: "Traza detectada",
  archivo: "Pesticidas lote FL-2026-04-AH02 · PDF"
}, {
  lote: "FL-2026-03-WW03",
  tipo: "Humedad",
  estado: "Pendiente",
  fecha: "2026-05-12",
  resultado: "En análisis",
  archivo: "Humedad lote FL-2026-03-WW03 · PDF"
}];
const archivosLotes = [{
  lote: "FL-2026-05-KB01",
  tipoArchivo: "Informe laboratorio",
  nombre: "Lab-FL-2026-05-KB01.pdf",
  estado: "Activo",
  fecha: "2026-05-10"
}, {
  lote: "FL-2026-05-KB01",
  tipoArchivo: "Foto de lote",
  nombre: "Foto-FL-2026-05-KB01-01.jpg",
  estado: "Activo",
  fecha: "2026-05-09"
}, {
  lote: "FL-2026-04-AH02",
  tipoArchivo: "Registro técnico",
  nombre: "Reg-Tec-FL-2026-04-AH02.pdf",
  estado: "Activo",
  fecha: "2026-04-28"
}, {
  lote: "FL-2026-04-AH02",
  tipoArchivo: "Acta interna",
  nombre: "Acta-FL-2026-04-AH02.pdf",
  estado: "Archivado",
  fecha: "2026-04-15"
}, {
  lote: "FL-2026-03-WW03",
  tipoArchivo: "Control sanitario",
  nombre: "Sanitario-FL-2026-03-WW03.pdf",
  estado: "Activo",
  fecha: "2026-03-20"
}];
const BATCH_STATUS_OPTIONS = ["activo", "floracion", "cosechado", "cerrado", "descartado"];
function todayInputDate() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function emptyBatchForm() {
  return {
    code: "",
    geneticsId: "",
    roomId: "",
    status: "activo",
    startDate: todayInputDate(),
    floweringStartDate: "",
    estimatedHarvestDate: "",
    realHarvestDate: "",
    notes: ""
  };
}
function batchToForm(batch) {
  return {
    code: batch.code,
    geneticsId: batch.geneticsId,
    roomId: batch.roomId,
    status: batch.status,
    startDate: batch.startDate || todayInputDate(),
    floweringStartDate: batch.floweringStartDate ?? "",
    estimatedHarvestDate: batch.estimatedHarvestDate ?? "",
    realHarvestDate: batch.realHarvestDate ?? "",
    notes: batch.notes ?? ""
  };
}
const rendimientosLote = [{
  lote: "FL-2026-05-KB01",
  genetica: "Critical +",
  sala: "Sala A",
  pesoSeco: "2.340 g",
  merma: "8,2 %",
  diasFlora: 58,
  incidencias: "Ninguna",
  estado: "Liberado"
}, {
  lote: "FL-2026-04-AH02",
  genetica: "Amnesia Haze",
  sala: "Sala B",
  pesoSeco: "1.890 g",
  merma: "12,1 %",
  diasFlora: 65,
  incidencias: "Mildiu leve",
  estado: "Retenido"
}, {
  lote: "FL-2026-03-WW03",
  genetica: "White Widow",
  sala: "Sala A",
  pesoSeco: "2.120 g",
  merma: "9,5 %",
  diasFlora: 60,
  incidencias: "Ninguna",
  estado: "Liberado"
}, {
  lote: "FL-2026-02-NL01",
  genetica: "Northern Lights",
  sala: "Sala C",
  pesoSeco: "1.560 g",
  merma: "15,3 %",
  diasFlora: 55,
  incidencias: "Plagas menores",
  estado: "Observado"
}];
const rendimientosGenetica = [{
  genetica: "Critical +",
  promedio: "550 g/m²",
  lotesCompletados: 6,
  incidencias: "Baja",
  estado: "Óptima"
}, {
  genetica: "Northern Lights",
  promedio: "450 g/m²",
  lotesCompletados: 8,
  incidencias: "Baja",
  estado: "Óptima"
}, {
  genetica: "Amnesia Haze",
  promedio: "480 g/m²",
  lotesCompletados: 4,
  incidencias: "Media",
  estado: "En revisión"
}, {
  genetica: "White Widow",
  promedio: "480 g/m²",
  lotesCompletados: 5,
  incidencias: "Baja",
  estado: "Óptima"
}];
const rendimientosSala = [{
  sala: "Sala A",
  lotesCompletados: 7,
  pesoSecoTotal: "14.200 g",
  incidencias: "Baja",
  promedio: "2.028 g/lote"
}, {
  sala: "Sala B",
  lotesCompletados: 5,
  pesoSecoTotal: "9.800 g",
  incidencias: "Media",
  promedio: "1.960 g/lote"
}, {
  sala: "Sala C",
  lotesCompletados: 3,
  pesoSecoTotal: "5.100 g",
  incidencias: "Alta",
  promedio: "1.700 g/lote"
}];
const curadoAvanzado = [{
  lote: "FL-2026-05-KB01",
  genetica: "Critical +",
  fechaIngreso: "2026-05-10",
  diasCurado: 14,
  pesoSecoFinal: "2.340 g",
  estado: "En curado",
  observaciones: "Humedad estable · 62 % RH"
}, {
  lote: "FL-2026-04-AH02",
  genetica: "Amnesia Haze",
  fechaIngreso: "2026-04-28",
  diasCurado: 26,
  pesoSecoFinal: "1.890 g",
  estado: "Retenido",
  observaciones: "Esperando resultado de laboratorio."
}, {
  lote: "FL-2026-03-WW03",
  genetica: "White Widow",
  fechaIngreso: "2026-03-15",
  diasCurado: 45,
  pesoSecoFinal: "2.120 g",
  estado: "Liberado",
  observaciones: "Aprobado para stock."
}, {
  lote: "FL-2026-02-NL01",
  genetica: "Northern Lights",
  fechaIngreso: "2026-02-20",
  diasCurado: 60,
  pesoSecoFinal: "1.560 g",
  estado: "Observado",
  observaciones: "Revisar olor antes de liberar."
}];
const STOCK_COLORS = ["#0f766e", "#f59e0b", "#2563eb", "#dc2626", "#7c3aed"];
function parseGramValue(value) {
  return Number(value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
}
const stockPorGenetica = Array.from(curadoAvanzado.reduce((stockMap, row) => {
  stockMap.set(row.genetica, (stockMap.get(row.genetica) ?? 0) + parseGramValue(row.pesoSecoFinal));
  return stockMap;
}, /* @__PURE__ */ new Map())).map(([genetica, cantidad], index) => ({
  genetica,
  cantidad,
  fill: STOCK_COLORS[index % STOCK_COLORS.length]
}));
const stockTotal = stockPorGenetica.reduce((total, item) => total + item.cantidad, 0);
const stockChartConfig = {
  cantidad: {
    label: "Stock"
  }
};
const VPD_STATUS_CLASS = {
  bajo: "border-sky-200 bg-sky-500/10 text-sky-700",
  optimo: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  alto: "border-amber-200 bg-amber-500/10 text-amber-700",
  critico: "border-red-200 bg-red-500/10 text-red-700"
};
function sanitaryVariant(s) {
  if (s === "óptimo") return "secondary";
  if (s === "observación") return "default";
  return "destructive";
}
function qcStatusVariant(s) {
  if (s === "Aprobado") return "secondary";
  if (s === "Observado") return "default";
  if (s === "Retenido") return "destructive";
  return "outline";
}
function curadoVariant(s) {
  if (s === "Liberado") return "secondary";
  if (s === "En curado") return "default";
  if (s === "Retenido") return "destructive";
  return "outline";
}
function CultivoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    section
  } = Route.useSearch();
  const activeSection = section ?? "resumen";
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [plants, setPlants] = useState([]);
  const [genetics, setGenetics] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [logs, setLogs] = useState([]);
  const [batchFormOpen, setBatchFormOpen] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [batchSaving, setBatchSaving] = useState(false);
  const [batchForm, setBatchForm] = useState(() => emptyBatchForm());
  const [batchDetailTarget, setBatchDetailTarget] = useState(null);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  useEffect(() => {
    void Promise.all([getGrowRooms(), getGrowBeds(), getPlants(), getGenetics(), getMotherPlants(), getBatches(), getEnvironmentalLogs()]).then(([nextRooms, nextBeds, nextPlants, nextGenetics, nextMothers, nextBatches, nextLogs]) => {
      setRooms(nextRooms);
      setBeds(nextBeds);
      setPlants(nextPlants);
      setGenetics(nextGenetics);
      setMothers(nextMothers);
      setBatches(nextBatches);
      setLogs(nextLogs);
    });
  }, []);
  const activePlants = plants.filter((plant) => plant.status !== "descartada" && plant.status !== "cosechada");
  const activeLots = batches.filter((batch) => batch.status === "activo" || batch.status === "floracion").length;
  const vpdAlerts = logs.filter((log) => log.vpdStatus && log.vpdStatus !== "optimo");
  const latestLogs = [...logs].sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)).slice(0, 5);
  const observationPlants = plants.filter((plant) => plant.status === "observacion" || plant.status === "alerta");
  const activeMothers = mothers.filter((mother) => mother.status === "activa");
  const bedOccupancy = useMemo(() => beds.map((bed) => ({
    ...bed,
    occupancy: bed.maxPlants > 0 ? Math.round(bed.currentPlants / bed.maxPlants * 100) : 0
  })).sort((a, b) => b.occupancy - a.occupancy).slice(0, 5), [beds]);
  const geneticsRanking = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const plant of plants) {
      if (plant.geneticsId) counts.set(plant.geneticsId, (counts.get(plant.geneticsId) ?? 0) + 1);
    }
    return genetics.map((item) => ({
      ...item,
      plantsCount: counts.get(item.id) ?? 0
    })).sort((a, b) => b.plantsCount - a.plantsCount).slice(0, 5);
  }, [genetics, plants]);
  const roomAlerts = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const log of vpdAlerts) counts.set(log.roomId, (counts.get(log.roomId) ?? 0) + 1);
    return rooms.map((room) => ({
      room,
      alerts: counts.get(room.id) ?? 0
    })).filter((item) => item.alerts > 0).sort((a, b) => b.alerts - a.alerts);
  }, [rooms, vpdAlerts]);
  const resumeCards = [{
    label: "Salas activas",
    value: rooms.filter((room) => room.status === "activa").length,
    Icon: Warehouse,
    accent: "bg-sky-500",
    panel: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-400"
  }, {
    label: "Camillas activas",
    value: beds.filter((bed) => bed.status === "activa").length,
    Icon: LayoutGrid,
    accent: "bg-teal-500",
    panel: "bg-teal-500/10",
    iconClass: "text-teal-600 dark:text-teal-400"
  }, {
    label: "Plantas activas",
    value: activePlants.length,
    Icon: Sprout,
    accent: "bg-emerald-500",
    panel: "bg-emerald-500/10",
    iconClass: "text-emerald-600 dark:text-emerald-400"
  }, {
    label: "Lotes activos",
    value: activeLots,
    Icon: LayersIcon,
    accent: "bg-indigo-500",
    panel: "bg-indigo-500/10",
    iconClass: "text-indigo-600 dark:text-indigo-400"
  }, {
    label: "Geneticas activas",
    value: genetics.length,
    Icon: Dna,
    accent: "bg-violet-500",
    panel: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-400"
  }, {
    label: "Madres activas",
    value: activeMothers.length,
    Icon: Leaf,
    accent: "bg-lime-500",
    panel: "bg-lime-500/10",
    iconClass: "text-lime-600 dark:text-lime-400"
  }, {
    label: "Alertas VPD",
    value: vpdAlerts.length,
    Icon: AlertTriangle,
    accent: "bg-amber-500",
    panel: "bg-amber-500/10",
    iconClass: "text-amber-600 dark:text-amber-400"
  }, {
    label: "Registros ambientales",
    value: logs.length,
    Icon: Activity,
    accent: "bg-slate-500",
    panel: "bg-slate-500/10",
    iconClass: "text-slate-600 dark:text-slate-400"
  }];
  function roomName(roomId) {
    return rooms.find((room) => room.id === roomId)?.name ?? roomId;
  }
  function bedName(bedId) {
    if (!bedId) return "-";
    return beds.find((bed) => bed.id === bedId)?.name ?? bedId;
  }
  function closeUploadModal() {
    setUploadTarget(null);
    setUploadFile(null);
  }
  function handleUploadSubmit() {
    if (!uploadTarget || !uploadFile) {
      toast.error("Selecciona un archivo para subir.");
      return;
    }
    toast.success(`Archivo "${uploadFile.name}" asociado al lote ${uploadTarget.lote} (demo).`);
    closeUploadModal();
  }
  function openNewBatchForm() {
    setEditingBatchId(null);
    setBatchForm(emptyBatchForm());
    setBatchDetailTarget(null);
    setBatchFormOpen(true);
  }
  function openEditBatchForm(batch) {
    setEditingBatchId(batch.id);
    setBatchForm(batchToForm(batch));
    setBatchDetailTarget(null);
    setBatchFormOpen(true);
  }
  function closeBatchForm() {
    setEditingBatchId(null);
    setBatchForm(emptyBatchForm());
    setBatchFormOpen(false);
  }
  async function handleSubmitBatch(event) {
    event.preventDefault();
    if (!batchForm.code.trim() || !batchForm.geneticsId || !batchForm.roomId || !batchForm.startDate) {
      toast.error("Completa codigo, genetica, sala y fecha de inicio.");
      return;
    }
    setBatchSaving(true);
    try {
      const savedBatch = editingBatchId ? await updateBatch(editingBatchId, batchForm) : await createBatch(batchForm);
      setBatches((current) => [savedBatch, ...current.filter((batch) => batch.id !== savedBatch.id)]);
      closeBatchForm();
      toast.success(`Lote ${savedBatch.code} ${editingBatchId ? "actualizado" : "creado"} correctamente.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el lote.";
      toast.error(message);
    } finally {
      setBatchSaving(false);
    }
  }
  function mockPendingAction(action, lote) {
    toast.info(`${action} de lote ${lote} pendiente de integracion.`);
  }
  if (location.pathname !== "/app/cultivo") {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Cultivo" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Seguimiento operativo de salas, genéticas y trazabilidad interna." })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { value: activeSection, onValueChange: (value) => navigate({
      to: "/app/cultivo",
      search: {
        section: value
      }
    }), className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "resumen", children: "Resumen" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "trazabilidad", children: "Trazabilidad avanzada" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "lotes", children: "Lotes" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "rendimientos", children: "Rendimientos" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "inventario", children: "Inventario" })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "resumen", className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/ambiente", children: [
          "Parametros ambientales",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: resumeCards.map(({
          label,
          value,
          Icon,
          accent,
          panel,
          iconClass
        }) => /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-lg ${panel} px-5 py-4`, children: [
          /* @__PURE__ */ jsx("span", { className: `absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-r-full ${accent}` }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: label }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 font-mono text-3xl font-semibold leading-none text-foreground", children: value })
            ] }),
            /* @__PURE__ */ jsx(Icon, { className: `mt-1 h-5 w-5 shrink-0 ${iconClass}` })
          ] })
        ] }, label)) }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Ultimos registros ambientales" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Lecturas recientes con estado VPD." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Sala" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Camilla" }),
                /* @__PURE__ */ jsx(TableHead, { children: "VPD" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Estado" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: latestLogs.map((log) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsxs(TableCell, { children: [
                  log.date,
                  " ",
                  log.time
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: roomName(log.roomId) }),
                /* @__PURE__ */ jsx(TableCell, { children: bedName(log.bedId) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs", children: [
                  log.calculatedVPD ?? "-",
                  " kPa"
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: log.vpdStatus ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: VPD_STATUS_CLASS[log.vpdStatus], children: log.vpdStatus }) : null })
              ] }, log.id)) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Camillas con mayor ocupacion" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Ordenadas por porcentaje de uso." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: bedOccupancy.map((bed) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border px-3 py-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: bed.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  roomName(bed.roomId),
                  " · ",
                  bed.currentPlants,
                  "/",
                  bed.maxPlants
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
                bed.occupancy,
                "%"
              ] })
            ] }, bed.id)) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Plantas en observacion" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Estados observacion o alerta." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: observationPlants.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sin plantas en observacion." }) : observationPlants.slice(0, 5).map((plant) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border px-3 py-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-mono text-xs font-medium", children: plant.internalCode }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  plant.geneticsName ?? "genetica pendiente",
                  " · ",
                  bedName(plant.bedId)
                ] })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: plant.status })
            ] }, plant.id)) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Salas con alertas" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Alertas VPD no optimas por sala." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: roomAlerts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sin alertas ambientales." }) : roomAlerts.map(({
              room,
              alerts
            }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border px-3 py-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-600" }),
                room.name
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: alerts })
            ] }, room.id)) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Madres activas" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Madres disponibles y plantas asociadas." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: activeMothers.map((mother) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border px-3 py-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-mono text-xs font-medium", children: mother.code }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: mother.geneticsName })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: mother.derivedPlantsCount })
            ] }, mother.id)) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Geneticas con mas plantas" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Ranking por asociacion en plantas mock." })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: geneticsRanking.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border px-3 py-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Leaf, { className: "h-4 w-4 text-muted-foreground" }),
                item.name
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: item.plantsCount })
            ] }, item.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "trazabilidad", className: "space-y-10", children: /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-l-2 border-primary/60 pl-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: "Genéticas" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Seguimiento técnico de variedades, madres, esquejes y comportamiento observado." })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Leaf, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Ficha de genéticas" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Catálogo interno de variedades en uso o evaluación." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Genética" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Rendimiento estimado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Notas internas" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: geneticas.map((g) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: g.genetica }),
              /* @__PURE__ */ jsx(TableCell, { children: g.tipo }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: g.rendimiento }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: g.estado }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: g.notas })
            ] }, g.genetica)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Sprout, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Madres y esquejes" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Seguimiento sanitario de plantas madre y propagación." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Planta madre" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado sanitario" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Esquejes generados" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Próxima revisión" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: madres.map((m) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: m.madre }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: sanitaryVariant(m.sanitario), children: m.sanitario }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: m.esquejes }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: m.revision })
            ] }, m.madre)) })
          ] }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "lotes", className: "space-y-4", children: /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-l-2 border-primary/60 pl-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: "Lotes" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Trazabilidad documental, controles de calidad y rendimiento productivo por lote." })
          ] }),
          /* @__PURE__ */ jsxs(Button, { className: "gap-2 self-start", onClick: openNewBatchForm, children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Nuevo lote"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Sprout, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Lotes de cultivo" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Registros reales desde backend y base de datos." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            batchFormOpen ? /* @__PURE__ */ jsxs("section", { className: "rounded-md border bg-muted/20 p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: editingBatchId ? "Edicion operativa" : "Alta operativa" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold tracking-tight", children: editingBatchId ? "Editar lote" : "Nuevo lote" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: editingBatchId ? "Modifica los datos principales del lote seleccionado." : "Registra un lote de cultivo con sus relaciones principales." })
                ] }),
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: closeBatchForm, children: "Cerrar" })
              ] }),
              /* @__PURE__ */ jsxs("form", { className: "space-y-5", onSubmit: handleSubmitBatch, children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "batch-code", children: "Codigo de lote" }),
                    /* @__PURE__ */ jsx(Input, { id: "batch-code", value: batchForm.code, onChange: (event) => setBatchForm((current) => ({
                      ...current,
                      code: event.target.value
                    })), placeholder: "LOT-2026-001", required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Genetica" }),
                    /* @__PURE__ */ jsxs(Select, { value: batchForm.geneticsId || void 0, onValueChange: (value) => setBatchForm((current) => ({
                      ...current,
                      geneticsId: value
                    })), children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona genetica" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: genetics.map((item) => /* @__PURE__ */ jsx(SelectItem, { value: item.id, children: item.name }, item.id)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Sala" }),
                    /* @__PURE__ */ jsxs(Select, { value: batchForm.roomId || void 0, onValueChange: (value) => setBatchForm((current) => ({
                      ...current,
                      roomId: value
                    })), children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona sala" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "batch-start", children: "Fecha inicio" }),
                    /* @__PURE__ */ jsx(DateInput, { id: "batch-start", value: batchForm.startDate, onChange: (v) => setBatchForm((current) => ({
                      ...current,
                      startDate: v
                    })) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "batch-flowering", children: "Inicio floracion" }),
                    /* @__PURE__ */ jsx(DateInput, { id: "batch-flowering", value: batchForm.floweringStartDate, onChange: (v) => setBatchForm((current) => ({
                      ...current,
                      floweringStartDate: v
                    })) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "batch-estimated", children: "Cosecha estimada" }),
                    /* @__PURE__ */ jsx(DateInput, { id: "batch-estimated", value: batchForm.estimatedHarvestDate, onChange: (v) => setBatchForm((current) => ({
                      ...current,
                      estimatedHarvestDate: v
                    })) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "batch-real", children: "Cosecha real" }),
                    /* @__PURE__ */ jsx(DateInput, { id: "batch-real", value: batchForm.realHarvestDate, onChange: (v) => setBatchForm((current) => ({
                      ...current,
                      realHarvestDate: v
                    })) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Estado" }),
                    /* @__PURE__ */ jsxs(Select, { value: batchForm.status, onValueChange: (value) => setBatchForm((current) => ({
                      ...current,
                      status: value
                    })), children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: BATCH_STATUS_OPTIONS.map((status) => /* @__PURE__ */ jsx(SelectItem, { value: status, children: status }, status)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-3", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "batch-notes", children: "Observaciones" }),
                    /* @__PURE__ */ jsx(Textarea, { id: "batch-notes", value: batchForm.notes, onChange: (event) => setBatchForm((current) => ({
                      ...current,
                      notes: event.target.value
                    })), placeholder: "Notas operativas del lote" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: closeBatchForm, children: "Cancelar" }),
                  /* @__PURE__ */ jsxs(Button, { type: "submit", className: "gap-2", disabled: batchSaving, children: [
                    /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
                    batchSaving ? "Guardando..." : editingBatchId ? "Guardar cambios" : "Guardar lote"
                  ] })
                ] })
              ] })
            ] }) : null,
            batchDetailTarget ? /* @__PURE__ */ jsx(BatchDetailSection, { item: batchDetailTarget, geneticsName: batchDetailTarget.geneticsName ?? genetics.find((item) => item.id === batchDetailTarget.geneticsId)?.name ?? "-", roomName: batchDetailTarget.roomName ?? roomName(batchDetailTarget.roomId), onClose: () => setBatchDetailTarget(null), onEdit: () => openEditBatchForm(batchDetailTarget) }) : null,
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableHead, { children: "Lote" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Genetica" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Sala" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Inicio" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Inicio flora" }),
                /* @__PURE__ */ jsx(TableHead, { children: "Cosecha est." }),
                /* @__PURE__ */ jsx(TableHead, { className: "w-[80px] text-center", children: "Accion" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: batches.length > 0 ? batches.map((batch) => /* @__PURE__ */ jsxs(TableRow, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: batch.code }),
                /* @__PURE__ */ jsx(TableCell, { children: batch.geneticsName ?? genetics.find((item) => item.id === batch.geneticsId)?.name ?? "-" }),
                /* @__PURE__ */ jsx(TableCell, { children: batch.roomName ?? roomName(batch.roomId) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: batch.status === "descartado" ? "destructive" : "secondary", children: batch.status }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: batch.startDate || "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: batch.floweringStartDate || "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: batch.estimatedHarvestDate || "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(LoteRowActions, { onView: () => {
                  setEditingBatchId(null);
                  setBatchFormOpen(false);
                  setBatchDetailTarget(batch);
                }, onEdit: () => openEditBatchForm(batch), onDelete: () => mockPendingAction("Eliminacion", batch.code) }) })
              ] }, batch.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "h-20 text-center text-sm text-muted-foreground", children: "Todavia no hay lotes registrados." }) }) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(TestTube, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Control de calidad / laboratorio" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Registro visual de controles por lote y tipo de análisis." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Lote" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tipo de control" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Resultado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Archivo" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-[80px] text-center", children: "Accion" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: controlesCalidad.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: c.lote }),
              /* @__PURE__ */ jsx(TableCell, { children: c.tipo }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: qcStatusVariant(c.estado), children: c.estado }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: c.fecha }),
              /* @__PURE__ */ jsx(TableCell, { children: c.resultado }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: c.archivo }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(LoteRowActions, { onView: () => setDetailTarget({
                title: `Control ${c.tipo} - ${c.lote}`,
                rows: [{
                  label: "Lote",
                  value: c.lote
                }, {
                  label: "Tipo de control",
                  value: c.tipo
                }, {
                  label: "Estado",
                  value: c.estado
                }, {
                  label: "Fecha",
                  value: c.fecha
                }, {
                  label: "Resultado",
                  value: c.resultado
                }, {
                  label: "Archivo",
                  value: c.archivo
                }]
              }), onEdit: () => mockPendingAction("Edicion", c.lote), onDelete: () => mockPendingAction("Eliminacion", c.lote), onUpload: () => setUploadTarget({
                source: "control",
                lote: c.lote,
                title: `Subir archivo de control - ${c.lote}`,
                description: `Adjunta un informe o respaldo para el control "${c.tipo}" con estado ${c.estado}.`
              }) }) })
            ] }, `${c.lote}-${c.tipo}`)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Archivos asociados a lotes" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Documentación técnica y registros vinculados a lotes de cultivo." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Lote" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tipo de archivo" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Nombre del archivo" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-[80px] text-center", children: "Accion" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: archivosLotes.map((a) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: a.lote }),
              /* @__PURE__ */ jsx(TableCell, { children: a.tipoArchivo }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: a.nombre }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: a.estado === "Activo" ? "secondary" : "outline", children: a.estado }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: a.fecha }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(LoteRowActions, { onView: () => setDetailTarget({
                title: `Archivo ${a.nombre}`,
                rows: [{
                  label: "Lote",
                  value: a.lote
                }, {
                  label: "Tipo de archivo",
                  value: a.tipoArchivo
                }, {
                  label: "Nombre",
                  value: a.nombre
                }, {
                  label: "Estado",
                  value: a.estado
                }, {
                  label: "Fecha",
                  value: a.fecha
                }]
              }), onEdit: () => mockPendingAction("Edicion de archivo", a.lote), onDelete: () => mockPendingAction("Eliminacion de archivo", a.lote), onUpload: () => setUploadTarget({
                source: "archivo",
                lote: a.lote,
                title: `Subir archivo asociado - ${a.lote}`,
                description: `Adjunta o reemplaza documentacion para "${a.nombre}".`
              }) }) })
            ] }, `${a.lote}-${a.nombre}`)) })
          ] }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "rendimientos", className: "space-y-4", children: /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-l-2 border-primary/60 pl-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: "Rendimientos" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Indicadores visuales de rendimiento por sala, genética y lote." })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "order-3", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Rendimientos por lote" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Métricas de producción y merma por lote finalizado." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Lote" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Genética" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Sala" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Peso seco" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Merma %" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Días flora" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Incidencias" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: rendimientosLote.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: r.lote }),
              /* @__PURE__ */ jsx(TableCell, { children: r.genetica }),
              /* @__PURE__ */ jsx(TableCell, { children: r.sala }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.pesoSeco }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.merma }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.diasFlora }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: r.incidencias }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: curadoVariant(r.estado), children: r.estado }) })
            ] }, r.lote)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "order-2", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Rendimiento por genética" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Promedio de producción e incidencias por variedad." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Genética" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Rendimiento promedio" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Lotes completados" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Incidencias" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: rendimientosGenetica.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: r.genetica }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.promedio }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.lotesCompletados }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: r.incidencias }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: r.estado === "Óptima" ? "secondary" : "outline", children: r.estado }) })
            ] }, r.genetica)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "order-1", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Warehouse, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Rendimiento por sala" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Consolidado de producción e incidencias por sala de cultivo." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Sala" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Lotes completados" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Peso seco total" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Incidencias" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Rendimiento promedio" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: rendimientosSala.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: r.sala }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.lotesCompletados }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.pesoSecoTotal }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: r.incidencias }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.promedio })
            ] }, r.sala)) })
          ] }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "inventario", className: "space-y-4", children: /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-l-2 border-primary/60 pl-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: "Inventario" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Stock visual por genética y seguimiento interno de curado por lote." })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Warehouse, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Stock" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Distribución visual del stock ficticio disponible por genética." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-center", children: [
            /* @__PURE__ */ jsx(ChartContainer, { config: stockChartConfig, className: "mx-auto aspect-square h-[240px]", children: /* @__PURE__ */ jsxs(PieChart, { children: [
              /* @__PURE__ */ jsx(ChartTooltip, { cursor: false, content: /* @__PURE__ */ jsx(ChartTooltipContent, { hideLabel: true, nameKey: "genetica" }) }),
              /* @__PURE__ */ jsxs(Pie, { data: stockPorGenetica, dataKey: "cantidad", nameKey: "genetica", innerRadius: 64, outerRadius: 92, strokeWidth: 4, children: [
                stockPorGenetica.map((item) => /* @__PURE__ */ jsx(Cell, { fill: item.fill }, item.genetica)),
                /* @__PURE__ */ jsx(Label$1, { content: ({
                  viewBox
                }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return /* @__PURE__ */ jsxs("text", { x: viewBox.cx, y: viewBox.cy, textAnchor: "middle", dominantBaseline: "middle", children: [
                      /* @__PURE__ */ jsx("tspan", { x: viewBox.cx, y: viewBox.cy, className: "fill-foreground text-2xl font-semibold", children: stockTotal.toLocaleString("es-AR") }),
                      /* @__PURE__ */ jsx("tspan", { x: viewBox.cx, y: (viewBox.cy ?? 0) + 22, className: "fill-muted-foreground text-xs", children: "g totales" })
                    ] });
                  }
                } })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Stock total" }),
                /* @__PURE__ */ jsxs("p", { className: "font-mono text-2xl font-semibold", children: [
                  stockTotal.toLocaleString("es-AR"),
                  " g"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid gap-2", children: stockPorGenetica.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border px-3 py-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-2 text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-full", style: {
                    backgroundColor: item.fill
                  } }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: item.genetica })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm", children: [
                  item.cantidad.toLocaleString("es-AR"),
                  " g"
                ] })
              ] }, item.genetica)) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Timer, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(CardTitle, { children: "Curado avanzado" })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Seguimiento visual del tiempo de curado y estado de liberación por lote." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Lote" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Genética" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha ingreso" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Días en curado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Peso seco final" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Observaciones" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: curadoAvanzado.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: c.lote }),
              /* @__PURE__ */ jsx(TableCell, { children: c.genetica }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: c.fechaIngreso }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.diasCurado }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.pesoSecoFinal }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: curadoVariant(c.estado), children: c.estado }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: c.observaciones })
            ] }, c.lote)) })
          ] }) }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(detailTarget), onOpenChange: (open) => !open && setDetailTarget(null), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
          detailTarget?.title ?? "Detalle de lote"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Informacion asociada a la fila seleccionada." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-2 rounded-md border bg-muted/30 p-3", children: detailTarget?.rows.map((row) => /* @__PURE__ */ jsxs("div", { className: "grid gap-1 text-sm sm:grid-cols-[140px_1fr]", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-muted-foreground", children: row.label }),
        /* @__PURE__ */ jsx("span", { children: row.value || "-" })
      ] }, row.label)) }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDetailTarget(null), children: "Cerrar" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(uploadTarget), onOpenChange: (open) => !open && closeUploadModal(), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
          uploadTarget?.title ?? "Subir archivo"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Selecciona un archivo para asociarlo al lote y conservar la trazabilidad documental." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-md border bg-muted/30 p-3 text-sm", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
            "Lote ",
            uploadTarget?.lote ?? "-"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-muted-foreground", children: uploadTarget?.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "lote-upload-file", children: "Archivo" }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-10 items-center gap-2 rounded-md border border-input bg-background/70 px-2 py-1.5 shadow-sm dark:bg-muted/35", children: [
            /* @__PURE__ */ jsx(Input, { id: "lote-upload-file", type: "file", accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv", className: "sr-only", onChange: (event) => setUploadFile(event.target.files?.[0] ?? null) }),
            /* @__PURE__ */ jsxs(Label, { htmlFor: "lote-upload-file", className: "inline-flex h-8 cursor-pointer items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90", children: [
              /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }),
              "Seleccionar archivo"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-sm text-muted-foreground", children: uploadFile ? uploadFile.name : "Sin archivos seleccionados" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Formatos sugeridos: PDF, imagen, planilla o documento tecnico." })
        ] }),
        uploadFile ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border px-3 py-2 text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: uploadFile.name }),
          /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-muted-foreground", children: [
            Math.ceil(uploadFile.size / 1024),
            " KB"
          ] })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: closeUploadModal, children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { className: "gap-2", onClick: handleUploadSubmit, children: [
          /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
          "Subir archivo"
        ] })
      ] })
    ] }) })
  ] });
}
function LoteRowActions({
  onView,
  onEdit,
  onDelete,
  onUpload
}) {
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: [
      /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Abrir acciones" })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: onView, children: [
        /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }),
        "Ver"
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: onEdit, children: [
        /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
        "Editar"
      ] }),
      onUpload ? /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: onUpload, children: [
        /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
        "Subir"
      ] }) : null,
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: onDelete, children: [
        /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
        "Eliminar"
      ] })
    ] })
  ] });
}
function BatchDetailSection({
  item,
  geneticsName,
  roomName,
  onClose,
  onEdit
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-md border bg-muted/20 p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Detalle de lote" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold tracking-tight", children: item.code }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          geneticsName,
          " - ",
          roomName
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: onClose, children: "Cerrar" }),
        /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", className: "gap-2", onClick: onEdit, children: [
          /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
          "Editar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-md border bg-background/70 p-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Ficha principal" }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "Codigo lote", value: item.code }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "Genetica", value: geneticsName }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "Sala", value: roomName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-md border bg-background/70 p-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Estado" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Estado" }),
          /* @__PURE__ */ jsx(Badge, { variant: item.status === "descartado" ? "destructive" : "secondary", children: item.status })
        ] }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "ID genetica", value: item.geneticsId }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "ID sala", value: item.roomId })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-md border bg-background/70 p-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Fechas" }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "Inicio", value: item.startDate }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "Inicio flora", value: item.floweringStartDate }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "Cosecha est.", value: item.estimatedHarvestDate }),
        /* @__PURE__ */ jsx(BatchDetailRow, { label: "Cosecha real", value: item.realHarvestDate })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-md border bg-background/70 p-3", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Observaciones" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm text-muted-foreground", children: item.notes || "Sin observaciones." })
    ] })
  ] });
}
function BatchDetailRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-right font-medium", children: value || "-" })
  ] });
}
export {
  CultivoPage as component
};
