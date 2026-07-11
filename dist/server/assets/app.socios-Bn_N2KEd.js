import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Users, UserCheck, UserPlus, ShieldAlert, AlertTriangle, Search, CheckCircle2, XCircle, ExternalLink, UploadCloud } from "lucide-react";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { B as Button } from "./router-Rtc38bRC.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { S as Sheet, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import "class-variance-authority";
import "@radix-ui/react-checkbox";
import "@tanstack/react-router";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const BASE = "http://localhost:4000";
const STATUS_MAP = {
  activo: "active",
  pendiente: "pending",
  suspendido: "suspended",
  inactivo: "inactive"
};
const STATUS_REVERSE = {
  active: "activo",
  pending: "pendiente",
  suspended: "suspendido",
  inactive: "inactivo"
};
function latestDoc(docs, tipo) {
  return docs.filter((d) => d.tipoDocumento === tipo && d.fechaVencimiento).sort((a, b) => b.fechaVencimiento > a.fechaVencimiento ? 1 : -1)[0];
}
function mapApiDocumento(d) {
  return {
    id: String(d.id),
    socioId: String(d.socioId),
    tipoDocumento: d.tipoDocumento,
    numeroDocumento: d.numeroDocumento ?? void 0,
    fechaEmision: d.fechaEmision ? new Date(d.fechaEmision).toISOString().slice(0, 10) : void 0,
    fechaVencimiento: d.fechaVencimiento ? new Date(d.fechaVencimiento).toISOString().slice(0, 10) : void 0,
    estado: d.estado,
    archivoUrl: d.archivoUrl ?? void 0,
    nombreArchivo: d.nombreArchivo ?? void 0,
    mimeType: d.mimeType ?? void 0,
    tamanioBytes: d.tamanioBytes ?? void 0,
    subidoEn: d.subidoEn ?? void 0,
    observaciones: d.observaciones ?? void 0,
    creadoEn: d.creadoEn
  };
}
function mapApiSocio(s) {
  const docs = s.documentos ?? [];
  const reprocann = latestDoc(docs, "reprocann");
  const certMedico = latestDoc(docs, "certificado_medico");
  return {
    id: String(s.id),
    credentialCode: s.codigoSocio,
    firstName: s.nombre,
    lastName: s.apellido,
    fullName: `${s.nombre} ${s.apellido}`,
    dni: s.dni ?? void 0,
    birthDate: s.fechaNacimiento ? new Date(s.fechaNacimiento).toISOString().slice(0, 10) : void 0,
    phone: s.telefono ?? void 0,
    email: s.email ?? void 0,
    address: s.direccion ?? void 0,
    localidad: s.localidad ?? void 0,
    provincia: s.provincia ?? void 0,
    status: STATUS_MAP[s.estado] ?? "inactive",
    monthlyQuotaGrams: s.cupoMensualGramos ?? 0,
    currentMonthUsageGrams: 0,
    registrationDate: new Date(s.creadoEn).toISOString().slice(0, 10),
    reprocannExpirationDate: reprocann?.fechaVencimiento ? new Date(reprocann.fechaVencimiento).toISOString().slice(0, 10) : void 0,
    medicalDocumentExpirationDate: certMedico?.fechaVencimiento ? new Date(certMedico.fechaVencimiento).toISOString().slice(0, 10) : void 0,
    notes: s.observaciones ?? void 0,
    documents: docs.map(mapApiDocumento)
  };
}
async function apiRequest(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${res.status} en ${path}`);
  }
  return res.json();
}
async function getMembers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.estado) params.set("estado", STATUS_REVERSE[filters.estado]);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  return (await apiRequest(`/api/members${qs ? `?${qs}` : ""}`)).map(mapApiSocio);
}
async function createMember(payload) {
  return mapApiSocio(
    await apiRequest("/api/members", {
      method: "POST",
      body: JSON.stringify({ ...payload, estado: STATUS_REVERSE[payload.estado] })
    })
  );
}
async function updateMember(id, payload) {
  const body = { ...payload };
  if (payload.estado) body.estado = STATUS_REVERSE[payload.estado];
  return mapApiSocio(
    await apiRequest(`/api/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body)
    })
  );
}
async function deactivateMember(id) {
  return mapApiSocio(
    await apiRequest(`/api/members/${id}`, { method: "DELETE" })
  );
}
async function getMemberDocuments(socioId) {
  const docs = await apiRequest(`/api/members/${socioId}/documents`);
  return docs.map(mapApiDocumento);
}
async function createMemberDocument(socioId, payload, file) {
  if (file) {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v != null && v !== "") fd.append(k, String(v));
    });
    fd.append("arquivo", file);
    const res = await fetch(`${BASE}/api/members/${socioId}/documents`, { method: "POST", body: fd });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Error ${res.status}`);
    }
    return mapApiDocumento(await res.json());
  }
  return mapApiDocumento(
    await apiRequest(`/api/members/${socioId}/documents`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
  );
}
async function updateMemberDocument(docId, payload, file) {
  if (file) {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v != null && v !== "") fd.append(k, String(v));
    });
    fd.append("arquivo", file);
    const res = await fetch(`${BASE}/api/member-documents/${docId}`, { method: "PATCH", body: fd });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Error ${res.status}`);
    }
    return mapApiDocumento(await res.json());
  }
  return mapApiDocumento(
    await apiRequest(`/api/member-documents/${docId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
  );
}
async function deleteMemberDocument(docId) {
  await apiRequest(`/api/member-documents/${docId}`, { method: "DELETE" });
}
const STATUS_LABEL = {
  active: "Activo",
  pending: "Pendiente",
  suspended: "Suspendido",
  inactive: "Inactivo"
};
const STATUS_CLASS = {
  active: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  suspended: "bg-red-500/10 text-red-700 border-red-200",
  inactive: "bg-muted text-muted-foreground border-border"
};
const DOC_TYPE_LABEL = {
  credencial: "Credencial",
  dni_frente: "DNI frente",
  dni_dorso: "DNI dorso",
  reprocann: "REPROCANN",
  certificado_medico: "Cert. médico",
  autorizacion: "Autorización",
  otro: "Otro (opcional)"
};
const REQUIRED_DOC_TYPES = ["credencial", "dni_frente", "dni_dorso", "reprocann", "certificado_medico", "autorizacion"];
const ALL_DOC_TYPES = [...REQUIRED_DOC_TYPES, "otro"];
const API_BASE = "http://localhost:4000";
const DOC_STATUS_LABEL = {
  vigente: "Vigente",
  por_vencer: "Por vencer",
  vencido: "Vencido",
  pendiente: "Pendiente",
  inactivo: "Inactivo"
};
const DOC_STATUS_CLASS = {
  vigente: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  por_vencer: "bg-amber-500/10 text-amber-700 border-amber-200",
  vencido: "bg-red-500/10 text-red-700 border-red-200",
  pendiente: "bg-sky-500/10 text-sky-700 border-sky-200",
  inactivo: "bg-muted text-muted-foreground border-border"
};
function daysUntil(iso) {
  if (!iso) return null;
  return Math.floor((new Date(iso).getTime() - Date.now()) / 864e5);
}
function fmtDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
const SOLO_ARCHIVO_TYPES = /* @__PURE__ */ new Set(["dni_frente", "dni_dorso"]);
function computeDocStatus(doc) {
  if (SOLO_ARCHIVO_TYPES.has(doc.tipoDocumento)) return "vigente";
  if (doc.fechaVencimiento) {
    const days = Math.floor((new Date(doc.fechaVencimiento).getTime() - Date.now()) / 864e5);
    if (days < 0) return "vencido";
    if (days <= 30) return "por_vencer";
    return "vigente";
  }
  return doc.estado;
}
function getDocForType(docs, tipo) {
  return docs.filter((d) => d.tipoDocumento === tipo && d.estado !== "inactivo").sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())[0];
}
function reprocannSummary(member) {
  const doc = getDocForType(member.documents ?? [], "reprocann");
  if (!doc) return {
    label: "Sin documento",
    class: "bg-muted text-muted-foreground border-border"
  };
  const status = computeDocStatus(doc);
  const map = {
    vigente: {
      label: "Vigente",
      class: DOC_STATUS_CLASS.vigente
    },
    por_vencer: {
      label: "Por vencer",
      class: DOC_STATUS_CLASS.por_vencer
    },
    vencido: {
      label: "Vencido",
      class: DOC_STATUS_CLASS.vencido
    },
    pendiente: {
      label: "Pendiente",
      class: DOC_STATUS_CLASS.pendiente
    },
    inactivo: {
      label: "Sin documento",
      class: "bg-muted text-muted-foreground border-border"
    }
  };
  return map[status];
}
const EMPTY_FORM = {
  codigoSocio: "",
  nombre: "",
  apellido: "",
  dni: "",
  fechaNacimiento: "",
  telefono: "",
  email: "",
  direccion: "",
  localidad: "",
  provincia: "",
  estado: "activo",
  cupoMensualGramos: void 0,
  observaciones: ""
};
function memberToForm(m) {
  return {
    codigoSocio: m.credentialCode,
    nombre: m.firstName,
    apellido: m.lastName,
    dni: m.dni ?? "",
    fechaNacimiento: m.birthDate ?? "",
    telefono: m.phone ?? "",
    email: m.email ?? "",
    direccion: m.address ?? "",
    localidad: m.localidad ?? "",
    provincia: m.provincia ?? "",
    estado: m.status,
    cupoMensualGramos: m.monthlyQuotaGrams || void 0,
    observaciones: m.notes ?? ""
  };
}
function SociosPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [docFilter, setDocFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [formTarget, setFormTarget] = useState(null);
  const [showQuotaCol, setShowQuotaCol] = useState(false);
  useEffect(() => {
    void getMembers().then((data) => {
      setMembers(data);
      setMessage("");
    }).catch((error) => {
      const text = error instanceof Error ? error.message : "No se pudieron cargar los socios.";
      setMessage(`No se pudo conectar con socios reales: ${text}`);
      setMembers([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  const stats = useMemo(() => {
    let active = 0, pending = 0, expiring = 0, nearQuota = 0;
    for (const m of members) {
      if (m.status === "active") active++;
      if (m.status === "pending") pending++;
      const dCred = daysUntil(m.reprocannExpirationDate);
      const dMed = daysUntil(m.medicalDocumentExpirationDate);
      const min = Math.min(dCred ?? 999, dMed ?? 999);
      if (min >= 0 && min <= 30) expiring++;
      if (m.status === "active" && m.monthlyQuotaGrams > 0 && m.currentMonthUsageGrams / m.monthlyQuotaGrams >= 0.8) nearQuota++;
    }
    return {
      total: members.length,
      active,
      pending,
      expiring,
      nearQuota
    };
  }, [members]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (docFilter !== "all") {
        const summary = reprocannSummary(m);
        const key = summary.label.toLowerCase().replace(/ /g, "_");
        if (docFilter === "vigente" && key !== "vigente") return false;
        if (docFilter === "por_vencer" && key !== "por_vencer") return false;
        if (docFilter === "vencido" && key !== "vencido") return false;
      }
      if (!q) return true;
      return m.fullName.toLowerCase().includes(q) || m.credentialCode.toLowerCase().includes(q) || (m.dni ?? "").includes(q);
    });
  }, [members, search, statusFilter, docFilter]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(filtered);
  function handleSelectMember(m) {
    setSelected(m);
    setFormTarget(null);
  }
  function handleMemberSaved(saved) {
    setMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id);
      return idx === -1 ? [saved, ...prev] : prev.map((m) => m.id === saved.id ? saved : m);
    });
    setFormTarget(null);
    setSelected(saved);
  }
  function handleMemberDeleted(m) {
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
    if (selected?.id === m.id) setSelected(null);
    setFormTarget(null);
  }
  function handleDeactivate(m) {
    const updated = {
      ...m,
      status: "inactive"
    };
    setMembers((prev) => prev.map((x) => x.id === m.id ? updated : x));
    if (selected?.id === m.id) setSelected(updated);
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Socios · Pacientes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Gestión de socios, cupos y documentación" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: "gap-1.5", onClick: () => setFormTarget("new"), children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Nuevo socio"
      ] })
    ] }),
    message ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: message }) : null,
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-5", children: [{
      label: "Total de socios",
      value: stats.total,
      icon: Users,
      accent: "bg-sky-500",
      panel: "bg-sky-500/10",
      iconClass: "text-sky-600 dark:text-sky-400"
    }, {
      label: "Socios activos",
      value: stats.active,
      icon: UserCheck,
      accent: "bg-emerald-500",
      panel: "bg-emerald-500/10",
      iconClass: "text-emerald-600 dark:text-emerald-400"
    }, {
      label: "Socios pendientes",
      value: stats.pending,
      icon: UserPlus,
      accent: "bg-amber-500",
      panel: "bg-amber-500/10",
      iconClass: "text-amber-600 dark:text-amber-400"
    }, {
      label: "Doc. por vencer",
      value: stats.expiring,
      icon: ShieldAlert,
      accent: "bg-yellow-500",
      panel: "bg-yellow-500/10",
      iconClass: "text-yellow-600 dark:text-yellow-400"
    }, {
      label: "Cupos al limite",
      value: stats.nearQuota,
      icon: AlertTriangle,
      accent: "bg-red-500",
      panel: "bg-red-500/10",
      iconClass: "text-red-600 dark:text-red-400"
    }].map((card) => {
      const Icon = card.icon;
      return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-lg ${card.panel} px-5 py-4`, children: [
        /* @__PURE__ */ jsx("span", { className: `absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-r-full ${card.accent}` }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: card.label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 font-mono text-3xl font-semibold leading-none text-foreground", children: card.value })
          ] }),
          /* @__PURE__ */ jsx(Icon, { className: `mt-1 h-5 w-5 ${card.iconClass}` })
        ] })
      ] }, card.label);
    }) }) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { className: "h-9 pl-8 bg-card", placeholder: "Buscar por nombre, código o DNI", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: (v) => setStatusFilter(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 bg-card", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Estado" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Activo" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pendiente" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "suspended", children: "Suspendido" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: "Inactivo" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: docFilter, onValueChange: (v) => setDocFilter(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 bg-card", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Documentación" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Toda la documentación" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "vigente", children: "Vigente" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "por_vencer", children: "Por vencer (≤30 días)" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "vencido", children: "Vencida" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Checkbox, { id: "show-quota", checked: showQuotaCol, onCheckedChange: (v) => setShowQuotaCol(!!v) }),
      /* @__PURE__ */ jsx("label", { htmlFor: "show-quota", className: "text-sm text-muted-foreground cursor-pointer select-none", children: "Mostrar columna Cupo mensual estimado" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card py-16 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Cargando socios..." }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card py-16 text-center", children: [
      /* @__PURE__ */ jsx(Users, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "No hay socios que coincidan con los filtros" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(SortHead, { label: "Código", sortKey: "credentialCode", col: sCol, dir: sDir, onSort: sort, className: "text-center" }),
        /* @__PURE__ */ jsx(SortHead, { label: "Nombre", sortKey: "fullName", col: sCol, dir: sDir, onSort: sort, className: "text-center" }),
        /* @__PURE__ */ jsx(SortHead, { label: "DNI", sortKey: "dni", col: sCol, dir: sDir, onSort: sort, className: "text-center" }),
        /* @__PURE__ */ jsx(SortHead, { label: "Teléfono", sortKey: "phone", col: sCol, dir: sDir, onSort: sort, className: "text-center" }),
        /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort, className: "text-center" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "REPROCANN" }),
        showQuotaCol && /* @__PURE__ */ jsx(SortHead, { label: "Cupo mensual estimado", sortKey: "monthlyQuotaGrams", col: sCol, dir: sDir, onSort: sort, className: "text-center" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: sorted.map((m) => {
        const doc = reprocannSummary(m);
        return /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer hover:bg-muted/40", onClick: () => handleSelectMember(m), children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs text-center", children: m.credentialCode }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-center", children: m.fullName }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs text-muted-foreground text-center", children: m.dni ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-center", children: m.phone ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[m.status], children: STATUS_LABEL[m.status] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: doc.class, children: doc.label }) }),
          showQuotaCol && /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs text-center", children: m.monthlyQuotaGrams ? `${m.monthlyQuotaGrams} g` : "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-1", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
              e.stopPropagation();
              handleSelectMember(m);
            }, children: "Ver" }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
              e.stopPropagation();
              setFormTarget(m);
            }, children: "Editar" })
          ] }) })
        ] }, m.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(MemberFormSheet, { target: formTarget, onClose: () => setFormTarget(null), onSaved: handleMemberSaved, onDeleted: handleMemberDeleted, onError: setMessage }),
    /* @__PURE__ */ jsx(MemberDetailSheet, { member: selected, onClose: () => setSelected(null), onEdit: () => {
      if (selected) {
        const m = selected;
        setSelected(null);
        setFormTarget(m);
      }
    }, onDeactivate: handleDeactivate, onError: setMessage })
  ] });
}
function MemberFormSheet({
  target,
  onClose,
  onSaved,
  onDeleted,
  onError
}) {
  const isNew = target === "new";
  const editMember = isNew ? null : target;
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState("");
  const [pendingDocs, setPendingDocs] = useState({});
  useEffect(() => {
    if (!target) return;
    setForm(editMember ? memberToForm(editMember) : EMPTY_FORM);
    setError("");
    setDocError("");
    setDocuments([]);
    setPendingDocs({});
    if (editMember) {
      if (editMember.documents) {
        setDocuments(editMember.documents.filter((d) => d.estado !== "inactivo"));
      } else {
        setDocLoading(true);
        getMemberDocuments(editMember.id).then((docs) => setDocuments(docs.filter((d) => d.estado !== "inactivo"))).catch(() => setDocuments([])).finally(() => setDocLoading(false));
      }
    }
  }, [target]);
  const set = (key, value) => setForm((f) => ({
    ...f,
    [key]: value
  }));
  async function handleSubmit() {
    if (!form.codigoSocio.trim()) {
      setError("El código de socio es obligatorio.");
      return;
    }
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!form.apellido.trim()) {
      setError("El apellido es obligatorio.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        dni: form.dni || void 0,
        fechaNacimiento: form.fechaNacimiento || void 0,
        telefono: form.telefono || void 0,
        email: form.email || void 0,
        direccion: form.direccion || void 0,
        localidad: form.localidad || void 0,
        provincia: form.provincia || void 0,
        observaciones: form.observaciones || void 0
      };
      const saved = editMember ? await updateMember(editMember.id, payload) : await createMember(payload);
      if (isNew) {
        for (const entry of Object.values(pendingDocs)) {
          if (!entry) continue;
          try {
            await createMemberDocument(saved.id, entry.payload, entry.file);
          } catch {
          }
        }
      }
      onSaved(saved);
      onError("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar el socio.";
      setError(msg);
      onError(msg);
    } finally {
      setSaving(false);
    }
  }
  async function confirmDelete() {
    if (!editMember) return;
    setConfirmOpen(false);
    setDeleting(true);
    setError("");
    try {
      await deactivateMember(editMember.id);
      onDeleted(editMember);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el asociado.");
    } finally {
      setDeleting(false);
    }
  }
  return /* @__PURE__ */ jsx(Sheet, { open: Boolean(target), onOpenChange: (o) => {
    if (!o) onClose();
  }, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-[560px] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: isNew ? "Nuevo socio" : "Editar socio" }),
      /* @__PURE__ */ jsx(SheetDescription, { children: isNew ? "Completá los datos del nuevo socio." : `Editando ${editMember?.fullName}` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-5", children: [
      error ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive", children: error }) : null,
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Field, { label: "Código socio *", children: /* @__PURE__ */ jsx(Input, { value: form.codigoSocio, onChange: (e) => set("codigoSocio", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Estado", children: /* @__PURE__ */ jsxs(Select, { value: form.estado, onValueChange: (v) => set("estado", v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "activo", children: "Activo" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "pendiente", children: "Pendiente" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "suspendido", children: "Suspendido" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "inactivo", children: "Inactivo" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Field, { label: "Nombre *", children: /* @__PURE__ */ jsx(Input, { value: form.nombre, onChange: (e) => set("nombre", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Apellido *", children: /* @__PURE__ */ jsx(Input, { value: form.apellido, onChange: (e) => set("apellido", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "DNI", children: /* @__PURE__ */ jsx(Input, { value: form.dni ?? "", onChange: (e) => set("dni", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Fecha de nacimiento", children: /* @__PURE__ */ jsx(DateInput, { value: form.fechaNacimiento ?? "", onChange: (v) => set("fechaNacimiento", v) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Teléfono", children: /* @__PURE__ */ jsx(Input, { value: form.telefono ?? "", onChange: (e) => set("telefono", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx(Input, { type: "email", value: form.email ?? "", onChange: (e) => set("email", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Dirección", className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Input, { value: form.direccion ?? "", onChange: (e) => set("direccion", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Localidad", children: /* @__PURE__ */ jsx(Input, { value: form.localidad ?? "", onChange: (e) => set("localidad", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Provincia", children: /* @__PURE__ */ jsx(Input, { value: form.provincia ?? "", onChange: (e) => set("provincia", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Cupo mensual estimado (g)", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 0, step: 5, value: form.cupoMensualGramos ?? "", onChange: (e) => set("cupoMensualGramos", e.target.value ? Number(e.target.value) : void 0) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Observaciones", className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Textarea, { value: form.observaciones ?? "", onChange: (e) => set("observaciones", e.target.value), rows: 3 }) })
      ] }),
      /* @__PURE__ */ jsx(Button, { className: "w-full cursor-pointer", onClick: handleSubmit, disabled: saving || deleting, children: saving ? "Guardando..." : isNew ? "Crear socio" : "Guardar cambios" }),
      !isNew && editMember ? /* @__PURE__ */ jsx(Button, { className: "w-full cursor-pointer", variant: "destructive", onClick: () => setConfirmOpen(true), disabled: saving || deleting, children: deleting ? "Eliminando..." : "Eliminar asociado" }) : null,
      /* @__PURE__ */ jsx(Dialog, { open: confirmOpen, onOpenChange: setConfirmOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[400px]", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-destructive", children: "Eliminar asociado" }),
          /* @__PURE__ */ jsxs(DialogDescription, { className: "pt-1", children: [
            "Estás por eliminar a",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: editMember?.fullName }),
            ".",
            /* @__PURE__ */ jsx("br", {}),
            "Esta acción no se puede deshacer."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "cursor-pointer", onClick: () => setConfirmOpen(false), disabled: deleting, children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { variant: "destructive", className: "cursor-pointer", onClick: () => void confirmDelete(), disabled: deleting, children: deleting ? "Eliminando..." : "Sí, eliminar" })
        ] })
      ] }) }),
      isNew ? /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-5", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3", children: [
          "Documentación ",
          /* @__PURE__ */ jsx("span", { className: "normal-case font-normal text-muted-foreground", children: "(opcional)" })
        ] }),
        /* @__PURE__ */ jsx(PendingDocChecklist, { pending: pendingDocs, onChange: setPendingDocs })
      ] }) : editMember ? /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3", children: "Documentación" }),
        docError ? /* @__PURE__ */ jsx("p", { className: "mb-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive", children: docError }) : null,
        docLoading ? /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Cargando documentos..." }) : /* @__PURE__ */ jsx(DocumentChecklist, { socioId: editMember.id, documents, onDocumentsChange: setDocuments, onError: setDocError })
      ] }) : null
    ] })
  ] }) });
}
function MemberDetailSheet({
  member,
  onClose,
  onEdit,
  onDeactivate,
  onError
}) {
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  useEffect(() => {
    if (!member) {
      setDocuments([]);
      return;
    }
    setDocLoading(true);
    getMemberDocuments(member.id).then((docs) => setDocuments(docs.filter((d) => d.estado !== "inactivo"))).catch(() => setDocuments(member.documents?.filter((d) => d.estado !== "inactivo") ?? [])).finally(() => setDocLoading(false));
  }, [member]);
  async function handleDeactivate() {
    if (!member) return;
    setDeactivating(true);
    try {
      await updateMember(member.id, {
        estado: "inactive"
      });
      onDeactivate(member);
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "No se pudo inactivar el socio.");
    } finally {
      setDeactivating(false);
    }
  }
  if (!member) {
    return /* @__PURE__ */ jsx(Sheet, { open: false, onOpenChange: (o) => {
      if (!o) onClose();
    }, children: /* @__PURE__ */ jsx(SheetContent, {}) });
  }
  const usagePct = member.monthlyQuotaGrams > 0 ? Math.round(member.currentMonthUsageGrams / member.monthlyQuotaGrams * 100) : 0;
  return /* @__PURE__ */ jsx(Sheet, { open: true, onOpenChange: (o) => {
    if (!o) onClose();
  }, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-[480px] sm:max-w-[520px] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: member.fullName }),
      /* @__PURE__ */ jsx(SheetDescription, { children: member.credentialCode })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-5 text-sm", children: [
      /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Datos generales" }),
        /* @__PURE__ */ jsx(Row, { label: "Estado", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[member.status], children: STATUS_LABEL[member.status] }) }),
        /* @__PURE__ */ jsx(Row, { label: "DNI", mono: true, children: member.dni ?? "-" }),
        /* @__PURE__ */ jsx(Row, { label: "Teléfono", children: member.phone ?? "-" }),
        /* @__PURE__ */ jsx(Row, { label: "Email", children: member.email ?? "-" }),
        member.localidad ? /* @__PURE__ */ jsxs(Row, { label: "Localidad", children: [
          member.localidad,
          member.provincia ? `, ${member.provincia}` : ""
        ] }) : null,
        /* @__PURE__ */ jsx(Row, { label: "Alta", children: fmtDate(member.registrationDate) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Cupo" }),
        /* @__PURE__ */ jsx(Row, { label: "Cupo mensual estimado", mono: true, children: member.monthlyQuotaGrams ? `${member.monthlyQuotaGrams} g` : "-" }),
        /* @__PURE__ */ jsx(Row, { label: "Uso del mes", mono: true, children: `${member.currentMonthUsageGrams} g · ${usagePct}%` }),
        member.monthlyQuotaGrams > 0 ? /* @__PURE__ */ jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx("div", { className: `h-full ${usagePct >= 80 ? "bg-amber-500" : "bg-emerald-500"}`, style: {
          width: `${Math.min(100, usagePct)}%`
        } }) }) : null
      ] }),
      member.notes ? /* @__PURE__ */ jsxs("section", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Observaciones" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: member.notes })
      ] }) : null,
      /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Documentación" }),
        docLoading ? /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Cargando..." }) : /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: ALL_DOC_TYPES.map((tipo) => {
          const doc = getDocForType(documents, tipo);
          const effectiveStatus = doc ? computeDocStatus(doc) : null;
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2", children: [
            /* @__PURE__ */ jsx("span", { className: "shrink-0", children: !doc ? /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-4 rounded-full border-2 border-muted-foreground/30" }) : effectiveStatus === "vigente" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-500" }) : effectiveStatus === "vencido" ? /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4 text-red-500" }) : /* @__PURE__ */ jsx("span", { className: "inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-bold text-white", children: "!" }) }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-xs font-medium", children: DOC_TYPE_LABEL[tipo] }),
            doc ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] px-1.5 py-0 ${DOC_STATUS_CLASS[effectiveStatus]}`, children: DOC_STATUS_LABEL[effectiveStatus] }),
              doc.fechaEmision ? /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: fmtDate(doc.fechaEmision) }) : null
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "Sin cargar" }),
            doc?.archivoUrl ? /* @__PURE__ */ jsx("a", { href: `${API_BASE}${doc.archivoUrl}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground", title: doc.nombreArchivo ?? "Ver archivo", children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }) : null
          ] }, tipo);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { className: "flex-1", variant: "outline", onClick: onEdit, children: "Editar socio" }),
        member.status !== "inactive" ? /* @__PURE__ */ jsx(Button, { variant: "outline", className: "text-destructive hover:text-destructive", onClick: () => void handleDeactivate(), disabled: deactivating, children: deactivating ? "..." : "Inactivar" }) : null
      ] })
    ] })
  ] }) });
}
function emptyRowForm(tipo) {
  return {
    tipoDocumento: tipo,
    fechaEmision: "",
    estado: "vigente",
    numeroDocumento: "",
    observaciones: ""
  };
}
const DOC_FIELD_CONFIG = {
  credencial: {
    soloArchivo: false,
    fechaLabel: "Fecha de Alta",
    showEstado: true,
    numLabel: "N°",
    obsLabel: null
  },
  dni_frente: {
    soloArchivo: true,
    fechaLabel: "",
    showEstado: false,
    numLabel: null,
    obsLabel: null
  },
  dni_dorso: {
    soloArchivo: true,
    fechaLabel: "",
    showEstado: false,
    numLabel: null,
    obsLabel: null
  },
  reprocann: {
    soloArchivo: false,
    fechaLabel: "Fecha de Alta",
    showEstado: true,
    numLabel: "Código Vinculación",
    obsLabel: null
  },
  certificado_medico: {
    soloArchivo: false,
    fechaLabel: "Fecha de prescripción",
    showEstado: false,
    numLabel: null,
    obsLabel: "Diagnóstico"
  },
  autorizacion: {
    soloArchivo: false,
    fechaLabel: "Fecha de Alta",
    showEstado: false,
    numLabel: null,
    obsLabel: "Descripción"
  },
  otro: {
    soloArchivo: false,
    fechaLabel: "Fecha",
    showEstado: false,
    numLabel: null,
    obsLabel: "Descripción"
  }
};
function DocumentChecklist({
  socioId,
  documents,
  onDocumentsChange,
  onError
}) {
  const [activeType, setActiveType] = useState(null);
  const [rowForm, setRowForm] = useState(emptyRowForm("credencial"));
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  function openCreate(tipo) {
    setActiveType(tipo);
    setRowForm(emptyRowForm(tipo));
    if (fileRef.current) fileRef.current.value = "";
  }
  function openEdit(doc) {
    setActiveType(doc.tipoDocumento);
    setRowForm({
      tipoDocumento: doc.tipoDocumento,
      fechaEmision: doc.fechaEmision ?? "",
      estado: computeDocStatus(doc),
      numeroDocumento: doc.numeroDocumento ?? "",
      observaciones: doc.observaciones ?? ""
    });
    if (fileRef.current) fileRef.current.value = "";
  }
  async function handleSave() {
    if (!activeType) return;
    setSaving(true);
    const existingDoc = getDocForType(documents, activeType);
    const cfg = DOC_FIELD_CONFIG[activeType];
    const payload = {
      tipoDocumento: rowForm.tipoDocumento,
      fechaEmision: rowForm.fechaEmision || void 0,
      estado: cfg.showEstado ? rowForm.estado : "vigente",
      numeroDocumento: rowForm.numeroDocumento || void 0,
      observaciones: rowForm.observaciones || void 0
    };
    try {
      let saved;
      if (existingDoc) {
        saved = await updateMemberDocument(existingDoc.id, payload, rowForm.file);
        onDocumentsChange(documents.map((d) => d.id === saved.id ? saved : d));
      } else {
        saved = await createMemberDocument(socioId, payload, rowForm.file);
        onDocumentsChange([...documents, saved]);
      }
      setActiveType(null);
      onError("");
    } catch (err) {
      onError(err instanceof Error ? err.message : "No se pudo guardar el documento.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(doc) {
    try {
      await deleteMemberDocument(doc.id);
      onDocumentsChange(documents.filter((d) => d.id !== doc.id));
    } catch (err) {
      onError(err instanceof Error ? err.message : "No se pudo eliminar el documento.");
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: ALL_DOC_TYPES.map((tipo) => {
    const doc = getDocForType(documents, tipo);
    const effectiveStatus = doc ? computeDocStatus(doc) : null;
    const isEditing = activeType === tipo;
    return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2", children: [
        /* @__PURE__ */ jsx("span", { className: "shrink-0", children: !doc ? /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-4 rounded-full border-2 border-muted-foreground/30" }) : effectiveStatus === "vigente" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-500" }) : effectiveStatus === "vencido" ? /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4 text-red-500" }) : /* @__PURE__ */ jsx("span", { className: "inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-bold text-white", children: "!" }) }),
        /* @__PURE__ */ jsx("span", { className: "flex-1 text-xs font-medium", children: DOC_TYPE_LABEL[tipo] }),
        doc ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] px-1.5 py-0 ${DOC_STATUS_CLASS[effectiveStatus]}`, children: DOC_STATUS_LABEL[effectiveStatus] }),
          doc.fechaVencimiento ? /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline", children: [
            "Vence ",
            fmtDate(doc.fechaVencimiento)
          ] }) : null
        ] }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "Sin cargar" }),
        doc?.archivoUrl ? /* @__PURE__ */ jsx("a", { href: `${API_BASE}${doc.archivoUrl}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground", title: doc.nombreArchivo ?? "Ver archivo", children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }) : null,
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-6 px-2 text-[11px] shrink-0", onClick: () => {
          if (isEditing) {
            setActiveType(null);
            return;
          }
          doc ? openEdit(doc) : openCreate(tipo);
        }, children: isEditing ? "Cancelar" : doc ? "Editar" : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(UploadCloud, { className: "mr-1 h-3 w-3" }),
          "Cargar"
        ] }) })
      ] }),
      isEditing ? /* @__PURE__ */ jsxs("div", { className: "border-t border-border bg-muted/30 px-3 py-3 space-y-2.5", children: [
        (() => {
          const cfg = DOC_FIELD_CONFIG[tipo];
          if (cfg.soloArchivo) {
            return /* @__PURE__ */ jsxs(Field, { label: doc?.archivoUrl ? "Reemplazar archivo (PDF, JPG, PNG)" : "Adjuntar archivo (PDF, JPG, PNG)", children: [
              /* @__PURE__ */ jsx("input", { ref: tipo === activeType ? fileRef : void 0, type: "file", accept: ".pdf,.jpg,.jpeg,.png,.webp", className: "block w-full text-xs text-muted-foreground file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium", onChange: (e) => setRowForm((f) => ({
                ...f,
                file: e.target.files?.[0]
              })) }),
              doc?.nombreArchivo ? /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                "Actual: ",
                doc.nombreArchivo
              ] }) : null
            ] });
          }
          const hasNum = cfg.numLabel !== null;
          const hasObs = cfg.obsLabel !== null;
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: `grid gap-2 ${cfg.showEstado && hasNum ? "grid-cols-3" : cfg.showEstado || hasNum ? "grid-cols-2" : "grid-cols-1"}`, children: [
              /* @__PURE__ */ jsx(Field, { label: cfg.fechaLabel, children: /* @__PURE__ */ jsx(DateInput, { className: "h-7 text-xs", value: rowForm.fechaEmision, onChange: (v) => setRowForm((f) => ({
                ...f,
                fechaEmision: v
              })) }) }),
              cfg.showEstado && /* @__PURE__ */ jsx(Field, { label: "Estado", children: /* @__PURE__ */ jsxs(Select, { value: rowForm.estado, onValueChange: (v) => setRowForm((f) => ({
                ...f,
                estado: v
              })), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "h-7 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "vigente", children: "Vigente" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "por_vencer", children: "Por vencer" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "pendiente", children: "Pendiente" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "vencido", children: "Vencido" })
                ] })
              ] }) }),
              hasNum && /* @__PURE__ */ jsx(Field, { label: cfg.numLabel, children: /* @__PURE__ */ jsx(Input, { className: "h-7 text-xs", value: rowForm.numeroDocumento, onChange: (e) => setRowForm((f) => ({
                ...f,
                numeroDocumento: e.target.value
              })), placeholder: "Opcional" }) })
            ] }),
            hasObs && /* @__PURE__ */ jsx(Field, { label: cfg.obsLabel, children: /* @__PURE__ */ jsx("textarea", { className: "w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs min-h-[72px] resize-y focus:outline-none focus:ring-1 focus:ring-ring", value: rowForm.observaciones, onChange: (e) => setRowForm((f) => ({
              ...f,
              observaciones: e.target.value
            })), placeholder: "Opcional" }) }),
            /* @__PURE__ */ jsxs(Field, { label: doc?.archivoUrl ? "Reemplazar archivo (PDF, JPG, PNG)" : "Adjuntar archivo (PDF, JPG, PNG)", children: [
              /* @__PURE__ */ jsx("input", { ref: tipo === activeType ? fileRef : void 0, type: "file", accept: ".pdf,.jpg,.jpeg,.png,.webp", className: "block w-full text-xs text-muted-foreground file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium", onChange: (e) => setRowForm((f) => ({
                ...f,
                file: e.target.files?.[0]
              })) }),
              doc?.nombreArchivo ? /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                "Actual: ",
                doc.nombreArchivo
              ] }) : null
            ] })
          ] });
        })(),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", className: "flex-1 h-7 text-xs", onClick: () => void handleSave(), disabled: saving, children: saving ? "Guardando..." : "Guardar" }),
          doc ? /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs text-destructive hover:text-destructive", onClick: () => void handleDelete(doc), disabled: saving, children: "Quitar" }) : null
        ] })
      ] }) : null
    ] }, tipo);
  }) });
}
function PendingDocChecklist({
  pending,
  onChange
}) {
  const [activeType, setActiveType] = useState(null);
  const [rowForm, setRowForm] = useState(emptyRowForm("credencial"));
  const fileRef = useRef(null);
  function openCreate(tipo) {
    setActiveType(tipo);
    setRowForm(emptyRowForm(tipo));
    if (fileRef.current) fileRef.current.value = "";
  }
  function handleSave() {
    if (!activeType) return;
    const cfg = DOC_FIELD_CONFIG[activeType];
    const entry = {
      payload: {
        tipoDocumento: rowForm.tipoDocumento,
        fechaEmision: rowForm.fechaEmision || void 0,
        estado: cfg.showEstado ? rowForm.estado : "vigente",
        numeroDocumento: rowForm.numeroDocumento || void 0,
        observaciones: rowForm.observaciones || void 0
      },
      file: rowForm.file
    };
    onChange({
      ...pending,
      [activeType]: entry
    });
    setActiveType(null);
  }
  function handleRemove(tipo) {
    const next = {
      ...pending
    };
    delete next[tipo];
    onChange(next);
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: ALL_DOC_TYPES.map((tipo) => {
    const entry = pending[tipo];
    const isEditing = activeType === tipo;
    const cfg = DOC_FIELD_CONFIG[tipo];
    return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2", children: [
        /* @__PURE__ */ jsx("span", { className: "shrink-0", children: entry ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ jsx("span", { className: "inline-block h-4 w-4 rounded-full border-2 border-muted-foreground/30" }) }),
        /* @__PURE__ */ jsx("span", { className: "flex-1 text-xs font-medium", children: DOC_TYPE_LABEL[tipo] }),
        entry?.file ? /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground truncate max-w-[120px]", children: entry.file.name }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "Sin cargar" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-6 px-2 text-[11px] shrink-0", onClick: () => {
          if (isEditing) {
            setActiveType(null);
          } else {
            openCreate(tipo);
          }
        }, children: isEditing ? "Cancelar" : entry ? "Editar" : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(UploadCloud, { className: "mr-1 h-3 w-3" }),
          "Cargar"
        ] }) })
      ] }),
      isEditing && /* @__PURE__ */ jsxs("div", { className: "border-t border-border bg-muted/30 px-3 py-3 space-y-2.5", children: [
        cfg.soloArchivo ? /* @__PURE__ */ jsx(Field, { label: "Adjuntar archivo (PDF, JPG, PNG)", children: /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: ".pdf,.jpg,.jpeg,.png,.webp", className: "block w-full text-xs text-muted-foreground file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium", onChange: (e) => setRowForm((f) => ({
          ...f,
          file: e.target.files?.[0]
        })) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: `grid gap-2 ${cfg.showEstado && cfg.numLabel ? "grid-cols-3" : cfg.showEstado || cfg.numLabel ? "grid-cols-2" : "grid-cols-1"}`, children: [
            /* @__PURE__ */ jsx(Field, { label: cfg.fechaLabel, children: /* @__PURE__ */ jsx(DateInput, { className: "h-7 text-xs", value: rowForm.fechaEmision, onChange: (v) => setRowForm((f) => ({
              ...f,
              fechaEmision: v
            })) }) }),
            cfg.showEstado && /* @__PURE__ */ jsx(Field, { label: "Estado", children: /* @__PURE__ */ jsxs(Select, { value: rowForm.estado, onValueChange: (v) => setRowForm((f) => ({
              ...f,
              estado: v
            })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-7 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "vigente", children: "Vigente" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "por_vencer", children: "Por vencer" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "pendiente", children: "Pendiente" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "vencido", children: "Vencido" })
              ] })
            ] }) }),
            cfg.numLabel && /* @__PURE__ */ jsx(Field, { label: cfg.numLabel, children: /* @__PURE__ */ jsx(Input, { className: "h-7 text-xs", value: rowForm.numeroDocumento, placeholder: "Opcional", onChange: (e) => setRowForm((f) => ({
              ...f,
              numeroDocumento: e.target.value
            })) }) })
          ] }),
          cfg.obsLabel && /* @__PURE__ */ jsx(Field, { label: cfg.obsLabel, children: /* @__PURE__ */ jsx("textarea", { className: "w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs min-h-[72px] resize-y focus:outline-none focus:ring-1 focus:ring-ring", value: rowForm.observaciones, placeholder: "Opcional", onChange: (e) => setRowForm((f) => ({
            ...f,
            observaciones: e.target.value
          })) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Adjuntar archivo (PDF, JPG, PNG)", children: /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: ".pdf,.jpg,.jpeg,.png,.webp", className: "block w-full text-xs text-muted-foreground file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium", onChange: (e) => setRowForm((f) => ({
            ...f,
            file: e.target.files?.[0]
          })) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", className: "flex-1 h-7 text-xs", onClick: handleSave, children: "En cola" }),
          entry && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs text-destructive hover:text-destructive", onClick: () => handleRemove(tipo), children: "Quitar" })
        ] })
      ] })
    ] }, tipo);
  }) });
}
function Row({
  label,
  children,
  mono
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: mono ? "font-mono text-xs" : "", children })
  ] });
}
function Field({
  label,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: `space-y-1.5 ${className ?? ""}`, children: [
    /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: label }),
    children
  ] });
}
export {
  SociosPage as component
};
