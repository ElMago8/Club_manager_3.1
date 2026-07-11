import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useMemo, Fragment, useEffect } from "react";
import { ArrowLeftRight, PenLine, PackageMinus, PackageCheck, ExternalLink, ChevronRight, Filter, X, Plus, ArrowUpDown } from "lucide-react";
import { t as cn, B as Button, C as Card, c as CardHeader, d as CardTitle, a as CardContent, M as MovementType, i as Route, E as ErrorBoundary } from "./router-Rtc38bRC.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { u as useIsMobile } from "./use-mobile-BsFue-bT.js";
import { formatDistanceToNow, format } from "date-fns";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { S as Sheet, e as SheetTrigger, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { toast } from "sonner";
import { a as useCreateMovement } from "./useInventoryMutations-yEtOdo22.js";
import { C as CSVExportButton } from "./CSVExportButton-iwRbplCM.js";
import { c as useMovements, a as useItems, b as useLocations } from "./useInventoryData-B4MqeUD9.js";
import { P as PermissionGate } from "./usePermissions-DbMx0bgh.js";
import { E as EmptyState } from "./EmptyState-Dkmucllf.js";
import "@tanstack/react-router";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const TYPE_META = {
  [MovementType.Received]: { icon: PackageCheck, label: "Entrada" },
  [MovementType.Shipped]: { icon: PackageMinus, label: "Dispensa" },
  [MovementType.Adjusted]: { icon: PenLine, label: "Ajuste" },
  [MovementType.Transferred]: { icon: ArrowLeftRight, label: "Traslado" }
};
function directionOf(type, qty) {
  if (type === MovementType.Received) return "in";
  if (type === MovementType.Shipped) return "out";
  return qty >= 0 ? "in" : "out";
}
const PER_PAGE = 25;
function MovementsTable({ movements, itemNameMap, locationNameMap }) {
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const isMobile = useIsMobile();
  const sorted = useMemo(
    () => [...movements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [movements]
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);
  const start = safePage * PER_PAGE + 1;
  const end = Math.min((safePage + 1) * PER_PAGE, sorted.length);
  if (sorted.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: "Sin movimientos registrados" });
  }
  const pagination = /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxs("span", { children: [
      "Mostrando ",
      start,
      "–",
      end,
      " de ",
      sorted.length,
      " movimientos"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: safePage === 0, onClick: () => setPage(safePage - 1), children: "Anterior" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: safePage >= totalPages - 1, onClick: () => setPage(safePage + 1), children: "Siguiente" })
    ] })
  ] });
  if (isMobile) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: paged.map((m) => {
        const meta = TYPE_META[m.type];
        const Icon = meta.icon;
        const dir = directionOf(m.type, m.quantity);
        const absQty = Math.abs(m.quantity);
        return /* @__PURE__ */ jsxs(Card, { className: "cursor-pointer", onClick: () => setExpandedId(expandedId === m.id ? null : m.id), children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-muted-foreground" }),
              meta.label
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `font-mono text-sm font-medium ${dir === "in" ? "text-emerald-600" : "text-red-500"}`, children: [
              dir === "in" ? "+" : "−",
              absQty
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "px-4 pb-3 space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Producto" }),
              /* @__PURE__ */ jsx("span", { className: "truncate ml-2 font-medium", children: itemNameMap.get(m.itemId) ?? "Sin datos" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Responsable" }),
              /* @__PURE__ */ jsx("span", { children: m.performedBy })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Fecha" }),
              /* @__PURE__ */ jsx("span", { children: formatDistanceToNow(new Date(m.createdAt), { addSuffix: true }) })
            ] }),
            expandedId === m.id && /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-border mt-2 space-y-1", children: [
              m.reference && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Motivo:" }),
                " ",
                m.reference
              ] }),
              m.notes && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Observación:" }),
                " ",
                m.notes
              ] }),
              /* @__PURE__ */ jsxs("a", { href: `/app/catalog?item=${m.itemId}`, className: "inline-flex items-center gap-1 text-primary hover:underline text-xs", onClick: (e) => e.stopPropagation(), children: [
                /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" }),
                " Ver producto"
              ] })
            ] })
          ] })
        ] }, m.id);
      }) }),
      pagination
    ] });
  }
  return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 200, children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 bg-card", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[36px]" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[140px]", children: "Tipo" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Producto" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Cantidad" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Sentido" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Responsable" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Motivo" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[140px]", children: "Fecha" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: paged.map((m) => {
        const meta = TYPE_META[m.type];
        const Icon = meta.icon;
        const dir = directionOf(m.type, m.quantity);
        const absQty = Math.abs(m.quantity);
        const isExpanded = expandedId === m.id;
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer hover:bg-muted/50", onClick: () => setExpandedId(isExpanded ? null : m.id), children: [
            /* @__PURE__ */ jsx(TableCell, { className: "w-[36px] px-2", children: /* @__PURE__ */ jsx(ChevronRight, { className: `h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}` }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-sm", children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-muted-foreground" }),
              meta.label
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: itemNameMap.get(m.itemId) ?? /* @__PURE__ */ jsx("span", { className: "italic text-muted-foreground/60 line-through", children: "[Producto eliminado]" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: `font-mono text-sm font-medium ${dir === "in" ? "text-emerald-600" : "text-red-500"}`, children: [
              dir === "in" ? "+" : "−",
              absQty
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: `inline-block rounded-full px-2 py-0.5 text-xs font-medium ${dir === "in" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`, children: dir === "in" ? "entrada" : "salida" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: m.performedBy }),
            /* @__PURE__ */ jsx(TableCell, { className: "max-w-[180px] truncate text-sm text-muted-foreground", children: m.reference || "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("span", { className: "cursor-default text-sm text-muted-foreground", children: formatDistanceToNow(new Date(m.createdAt), { addSuffix: true }) }) }),
              /* @__PURE__ */ jsx(TooltipContent, { children: format(new Date(m.createdAt), "PPpp") })
            ] }) })
          ] }),
          isExpanded && /* @__PURE__ */ jsx(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            MovementDetail,
            {
              movement: m,
              itemName: itemNameMap.get(m.itemId) ?? m.itemId,
              fromLocation: m.fromLocationId && locationNameMap ? locationNameMap.get(m.fromLocationId) : void 0,
              toLocation: m.toLocationId && locationNameMap ? locationNameMap.get(m.toLocationId) : void 0
            }
          ) }) }, `${m.id}-detail`)
        ] }, m.id);
      }) })
    ] }) }),
    pagination
  ] }) });
}
function MovementDetail({ movement, itemName, fromLocation, toLocation }) {
  const isTransfer = movement.type === MovementType.Transferred;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
    (movement.notes || movement.reference) && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: "Observación: " }),
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: movement.notes || movement.reference })
    ] }),
    isTransfer && (fromLocation || toLocation) && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: "Traslado: " }),
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
        fromLocation ?? "—",
        " → ",
        toLocation ?? "—"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("a", { href: `/app/catalog?item=${movement.itemId}`, className: "inline-flex items-center gap-1 text-primary hover:underline", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" }),
      "Ver ",
      itemName
    ] }) })
  ] });
}
const EMPTY_MOVEMENT_FILTERS = {
  types: [],
  itemId: null,
  performedBy: null,
  dateFrom: null,
  dateTo: null
};
function isFiltersActive(f) {
  return f.types.length > 0 || !!f.itemId || !!f.performedBy || !!f.dateFrom || !!f.dateTo;
}
function activeFilterCount(f) {
  let n = 0;
  if (f.types.length > 0) n++;
  if (f.itemId) n++;
  if (f.performedBy) n++;
  if (f.dateFrom || f.dateTo) n++;
  return n;
}
const TYPE_OPTIONS$1 = [
  { value: MovementType.Received, label: "Entrada" },
  { value: MovementType.Shipped, label: "Dispensa" },
  { value: MovementType.Adjusted, label: "Ajuste" },
  { value: MovementType.Transferred, label: "Traslado" }
];
function FilterControls({ filters, onChange, items, performers }) {
  const toggleType = (t) => {
    const next = filters.types.includes(t) ? filters.types.filter((v) => v !== t) : [...filters.types, t];
    onChange({ ...filters, types: next });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Tipo" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: TYPE_OPTIONS$1.map((o) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: filters.types.includes(o.value),
            onCheckedChange: () => toggleType(o.value)
          }
        ),
        o.label
      ] }, o.value)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Producto" }),
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: filters.itemId ?? "__all__",
          onValueChange: (v) => onChange({ ...filters, itemId: v === "__all__" ? null : v }),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todos los productos" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "Todos los productos" }),
              items.map((i) => /* @__PURE__ */ jsx(SelectItem, { value: i.id, children: i.name }, i.id))
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Desde" }),
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: filters.dateFrom ?? "",
            onChange: (v) => onChange({ ...filters, dateFrom: v || null })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Hasta" }),
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: filters.dateTo ?? "",
            onChange: (v) => onChange({ ...filters, dateTo: v || null })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Responsable" }),
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: filters.performedBy ?? "__all__",
          onValueChange: (v) => onChange({ ...filters, performedBy: v === "__all__" ? null : v }),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todos" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "Todos" }),
              performers.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p, children: p }, p))
            ] })
          ]
        }
      )
    ] }),
    isFiltersActive(filters) && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "w-fit gap-1 text-xs", onClick: () => onChange(EMPTY_MOVEMENT_FILTERS), children: [
      /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }),
      "Limpiar filtros"
    ] })
  ] });
}
function MovementsFilters(props) {
  const isMobile = useIsMobile();
  const count = activeFilterCount(props.filters);
  if (isMobile) {
    return /* @__PURE__ */ jsxs(Sheet, { children: [
      /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
        "Filtros",
        count > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1 h-5 px-1.5 text-xs", children: count })
      ] }) }),
      /* @__PURE__ */ jsxs(SheetContent, { side: "left", className: "w-[300px]", children: [
        /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { children: "Filtros" }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(FilterControls, { ...props }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Tipo" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: TYPE_OPTIONS$1.map((o) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: props.filters.types.includes(o.value),
            onCheckedChange: () => {
              const next = props.filters.types.includes(o.value) ? props.filters.types.filter((v) => v !== o.value) : [...props.filters.types, o.value];
              props.onChange({ ...props.filters, types: next });
            }
          }
        ),
        o.label
      ] }, o.value)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Producto" }),
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: props.filters.itemId ?? "__all__",
          onValueChange: (v) => props.onChange({ ...props.filters, itemId: v === "__all__" ? null : v }),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todos los productos" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "Todos los productos" }),
              props.items.map((i) => /* @__PURE__ */ jsx(SelectItem, { value: i.id, children: i.name }, i.id))
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Rango de fechas" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: props.filters.dateFrom ?? "",
            onChange: (v) => props.onChange({ ...props.filters, dateFrom: v || null })
          }
        ),
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: props.filters.dateTo ?? "",
            onChange: (v) => props.onChange({ ...props.filters, dateTo: v || null })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Responsable" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: props.filters.performedBy ?? "__all__",
            onValueChange: (v) => props.onChange({ ...props.filters, performedBy: v === "__all__" ? null : v }),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Todos" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "Todos" }),
                props.performers.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p, children: p }, p))
              ] })
            ]
          }
        )
      ] }),
      isFiltersActive(props.filters) && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "h-8 gap-1 text-xs", onClick: () => props.onChange(EMPTY_MOVEMENT_FILTERS), children: [
        /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }),
        "Limpiar"
      ] })
    ] })
  ] }) });
}
function MovementStats({ movements }) {
  const stats = useMemo(() => {
    let received = 0;
    let shipped = 0;
    let adjusted = 0;
    for (const m of movements) {
      if (m.type === MovementType.Received) received++;
      else if (m.type === MovementType.Shipped) shipped++;
      else if (m.type === MovementType.Adjusted) adjusted++;
    }
    return { total: movements.length, received, shipped, adjusted };
  }, [movements]);
  const pills = [
    { label: "Total", value: stats.total },
    { label: "Entradas", value: stats.received },
    { label: "Dispensas", value: stats.shipped },
    { label: "Ajustes", value: stats.adjusted }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 lg:grid-cols-4", "data-testid": "movement-stats", children: pills.map((p) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "rounded-md border border-border bg-muted/50 px-3 py-2 text-center",
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold font-mono text-foreground", children: p.value })
      ]
    },
    p.label
  )) });
}
const TYPE_OPTIONS = [
  { value: "cosecha", label: "Cosecha" },
  { value: "entrada", label: "Entrada" },
  { value: "dispensa", label: "Dispensa" },
  { value: "salida", label: "Salida" },
  { value: "ajuste", label: "Ajuste" },
  { value: "merma", label: "Merma" }
];
const DISPLAY_TO_ENUM = {
  cosecha: MovementType.Received,
  entrada: MovementType.Received,
  dispensa: MovementType.Shipped,
  salida: MovementType.Shipped,
  ajuste: MovementType.Adjusted,
  merma: MovementType.Adjusted
};
function MovementFormSheet({
  open,
  onOpenChange,
  items,
  locations,
  preSelectedItemId
}) {
  const { mutate, isLoading } = useCreateMovement();
  const [itemId, setItemId] = useState("");
  const [displayType, setDisplayType] = useState("entrada");
  const type = DISPLAY_TO_ENUM[displayType];
  const [quantity, setQuantity] = useState("");
  const [direction, setDirection] = useState("in");
  const [reference, setReference] = useState("");
  const [member, setMember] = useState("");
  const [responsible, setResponsible] = useState("");
  const [observation, setObservation] = useState("");
  const [fromLocationId, setFromLocationId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (open) {
      setItemId(preSelectedItemId ?? "");
      setDisplayType("entrada");
      setQuantity("");
      setDirection("in");
      setReference("");
      setMember("");
      setResponsible("");
      setObservation("");
      setFromLocationId("");
      setToLocationId("");
      setErrors({});
    }
  }, [open, preSelectedItemId]);
  useEffect(() => {
    if (displayType === "merma") setDirection("out");
    else if (type === MovementType.Received) setDirection("in");
    else if (type === MovementType.Shipped) setDirection("out");
  }, [displayType, type]);
  const validate = () => {
    const errs = {};
    if (!itemId) errs.itemId = "El producto es obligatorio";
    const num = Number(quantity);
    const qty = parseInt(quantity, 10);
    if (!quantity || isNaN(qty) || qty <= 0 || !Number.isInteger(num)) {
      errs.quantity = "La cantidad debe ser un entero positivo";
    }
    if (type === MovementType.Adjusted && !reference.trim()) {
      errs.reference = "El motivo es obligatorio para ajustes";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSave = () => {
    if (!validate()) return;
    const qty = parseInt(quantity, 10);
    const selectedItem = items.find((i) => i.id === itemId);
    const signedQty = direction === "in" ? qty : -qty;
    const noteParts = [
      member ? `Socio: ${member}` : "",
      observation
    ].filter(Boolean);
    const movement = {
      id: crypto.randomUUID(),
      itemId,
      type,
      quantity: signedQty,
      fromLocationId: null,
      toLocationId: null,
      reference: reference || TYPE_OPTIONS.find((o) => o.value === displayType)?.label || "",
      notes: noteParts.join(" · "),
      performedBy: responsible || "demo.user",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    mutate(movement, {
      onSuccess: () => {
        const label = selectedItem?.name ?? itemId;
        const sign = direction === "in" ? "+" : "−";
        const typeLabel = TYPE_OPTIONS.find((o) => o.value === displayType)?.label ?? displayType;
        toast.success(`Movimiento registrado: ${sign}${qty} ${label} (${typeLabel})`, {
          duration: 5e3
        });
        onOpenChange(false);
      },
      onError: (e) => toast.error(e.message || "No se pudo registrar el movimiento. Intentá de nuevo.")
    });
  };
  type === MovementType.Transferred;
  const isAdjusted = type === MovementType.Adjusted;
  const isDispensa = displayType === "dispensa";
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-[400px] sm:max-w-[440px] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: "Registrar movimiento" }),
      /* @__PURE__ */ jsx(SheetDescription, { children: "Registrá un movimiento de stock del club." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-sm", children: "Tipo de movimiento" }),
        /* @__PURE__ */ jsxs(Select, { value: displayType, onValueChange: (v) => setDisplayType(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsx(SelectContent, { children: TYPE_OPTIONS.map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
        ] })
      ] }),
      isDispensa && /* @__PURE__ */ jsx("div", { className: "rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: "La validación real de cupo y stock se implementará en backend." }),
      isAdjusted && /* @__PURE__ */ jsx("div", { className: "rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-xs text-sky-800", children: "Este movimiento quedará registrado en auditoría cuando exista backend real." }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-sm", children: "Producto *" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: itemId || "__none__",
            onValueChange: (v) => setItemId(v === "__none__" ? "" : v),
            disabled: !!preSelectedItemId,
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar producto" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "__none__", disabled: true, children: "Seleccionar producto" }),
                items.map((i) => /* @__PURE__ */ jsx(SelectItem, { value: i.id, children: i.name }, i.id))
              ] })
            ]
          }
        ),
        errors.itemId && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.itemId })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-sm", children: "Cantidad *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: 1,
            step: 1,
            placeholder: "Ingresá la cantidad",
            value: quantity,
            onChange: (e) => setQuantity(e.target.value)
          }
        ),
        errors.quantity && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.quantity })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-sm", children: "Socio asociado (opcional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Credencial o nombre del socio",
            value: member,
            onChange: (e) => setMember(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-sm", children: "Responsable" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Usuario interno responsable",
            value: responsible,
            onChange: (e) => setResponsible(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { className: "mb-1.5 block text-sm", children: [
          "Motivo",
          isAdjusted ? " *" : ""
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: isAdjusted ? "Motivo del ajuste (requerido)" : "Motivo del movimiento",
            value: reference,
            onChange: (e) => setReference(e.target.value)
          }
        ),
        errors.reference && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.reference })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-sm", children: "Observaciones" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: "Notas internas (opcional)",
            value: observation,
            onChange: (e) => setObservation(e.target.value),
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: isLoading, className: "flex-1", children: isLoading ? "Guardando…" : "Guardar movimiento" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" })
      ] })
    ] })
  ] }) });
}
function applyFilters(movements, f) {
  let result = movements;
  if (f.types.length > 0) result = result.filter((m) => f.types.includes(m.type));
  if (f.itemId) result = result.filter((m) => m.itemId === f.itemId);
  if (f.performedBy) result = result.filter((m) => m.performedBy === f.performedBy);
  if (f.dateFrom) {
    const from = new Date(f.dateFrom);
    from.setHours(0, 0, 0, 0);
    result = result.filter((m) => new Date(m.createdAt) >= from);
  }
  if (f.dateTo) {
    const to = new Date(f.dateTo);
    to.setHours(23, 59, 59, 999);
    result = result.filter((m) => new Date(m.createdAt) <= to);
  }
  return result;
}
function MovementsPage() {
  const {
    item: itemParam
  } = Route.useSearch();
  const [filters, setFilters] = useState(EMPTY_MOVEMENT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const {
    data: movements
  } = useMovements();
  const {
    data: items
  } = useItems();
  const {
    data: locations
  } = useLocations();
  useEffect(() => {
    if (itemParam) {
      setFilters((prev) => ({
        ...prev,
        itemId: itemParam
      }));
    }
  }, [itemParam]);
  const itemNameMap = useMemo(() => new Map(items.map((i) => [i.id, i.name])), [items]);
  const locationNameMap = useMemo(() => new Map(locations.map((l) => [l.id, l.name])), [locations]);
  const performers = useMemo(() => [...new Set(movements.map((m) => m.performedBy))].sort(), [movements]);
  const filtered = useMemo(() => applyFilters(movements, filters), [movements, filters]);
  const movementCsvColumns = useMemo(() => [{
    header: "Fecha",
    accessor: (m) => new Date(m.createdAt).toLocaleDateString()
  }, {
    header: "Tipo",
    accessor: (m) => m.type
  }, {
    header: "Producto",
    accessor: (m) => itemNameMap.get(m.itemId) ?? ""
  }, {
    header: "Lote",
    accessor: (m) => items.find((i) => i.id === m.itemId)?.sku ?? ""
  }, {
    header: "Cantidad",
    accessor: (m) => m.quantity
  }, {
    header: "Responsable",
    accessor: (m) => m.performedBy
  }, {
    header: "Motivo",
    accessor: (m) => m.reference
  }, {
    header: "Observación",
    accessor: (m) => m.notes
  }], [itemNameMap, items]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Movimientos" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          filtered.length,
          " movimientos"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CSVExportButton, { data: filtered, columns: movementCsvColumns, filename: "movimientos-club", label: "Exportar CSV" }),
        /* @__PURE__ */ jsx(PermissionGate, { permission: "log_movement", children: /* @__PURE__ */ jsxs(Button, { onClick: () => setFormOpen(true), className: "gap-1.5", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Registrar movimiento"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(MovementsFilters, { filters, onChange: setFilters, items, performers }),
    /* @__PURE__ */ jsx(MovementStats, { movements: filtered }),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: movements.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: ArrowUpDown, title: "Sin movimientos registrados", description: "Los movimientos registran cosechas, dispensas, ajustes y mermas del club.", actionLabel: "Registrar movimiento", onAction: () => setFormOpen(true) }) : /* @__PURE__ */ jsx(MovementsTable, { movements: filtered, itemNameMap, locationNameMap }) }),
    /* @__PURE__ */ jsx(MovementFormSheet, { open: formOpen, onOpenChange: setFormOpen, items, locations })
  ] });
}
export {
  MovementsPage as component
};
