import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Landmark, Plus, AlertCircle, FileText, TrendingUp, TrendingDown, Users, Search, Filter, Calendar, X, MoreVertical, Eye, Download, FileMinus2, FilePlus2, CheckCircle2, Trash2, Receipt, EyeOff, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, a as CardContent } from "./router-Rtc38bRC.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
import "class-variance-authority";
import "@tanstack/react-router";
import "date-fns";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-dialog";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const MOCK_MEMBERS = [];
const MOCK_INVOICES = [];
function dateOnly(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : void 0;
}
function mapMember(member) {
  return {
    id: String(member.id),
    codigoSocio: member.codigoSocio,
    nombreCompleto: `${member.nombre} ${member.apellido}`.trim(),
    dni: member.dni ?? void 0,
    direccion: member.direccion ?? void 0
  };
}
function mapInvoice(invoice) {
  return {
    id: String(invoice.id),
    codigoComprobante: invoice.codigoComprobante,
    socioId: invoice.socioId ? String(invoice.socioId) : void 0,
    tipoComprobante: invoice.tipoComprobante,
    puntoVenta: invoice.puntoVenta ?? void 0,
    numeroComprobante: invoice.numeroComprobante ?? void 0,
    fechaEmision: dateOnly(invoice.fechaEmision) ?? "",
    fechaVencimientoPago: dateOnly(invoice.fechaVencimientoPago),
    concepto: invoice.concepto,
    condicionIva: invoice.condicionIva,
    cuitDni: invoice.cuitDni ?? void 0,
    razonSocial: invoice.razonSocial ?? void 0,
    domicilio: invoice.domicilio ?? void 0,
    subtotal: invoice.subtotal,
    iva: invoice.iva,
    total: invoice.total,
    moneda: invoice.moneda,
    estadoArca: invoice.estadoArca,
    estadoCobro: invoice.estadoCobro,
    cae: invoice.cae ?? void 0,
    vencimientoCae: dateOnly(invoice.vencimientoCae),
    pdfUrl: invoice.pdfUrl ?? void 0,
    observaciones: invoice.observaciones ?? void 0,
    comprobanteRelacionadoId: invoice.comprobanteRelacionadoId ? String(invoice.comprobanteRelacionadoId) : void 0,
    socio: invoice.socio ? mapMember(invoice.socio) : void 0,
    items: (invoice.items ?? []).map((item) => ({
      id: String(item.id),
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal
    })),
    pagos: (invoice.pagos ?? []).map((payment) => ({
      id: String(payment.id),
      fechaPago: dateOnly(payment.fechaPago) ?? "",
      monto: payment.monto,
      medioPago: payment.medioPago,
      referencia: payment.referencia ?? void 0,
      observaciones: payment.observaciones ?? void 0
    }))
  };
}
async function getBillingMembers() {
  return withMockFallback(
    async () => (await apiRequest("/members")).map(mapMember),
    () => MOCK_MEMBERS
  );
}
async function getBillingInvoices() {
  return withMockFallback(
    async () => (await apiRequest("/billing/invoices")).map(mapInvoice),
    () => MOCK_INVOICES
  );
}
async function createBillingInvoice(payload) {
  return mapInvoice(
    await apiRequest("/billing/invoices", {
      method: "POST",
      body: JSON.stringify(payload)
    })
  );
}
async function markBillingInvoicePaid(id) {
  return mapInvoice(
    await apiRequest(`/billing/invoices/${id}/mark-paid`, {
      method: "POST",
      body: JSON.stringify({ medio_pago: "efectivo" })
    })
  );
}
async function createCreditNote(id) {
  return mapInvoice(
    await apiRequest(`/billing/invoices/${id}/credit-note`, {
      method: "POST",
      body: JSON.stringify({})
    })
  );
}
async function createDebitNote(id) {
  return mapInvoice(
    await apiRequest(`/billing/invoices/${id}/debit-note`, {
      method: "POST",
      body: JSON.stringify({})
    })
  );
}
const TYPE_LABEL = {
  factura_c: "Recibo C",
  nota_credito_c: "Nota de credito C",
  nota_debito_c: "Nota de debito C",
  recibo_interno: "Recibo interno"
};
const ARCA_LABEL = {
  aprobado: "Aprobado",
  pendiente: "Pendiente",
  observado: "Observado",
  rechazado: "Rechazado"
};
const COBRO_LABEL = {
  pagado: "Pagado",
  impago: "Impago",
  parcial: "Parcial",
  vencido: "Vencido"
};
const ARCA_CLASS = {
  aprobado: "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pendiente: "border-sky-200 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  observado: "border-amber-200 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  rechazado: "border-red-200 bg-red-500/10 text-red-700 dark:text-red-400"
};
const COBRO_CLASS = {
  pagado: "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  impago: "border-amber-200 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  parcial: "border-violet-200 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  vencido: "border-red-200 bg-red-500/10 text-red-700 dark:text-red-400"
};
const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}
function isInPeriod(fecha, periodo) {
  const date = /* @__PURE__ */ new Date(`${fecha}T00:00:00`);
  const now = /* @__PURE__ */ new Date();
  if (periodo === "mes") return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  if (periodo === "30dias") {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 30);
    return date >= cutoff;
  }
  if (periodo === "90dias") {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 90);
    return date >= cutoff;
  }
  return date.getFullYear() === now.getFullYear();
}
function memberLabel(member) {
  return `${member.codigoSocio} · ${member.nombreCompleto}${member.dni ? ` · DNI ${member.dni}` : ""}`;
}
function formatCondicionIva(value) {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "consumidor_final" || normalized.includes("consumidor")) return "Cons F";
  const labels = {
    monotributista: "Mono",
    responsable_inscripto: "Resp Ins",
    exento: "Exento"
  };
  return labels[normalized] ?? value;
}
function compareValues(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), "es", {
    numeric: true,
    sensitivity: "base"
  });
}
function invoiceSortValue(invoice, key) {
  if (key === "fecha") return invoice.fechaEmision;
  if (key === "tipo") return TYPE_LABEL[invoice.tipoComprobante];
  if (key === "numero") return invoice.numeroComprobante ?? invoice.codigoComprobante;
  if (key === "socio") return invoice.socio?.nombreCompleto ?? invoice.razonSocial ?? "";
  if (key === "codigoSocio") return invoice.socio?.codigoSocio ?? "";
  if (key === "documento") return invoice.cuitDni ?? "";
  if (key === "condicionIva") return formatCondicionIva(invoice.condicionIva);
  if (key === "concepto") return invoice.concepto;
  if (key === "total") return invoice.total;
  if (key === "estadoArca") return ARCA_LABEL[invoice.estadoArca];
  return COBRO_LABEL[invoice.estadoCobro];
}
function formatDateForInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}
function maskDateInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
function maskedDateToIso(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return "";
  return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}
function isValidIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
function FacturacionPage() {
  const [comprobantes, setComprobantes] = useState([]);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterArca, setFilterArca] = useState("todos");
  const [filterCobro, setFilterCobro] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterPeriodo, setFilterPeriodo] = useState("mes");
  const [detailItem, setDetailItem] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sortKey, setSortKey] = useState("fecha");
  const [sortDir, setSortDir] = useState("desc");
  const [showFacturado, setShowFacturado] = useState(false);
  const [showPendiente, setShowPendiente] = useState(false);
  const [showTableTotals, setShowTableTotals] = useState(false);
  const [fechaInput, setFechaInput] = useState(formatDateForInput(today));
  const [clienteMode, setClienteMode] = useState("socio");
  const [newForm, setNewForm] = useState({
    socioId: "",
    clienteNombre: "",
    clienteDocumento: "",
    clienteDomicilio: "",
    tipo: "factura_c",
    concepto: "",
    fecha: today,
    vencimientoPago: "",
    importe: "",
    condicionIva: "consumidor_final",
    observaciones: ""
  });
  async function loadData() {
    setLoading(true);
    try {
      const [nextInvoices, nextMembers] = await Promise.all([getBillingInvoices(), getBillingMembers()]);
      setComprobantes(nextInvoices);
      setSocios(nextMembers);
      setNewForm((current) => ({
        ...current,
        socioId: current.socioId || nextMembers[0]?.id || ""
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar facturacion.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void loadData();
  }, []);
  const selectedSocio = clienteMode === "socio" ? socios.find((socio) => socio.id === newForm.socioId) : void 0;
  const isReciboC = newForm.tipo === "factura_c";
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return comprobantes.filter((c) => {
      if (filterArca !== "todos" && c.estadoArca !== filterArca) return false;
      if (filterCobro !== "todos" && c.estadoCobro !== filterCobro) return false;
      if (filterTipo !== "todos" && c.tipoComprobante !== filterTipo) return false;
      if (!isInPeriod(c.fechaEmision, filterPeriodo)) return false;
      if (!q) return true;
      const socioText = `${c.socio?.nombreCompleto ?? c.razonSocial ?? ""} ${c.socio?.codigoSocio ?? ""}`;
      return [socioText, c.cuitDni, c.numeroComprobante, c.codigoComprobante, c.cae, c.concepto].some((value) => value?.toLowerCase().includes(q));
    });
  }, [comprobantes, search, filterArca, filterCobro, filterTipo, filterPeriodo]);
  const stats = useMemo(() => {
    const inPeriod = comprobantes.filter((c) => isInPeriod(c.fechaEmision, filterPeriodo));
    const totalFacturado = inPeriod.reduce((sum, c) => sum + c.total, 0);
    const pendienteCobro = inPeriod.filter((c) => c.estadoCobro === "impago" || c.estadoCobro === "vencido" || c.estadoCobro === "parcial").reduce((sum, c) => sum + Math.abs(c.total), 0);
    const observados = inPeriod.filter((c) => c.estadoArca === "observado").length;
    const sociosSet = new Set(inPeriod.map((c) => c.socioId).filter(Boolean));
    return {
      count: inPeriod.length,
      totalFacturado,
      pendienteCobro,
      observados,
      socios: sociosSet.size
    };
  }, [comprobantes, filterPeriodo]);
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const result = compareValues(invoiceSortValue(a, sortKey), invoiceSortValue(b, sortKey));
      return sortDir === "asc" ? result : -result;
    });
  }, [filtered, sortKey, sortDir]);
  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDir(key === "fecha" ? "desc" : "asc");
  }
  function handleFechaInput(value) {
    const next = maskDateInput(value);
    setFechaInput(next);
    setNewForm((current) => ({
      ...current,
      fecha: maskedDateToIso(next)
    }));
  }
  async function handleNewSave() {
    if (clienteMode === "socio" && !selectedSocio) {
      toast.error("Selecciona un socio real.");
      return;
    }
    if (clienteMode === "otro" && !newForm.clienteNombre.trim()) {
      toast.error("Ingresa el nombre o razon social del cliente.");
      return;
    }
    if (!newForm.concepto.trim() || !newForm.importe) {
      toast.error("Completa concepto e importe.");
      return;
    }
    const importe = Number(newForm.importe);
    if (!Number.isFinite(importe) || importe <= 0) {
      toast.error("El importe debe ser mayor a 0.");
      return;
    }
    if (!isValidIsoDate(newForm.fecha)) {
      toast.error("Ingresa una fecha valida con formato dd/mm/aaaa.");
      return;
    }
    try {
      setSaving(true);
      const invoice = await createBillingInvoice({
        ...selectedSocio ? {
          socio_id: Number(selectedSocio.id)
        } : {},
        tipo_comprobante: newForm.tipo,
        punto_venta: "0001",
        fecha_emision: newForm.fecha,
        fecha_vencimiento_pago: newForm.vencimientoPago || void 0,
        concepto: newForm.concepto.trim(),
        condicion_iva: isReciboC ? "consumidor_final" : newForm.condicionIva,
        cuit_dni: clienteMode === "otro" ? newForm.clienteDocumento.trim() || void 0 : void 0,
        razon_social: clienteMode === "otro" ? newForm.clienteNombre.trim() : void 0,
        domicilio: clienteMode === "otro" ? newForm.clienteDomicilio.trim() || void 0 : void 0,
        subtotal: importe,
        iva: 0,
        total: newForm.tipo === "nota_credito_c" ? -importe : importe,
        estado_arca: "pendiente",
        estado_cobro: "impago",
        observaciones: newForm.observaciones.trim() || void 0,
        items: [{
          descripcion: newForm.concepto.trim(),
          cantidad: 1,
          precio_unitario: importe,
          subtotal: newForm.tipo === "nota_credito_c" ? -importe : importe
        }]
      });
      setComprobantes((current) => [invoice, ...current]);
      setShowNewModal(false);
      setNewForm({
        socioId: socios[0]?.id || "",
        clienteNombre: "",
        clienteDocumento: "",
        clienteDomicilio: "",
        tipo: "factura_c",
        concepto: "",
        fecha: today,
        vencimientoPago: "",
        importe: "",
        condicionIva: "consumidor_final",
        observaciones: ""
      });
      setClienteMode("socio");
      setFechaInput(formatDateForInput(today));
      toast.success("Comprobante creado en base de datos.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el comprobante.");
    } finally {
      setSaving(false);
    }
  }
  async function updateInvoice(action, message) {
    try {
      const invoice = await action();
      setComprobantes((current) => [invoice, ...current.filter((item) => item.id !== invoice.id)]);
      setDetailItem((current) => current?.id === invoice.id ? invoice : current);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo completar la accion.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-4 pb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-card px-4 py-4 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "gap-1.5 border-amber-300 bg-amber-500/10 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400", children: [
            /* @__PURE__ */ jsx(Landmark, { className: "h-3 w-3" }),
            "Administracion"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Facturacion ARCA" }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: "Generacion y seguimiento de comprobantes asociados a socios del club." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: "gap-2", onClick: () => setShowNewModal(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nuevo recibo"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5 shrink-0" }),
        "Integracion ARCA en modo simulado. Los comprobantes se guardan en base de datos, pero no se informan fiscalmente."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-5", children: [
      /* @__PURE__ */ jsx(SummaryCard, { title: "Comprobantes del mes", value: String(stats.count), description: `${stats.socios} socios facturados`, icon: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-sky-600 dark:text-sky-400" }), accent: "bg-sky-500", panel: "bg-sky-500/10" }),
      /* @__PURE__ */ jsx(SummaryCard, { title: "Facturado del mes", value: showFacturado ? formatCurrency(stats.totalFacturado) : "••••", description: "Total bruto emitido", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }), action: /* @__PURE__ */ jsx(VisibilityButton, { visible: showFacturado, label: "facturado del mes", onToggle: () => setShowFacturado((current) => !current) }), accent: "bg-emerald-500", panel: "bg-emerald-500/10" }),
      /* @__PURE__ */ jsx(SummaryCard, { title: "Pendiente de cobro", value: showPendiente ? formatCurrency(stats.pendienteCobro) : "••••", description: "Impago + parcial + vencido", icon: /* @__PURE__ */ jsx(TrendingDown, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }), action: /* @__PURE__ */ jsx(VisibilityButton, { visible: showPendiente, label: "pendiente de cobro", onToggle: () => setShowPendiente((current) => !current) }), accent: "bg-amber-500", panel: "bg-amber-500/10" }),
      /* @__PURE__ */ jsx(SummaryCard, { title: "Observados ARCA", value: String(stats.observados), description: "Requieren revision", icon: /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-red-600 dark:text-red-400" }), accent: "bg-red-500", panel: "bg-red-500/10" }),
      /* @__PURE__ */ jsx(SummaryCard, { title: "Socios facturados", value: String(stats.socios), description: "Unicos del periodo", icon: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-violet-600 dark:text-violet-400" }), accent: "bg-violet-500", panel: "bg-violet-500/10" })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative min-w-[200px] flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { className: "pl-8", placeholder: "Buscar por socio, codigo, DNI, comprobante o CAE", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
        " Filtrar:"
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: filterPeriodo, onValueChange: (v) => setFilterPeriodo(v), children: [
        /* @__PURE__ */ jsxs(SelectTrigger, { className: "w-[135px]", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "mr-1.5 h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx(SelectValue, {})
        ] }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "mes", children: "Este mes" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "30dias", children: "Ultimos 30 dias" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "90dias", children: "Ultimos 90 dias" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "anual", children: "Anio actual" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: filterArca, onValueChange: (v) => setFilterArca(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[135px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "todos", children: "ARCA · Todos" }),
          Object.entries(ARCA_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: filterCobro, onValueChange: (v) => setFilterCobro(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[135px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "todos", children: "Cobro · Todos" }),
          Object.entries(COBRO_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: filterTipo, onValueChange: (v) => setFilterTipo(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[150px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "todos", children: "Tipo · Todos" }),
          Object.entries(TYPE_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
        ] })
      ] }),
      (search || filterArca !== "todos" || filterCobro !== "todos" || filterTipo !== "todos") && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "gap-1.5 text-xs", onClick: () => {
        setSearch("");
        setFilterArca("todos");
        setFilterCobro("todos");
        setFilterTipo("todos");
      }, children: [
        /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }),
        " Limpiar"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Fecha", sortKey: "fecha", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Tipo", sortKey: "tipo", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Nro comprobante", sortKey: "numero", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Socio / Cliente", sortKey: "socio", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Codigo socio", sortKey: "codigoSocio", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "CUIT / DNI", sortKey: "documento", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Condicion IVA", sortKey: "condicionIva", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Concepto", sortKey: "concepto", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
          /* @__PURE__ */ jsx(TableHead, { className: "h-9 px-2 text-right text-xs", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsx(InvoiceSortButton, { label: "Total", sortKey: "total", activeKey: sortKey, dir: sortDir, onSort: handleSort }),
            /* @__PURE__ */ jsx(VisibilityButton, { visible: showTableTotals, label: "totales de la tabla", onToggle: () => setShowTableTotals((current) => !current) })
          ] }) }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Estado ARCA", sortKey: "estadoArca", activeKey: sortKey, dir: sortDir, onSort: handleSort, className: "text-center" }),
          /* @__PURE__ */ jsx(InvoiceSortHead, { label: "Estado cobro", sortKey: "estadoCobro", activeKey: sortKey, dir: sortDir, onSort: handleSort, className: "text-center" }),
          /* @__PURE__ */ jsx(TableHead, { className: "h-9 px-2 text-center text-xs", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 12, className: "py-12 text-center text-sm text-muted-foreground", children: "Cargando comprobantes..." }) }) : sorted.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 12, className: "py-12 text-center text-sm text-muted-foreground", children: "No hay comprobantes que coincidan con los filtros aplicados." }) }) : sorted.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap px-2 py-2 text-xs", children: c.fechaEmision }),
          /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap px-2 py-2 text-xs", children: TYPE_LABEL[c.tipoComprobante] }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2 font-mono text-xs", children: c.numeroComprobante ?? c.codigoComprobante }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: c.socio?.nombreCompleto ?? c.razonSocial ?? "-" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2 text-xs text-muted-foreground", children: c.socio?.codigoSocio ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2 font-mono text-xs", children: c.cuitDni ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2 text-xs", children: formatCondicionIva(c.condicionIva) }),
          /* @__PURE__ */ jsx(TableCell, { className: "max-w-[180px] truncate px-2 py-2 text-xs", children: c.concepto }),
          /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap px-2 py-2 text-right text-xs font-medium", children: /* @__PURE__ */ jsx("span", { className: c.total < 0 && showTableTotals ? "text-red-600 dark:text-red-400" : "", children: showTableTotals ? formatCurrency(c.total) : "••••" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `px-2 text-[11px] ${ARCA_CLASS[c.estadoArca]}`, children: ARCA_LABEL[c.estadoArca] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `px-2 text-[11px] ${COBRO_CLASS[c.estadoCobro]}`, children: COBRO_LABEL[c.estadoCobro] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => setDetailItem(c), children: [
                /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }),
                "Ver detalle"
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => toast.info("PDF real pendiente de integracion."), children: [
                /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
                "Descargar PDF"
              ] }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => void updateInvoice(() => createCreditNote(c.id), "Nota de credito generada correctamente."), children: [
                /* @__PURE__ */ jsx(FileMinus2, { className: "mr-2 h-4 w-4" }),
                "Generar nota de credito"
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => void updateInvoice(() => createDebitNote(c.id), "Nota de debito generada correctamente."), children: [
                /* @__PURE__ */ jsx(FilePlus2, { className: "mr-2 h-4 w-4" }),
                "Generar nota de debito"
              ] }),
              c.estadoCobro !== "pagado" && /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => void updateInvoice(() => markBillingInvoicePaid(c.id), "Comprobante marcado como pagado."), children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "mr-2 h-4 w-4" }),
                "Marcar como pagado"
              ] }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => toast.info("Baja fisica deshabilitada para conservar trazabilidad."), children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "Eliminar"
              ] })
            ] })
          ] }) })
        ] }, c.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "border-t px-4 py-2.5 text-xs text-muted-foreground", children: [
        filtered.length,
        " de ",
        comprobantes.length,
        " comprobantes · Datos persistidos con ARCA simulado"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(detailItem), onOpenChange: (open) => !open && setDetailItem(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4" }),
          "Detalle de comprobante"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Datos guardados en base local. CAE y estado ARCA son simulados." })
      ] }),
      detailItem && /* @__PURE__ */ jsx(InvoiceDetail, { invoice: detailItem }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDetailItem(null), children: "Cerrar" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showNewModal, onOpenChange: setShowNewModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nuevo Recibo"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "El comprobante se guarda en base de datos. No se envia a ARCA." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
        clienteMode === "socio" && !socios.length && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-300", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
          "No hay socios disponibles para facturar. Revisá que el backend esté activo y que existan socios cargados."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked: clienteMode === "socio", onCheckedChange: () => setClienteMode("socio") }),
              "Socio"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked: clienteMode === "otro", onCheckedChange: () => setClienteMode("otro") }),
              "Otro"
            ] })
          ] }),
          clienteMode === "socio" ? /* @__PURE__ */ jsxs(Select, { value: newForm.socioId, onValueChange: (v) => setNewForm({
            ...newForm,
            socioId: v
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona socio" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: socios.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s.id, children: memberLabel(s) }, s.id)) })
          ] }) : /* @__PURE__ */ jsx(Input, { value: newForm.clienteNombre, onChange: (e) => setNewForm({
            ...newForm,
            clienteNombre: e.target.value
          }), placeholder: "Nombre o razon social" })
        ] }),
        clienteMode === "otro" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "nf-doc-manual", className: "text-sm font-semibold", children: "CUIT / DNI" }),
            /* @__PURE__ */ jsx(Input, { id: "nf-doc-manual", value: newForm.clienteDocumento, onChange: (e) => setNewForm({
              ...newForm,
              clienteDocumento: e.target.value
            }), placeholder: "Opcional" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "nf-dom-manual", className: "text-sm font-semibold", children: "Domicilio" }),
            /* @__PURE__ */ jsx(Input, { id: "nf-dom-manual", value: newForm.clienteDomicilio, onChange: (e) => setNewForm({
              ...newForm,
              clienteDomicilio: e.target.value
            }), placeholder: "Opcional" })
          ] })
        ] }),
        selectedSocio && /* @__PURE__ */ jsxs("div", { className: "rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground", children: [
          "DNI/CUIT: ",
          selectedSocio.dni ?? "-",
          " · Razon social: ",
          selectedSocio.nombreCompleto,
          " · Domicilio: ",
          selectedSocio.direccion ?? "-"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Tipo" }),
            /* @__PURE__ */ jsxs(Select, { value: newForm.tipo, onValueChange: (v) => setNewForm({
              ...newForm,
              tipo: v
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(TYPE_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "nf-fecha", className: "text-sm font-semibold", children: "Fecha" }),
            /* @__PURE__ */ jsx(Input, { id: "nf-fecha", type: "text", inputMode: "numeric", maxLength: 10, placeholder: "dd/mm/aaaa", value: fechaInput, onChange: (e) => handleFechaInput(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "nf-concepto", className: "text-sm font-semibold", children: "Concepto" }),
          /* @__PURE__ */ jsx(Input, { id: "nf-concepto", value: newForm.concepto, onChange: (e) => setNewForm({
            ...newForm,
            concepto: e.target.value
          }), placeholder: "Ej: Cuota mensual socio" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `grid gap-4 ${isReciboC ? "grid-cols-1" : "grid-cols-2"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "nf-importe", className: "text-sm font-semibold", children: "Importe total ($)" }),
            /* @__PURE__ */ jsx(Input, { id: "nf-importe", type: "number", min: "1", step: "1", value: newForm.importe, onChange: (e) => setNewForm({
              ...newForm,
              importe: e.target.value
            }), placeholder: "Ej: 50000" })
          ] }),
          !isReciboC && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Condicion IVA" }),
            /* @__PURE__ */ jsxs(Select, { value: newForm.condicionIva, onValueChange: (v) => setNewForm({
              ...newForm,
              condicionIva: v
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "consumidor_final", children: "Consumidor final" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "monotributista", children: "Monotributista" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "responsable_inscripto", children: "Responsable inscripto" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "exento", children: "Exento" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "nf-obs", className: "text-sm font-semibold", children: "Observaciones" }),
          /* @__PURE__ */ jsx(Textarea, { id: "nf-obs", rows: 2, value: newForm.observaciones, onChange: (e) => setNewForm({
            ...newForm,
            observaciones: e.target.value
          }), placeholder: "Opcional" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setShowNewModal(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleNewSave, disabled: saving || clienteMode === "socio" && !socios.length, className: "gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          saving ? "Guardando..." : "Crear recibo"
        ] })
      ] })
    ] }) })
  ] });
}
function InvoiceSortHead({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  className = ""
}) {
  const justify = className.includes("text-right") ? "justify-end" : className.includes("text-center") ? "justify-center" : "";
  return /* @__PURE__ */ jsx(TableHead, { className: `h-9 select-none px-2 text-xs ${className}`, children: /* @__PURE__ */ jsx(InvoiceSortButton, { label, sortKey, activeKey, dir, onSort, className: `w-full ${justify}` }) });
}
function InvoiceSortButton({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  className = ""
}) {
  const active = activeKey === sortKey;
  const Icon = active ? dir === "asc" ? ChevronUp : ChevronDown : ChevronsUpDown;
  return /* @__PURE__ */ jsxs("button", { type: "button", className: `inline-flex items-center gap-1.5 ${className}`, onClick: () => onSort(sortKey), children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx(Icon, { className: `h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground/70"}` })
  ] });
}
function VisibilityButton({
  visible,
  label,
  onToggle
}) {
  return /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "h-7 w-7 text-muted-foreground hover:text-foreground", title: visible ? `Ocultar ${label}` : `Mostrar ${label}`, "aria-label": visible ? `Ocultar ${label}` : `Mostrar ${label}`, onClick: onToggle, children: visible ? /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) });
}
function SummaryCard({
  title,
  value,
  description,
  icon,
  action,
  accent,
  panel
}) {
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-lg ${panel} px-5 py-4`, children: [
    /* @__PURE__ */ jsx("span", { className: `absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-r-full ${accent}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: title }),
          action
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-mono text-3xl font-semibold leading-none text-foreground", children: value }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: description })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 shrink-0", children: icon })
    ] })
  ] });
}
function InvoiceDetail({
  invoice
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-md border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground", children: "Integracion ARCA simulada." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-6 gap-y-3", children: [
      /* @__PURE__ */ jsx(DetailRow, { label: "Tipo", value: TYPE_LABEL[invoice.tipoComprobante] }),
      /* @__PURE__ */ jsx(DetailRow, { label: "Nro comprobante", value: invoice.numeroComprobante ?? invoice.codigoComprobante, mono: true }),
      /* @__PURE__ */ jsx(DetailRow, { label: "Fecha emision", value: invoice.fechaEmision }),
      /* @__PURE__ */ jsx(DetailRow, { label: "Socio", value: invoice.socio?.nombreCompleto ?? invoice.razonSocial ?? "-" }),
      /* @__PURE__ */ jsx(DetailRow, { label: "Codigo socio", value: invoice.socio?.codigoSocio ?? "-" }),
      /* @__PURE__ */ jsx(DetailRow, { label: "DNI / CUIT", value: invoice.cuitDni ?? "-", mono: true }),
      /* @__PURE__ */ jsx(DetailRow, { label: "Condicion IVA", value: invoice.condicionIva }),
      /* @__PURE__ */ jsx(DetailRow, { label: "CAE simulado", value: invoice.cae ?? "-", mono: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3 space-y-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Items" }),
      invoice.items.length ? invoice.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4 text-sm", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          item.descripcion,
          " x ",
          item.cantidad
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatCurrency(item.subtotal) })
      ] }, item.id)) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sin items cargados." }),
      /* @__PURE__ */ jsxs("div", { className: "border-t pt-2 text-right font-semibold", children: [
        "Total: ",
        formatCurrency(invoice.total)
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-6 gap-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Estado ARCA" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-xs ${ARCA_CLASS[invoice.estadoArca]}`, children: ARCA_LABEL[invoice.estadoArca] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Estado cobro" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-xs ${COBRO_CLASS[invoice.estadoCobro]}`, children: COBRO_LABEL[invoice.estadoCobro] })
      ] })
    ] }),
    invoice.observaciones && /* @__PURE__ */ jsx(DetailRow, { label: "Observaciones", value: invoice.observaciones })
  ] });
}
function DetailRow({
  label,
  value,
  mono
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: `font-medium ${mono ? "font-mono text-xs" : "text-sm"}`, children: value })
  ] });
}
export {
  FacturacionPage as component
};
