import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useLocation, Outlet, Link } from "@tanstack/react-router";
import { Plus, MoreVertical, Eye } from "lucide-react";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem } from "./dropdown-menu-CVBxbGj8.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from "./router-Rtc38bRC.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { h as getClonadores } from "./growBedService-CR9jvSKV.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
import { b as getMeasurements } from "./measurementService-L_YC84-q.js";
import "@radix-ui/react-dropdown-menu";
import "class-variance-authority";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const STATUS_LABEL = {
  vacia: "Vacío",
  activa: "Activo",
  limpieza: "Limpieza",
  mantenimiento: "Mantenimiento",
  fuera_de_uso: "Fuera de uso"
};
const STATUS_CLASS = {
  vacia: "border-muted bg-muted text-muted-foreground",
  activa: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  limpieza: "border-sky-200 bg-sky-500/10 text-sky-700",
  mantenimiento: "border-amber-200 bg-amber-500/10 text-amber-700",
  fuera_de_uso: "border-red-200 bg-red-500/10 text-red-700"
};
function ClonadoresPage() {
  const location = useLocation();
  const [clonadores, setClonadores] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [roomId, setRoomId] = useState("all");
  const [status, setStatus] = useState("all");
  const [capacity, setCapacity] = useState("");
  const [occupancy, setOccupancy] = useState("all");
  const [showSubstratePH, setShowSubstratePH] = useState(false);
  const [showSubstratePPM, setShowSubstratePPM] = useState(false);
  const [showLiquidPH, setShowLiquidPH] = useState(false);
  const [showLiquidPPM, setShowLiquidPPM] = useState(false);
  useEffect(() => {
    void Promise.all([getClonadores(), getGrowRooms(), getMeasurements()]).then(([nextClonadores, nextRooms, nextMeasurements]) => {
      setClonadores(nextClonadores);
      setRooms(nextRooms);
      setMeasurements(nextMeasurements);
    });
  }, []);
  const filtered = useMemo(() => {
    const minCap = Number(capacity);
    return clonadores.filter((c) => {
      if (roomId !== "all" && c.roomId !== roomId) return false;
      if (status !== "all" && c.status !== status) return false;
      if (capacity && Number.isFinite(minCap) && c.maxPlants < minCap) return false;
      if (occupancy === "with_plants" && c.currentPlants <= 0) return false;
      if (occupancy === "empty" && c.currentPlants > 0) return false;
      return true;
    });
  }, [clonadores, capacity, occupancy, roomId, status]);
  function roomName(id) {
    return rooms.find((r) => r.id === id)?.name ?? id;
  }
  const flat = useMemo(() => filtered.map((c) => ({
    ...c,
    _roomName: roomName(c.roomId)
  })), [filtered, rooms]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(flat);
  function latestMeasurement(clonadorId) {
    return measurements.find((m) => m.clonadorId === clonadorId);
  }
  if (location.pathname !== "/app/cultivo/clonador") return /* @__PURE__ */ jsx(Outlet, {});
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Clonadores" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Gestión de clonadores: capacidad, esquejes y envío a camillas." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/clonador/nueva", search: {
        edit: void 0
      }, children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Nuevo clonador"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Filtros" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Filtrá clonadores por sala, estado, capacidad u ocupación." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-4", children: [
          /* @__PURE__ */ jsxs(Select, { value: roomId, onValueChange: setRoomId, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las salas" }),
              rooms.map((r) => /* @__PURE__ */ jsx(SelectItem, { value: r.id, children: r.name }, r.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: status, onValueChange: (v) => setStatus(v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "vacia", children: "Vacío" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "activa", children: "Activo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "limpieza", children: "Limpieza" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "mantenimiento", children: "Mantenimiento" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "fuera_de_uso", children: "Fuera de uso" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Input, { type: "number", min: 0, max: 60, placeholder: "Capacidad mínima", value: capacity, onChange: (e) => setCapacity(e.target.value) }),
          /* @__PURE__ */ jsxs(Select, { value: occupancy, onValueChange: (v) => setOccupancy(v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "with_plants", children: "Con esquejes" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "empty", children: "Vacíos" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Columnas de mediciones:" }),
          [["showSubstratePH", "PH sustrato", showSubstratePH, setShowSubstratePH], ["showSubstratePPM", "PPM sustrato", showSubstratePPM, setShowSubstratePPM], ["showLiquidPH", "PH líquido", showLiquidPH, setShowLiquidPH], ["showLiquidPPM", "PPM líquido", showLiquidPPM, setShowLiquidPPM]].map(([id, label, checked, setter]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Checkbox, { id, checked, onCheckedChange: (v) => setter(Boolean(v)) }),
            /* @__PURE__ */ jsx(Label, { htmlFor: id, className: "cursor-pointer text-sm", children: label })
          ] }, id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Listado de clonadores" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          sorted.length,
          " clonador",
          sorted.length !== 1 ? "es" : "",
          " encontrado",
          sorted.length !== 1 ? "s" : "",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border [&_td]:text-center [&_th]:text-center", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(SortHead, { label: "Nombre", sortKey: "name", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Código", sortKey: "code", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Sala", sortKey: "_roomName", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Cap. máxima", sortKey: "maxPlants", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Esquejes actuales", sortKey: "currentPlants", col: sCol, dir: sDir, onSort: sort }),
          showSubstratePH && /* @__PURE__ */ jsx(TableHead, { children: "PH sustrato" }),
          showSubstratePPM && /* @__PURE__ */ jsx(TableHead, { children: "PPM sustrato" }),
          showLiquidPH && /* @__PURE__ */ jsx(TableHead, { children: "PH líquido" }),
          showLiquidPPM && /* @__PURE__ */ jsx(TableHead, { children: "PPM líquido" }),
          /* @__PURE__ */ jsx(SortHead, { label: "Responsable", sortKey: "responsibleUserId", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sorted.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8 + (showSubstratePH ? 1 : 0) + (showSubstratePPM ? 1 : 0) + (showLiquidPH ? 1 : 0) + (showLiquidPPM ? 1 : 0), className: "py-10 text-muted-foreground", children: "No hay clonadores registrados." }) }) : sorted.map((c) => {
          const latest = latestMeasurement(c.id);
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: c.name }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.code }),
            /* @__PURE__ */ jsx(TableCell, { children: roomName(c.roomId) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[c.status], children: STATUS_LABEL[c.status] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.maxPlants }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: c.currentPlants }),
            showSubstratePH && /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: latest?.substratePH ?? "-" }),
            showSubstratePPM && /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: latest?.substratePPM ?? "-" }),
            showLiquidPH && /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: latest?.liquidPH ?? "-" }),
            showLiquidPPM && /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: latest?.liquidPPM ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: c.responsibleUserId ?? "Sin asignar" }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/clonador/$id", params: {
                id: c.id
              }, children: [
                /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }),
                "Ver detalles"
              ] }) }) })
            ] }) })
          ] }, c.id);
        }) })
      ] }) }) })
    ] })
  ] });
}
export {
  ClonadoresPage as component
};
