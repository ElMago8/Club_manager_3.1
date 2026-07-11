import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { v as useDemo, C as Card, a as CardContent, c as CardHeader, d as CardTitle } from "./router-Rtc38bRC.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import "@tanstack/react-router";
import "date-fns";
import "sonner";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
const LEVEL_LABEL = {
  informativo: "Informativo",
  medio: "Medio",
  critico: "Crítico"
};
const LEVEL_BADGE = {
  informativo: "bg-blue-50 text-blue-700 border-blue-200",
  medio: "bg-amber-50 text-amber-700 border-amber-200",
  critico: "bg-red-50 text-red-700 border-red-200"
};
function fmtDateTime(iso) {
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}
function isToday(iso) {
  const d = new Date(iso);
  const now = /* @__PURE__ */ new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
function AuditoriaPage() {
  const {
    demoStore,
    version
  } = useDemo();
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const entries = useMemo(() => {
    if (!demoStore) return [];
    return demoStore.getAuditEntries();
  }, [demoStore, version]);
  const users = useMemo(() => Array.from(new Set(entries.map((e) => e.user))).sort(), [entries]);
  const modules = useMemo(() => Array.from(new Set(entries.map((e) => e.module))).sort(), [entries]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (userFilter !== "all" && e.user !== userFilter) return false;
      if (moduleFilter !== "all" && e.module !== moduleFilter) return false;
      if (levelFilter !== "all" && e.level !== levelFilter) return false;
      if (q) {
        const hay = `${e.action} ${e.entityName} ${e.detail} ${e.user} ${e.module}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [entries, search, userFilter, moduleFilter, levelFilter]);
  const stats = useMemo(() => {
    const today = entries.filter((e) => isToday(e.timestamp));
    const last = entries[0];
    return {
      hoy: today.length,
      criticos: entries.filter((e) => e.level === "critico").length,
      usuariosHoy: new Set(today.map((e) => e.user)).size,
      ultima: last ? fmtDateTime(last.timestamp) : "Sin registros"
    };
  }, [entries]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Auditoría" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Registro visual de acciones importantes realizadas en el sistema." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Acciones de hoy", value: String(stats.hoy) }),
      /* @__PURE__ */ jsx(StatCard, { label: "Cambios críticos", value: String(stats.criticos) }),
      /* @__PURE__ */ jsx(StatCard, { label: "Usuarios activos hoy", value: String(stats.usuariosHoy) }),
      /* @__PURE__ */ jsx(StatCard, { label: "Última acción", value: stats.ultima, small: true })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Input, { placeholder: "Buscar acción, entidad, detalle…", value: search, onChange: (e) => setSearch(e.target.value) }),
      /* @__PURE__ */ jsxs(Select, { value: userFilter, onValueChange: setUserFilter, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Usuario" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los usuarios" }),
          users.map((u) => /* @__PURE__ */ jsx(SelectItem, { value: u, children: u }, u))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: moduleFilter, onValueChange: setModuleFilter, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Módulo" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los módulos" }),
          modules.map((m) => /* @__PURE__ */ jsx(SelectItem, { value: m, children: m }, m))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: levelFilter, onValueChange: setLevelFilter, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Nivel" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los niveles" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "informativo", children: "Informativo" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "medio", children: "Medio" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "critico", children: "Crítico" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base", children: [
        "Bitácora · ",
        filtered.length,
        " ",
        filtered.length === 1 ? "registro" : "registros"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Fecha y hora" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Usuario" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Rol" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acción" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Módulo" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Entidad" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Detalle" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nivel" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          filtered.map((e) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs whitespace-nowrap", children: fmtDateTime(e.timestamp) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: e.user }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: e.role }),
            /* @__PURE__ */ jsx(TableCell, { children: e.action }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: e.module }),
            /* @__PURE__ */ jsxs(TableCell, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: e.entityType }),
              /* @__PURE__ */ jsx("div", { className: "font-mono text-xs", children: e.entityName })
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "max-w-[280px] text-sm text-muted-foreground", children: e.detail }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: LEVEL_BADGE[e.level], children: LEVEL_LABEL[e.level] }) })
          ] }, e.id)),
          filtered.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center text-muted-foreground py-8", children: "Sin registros para los filtros aplicados." }) })
        ] })
      ] }) }) })
    ] })
  ] });
}
function StatCard({
  label,
  value,
  small
}) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: small ? "mt-1 font-mono text-sm font-medium" : "mt-1 font-mono text-2xl font-semibold", children: value })
  ] }) });
}
export {
  AuditoriaPage as component
};
