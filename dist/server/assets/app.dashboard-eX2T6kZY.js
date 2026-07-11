import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Sprout, ArrowRight, Leaf, FlaskConical, Files, TrendingUp, Boxes, Timer, CalendarDays, Users, UserPlus, AlertTriangle, ArrowLeftRight, BellRing, ShieldAlert, Expand, Eye, EyeOff, ChevronUp, ChevronDown, ChevronsUpDown, X, FileText, Activity, BarChart3, DollarSign } from "lucide-react";
import { B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, M as MovementType, v as useDemo, b as CardDescription } from "./router-Rtc38bRC.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { M as MetricCard } from "./MetricCard-DQTOhwsX.js";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription } from "./dialog-D_bA4dyy.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { T as Table, d as TableHeader, e as TableRow, a as TableBody, b as TableCell, c as TableHead } from "./table-DqzdP08c.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
const BRANCHES = [
  {
    icon: Leaf,
    title: "Genéticas",
    description: "Variedades, madres y propagación.",
    items: [
      { icon: Sprout, label: "Ficha de genéticas" },
      { icon: Leaf, label: "Madres y esquejes" }
    ]
  },
  {
    icon: Boxes,
    title: "Lotes",
    description: "Trazabilidad documental, controles y rendimiento.",
    items: [
      { icon: FlaskConical, label: "Control de calidad · laboratorio" },
      { icon: Files, label: "Archivos asociados a lotes" },
      { icon: TrendingUp, label: "Rendimientos por lote" }
    ]
  },
  {
    icon: Timer,
    title: "Curado avanzado",
    description: "Seguimiento de curado, estabilización y liberación por lote."
  },
  {
    icon: CalendarDays,
    title: "Calendario operativo",
    description: "Tareas técnicas y operativas del equipo."
  }
];
function CultivoTraceabilityBlock() {
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary", children: /* @__PURE__ */ jsx(Sprout, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Cultivo · Trazabilidad avanzada" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Control técnico, trazabilidad y seguimiento productivo." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo", children: [
        "Ir a cultivo ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "rounded-xl border bg-card shadow-xs", children: /* @__PURE__ */ jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: BRANCHES.map((b) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex flex-col rounded-lg border border-border/70 bg-background/40 p-4",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(b.icon, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: b.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: b.description }),
          b.items && b.items.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-1.5 border-l border-border/70 pl-3", children: b.items.map((it) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-xs text-foreground/90", children: [
            /* @__PURE__ */ jsx(it.icon, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsx("span", { children: it.label })
          ] }, it.label)) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-border/60 pt-3", children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/app/cultivo",
              className: "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
              children: [
                "Ver módulo ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
              ]
            }
          ) })
        ]
      },
      b.title
    )) }) }) })
  ] });
}
function startOfDay() {
  const d = /* @__PURE__ */ new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function ClubKpiGrid({ members, items, movements, alerts }) {
  const dayStart = startOfDay();
  const in30Days = Date.now() + 30 * 864e5;
  const activeMembers = members.filter((m) => m.status === "active").length;
  const pendingMembers = members.filter((m) => m.status === "pending").length;
  const inStock = items.filter((i) => i.currentStock > i.reorderPoint).length;
  const lowStock = items.filter((i) => i.currentStock > 0 && i.currentStock <= i.reorderPoint).length;
  const todaysMovements = movements.filter((m) => new Date(m.createdAt).getTime() >= dayStart).length;
  const openAlerts = alerts.filter((a) => !a.isRead).length;
  const expiringCredentials = members.filter((m) => {
    if (!m.reprocannExpirationDate) return false;
    const t = new Date(m.reprocannExpirationDate).getTime();
    return t > Date.now() && t <= in30Days;
  }).length;
  return /* @__PURE__ */ jsx("div", { "data-tour": "metrics", className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4", children: [
    /* @__PURE__ */ jsx(MetricCard, { label: "Socios activos", value: activeMembers, accentColor: "healthy", icon: Users }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Socios pendientes", value: pendingMembers, accentColor: "warning", icon: UserPlus }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Productos en stock", value: inStock, accentColor: "healthy", icon: Boxes }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Stock bajo", value: lowStock, accentColor: "warning", icon: AlertTriangle }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Movimientos del día", value: todaysMovements, accentColor: "neutral", icon: ArrowLeftRight }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Alertas abiertas", value: openAlerts, accentColor: "danger", icon: BellRing }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Credenciales por vencer", value: expiringCredentials, accentColor: "warning", icon: ShieldAlert })
  ] }) });
}
const PRIORITY = {
  zero_stock: { label: "Crítica", tone: "danger" },
  low_stock: { label: "Media", tone: "warning" },
  po_overdue: { label: "Alta", tone: "danger" },
  po_reminder: { label: "Baja", tone: "neutral" },
  request_update: { label: "Baja", tone: "neutral" },
  system: { label: "Media", tone: "warning" }
};
const TONE_CLASSES = {
  danger: "bg-stock-out/10 text-stock-out border-stock-out/30",
  warning: "bg-stock-low/10 text-stock-low border-stock-low/30",
  neutral: "bg-muted text-muted-foreground border-border"
};
function ClubAlertsPanel({ alerts }) {
  const rows = alerts.slice(0, 6);
  return /* @__PURE__ */ jsxs(Card, { className: "shadow-xs", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Alertas que requieren atención" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: rows.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay alertas pendientes." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((a) => {
      const p = PRIORITY[a.type];
      return /* @__PURE__ */ jsxs("li", { className: "flex items-start justify-between gap-3 py-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] font-medium ${TONE_CLASSES[p.tone]}`, children: p.label }),
            /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-medium text-foreground", children: a.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: a.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1 text-right", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: formatDistanceToNow(new Date(a.createdAt), { addSuffix: true, locale: es }) }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: a.isRead ? "En revisión" : "Pendiente" })
        ] })
      ] }, a.id);
    }) }) })
  ] });
}
const TYPE_LABEL = {
  [MovementType.Received]: "Cosecha - Entrada",
  [MovementType.Shipped]: "Dispensa",
  [MovementType.Adjusted]: "Ajuste - Merma",
  [MovementType.Transferred]: "Traslado"
};
const EMPTY_FILTERS = {
  producto: "",
  tipo: "",
  responsable: "",
  fechaDesde: "",
  fechaHasta: "",
  cantidadMin: "",
  cantidadMax: ""
};
function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "es", { sensitivity: "base", numeric: true });
}
function ClubRecentMovements({ movements, items }) {
  const [sortKey, setSortKey] = useState("fecha");
  const [sortDir, setSortDir] = useState("desc");
  const [showQuantity, setShowQuantity] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  useEffect(() => {
    if (!showQuantity && sortKey === "cantidad") {
      setSortKey("fecha");
      setSortDir("desc");
    }
  }, [showQuantity, sortKey]);
  function handleSort(key) {
    if (!showQuantity && key === "cantidad") return;
    if (sortKey === key) {
      setSortDir((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDir(key === "fecha" ? "desc" : "asc");
  }
  const allRows = useMemo(() => {
    return movements.map((movement) => {
      const item = itemMap.get(movement.itemId);
      const cantidad = Math.abs(movement.quantity);
      return {
        movement,
        item,
        fecha: new Date(movement.createdAt).getTime(),
        tipo: TYPE_LABEL[movement.type],
        producto: item?.name ?? "",
        cantidad,
        responsable: movement.performedBy
      };
    });
  }, [itemMap, movements]);
  const latestRows = useMemo(() => sortRows(allRows, "fecha", "desc").slice(0, 8), [allRows]);
  const rows = useMemo(() => sortRows(latestRows, sortKey, sortDir), [latestRows, sortDir, sortKey]);
  const sortedExpandedRows = useMemo(() => sortRows(allRows, sortKey, sortDir), [allRows, sortDir, sortKey]);
  const expandedRows = useMemo(() => {
    const producto = filters.producto.trim().toLowerCase();
    const tipo = filters.tipo.trim().toLowerCase();
    const responsable = filters.responsable.trim().toLowerCase();
    const desde = filters.fechaDesde ? (/* @__PURE__ */ new Date(`${filters.fechaDesde}T00:00:00`)).getTime() : null;
    const hasta = filters.fechaHasta ? (/* @__PURE__ */ new Date(`${filters.fechaHasta}T23:59:59`)).getTime() : null;
    const min = filters.cantidadMin ? Number(filters.cantidadMin) : null;
    const max = filters.cantidadMax ? Number(filters.cantidadMax) : null;
    return sortedExpandedRows.filter((row) => {
      if (producto && !row.producto.toLowerCase().includes(producto)) return false;
      if (tipo && !row.tipo.toLowerCase().includes(tipo)) return false;
      if (responsable && !row.responsable.toLowerCase().includes(responsable)) return false;
      if (desde !== null && row.fecha < desde) return false;
      if (hasta !== null && row.fecha > hasta) return false;
      if (min !== null && Number.isFinite(min) && row.cantidad < min) return false;
      if (max !== null && Number.isFinite(max) && row.cantidad > max) return false;
      return true;
    });
  }, [filters, sortedExpandedRows]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "shadow-xs", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Ultimos movimientos" }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", onClick: () => setExpanded(true), children: [
          /* @__PURE__ */ jsx(Expand, { className: "h-4 w-4" }),
          "Expandir"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx(MovementsTable, { rows, sortKey, sortDir, showQuantity, onSort: handleSort, onToggleQuantity: () => setShowQuantity((current) => !current) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: expanded, onOpenChange: setExpanded, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[88vh] max-w-6xl overflow-hidden p-0", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { className: "border-b px-6 py-4", children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Movimientos completos" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Filtra y ordena el historial completo de movimientos." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 overflow-y-auto px-6 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsx(Input, { placeholder: "Producto", value: filters.producto, onChange: (e) => setFilters((current) => ({ ...current, producto: e.target.value })) }),
          /* @__PURE__ */ jsx(Input, { placeholder: "Tipo", value: filters.tipo, onChange: (e) => setFilters((current) => ({ ...current, tipo: e.target.value })) }),
          /* @__PURE__ */ jsx(Input, { placeholder: "Responsable", value: filters.responsable, onChange: (e) => setFilters((current) => ({ ...current, responsable: e.target.value })) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Input, { type: "number", placeholder: "Cant. min", value: filters.cantidadMin, onChange: (e) => setFilters((current) => ({ ...current, cantidadMin: e.target.value })) }),
            /* @__PURE__ */ jsx(Input, { type: "number", placeholder: "Cant. max", value: filters.cantidadMax, onChange: (e) => setFilters((current) => ({ ...current, cantidadMax: e.target.value })) })
          ] }),
          /* @__PURE__ */ jsx(DateInput, { value: filters.fechaDesde, onChange: (v) => setFilters((current) => ({ ...current, fechaDesde: v })) }),
          /* @__PURE__ */ jsx(DateInput, { value: filters.fechaHasta, onChange: (v) => setFilters((current) => ({ ...current, fechaHasta: v })) }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setFilters(EMPTY_FILTERS), children: "Limpiar filtros" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-muted-foreground", children: [
            expandedRows.length,
            " movimientos"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsx(MovementsTable, { rows: expandedRows, sortKey, sortDir, showQuantity, onSort: handleSort, onToggleQuantity: () => setShowQuantity((current) => !current), compact: false }) })
      ] })
    ] }) })
  ] });
}
function sortRows(rows, sortKey, sortDir) {
  return [...rows].sort((a, b) => {
    const result = compareValues(a[sortKey], b[sortKey]);
    return sortDir === "asc" ? result : -result;
  });
}
function MovementsTable({
  rows,
  sortKey,
  sortDir,
  showQuantity,
  onSort,
  onToggleQuantity,
  compact = true
}) {
  return /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(SortableHead, { className: "pl-6", label: "Fecha", sortKey: "fecha", activeKey: sortKey, dir: sortDir, onSort }),
      /* @__PURE__ */ jsx(SortableHead, { label: "Tipo", sortKey: "tipo", activeKey: sortKey, dir: sortDir, onSort }),
      /* @__PURE__ */ jsx(SortableHead, { label: "Producto", sortKey: "producto", activeKey: sortKey, dir: sortDir, onSort }),
      /* @__PURE__ */ jsx(
        SortableHead,
        {
          className: "text-right",
          label: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
            "Cantidad",
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7",
                title: showQuantity ? "Ocultar cantidad" : "Mostrar cantidad",
                onClick: (event) => {
                  event.stopPropagation();
                  onToggleQuantity();
                },
                children: showQuantity ? /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(EyeOff, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          sortKey: "cantidad",
          activeKey: sortKey,
          dir: sortDir,
          onSort,
          disabled: !showQuantity
        }
      ),
      /* @__PURE__ */ jsx(SortableHead, { className: "pr-6", label: "Responsable", sortKey: "responsable", activeKey: sortKey, dir: sortDir, onSort })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: rows.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "py-10 text-center text-sm text-muted-foreground", children: "No hay movimientos para mostrar." }) }) : rows.map(({ movement, item, cantidad }) => /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableCell, { className: "pl-6 text-xs text-muted-foreground", children: format(new Date(movement.createdAt), compact ? "dd/MM HH:mm" : "dd/MM/yyyy HH:mm") }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: TYPE_LABEL[movement.type] }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "max-w-[220px] truncate text-sm", children: item?.name ?? "-" }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: showQuantity ? `${cantidad} ${item?.unit ?? ""}` : /* @__PURE__ */ jsx("span", { className: "font-sans text-xs text-muted-foreground", children: "Oculta" }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "pr-6 text-xs text-muted-foreground", children: movement.performedBy })
    ] }, movement.id)) })
  ] });
}
function SortableHead({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  className,
  disabled = false
}) {
  const active = activeKey === sortKey;
  const alignRight = className?.includes("text-right");
  return /* @__PURE__ */ jsx(
    TableHead,
    {
      className: `${disabled ? "cursor-default" : "cursor-pointer"} select-none ${className ?? ""}`,
      onClick: () => !disabled && onSort(sortKey),
      children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 ${alignRight ? "justify-end" : ""}`, children: [
        label,
        !disabled && (active ? dir === "asc" ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-3 w-3 shrink-0" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 shrink-0" }) : /* @__PURE__ */ jsx(ChevronsUpDown, { className: "h-3 w-3 shrink-0 opacity-30" }))
      ] })
    }
  );
}
const MEMBER_STATUS = [
  { key: "active", label: "Activo", color: "bg-stock-healthy" },
  { key: "pending", label: "Pendiente", color: "bg-stock-low" },
  { key: "suspended", label: "Suspendido", color: "bg-stock-out" },
  { key: "inactive", label: "Inactivo", color: "bg-muted-foreground" }
];
function Bar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round(value / total * 100) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "text-foreground", children: label }),
      /* @__PURE__ */ jsx("span", { className: "font-mono text-muted-foreground", children: value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx("div", { className: `h-full ${color} transition-all`, style: { width: `${pct}%` } }) })
  ] });
}
function ClubDistribution({ items, categories, members }) {
  const totalStock = items.reduce((s, i) => s + i.currentStock, 0);
  const byCat = categories.map((c) => ({
    name: c.name,
    value: items.filter((i) => i.categoryId === c.id).reduce((s, i) => s + i.currentStock, 0)
  }));
  const totalMembers = members.length;
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs(Card, { className: "shadow-xs", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Stock por categoría" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-3", children: byCat.map((c) => /* @__PURE__ */ jsx(Bar, { label: c.name, value: c.value, total: totalStock, color: "bg-primary" }, c.name)) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "shadow-xs", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Socios por estado" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-3", children: MEMBER_STATUS.map((s) => /* @__PURE__ */ jsx(
        Bar,
        {
          label: s.label,
          value: members.filter((m) => m.status === s.key).length,
          total: totalMembers,
          color: s.color
        },
        s.key
      )) })
    ] })
  ] });
}
function ClubUpcomingExpirations({ members }) {
  const now = Date.now();
  const horizon = now + 60 * 864e5;
  const rows = [];
  for (const m of members) {
    if (m.reprocannExpirationDate) {
      const r = new Date(m.reprocannExpirationDate).getTime();
      if (r > now && r <= horizon) {
        rows.push({ member: m, kind: "Reprocann", date: m.reprocannExpirationDate, daysLeft: differenceInDays(r, now) });
      }
    }
    if (m.medicalDocumentExpirationDate) {
      const d = new Date(m.medicalDocumentExpirationDate).getTime();
      if (d > now && d <= horizon) {
        rows.push({ member: m, kind: "Documento médico", date: m.medicalDocumentExpirationDate, daysLeft: differenceInDays(d, now) });
      }
    }
  }
  rows.sort((a, b) => a.daysLeft - b.daysLeft);
  const top = rows.slice(0, 6);
  return /* @__PURE__ */ jsxs(Card, { className: "shadow-xs", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Vencimientos próximos" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: top.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sin vencimientos en los próximos 60 días." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: top.map((r, i) => {
      const tone = r.daysLeft <= 15 ? "bg-stock-out/10 text-stock-out border-stock-out/30" : "bg-stock-low/10 text-stock-low border-stock-low/30";
      return /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between gap-3 py-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-foreground", children: r.member.fullName }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            r.member.credentialCode,
            " · ",
            r.kind
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `text-[10px] ${tone}`, children: [
            "En ",
            r.daysLeft,
            " días"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: new Date(r.date).toLocaleDateString("es-AR") })
        ] })
      ] }, `${r.member.id}-${r.kind}-${i}`);
    }) }) })
  ] });
}
function OnboardingTour({ steps, currentStep, isActive, onNext, onBack, onSkip, onComplete }) {
  const [pos, setPos] = useState(null);
  const tooltipRef = useRef(null);
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const hasTarget = !!step?.target;
  useEffect(() => {
    if (!isActive || !step?.target) {
      setPos(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setPos(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setPos({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    el.style.position = el.style.position || "relative";
    el.style.zIndex = "10002";
    return () => {
      el.style.zIndex = "";
    };
  }, [isActive, step, currentStep]);
  if (!isActive || !step) return null;
  const handleNext = () => {
    if (isLast) onComplete();
    else onNext();
  };
  const getTooltipStyle = () => {
    if (!hasTarget || !pos) {
      return { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10001 };
    }
    const vh = window.innerHeight;
    const tooltipH = 180;
    if (pos.height > vh * 0.5) {
      return { position: "fixed", top: Math.min(pos.top + 60, vh - tooltipH - 16), left: pos.left + pos.width + 16, zIndex: 10001 };
    }
    const top = Math.min(pos.top + pos.height + 12, vh - tooltipH - 16);
    return { position: "fixed", top, left: Math.max(16, Math.min(pos.left, window.innerWidth - 340)), zIndex: 10001 };
  };
  const tooltipStyle = getTooltipStyle();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[10000] bg-black/50", onClick: onSkip }),
    hasTarget && pos && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed z-[10000] rounded-lg ring-4 ring-primary/60 pointer-events-none",
        style: { top: pos.top - 4, left: pos.left - 4, width: pos.width + 8, height: pos.height + 8 }
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: tooltipRef,
        className: "w-[320px] rounded-lg border border-border bg-card p-4 shadow-xl",
        style: tooltipStyle,
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: step.title }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: onSkip, className: "text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center -mt-2 -mr-2", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: step.description }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("div", { className: "flex gap-1.5", children: steps.map((_, i) => /* @__PURE__ */ jsx("div", { className: `h-1.5 w-1.5 rounded-full ${i === currentStep ? "bg-primary" : "bg-muted-foreground/30"}` }, i)) }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              !isFirst && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: onBack, children: "Back" }),
              /* @__PURE__ */ jsx(Button, { size: "sm", onClick: handleNext, children: isLast ? "Done" : "Next" })
            ] })
          ] })
        ]
      }
    )
  ] });
}
const STORAGE_KEY = "stackwise-onboarding-complete";
function useOnboarding(tourId) {
  const key = `${STORAGE_KEY}-${tourId}`;
  const [hasCompleted, setHasCompleted] = useState(() => localStorage.getItem(key) === "true");
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const startTour = useCallback(() => {
    if (!hasCompleted) {
      setCurrentStep(0);
      setIsActive(true);
    }
  }, [hasCompleted]);
  const skipTour = useCallback(() => {
    localStorage.setItem(key, "true");
    setHasCompleted(true);
    setIsActive(false);
  }, [key]);
  const completeTour = useCallback(() => {
    localStorage.setItem(key, "true");
    setHasCompleted(true);
    setIsActive(false);
  }, [key]);
  const next = useCallback(() => setCurrentStep((s) => s + 1), []);
  const back = useCallback(() => setCurrentStep((s) => Math.max(0, s - 1)), []);
  const resetTour = useCallback(() => {
    localStorage.removeItem(key);
    setHasCompleted(false);
    setIsActive(false);
    setCurrentStep(0);
  }, [key]);
  return { hasCompleted, currentStep, isActive, startTour, skipTour, completeTour, next, back, resetTour };
}
const TOUR_STEPS = [{
  title: "Bienvenido a Cannabis Club Manager",
  description: "Recorrido breve por las secciones principales del panel interno."
}, {
  target: "sidebar",
  title: "Navegación",
  description: "Usá la barra lateral para moverte entre socios, productos, movimientos y configuración."
}, {
  target: "metrics",
  title: "Resumen operativo",
  description: "Indicadores clave del club: socios, stock, dispensas, alertas y vencimientos."
}, {
  target: "search",
  title: "Búsqueda rápida",
  description: "Presioná CMD+K (o Ctrl+K) para buscar socios, productos y movimientos."
}, {
  title: "Listo",
  description: "Explorá el panel libremente o repetí el recorrido cuando lo necesites."
}];
function DashboardPage() {
  const {
    demoStore,
    isDemo
  } = useDemo();
  const items = demoStore?.getItems() ?? [];
  const movements = demoStore?.getMovements() ?? [];
  const members = demoStore?.getMembers() ?? [];
  const categories = demoStore?.getCategories() ?? [];
  const alerts = demoStore?.getNotifications() ?? [];
  const tour = useOnboarding("dashboard");
  useEffect(() => {
    if (isDemo && !tour.hasCompleted) {
      const timer = setTimeout(() => tour.startTour(), 500);
      return () => clearTimeout(timer);
    }
  }, [isDemo, tour.hasCompleted]);
  const handleTourComplete = () => {
    tour.completeTour();
    toast.success("Recorrido finalizado.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Resumen operativo" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Panorama interno del club: socios, stock, dispensas y alertas vigentes." })
    ] }),
    /* @__PURE__ */ jsx(ClubKpiGrid, { members, items, movements, alerts }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]", children: [
      /* @__PURE__ */ jsx("div", { "data-tour": "needs-attention", className: "min-h-0", children: /* @__PURE__ */ jsx(ClubAlertsPanel, { alerts }) }),
      /* @__PURE__ */ jsx("div", { className: "min-h-0", children: /* @__PURE__ */ jsx(ClubUpcomingExpirations, { members }) })
    ] }),
    /* @__PURE__ */ jsx(ClubRecentMovements, { movements, items }),
    /* @__PURE__ */ jsx(ClubDistribution, { items, categories, members }),
    /* @__PURE__ */ jsx(CultivoTraceabilityBlock, {}),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Próximas capacidades" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Funcionalidades planificadas para futuras versiones." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border bg-background shadow-xs", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Coming soon" })
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "pt-2 text-sm font-medium", children: "Archivos asociados a lotes" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Permitir asociar informes, fotos, controles y documentos internos a cada lote." }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border bg-background shadow-xs", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Coming soon" })
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "pt-2 text-sm font-medium", children: "Integración futura con sensores" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Preparado para conectar mediciones automáticas de temperatura, humedad, VPD u otros parámetros." }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border bg-background shadow-xs", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Coming soon" })
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "pt-2 text-sm font-medium", children: "Reportes comparativos" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Comparar rendimiento por lote, genética, sala, ciclo e incidencias." }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "rounded-xl border bg-background shadow-xs", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Coming soon" })
            ] }),
            /* @__PURE__ */ jsx(CardTitle, { className: "pt-2 text-sm font-medium", children: "Costos productivos" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Registrar costos básicos por ciclo para evaluar eficiencia productiva." }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(OnboardingTour, { steps: TOUR_STEPS, currentStep: tour.currentStep, isActive: tour.isActive, onNext: tour.next, onBack: tour.back, onSkip: tour.skipTour, onComplete: handleTourComplete })
  ] });
}
export {
  DashboardPage as component
};
