import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { RotateCcw, Save, Pencil, AlertTriangle } from "lucide-react";
import { C as Card, c as CardHeader, d as CardTitle, a as CardContent, b as CardDescription, B as Button } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { g as generateVPDTable, a as getVPDStatus } from "./vpdCalculator-CDiK96pa.js";
import "@tanstack/react-router";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
const TEMP_MIN = 10;
const TEMP_MAX = 40;
const TEMP_STEP = 0.5;
const TEMP_DEFAULT = 25;
const HUM_MIN = 20;
const HUM_MAX = 90;
const HUM_STEP = 1;
const HUM_DEFAULT = 60;
const LEVEL_CONFIG = {
  bajo: {
    label: "Bajo",
    description: "Ambiente húmedo, revisar ventilación y transpiración.",
    result: "border-sky-200 bg-sky-500/10 text-sky-800 dark:text-sky-300",
    track: "bg-sky-200 dark:bg-sky-900",
    accent: "#0ea5e9"
  },
  optimo_veg: {
    label: "Óptimo vegetativo",
    description: "Rango cómodo para crecimiento vegetativo.",
    result: "border-emerald-200 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
    track: "bg-emerald-200 dark:bg-emerald-900",
    accent: "#10b981"
  },
  optimo_flora: {
    label: "Óptimo floración",
    description: "Rango útil para floración con buen control ambiental.",
    result: "border-green-200 bg-green-500/10 text-green-800 dark:text-green-300",
    track: "bg-green-200 dark:bg-green-900",
    accent: "#22c55e"
  },
  alto: {
    label: "Alto",
    description: "Ambiente seco, revisar humedad y estrés hídrico.",
    result: "border-amber-200 bg-amber-500/10 text-amber-800 dark:text-amber-300",
    track: "bg-amber-200 dark:bg-amber-900",
    accent: "#f59e0b"
  },
  critico: {
    label: "Crítico",
    description: "Riesgo de estrés. Ajustar temperatura o humedad.",
    result: "border-red-200 bg-red-500/10 text-red-800 dark:text-red-300",
    track: "bg-red-200 dark:bg-red-900",
    accent: "#ef4444"
  }
};
function calcVpd(tempC, humidity) {
  const svp = 0.6108 * Math.exp(17.27 * tempC / (tempC + 237.3));
  return Math.round(svp * (1 - humidity / 100) * 100) / 100;
}
function classify(vpd) {
  if (vpd < 0.8) return "bajo";
  if (vpd < 1.2) return "optimo_veg";
  if (vpd < 1.6) return "optimo_flora";
  if (vpd < 2) return "alto";
  return "critico";
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function RangeSlider({
  min,
  max,
  step,
  value,
  accent,
  onChange
}) {
  const pct = (value - min) / (max - min) * 100;
  return /* @__PURE__ */ jsxs("div", { className: "relative flex items-center py-1", children: [
    /* @__PURE__ */ jsx("div", { className: "relative h-2 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-y-0 left-0 rounded-full",
        style: { width: `${pct}%`, backgroundColor: accent, opacity: 0.5 }
      }
    ) }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        onChange: (e) => onChange(Number(e.target.value)),
        className: "absolute inset-0 h-full w-full cursor-pointer opacity-0",
        style: { accentColor: accent }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white shadow-md",
        style: {
          left: `calc(${pct}% - 8px)`,
          backgroundColor: accent
        }
      }
    )
  ] });
}
function VpdCalculator() {
  const [temp, setTemp] = useState(TEMP_DEFAULT);
  const [hum, setHum] = useState(HUM_DEFAULT);
  const [tempStr, setTempStr] = useState(String(TEMP_DEFAULT));
  const [humStr, setHumStr] = useState(String(HUM_DEFAULT));
  const vpd = calcVpd(temp, hum);
  const level = classify(vpd);
  const cfg = LEVEL_CONFIG[level];
  function commitTemp(str) {
    const n = parseFloat(str);
    const safe = isNaN(n) ? TEMP_DEFAULT : clamp(n, TEMP_MIN, TEMP_MAX);
    setTemp(safe);
    setTempStr(String(safe));
  }
  function commitHum(str) {
    const n = parseFloat(str);
    const safe = isNaN(n) ? HUM_DEFAULT : clamp(n, HUM_MIN, HUM_MAX);
    setHum(safe);
    setHumStr(String(safe));
  }
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Calculadora VPD" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Temperatura del aire (°C)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: TEMP_MIN,
            max: TEMP_MAX,
            step: TEMP_STEP,
            value: tempStr,
            onChange: (e) => {
              setTempStr(e.target.value);
              const n = parseFloat(e.target.value);
              if (!isNaN(n)) setTemp(clamp(n, TEMP_MIN, TEMP_MAX));
            },
            onBlur: () => commitTemp(tempStr)
          }
        ),
        /* @__PURE__ */ jsx(
          RangeSlider,
          {
            min: TEMP_MIN,
            max: TEMP_MAX,
            step: TEMP_STEP,
            value: temp,
            accent: cfg.accent,
            onChange: (v) => {
              setTemp(v);
              setTempStr(String(v));
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            TEMP_MIN,
            " °C"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-foreground", children: [
            temp,
            " °C"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            TEMP_MAX,
            " °C"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Humedad relativa (%RH)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: HUM_MIN,
            max: HUM_MAX,
            step: HUM_STEP,
            value: humStr,
            onChange: (e) => {
              setHumStr(e.target.value);
              const n = parseFloat(e.target.value);
              if (!isNaN(n)) setHum(clamp(n, HUM_MIN, HUM_MAX));
            },
            onBlur: () => commitHum(humStr)
          }
        ),
        /* @__PURE__ */ jsx(
          RangeSlider,
          {
            min: HUM_MIN,
            max: HUM_MAX,
            step: HUM_STEP,
            value: hum,
            accent: cfg.accent,
            onChange: (v) => {
              setHum(v);
              setHumStr(String(v));
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            HUM_MIN,
            "%"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-foreground", children: [
            hum,
            "%"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            HUM_MAX,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `rounded-lg border p-4 transition-colors ${cfg.result}`, children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest opacity-60", children: "VPD actual" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 font-mono text-4xl font-bold leading-none", children: [
          vpd.toFixed(2),
          /* @__PURE__ */ jsx("span", { className: "ml-1 text-lg font-normal opacity-70", children: "kPa" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 border-t border-current/10 pt-3", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: cfg.label }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm opacity-75", children: cfg.description })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Rangos de referencia" }),
        /* @__PURE__ */ jsxs("div", { className: "flex h-3 w-full overflow-hidden rounded-full", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-[0.8] bg-sky-400/70", title: "Bajo < 0.8" }),
          /* @__PURE__ */ jsx("div", { className: "flex-[0.4] bg-emerald-400/70", title: "Óptimo veg 0.8–1.2" }),
          /* @__PURE__ */ jsx("div", { className: "flex-[0.4] bg-green-400/70", title: "Óptimo flora 1.2–1.6" }),
          /* @__PURE__ */ jsx("div", { className: "flex-[0.4] bg-amber-400/70", title: "Alto 1.6–2.0" }),
          /* @__PURE__ */ jsx("div", { className: "flex-[1] bg-red-400/70", title: "Crítico > 2.0" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { children: "0" }),
          /* @__PURE__ */ jsx("span", { children: "0.8" }),
          /* @__PURE__ */ jsx("span", { children: "1.2" }),
          /* @__PURE__ */ jsx("span", { children: "1.6" }),
          /* @__PURE__ */ jsx("span", { children: "2.0" }),
          /* @__PURE__ */ jsx("span", { children: "+" })
        ] })
      ] })
    ] })
  ] });
}
const HUMIDITIES = [40, 45, 50, 55, 60, 65, 70, 75, 80];
const STORAGE_KEY = "vpd_ranges_v1";
const RANGE_META = [{
  label: "Esquejes / plántulas",
  borderColor: "border-yellow-400 dark:border-yellow-500",
  labelColor: "text-yellow-600 dark:text-yellow-400"
}, {
  label: "Vegetativo",
  borderColor: "border-stone-500 dark:border-stone-400",
  labelColor: "text-stone-600 dark:text-stone-400"
}, {
  label: "Inicio flora",
  borderColor: "border-violet-400 dark:border-violet-500",
  labelColor: "text-violet-600 dark:text-violet-400"
}, {
  label: "Flora media",
  borderColor: "border-slate-400 dark:border-slate-500",
  labelColor: "text-slate-500 dark:text-slate-400"
}, {
  label: "Final flora",
  borderColor: "border-rose-400 dark:border-rose-500",
  labelColor: "text-rose-600 dark:text-rose-400"
}];
const DEFAULT_RANGES = [{
  min: 0.4,
  max: 0.8
}, {
  min: 0.8,
  max: 1.2
}, {
  min: 1,
  max: 1.3
}, {
  min: 1.2,
  max: 1.5
}, {
  min: 1.3,
  max: 1.5
}];
function loadRanges() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RANGES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === DEFAULT_RANGES.length) return parsed;
  } catch {
  }
  return DEFAULT_RANGES;
}
function saveRanges(ranges) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ranges));
}
const STATUS_CLASS = {
  bajo: "bg-sky-500/10 text-sky-700",
  optimo: "bg-emerald-500/10 text-emerald-700",
  alto: "bg-amber-500/10 text-amber-700",
  critico: "bg-red-500/10 text-red-700"
};
function fmtRange(r) {
  return `${r.min} – ${r.max}`;
}
function VPDTablePage() {
  const table = useMemo(() => generateVPDTable({
    humidities: HUMIDITIES,
    leafOffset: 0
  }), []);
  const [ranges, setRanges] = useState(() => loadRanges());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState([]);
  function startEdit() {
    setDraft(ranges.map((r) => ({
      min: String(r.min),
      max: String(r.max)
    })));
    setEditing(true);
  }
  function cancelEdit() {
    setEditing(false);
    setDraft([]);
  }
  function setDraftField(idx, field, value) {
    setDraft((prev) => prev.map((item, i) => i === idx ? {
      ...item,
      [field]: value
    } : item));
  }
  function commitEdit() {
    const next = draft.map((d, i) => {
      const min = parseFloat(d.min);
      const max = parseFloat(d.max);
      return {
        min: isNaN(min) ? DEFAULT_RANGES[i].min : Math.round(min * 100) / 100,
        max: isNaN(max) ? DEFAULT_RANGES[i].max : Math.round(max * 100) / 100
      };
    });
    setRanges(next);
    saveRanges(next);
    setEditing(false);
    setDraft([]);
  }
  function resetDefaults() {
    setRanges(DEFAULT_RANGES);
    saveRanges(DEFAULT_RANGES);
    setEditing(false);
    setDraft([]);
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Tabla VPD" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Matriz técnica de VPD y calculadora interactiva." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Matriz VPD" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Valores en kPa por temperatura ambiente y humedad relativa. Temperatura de hoja = temperatura de aire." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Temp. / HR" }),
            HUMIDITIES.map((humidity) => /* @__PURE__ */ jsxs(TableHead, { className: "text-center", children: [
              humidity,
              "%"
            ] }, humidity))
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: table.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { className: "font-mono font-medium whitespace-nowrap", children: [
              row.temperature,
              " °C"
            ] }),
            row.values.map((cell) => {
              const status = getVPDStatus(cell.vpd);
              return /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx("span", { className: `inline-flex min-w-14 justify-center rounded-md px-2 py-1 font-mono text-xs ${STATUS_CLASS[status]}`, children: cell.vpd }) }, cell.humidity);
            })
          ] }, row.temperature)) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsx(VpdCalculator, {})
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Rangos kPa" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Valores de referencia por etapa de cultivo." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: editing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: resetDefaults, title: "Restaurar valores por defecto", children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }),
            "Restaurar"
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: cancelEdit, children: "Cancelar" }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: commitEdit, children: [
            /* @__PURE__ */ jsx(Save, { className: "mr-1.5 h-3.5 w-3.5" }),
            "Guardar"
          ] })
        ] }) : /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: startEdit, children: [
          /* @__PURE__ */ jsx(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }),
          "Editar"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: RANGE_META.map((meta, idx) => /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-2 rounded-lg border-l-4 bg-muted/40 px-4 py-3 ${meta.borderColor}`, children: [
          /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold uppercase tracking-wide ${meta.labelColor}`, children: meta.label }),
          editing ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Input, { type: "number", step: 0.1, min: 0, value: draft[idx]?.min ?? "", onChange: (e) => setDraftField(idx, "min", e.target.value), className: "h-8 w-full font-mono text-sm" }),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 text-xs text-muted-foreground", children: "–" }),
            /* @__PURE__ */ jsx(Input, { type: "number", step: 0.1, min: 0, value: draft[idx]?.max ?? "", onChange: (e) => setDraftField(idx, "max", e.target.value), className: "h-8 w-full font-mono text-sm" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-lg font-bold leading-none text-foreground", children: fmtRange(ranges[idx]) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "kPa" })
          ] })
        ] }, meta.label)) }),
        editing && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: 'Los valores se guardan en este navegador. Usá "Restaurar" para volver a los valores por defecto.' })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-amber-200 bg-amber-500/5 dark:border-amber-900 dark:bg-amber-950/20", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-600" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Aviso técnico" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2 text-sm leading-relaxed text-muted-foreground", children: [
        /* @__PURE__ */ jsx("p", { children: "El VPD te dice si la planta está transpirando bien, poco o demasiado según la temperatura y la humedad." }),
        /* @__PURE__ */ jsx("p", { children: "El VPD se expresa en kPa. Ese número indica qué tan fuerte el ambiente hace transpirar a la planta." }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-sky-600 dark:text-sky-400", children: "kPa bajo:" }),
            " la planta transpira poco por exceso de humedad."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-emerald-600 dark:text-emerald-400", children: "kPa ideal:" }),
            " la planta transpira y absorbe bien."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-amber-600 dark:text-amber-400", children: "kPa alto:" }),
            " el ambiente está seco/caliente y la planta puede estresarse."
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  VPDTablePage as component
};
