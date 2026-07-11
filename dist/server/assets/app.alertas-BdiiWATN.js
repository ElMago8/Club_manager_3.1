import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Search, Bell, CheckCircle2 } from "lucide-react";
import { v as useDemo, B as Button } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { S as Sheet, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { toast } from "sonner";
import "@tanstack/react-router";
import "date-fns";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
const TYPE_LABEL = {
  zero_stock: "Sin stock",
  low_stock: "Stock bajo",
  po_reminder: "Recordatorio",
  po_overdue: "Vencido",
  request_update: "Solicitud",
  system: "Sistema"
};
const PRIORITY_BY_TYPE = {
  zero_stock: "critica",
  low_stock: "media",
  po_overdue: "critica",
  po_reminder: "media",
  request_update: "informativa",
  system: "informativa"
};
const PRIORITY_LABEL = {
  critica: "Crítica",
  media: "Media",
  informativa: "Informativa"
};
const PRIORITY_CLASS = {
  critica: "bg-red-500/10 text-red-700 border-red-200",
  media: "bg-amber-500/10 text-amber-700 border-amber-200",
  informativa: "bg-sky-500/10 text-sky-700 border-sky-200"
};
const STATUS_LABEL = {
  abierta: "Abierta",
  en_revision: "En revisión",
  resuelta: "Resuelta"
};
const STATUS_CLASS = {
  abierta: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  en_revision: "bg-amber-500/10 text-amber-700 border-amber-200",
  resuelta: "bg-muted text-muted-foreground border-border"
};
const RESPONSIBLES = ["admin.club", "op.lucia", "op.matias", "op.romina"];
function fmtDate(iso) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function daysUntil(iso) {
  return Math.floor((new Date(iso).getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
}
function AlertasPage() {
  const {
    demoStore,
    version
  } = useDemo();
  const [resolved, setResolved] = useState(/* @__PURE__ */ new Set());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const baseRows = useMemo(() => {
    if (!demoStore) return [];
    const notifications = demoStore.getNotifications();
    const items = demoStore.getItems();
    const itemMap = new Map(items.map((i) => [i.id, i]));
    return notifications.map((n, i) => {
      const entity = n.referenceId ? itemMap.get(n.referenceId)?.name ?? n.referenceId : "Sistema";
      return {
        id: n.id,
        notification: n,
        priority: PRIORITY_BY_TYPE[n.type] ?? "informativa",
        status: n.isRead ? "en_revision" : "abierta",
        responsible: RESPONSIBLES[i % RESPONSIBLES.length],
        entity
      };
    });
  }, [demoStore, version]);
  const rows = useMemo(() => baseRows.map((r) => resolved.has(r.id) ? {
    ...r,
    status: "resuelta"
  } : r), [baseRows, resolved]);
  const stats = useMemo(() => {
    if (!demoStore) return {
      abiertas: 0,
      criticas: 0,
      stockBajo: 0,
      credenciales: 0,
      docMedicos: 0
    };
    let abiertas = 0, criticas = 0;
    for (const r of rows) {
      if (r.status !== "resuelta") abiertas++;
      if (r.priority === "critica" && r.status !== "resuelta") criticas++;
    }
    const items = demoStore.getItems();
    const stockBajo = items.filter((i) => i.currentStock > 0 && i.currentStock <= i.reorderPoint).length;
    const members = demoStore.getMembers();
    const credenciales = members.filter((m) => {
      if (!m.reprocannExpirationDate) return false;
      const d = daysUntil(m.reprocannExpirationDate);
      return d >= 0 && d <= 30;
    }).length;
    const docMedicos = members.filter((m) => {
      if (!m.medicalDocumentExpirationDate) return false;
      const d = daysUntil(m.medicalDocumentExpirationDate);
      return d >= 0 && d <= 30;
    }).length;
    return {
      abiertas,
      criticas,
      stockBajo,
      credenciales,
      docMedicos
    };
  }, [rows, demoStore]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.notification.type !== typeFilter) return false;
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return r.notification.title.toLowerCase().includes(q) || r.notification.message.toLowerCase().includes(q) || r.entity.toLowerCase().includes(q);
    });
  }, [rows, search, typeFilter, priorityFilter, statusFilter]);
  const cards = [{
    label: "Alertas abiertas",
    value: stats.abiertas
  }, {
    label: "Alertas críticas",
    value: stats.criticas
  }, {
    label: "Stock bajo",
    value: stats.stockBajo
  }, {
    label: "Credenciales por vencer",
    value: stats.credenciales
  }, {
    label: "Documentos médicos por vencer",
    value: stats.docMedicos
  }];
  const markResolved = (row) => {
    setResolved((prev) => new Set(prev).add(row.id));
    toast.success(`Alerta marcada como resuelta · ${row.notification.title}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Alertas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Seguimiento de stock, cupos, documentación y eventos internos." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-5", children: cards.map((c) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: c.label }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 font-mono text-2xl font-semibold text-foreground", children: c.value })
    ] }, c.label)) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { className: "h-9 pl-8 bg-card", placeholder: "Buscar alerta", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: typeFilter, onValueChange: (v) => setTypeFilter(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 bg-card", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Tipo" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los tipos" }),
          Object.entries(TYPE_LABEL).map(([v, l]) => /* @__PURE__ */ jsx(SelectItem, { value: v, children: l }, v))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: priorityFilter, onValueChange: (v) => setPriorityFilter(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 bg-card", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Prioridad" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las prioridades" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "critica", children: "Crítica" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "media", children: "Media" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "informativa", children: "Informativa" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: (v) => setStatusFilter(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 bg-card", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Estado" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "abierta", children: "Abierta" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "en_revision", children: "En revisión" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "resuelta", children: "Resuelta" })
        ] })
      ] })
    ] }) }),
    filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card py-16 text-center", children: [
      /* @__PURE__ */ jsx(Bell, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "No hay alertas que coincidan con los filtros" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[150px]", children: "Fecha" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Prioridad" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Título" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Entidad" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Responsable" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filtered.map((r) => /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer hover:bg-muted/40", onClick: () => setSelected(r), children: [
        /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: fmtDate(r.notification.createdAt) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: TYPE_LABEL[r.notification.type] }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PRIORITY_CLASS[r.priority], children: PRIORITY_LABEL[r.priority] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: r.notification.title }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: r.entity }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[r.status], children: STATUS_LABEL[r.status] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.responsible }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
            e.stopPropagation();
            setSelected(r);
          }, children: "Ver detalle" }),
          r.status !== "resuelta" && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "gap-1 text-emerald-700 hover:text-emerald-800", onClick: (e) => {
            e.stopPropagation();
            markResolved(r);
          }, children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }),
            " Resolver"
          ] })
        ] }) })
      ] }, r.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDetailSheet, { row: selected, onClose: () => setSelected(null), onResolve: (r) => {
      markResolved(r);
      setSelected(null);
    } })
  ] });
}
function AlertDetailSheet({
  row,
  onClose,
  onResolve
}) {
  const open = row !== null;
  if (!row) {
    return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange: (o) => {
      if (!o) onClose();
    }, children: /* @__PURE__ */ jsx(SheetContent, {}) });
  }
  const n = row.notification;
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange: (o) => {
    if (!o) onClose();
  }, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-[420px] sm:max-w-[460px] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: n.title }),
      /* @__PURE__ */ jsx(SheetDescription, { children: fmtDate(n.createdAt) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PRIORITY_CLASS[row.priority], children: PRIORITY_LABEL[row.priority] }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[row.status], children: STATUS_LABEL[row.status] })
      ] }),
      /* @__PURE__ */ jsx(Row, { label: "Tipo", value: TYPE_LABEL[n.type] }),
      /* @__PURE__ */ jsx(Row, { label: "Entidad", value: row.entity }),
      /* @__PURE__ */ jsx(Row, { label: "Responsable", value: row.responsible, mono: true }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Mensaje" }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground", children: n.message })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-xs text-sky-800", children: "El envío real de avisos (email, WhatsApp) se habilitará cuando exista backend." }),
      row.status !== "resuelta" && /* @__PURE__ */ jsxs(Button, { className: "w-full gap-1.5", onClick: () => onResolve(row), children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
        " Marcar como resuelta"
      ] })
    ] })
  ] }) });
}
function Row({
  label,
  value,
  mono
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: mono ? "font-mono text-xs" : "", children: value })
  ] });
}
export {
  AlertasPage as component
};
