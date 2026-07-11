import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Package, FlaskConical, ClipboardList, BoxIcon, Warehouse, BarChart3, Layers, AlertTriangle, PackageCheck, Search, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button } from "./router-Rtc38bRC.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-Dt8gr3JP.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
import { format } from "date-fns";
import "class-variance-authority";
import "@tanstack/react-router";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-tabs";
async function getCategorias() {
  return apiRequest("/products/categories");
}
async function getProductos(params) {
  const qs = "";
  return apiRequest(`/products${qs}`);
}
async function createProducto(payload) {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function updateProducto(id, payload) {
  return apiRequest(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
async function deleteProducto(id) {
  return apiRequest(`/products/${id}`, { method: "DELETE" });
}
async function getLotesProducto(params) {
  const qs = "";
  return apiRequest(`/product-batches${qs}`);
}
async function getProductBatchSummary() {
  return apiRequest("/product-batches/summary");
}
async function createLoteProducto(payload) {
  return apiRequest("/product-batches", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function updateLoteProducto(id, payload) {
  return apiRequest(`/product-batches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
async function descartarLote(id) {
  return apiRequest(`/product-batches/${id}`, { method: "DELETE" });
}
async function getUbicaciones() {
  return apiRequest("/stock/locations");
}
async function createUbicacion(payload) {
  return apiRequest("/stock/locations", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function updateUbicacion(id, payload) {
  return apiRequest(`/stock/locations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
async function deleteUbicacion(id) {
  return apiRequest(`/stock/locations/${id}`, { method: "DELETE" });
}
const TIPO_LABEL = {
  flor: "Flor",
  aceite: "Aceite",
  extracto: "Extracto",
  comestible: "Comestible",
  insumo: "Insumo",
  otro: "Otro"
};
const TIPO_UBICACION_LABEL = {
  deposito: "Depósito",
  freezer: "Freezer",
  heladera: "Heladera",
  sala_curado: "Sala de curado",
  armario: "Armario",
  otro: "Otro"
};
const ESTADO_LOTE_LABEL = {
  disponible: "Disponible",
  reservado: "Reservado",
  agotado: "Agotado",
  bloqueado: "Bloqueado",
  descartado: "Descartado",
  en_analisis: "En análisis"
};
const ESTADO_LOTE_CLASS = {
  disponible: "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  reservado: "border-sky-200 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  agotado: "border-slate-200 bg-slate-500/10 text-slate-600 dark:text-slate-400",
  bloqueado: "border-red-200 bg-red-500/10 text-red-700 dark:text-red-400",
  descartado: "border-slate-200 bg-slate-100/50 text-slate-400",
  en_analisis: "border-amber-200 bg-amber-500/10 text-amber-700 dark:text-amber-400"
};
function fmtDate(iso) {
  if (!iso) return "—";
  return format(new Date(iso), "dd/MM/yyyy");
}
function generateCodigo(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}
function KpiCards({
  summary
}) {
  const cards = [{
    label: "Productos activos",
    value: summary?.productosActivos ?? "—",
    hint: "Registrados en el sistema",
    Icon: Package,
    accent: "bg-sky-500",
    panel: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-400"
  }, {
    label: "Stock disponible",
    value: summary ? `${summary.stockTotalDisponible.toFixed(0)} u` : "—",
    hint: "Suma de lotes disponibles",
    Icon: BarChart3,
    accent: "bg-emerald-500",
    panel: "bg-emerald-500/10",
    iconClass: "text-emerald-600 dark:text-emerald-400"
  }, {
    label: "Lotes disponibles",
    value: summary?.lotesDisponibles ?? "—",
    hint: `${summary?.totalLotes ?? 0} en total`,
    Icon: Layers,
    accent: "bg-teal-500",
    panel: "bg-teal-500/10",
    iconClass: "text-teal-600 dark:text-teal-400"
  }, {
    label: "Bloqueados / análisis",
    value: summary?.lotesBloqueadosAnalisis ?? "—",
    hint: summary?.lotesBloqueadosAnalisis ? "Requieren atención" : "Sin alertas",
    Icon: AlertTriangle,
    accent: "bg-amber-500",
    panel: "bg-amber-500/10",
    iconClass: "text-amber-600 dark:text-amber-400"
  }, {
    label: "Próximos a vencer",
    value: summary?.proximosVencimientos ?? "—",
    hint: "Vencen en los próximos 30 días",
    Icon: PackageCheck,
    accent: "bg-violet-500",
    panel: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-400"
  }];
  return /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", children: cards.map(({
    label,
    value,
    hint,
    Icon,
    accent,
    panel,
    iconClass
  }) => /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-lg ${panel} px-5 py-4`, children: [
    /* @__PURE__ */ jsx("span", { className: `absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-r-full ${accent}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: label }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-mono text-3xl font-semibold leading-none text-foreground", children: value }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: hint })
      ] }),
      /* @__PURE__ */ jsx(Icon, { className: `mt-1 h-5 w-5 shrink-0 ${iconClass}` })
    ] })
  ] }, label)) }) });
}
function TabProductos({
  productos,
  categorias,
  onRefresh,
  config
}) {
  const {
    tiposPermitidos,
    tipoDefault,
    codigoPrefix,
    labelNuevo,
    labelEntidad,
    mostrarSelectorTipo = true,
    mostrarTrazabilidad = true,
    requiereLoteDefault = false,
    requiereTrazabilidadDefault = false,
    unidadDefault = "gramos"
  } = config;
  const emptyForm = {
    codigoProducto: "",
    nombre: "",
    tipoProducto: tipoDefault,
    unidadMedida: unidadDefault,
    categoriaProductoId: "",
    descripcion: "",
    requiereLote: requiereLoteDefault,
    requiereTrazabilidad: requiereTrazabilidadDefault,
    estado: "activo"
  };
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return productos.filter((p) => tiposPermitidos.includes(p.tipoProducto)).filter((p) => p.nombre.toLowerCase().includes(q) || p.codigoProducto.toLowerCase().includes(q) || (p.categoria?.nombre.toLowerCase().includes(q) ?? false));
  }, [productos, search, tiposPermitidos]);
  function openCreate() {
    setEditTarget(null);
    setForm({
      ...emptyForm,
      codigoProducto: generateCodigo(codigoPrefix)
    });
    setDialogOpen(true);
  }
  function openEdit(p) {
    setEditTarget(p);
    setForm({
      codigoProducto: p.codigoProducto,
      nombre: p.nombre,
      tipoProducto: p.tipoProducto,
      unidadMedida: p.unidadMedida,
      categoriaProductoId: p.categoriaProductoId ? String(p.categoriaProductoId) : "",
      descripcion: p.descripcion ?? "",
      requiereLote: p.requiereLote,
      requiereTrazabilidad: p.requiereTrazabilidad,
      estado: p.estado
    });
    setDialogOpen(true);
  }
  async function handleSave() {
    if (!form.nombre.trim() || !form.codigoProducto.trim()) {
      toast.error("Nombre y código son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        codigoProducto: form.codigoProducto,
        nombre: form.nombre,
        tipoProducto: form.tipoProducto,
        unidadMedida: form.unidadMedida,
        categoriaProductoId: form.categoriaProductoId ? Number(form.categoriaProductoId) : null,
        descripcion: form.descripcion || null,
        requiereLote: mostrarTrazabilidad ? form.requiereLote : false,
        requiereTrazabilidad: mostrarTrazabilidad ? form.requiereTrazabilidad : false,
        estado: form.estado
      };
      if (editTarget) {
        await updateProducto(editTarget.id, payload);
        toast.success(`${labelEntidad.charAt(0).toUpperCase() + labelEntidad.slice(1)} actualizado`);
      } else {
        await createProducto(payload);
        toast.success(`${labelEntidad.charAt(0).toUpperCase() + labelEntidad.slice(1)} creado`);
      }
      setDialogOpen(false);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : `No se pudo guardar el ${labelEntidad}.`);
    } finally {
      setSaving(false);
    }
  }
  async function handleInactivate(p) {
    try {
      await deleteProducto(p.id);
      toast.success(`${p.nombre} ${p.estado === "activo" ? "inactivado" : "eliminado"}`);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : `No se pudo inactivar el ${labelEntidad}.`);
    }
  }
  const colSpan = mostrarSelectorTipo ? 7 : 6;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-xs flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { placeholder: `Buscar ${labelEntidad}s…`, value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: openCreate, className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        labelNuevo
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Código" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
        mostrarSelectorTipo && /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Unidad" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Categoría" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-24 text-right", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, { colSpan, className: "py-12 text-center text-muted-foreground", children: [
        "No hay ",
        labelEntidad,
        "s",
        search ? " que coincidan con la búsqueda" : " registrados",
        "."
      ] }) }) : filtered.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: p.codigoProducto }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: p.nombre }),
        mostrarSelectorTipo && /* @__PURE__ */ jsx(TableCell, { children: TIPO_LABEL[p.tipoProducto] }),
        /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: p.unidadMedida }),
        /* @__PURE__ */ jsx(TableCell, { children: p.categoria?.nombre ?? "—" }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: p.estado === "activo" ? "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-slate-200 bg-slate-100/50 text-slate-400", children: p.estado === "activo" ? "Activo" : "Inactivo" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => openEdit(p), children: [
              /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
              "Editar"
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => handleInactivate(p), children: [
              /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
              p.estado === "activo" ? "Inactivar" : "Eliminar"
            ] })
          ] })
        ] }) })
      ] }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editTarget ? `Editar ${labelEntidad}` : labelNuevo }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Código" }),
            /* @__PURE__ */ jsx(Input, { value: form.codigoProducto, onChange: (e) => setForm((f) => ({
              ...f,
              codigoProducto: e.target.value
            })), disabled: !!editTarget })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Nombre *" }),
            /* @__PURE__ */ jsx(Input, { value: form.nombre, onChange: (e) => setForm((f) => ({
              ...f,
              nombre: e.target.value
            })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          mostrarSelectorTipo && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
            /* @__PURE__ */ jsxs(Select, { value: form.tipoProducto, onValueChange: (v) => setForm((f) => ({
              ...f,
              tipoProducto: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: tiposPermitidos.map((t) => /* @__PURE__ */ jsx(SelectItem, { value: t, children: TIPO_LABEL[t] }, t)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Unidad de medida" }),
            /* @__PURE__ */ jsxs(Select, { value: form.unidadMedida, onValueChange: (v) => setForm((f) => ({
              ...f,
              unidadMedida: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "gramos", children: "Gramos" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "mililitros", children: "Mililitros" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "unidades", children: "Unidades" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Categoría" }),
            /* @__PURE__ */ jsxs(Select, { value: form.categoriaProductoId || "_none", onValueChange: (v) => setForm((f) => ({
              ...f,
              categoriaProductoId: v === "_none" ? "" : v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sin categoría" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "_none", children: "Sin categoría" }),
                categorias.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: String(c.id), children: c.nombre }, c.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Estado" }),
            /* @__PURE__ */ jsxs(Select, { value: form.estado, onValueChange: (v) => setForm((f) => ({
              ...f,
              estado: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "activo", children: "Activo" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "inactivo", children: "Inactivo" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Descripción" }),
          /* @__PURE__ */ jsx(Textarea, { value: form.descripcion, onChange: (e) => setForm((f) => ({
            ...f,
            descripcion: e.target.value
          })), rows: 2 })
        ] }),
        mostrarTrazabilidad && /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.requiereLote, onChange: (e) => setForm((f) => ({
              ...f,
              requiereLote: e.target.checked
            })), className: "rounded" }),
            "Requiere lote"
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.requiereTrazabilidad, onChange: (e) => setForm((f) => ({
              ...f,
              requiereTrazabilidad: e.target.checked
            })), className: "rounded" }),
            "Requiere trazabilidad"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: saving, children: saving ? "Guardando…" : editTarget ? "Guardar cambios" : labelNuevo })
      ] })
    ] }) })
  ] });
}
const EMPTY_LOTE_FORM = {
  codigoLoteProducto: "",
  productoId: "",
  ubicacionStockId: "",
  cantidadInicial: "0",
  cantidadDisponible: "0",
  unidadMedida: "gramos",
  estado: "disponible",
  fechaIngreso: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  fechaVencimiento: "",
  observaciones: ""
};
function TabLotes({
  lotes,
  productos,
  ubicaciones,
  onRefresh
}) {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_LOTE_FORM);
  const [saving, setSaving] = useState(false);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return lotes.filter((l) => {
      if (filterEstado !== "todos" && l.estado !== filterEstado) return false;
      return l.codigoLoteProducto.toLowerCase().includes(q) || (l.producto?.nombre.toLowerCase().includes(q) ?? false) || (l.ubicacionStock?.nombre.toLowerCase().includes(q) ?? false);
    });
  }, [lotes, search, filterEstado]);
  function openCreate() {
    setEditTarget(null);
    setForm({
      ...EMPTY_LOTE_FORM,
      codigoLoteProducto: generateCodigo("PRODLOT")
    });
    setDialogOpen(true);
  }
  function openEdit(l) {
    setEditTarget(l);
    setForm({
      codigoLoteProducto: l.codigoLoteProducto,
      productoId: String(l.productoId),
      ubicacionStockId: l.ubicacionStockId ? String(l.ubicacionStockId) : "",
      cantidadInicial: String(l.cantidadInicial),
      cantidadDisponible: String(l.cantidadDisponible),
      unidadMedida: l.unidadMedida,
      estado: l.estado,
      fechaIngreso: l.fechaIngreso.slice(0, 10),
      fechaVencimiento: l.fechaVencimiento?.slice(0, 10) ?? "",
      observaciones: l.observaciones ?? ""
    });
    setDialogOpen(true);
  }
  async function handleSave() {
    if (!form.productoId) {
      toast.error("Seleccioná un producto.");
      return;
    }
    const cantInicial = parseFloat(form.cantidadInicial);
    const cantDisponible = parseFloat(form.cantidadDisponible);
    if (isNaN(cantInicial) || isNaN(cantDisponible)) {
      toast.error("Las cantidades deben ser números.");
      return;
    }
    if (cantDisponible > cantInicial) {
      toast.error("La cantidad disponible no puede superar la inicial.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        codigoLoteProducto: form.codigoLoteProducto,
        productoId: Number(form.productoId),
        ubicacionStockId: form.ubicacionStockId ? Number(form.ubicacionStockId) : null,
        cantidadInicial: cantInicial,
        cantidadDisponible: cantDisponible,
        unidadMedida: form.unidadMedida,
        estado: form.estado,
        fechaIngreso: form.fechaIngreso || void 0,
        fechaVencimiento: form.fechaVencimiento || null,
        observaciones: form.observaciones || null
      };
      if (editTarget) {
        await updateLoteProducto(editTarget.id, payload);
        toast.success("Lote actualizado");
      } else {
        await createLoteProducto(payload);
        toast.success("Lote creado");
      }
      setDialogOpen(false);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar el lote.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDescartar(l) {
    try {
      await descartarLote(l.id);
      toast.success(`Lote ${l.codigoLoteProducto} descartado`);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo descartar el lote.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative max-w-xs", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(Input, { placeholder: "Buscar lotes…", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 w-52" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: filterEstado, onValueChange: (v) => setFilterEstado(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Estado" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "todos", children: "Todos los estados" }),
            Object.keys(ESTADO_LOTE_LABEL).map((e) => /* @__PURE__ */ jsx(SelectItem, { value: e, children: ESTADO_LOTE_LABEL[e] }, e))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: openCreate, className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Nuevo lote"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Código lote" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Producto" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Disponible" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Inicial" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Ubicación" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Vencimiento" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-24 text-right", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, { colSpan: 8, className: "py-12 text-center text-muted-foreground", children: [
        "No hay lotes",
        search || filterEstado !== "todos" ? " que coincidan" : " registrados",
        "."
      ] }) }) : filtered.map((l) => /* @__PURE__ */ jsxs(TableRow, { className: l.estado === "descartado" ? "opacity-50" : void 0, children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: l.codigoLoteProducto }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: l.producto?.nombre ?? `Producto #${l.productoId}` }),
        /* @__PURE__ */ jsxs(TableCell, { children: [
          l.cantidadDisponible,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: l.unidadMedida })
        ] }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: l.cantidadInicial }),
        /* @__PURE__ */ jsx(TableCell, { children: l.ubicacionStock?.nombre ?? "—" }),
        /* @__PURE__ */ jsx(TableCell, { children: fmtDate(l.fechaVencimiento) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: ESTADO_LOTE_CLASS[l.estado], children: ESTADO_LOTE_LABEL[l.estado] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", disabled: l.estado === "descartado", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => openEdit(l), children: [
              /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
              "Editar"
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => handleDescartar(l), children: [
              /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
              "Descartar lote"
            ] })
          ] })
        ] }) })
      ] }, l.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editTarget ? "Editar lote" : "Nuevo lote de producto" }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Código lote" }),
            /* @__PURE__ */ jsx(Input, { value: form.codigoLoteProducto, onChange: (e) => setForm((f) => ({
              ...f,
              codigoLoteProducto: e.target.value
            })), disabled: !!editTarget })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Producto *" }),
            /* @__PURE__ */ jsxs(Select, { value: form.productoId || "_none", onValueChange: (v) => {
              if (v === "_none") return;
              const p = productos.find((p2) => String(p2.id) === v);
              setForm((f) => ({
                ...f,
                productoId: v,
                unidadMedida: p?.unidadMedida ?? f.unidadMedida
              }));
            }, disabled: !!editTarget, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar…" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: productos.filter((p) => p.estado === "activo").map((p) => /* @__PURE__ */ jsx(SelectItem, { value: String(p.id), children: p.nombre }, p.id)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Cant. inicial" }),
            /* @__PURE__ */ jsx(Input, { type: "number", min: "0", step: "0.001", value: form.cantidadInicial, onChange: (e) => setForm((f) => ({
              ...f,
              cantidadInicial: e.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Cant. disponible" }),
            /* @__PURE__ */ jsx(Input, { type: "number", min: "0", step: "0.001", value: form.cantidadDisponible, onChange: (e) => setForm((f) => ({
              ...f,
              cantidadDisponible: e.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Unidad" }),
            /* @__PURE__ */ jsxs(Select, { value: form.unidadMedida, onValueChange: (v) => setForm((f) => ({
              ...f,
              unidadMedida: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "gramos", children: "Gramos" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "mililitros", children: "Mililitros" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "unidades", children: "Unidades" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Ubicación" }),
            /* @__PURE__ */ jsxs(Select, { value: form.ubicacionStockId || "_none", onValueChange: (v) => setForm((f) => ({
              ...f,
              ubicacionStockId: v === "_none" ? "" : v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sin ubicación" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "_none", children: "Sin ubicación" }),
                ubicaciones.filter((u) => u.estado === "activa").map((u) => /* @__PURE__ */ jsx(SelectItem, { value: String(u.id), children: u.nombre }, u.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Estado" }),
            /* @__PURE__ */ jsxs(Select, { value: form.estado, onValueChange: (v) => setForm((f) => ({
              ...f,
              estado: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(ESTADO_LOTE_LABEL).filter((e) => e !== "descartado").map((e) => /* @__PURE__ */ jsx(SelectItem, { value: e, children: ESTADO_LOTE_LABEL[e] }, e)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Fecha ingreso" }),
            /* @__PURE__ */ jsx(DateInput, { value: form.fechaIngreso, onChange: (v) => setForm((f) => ({
              ...f,
              fechaIngreso: v
            })) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Fecha vencimiento" }),
            /* @__PURE__ */ jsx(DateInput, { value: form.fechaVencimiento, onChange: (v) => setForm((f) => ({
              ...f,
              fechaVencimiento: v
            })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Observaciones" }),
          /* @__PURE__ */ jsx(Textarea, { value: form.observaciones, onChange: (e) => setForm((f) => ({
            ...f,
            observaciones: e.target.value
          })), rows: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: saving, children: saving ? "Guardando…" : editTarget ? "Guardar cambios" : "Crear lote" })
      ] })
    ] }) })
  ] });
}
const EMPTY_UBICACION_FORM = {
  codigoUbicacion: "",
  nombre: "",
  tipo: "deposito",
  descripcion: "",
  estado: "activa"
};
function TabUbicaciones({
  ubicaciones,
  onRefresh
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_UBICACION_FORM);
  const [saving, setSaving] = useState(false);
  function openCreate() {
    setEditTarget(null);
    setForm({
      ...EMPTY_UBICACION_FORM,
      codigoUbicacion: generateCodigo("UB")
    });
    setDialogOpen(true);
  }
  function openEdit(u) {
    setEditTarget(u);
    setForm({
      codigoUbicacion: u.codigoUbicacion,
      nombre: u.nombre,
      tipo: u.tipo,
      descripcion: u.descripcion ?? "",
      estado: u.estado
    });
    setDialogOpen(true);
  }
  async function handleSave() {
    if (!form.nombre.trim() || !form.codigoUbicacion.trim()) {
      toast.error("Nombre y código son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        codigoUbicacion: form.codigoUbicacion,
        nombre: form.nombre,
        tipo: form.tipo,
        descripcion: form.descripcion || null,
        estado: form.estado
      };
      if (editTarget) {
        await updateUbicacion(editTarget.id, payload);
        toast.success("Ubicación actualizada");
      } else {
        await createUbicacion(payload);
        toast.success("Ubicación creada");
      }
      setDialogOpen(false);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar la ubicación.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(u) {
    try {
      await deleteUbicacion(u.id);
      toast.success(`${u.nombre} eliminada/inactivada`);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar la ubicación.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsxs(Button, { onClick: openCreate, className: "gap-1.5", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      "Nueva ubicación"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Código" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Descripción" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-24 text-right", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: ubicaciones.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "py-12 text-center text-muted-foreground", children: "No hay ubicaciones registradas." }) }) : ubicaciones.map((u) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: u.codigoUbicacion }),
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: u.nombre }),
        /* @__PURE__ */ jsx(TableCell, { children: TIPO_UBICACION_LABEL[u.tipo] }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: u.descripcion ?? "—" }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: u.estado === "activa" ? "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-slate-200 bg-slate-100/50 text-slate-400", children: u.estado === "activa" ? "Activa" : "Inactiva" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => openEdit(u), children: [
              /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
              "Editar"
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => handleDelete(u), children: [
              /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
              u.estado === "activa" ? "Inactivar" : "Eliminar"
            ] })
          ] })
        ] }) })
      ] }, u.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editTarget ? "Editar ubicación" : "Nueva ubicación de stock" }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Código" }),
            /* @__PURE__ */ jsx(Input, { value: form.codigoUbicacion, onChange: (e) => setForm((f) => ({
              ...f,
              codigoUbicacion: e.target.value
            })), disabled: !!editTarget })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Nombre *" }),
            /* @__PURE__ */ jsx(Input, { value: form.nombre, onChange: (e) => setForm((f) => ({
              ...f,
              nombre: e.target.value
            })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
            /* @__PURE__ */ jsxs(Select, { value: form.tipo, onValueChange: (v) => setForm((f) => ({
              ...f,
              tipo: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(TIPO_UBICACION_LABEL).map((t) => /* @__PURE__ */ jsx(SelectItem, { value: t, children: TIPO_UBICACION_LABEL[t] }, t)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { children: "Estado" }),
            /* @__PURE__ */ jsxs(Select, { value: form.estado, onValueChange: (v) => setForm((f) => ({
              ...f,
              estado: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "activa", children: "Activa" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "inactiva", children: "Inactiva" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Descripción" }),
          /* @__PURE__ */ jsx(Textarea, { value: form.descripcion, onChange: (e) => setForm((f) => ({
            ...f,
            descripcion: e.target.value
          })), rows: 2 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: saving, children: saving ? "Guardando…" : editTarget ? "Guardar cambios" : "Crear ubicación" })
      ] })
    ] }) })
  ] });
}
function CatalogPage() {
  const [summary, setSummary] = useState(null);
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, prodRes, lotesRes, ubRes, catRes] = await Promise.all([getProductBatchSummary(), getProductos(), getLotesProducto(), getUbicaciones(), getCategorias()]);
      setSummary(sumRes);
      setProductos(prodRes);
      setLotes(lotesRes);
      setUbicaciones(ubRes);
      setCategorias(catRes);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudieron cargar los datos de productos.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void loadAll();
  }, [loadAll]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Productos · Stock" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Control de productos, lotes y ubicaciones de stock." })
      ] }),
      loading && /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Cargando…" })
    ] }),
    /* @__PURE__ */ jsx(KpiCards, { summary }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "productos", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "mb-2", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "productos", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
          "Productos"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "insumos", className: "gap-2", children: [
          /* @__PURE__ */ jsx(FlaskConical, { className: "h-4 w-4" }),
          "Insumos"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "inventario", className: "gap-2", children: [
          /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4" }),
          "Inventario"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "lotes", className: "gap-2", children: [
          /* @__PURE__ */ jsx(BoxIcon, { className: "h-4 w-4" }),
          "Lotes"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "ubicaciones", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Warehouse, { className: "h-4 w-4" }),
          "Ubicaciones"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "productos", children: /* @__PURE__ */ jsx(TabProductos, { productos, categorias, onRefresh: loadAll, config: {
        tiposPermitidos: ["flor", "aceite", "extracto", "comestible"],
        tipoDefault: "flor",
        codigoPrefix: "PROD",
        labelNuevo: "Nuevo producto",
        labelEntidad: "producto",
        mostrarSelectorTipo: true,
        mostrarTrazabilidad: true,
        requiereLoteDefault: true,
        requiereTrazabilidadDefault: true,
        unidadDefault: "gramos"
      } }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "insumos", children: /* @__PURE__ */ jsx(TabProductos, { productos, categorias, onRefresh: loadAll, config: {
        tiposPermitidos: ["insumo"],
        tipoDefault: "insumo",
        codigoPrefix: "INS",
        labelNuevo: "Nuevo insumo",
        labelEntidad: "insumo",
        mostrarSelectorTipo: false,
        mostrarTrazabilidad: true,
        requiereLoteDefault: false,
        requiereTrazabilidadDefault: false,
        unidadDefault: "unidades"
      } }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "inventario", children: /* @__PURE__ */ jsx(TabProductos, { productos, categorias, onRefresh: loadAll, config: {
        tiposPermitidos: ["otro"],
        tipoDefault: "otro",
        codigoPrefix: "INV",
        labelNuevo: "Nuevo artículo",
        labelEntidad: "artículo",
        mostrarSelectorTipo: false,
        mostrarTrazabilidad: false,
        requiereLoteDefault: false,
        requiereTrazabilidadDefault: false,
        unidadDefault: "unidades"
      } }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "lotes", children: /* @__PURE__ */ jsx(TabLotes, { lotes, productos, ubicaciones, onRefresh: loadAll }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "ubicaciones", children: /* @__PURE__ */ jsx(TabUbicaciones, { ubicaciones, onRefresh: loadAll }) })
    ] })
  ] });
}
export {
  CatalogPage as component
};
