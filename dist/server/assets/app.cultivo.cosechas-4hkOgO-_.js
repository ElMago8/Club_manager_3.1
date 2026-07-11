import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useLocation, Outlet, Link } from "@tanstack/react-router";
import { Plus, Wheat, Wind, Timer, Package, Scale, StopCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { C as CultivationStatusMessage } from "./RelationshipWarning-BRJ5EkHV.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, a as CardContent } from "./router-Rtc38bRC.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { a as getHarvests, d as deleteHarvest } from "./harvestService-8yHdLBj_.js";
import { a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
import "@radix-ui/react-dropdown-menu";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "class-variance-authority";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
const STATUS_CLASS = {
  registrada: "border-sky-200 bg-sky-500/10 text-sky-700",
  en_secado: "border-amber-200 bg-amber-500/10 text-amber-700",
  seca: "border-lime-200 bg-lime-500/10 text-lime-700",
  en_curado: "border-violet-200 bg-violet-500/10 text-violet-700",
  lista_para_stock: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  descartada: "border-muted bg-muted text-muted-foreground"
};
const STATUS_LABEL = {
  registrada: "Registrada",
  en_secado: "En secado",
  seca: "Seca",
  en_curado: "En curado",
  lista_para_stock: "Stock",
  descartada: "Descartada"
};
function fmt(n) {
  if (n == null) return "—";
  return n >= 1e3 ? `${(n / 1e3).toFixed(2)} kg` : `${n} g`;
}
function elapsedLabel(startIso, now) {
  const ms = now - new Date(startIso).getTime();
  if (ms < 0) return "0h";
  const totalHours = Math.floor(ms / 36e5);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${totalHours}h`;
}
function HarvestsPage() {
  const location = useLocation();
  const [harvests, setHarvests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stopTarget, setStopTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 6e4);
    return () => clearInterval(interval);
  }, []);
  async function load() {
    setLoading(true);
    try {
      setHarvests(await getHarvests());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [location.pathname]);
  const filtered = useMemo(() => {
    if (statusFilter === "all") return harvests;
    return harvests.filter((h) => h.status === statusFilter);
  }, [harvests, statusFilter]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(filtered);
  const totalDryGrams = harvests.reduce((sum, h) => sum + (h.dryWeightGrams ?? 0), 0);
  async function handleStopCounter(h) {
    const field = h.status === "en_secado" ? "secadoInicioEn" : "curadoInicioEn";
    await apiRequest(`/cultivation/harvests/${h.id}`, {
      method: "PUT",
      body: JSON.stringify({
        [field]: null
      })
    });
    setStopTarget(null);
    await load();
  }
  async function handleStartCounter(h) {
    const field = h.status === "en_secado" ? "secadoInicioEn" : "curadoInicioEn";
    await apiRequest(`/cultivation/harvests/${h.id}`, {
      method: "PUT",
      body: JSON.stringify({
        [field]: (/* @__PURE__ */ new Date()).toISOString()
      })
    });
    await load();
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteHarvest(deleteTarget.id);
      setMessage("Cosecha eliminada.");
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al eliminar.");
      setDeleteTarget(null);
    }
  }
  const countByStatus = (s) => harvests.filter((h) => h.status === s).length;
  const isSubRoute = location.pathname !== "/app/cultivo/cosechas";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    !isSubRoute && /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Cosechas" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Registro y seguimiento de cosechas por lote." })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/cosechas/nueva", search: {
          edit: void 0
        }, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Nueva cosecha"
        ] }) })
      ] }),
      message && /* @__PURE__ */ jsx(CultivationStatusMessage, { message }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: [{
        label: "Total",
        value: harvests.length,
        Icon: Wheat,
        accent: "bg-slate-500",
        panel: "bg-slate-500/10",
        iconClass: "text-slate-600 dark:text-slate-400"
      }, {
        label: "En secado",
        value: countByStatus("en_secado"),
        Icon: Wind,
        accent: "bg-amber-500",
        panel: "bg-amber-500/10",
        iconClass: "text-amber-600 dark:text-amber-400"
      }, {
        label: "En curado",
        value: countByStatus("en_curado"),
        Icon: Timer,
        accent: "bg-violet-500",
        panel: "bg-violet-500/10",
        iconClass: "text-violet-600 dark:text-violet-400"
      }, {
        label: "Stock",
        value: countByStatus("lista_para_stock"),
        Icon: Package,
        accent: "bg-emerald-500",
        panel: "bg-emerald-500/10",
        iconClass: "text-emerald-600 dark:text-emerald-400"
      }, {
        label: "Peso seco total",
        value: fmt(totalDryGrams),
        Icon: Scale,
        accent: "bg-teal-500",
        panel: "bg-teal-500/10",
        iconClass: "text-teal-600 dark:text-teal-400"
      }].map(({
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
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-48", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Estado" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "en_secado", children: "En secado" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "seca", children: "Seca" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "en_curado", children: "En curado" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "lista_para_stock", children: "Stock" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "descartada", children: "Descartada" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-16 text-sm text-muted-foreground", children: "Cargando cosechas..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Wheat, { className: "h-8 w-8 opacity-40" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No hay cosechas registradas." }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/app/cultivo/cosechas/nueva", search: {
          edit: void 0
        }, children: "Registrar primera cosecha" }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto [&_td]:text-center [&_th]:text-center", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(SortHead, { label: "Código", sortKey: "code", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Lote", sortKey: "batchCode", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Genética", sortKey: "geneticsName", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Sala", sortKey: "roomName", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Entorno", sortKey: "cultivationType", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Tipo cultivo", sortKey: "growMedium", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Fecha", sortKey: "harvestDate", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Peso húmedo", sortKey: "wetWeightGrams", col: sCol, dir: sDir, onSort: sort, className: "text-right" }),
          /* @__PURE__ */ jsx(SortHead, { label: "Peso seco", sortKey: "dryWeightGrams", col: sCol, dir: sDir, onSort: sort, className: "text-right" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Merma" }),
          /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(TableHead, { children: "Tiempo Transcurrido" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sorted.map((h) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono font-medium", children: h.code }),
          /* @__PURE__ */ jsx(TableCell, { children: h.batchCode ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: h.geneticsName ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: h.roomName ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: h.cultivationType ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: h.growMedium ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap", children: h.harvestDate }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono", children: fmt(h.wetWeightGrams) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono", children: fmt(h.dryWeightGrams) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono", children: fmt(h.shrinkageGrams) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[h.status], children: STATUS_LABEL[h.status] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: h.status === "en_secado" || h.status === "en_curado" ? (() => {
            const start = h.status === "en_secado" ? h.secadoInicioEn : h.curadoInicioEn;
            return start ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: elapsedLabel(start, now) }),
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-6 w-6 cursor-pointer p-0 text-muted-foreground hover:text-destructive", onClick: () => setStopTarget(h), children: /* @__PURE__ */ jsx(StopCircle, { className: "h-3.5 w-3.5" }) })
            ] }) : /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-7 cursor-pointer text-xs", onClick: () => void handleStartCounter(h), children: "Iniciar" });
          })() : "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/cosechas/nueva", search: {
                edit: h.id
              }, children: [
                /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                "Editar"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => setDeleteTarget(h), children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "Eliminar"
              ] })
            ] })
          ] }) })
        ] }, h.id)) })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: !!deleteTarget, entityLabel: "cosecha", itemName: deleteTarget?.code, onOpenChange: (open) => {
        if (!open) setDeleteTarget(null);
      }, onConfirm: handleDelete }),
      /* @__PURE__ */ jsx(Dialog, { open: !!stopTarget, onOpenChange: (open) => {
        if (!open) setStopTarget(null);
      }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[380px]", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: "Detener contador" }),
          /* @__PURE__ */ jsxs(DialogDescription, { children: [
            "¿Detener el contador de ",
            stopTarget?.code,
            "? Se perderá el tiempo registrado y podrás iniciarlo nuevamente."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setStopTarget(null), children: "Cancelar" }),
          /* @__PURE__ */ jsxs(Button, { variant: "destructive", onClick: () => stopTarget && void handleStopCounter(stopTarget), children: [
            /* @__PURE__ */ jsx(StopCircle, { className: "mr-2 h-4 w-4" }),
            "Detener"
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  HarvestsPage as component
};
