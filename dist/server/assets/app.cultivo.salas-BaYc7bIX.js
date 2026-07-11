import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useLocation, Outlet, Link } from "@tanstack/react-router";
import { Plus, Warehouse, Zap, CheckCircle2, Snowflake, Wind, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { C as CultivationStatusMessage } from "./RelationshipWarning-BRJ5EkHV.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from "./router-Rtc38bRC.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { a as getGrowRooms, d as deleteGrowRoom } from "./growRoomService-BUC_ARXZ.js";
import "@radix-ui/react-dropdown-menu";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "class-variance-authority";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const STATUS_LABEL = {
  activa: "Activa",
  limpieza: "Limpieza",
  mantenimiento: "Mantenimiento",
  fuera_de_uso: "Fuera de uso"
};
const STATUS_CLASS = {
  activa: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  limpieza: "border-sky-200 bg-sky-500/10 text-sky-700",
  mantenimiento: "border-amber-200 bg-amber-500/10 text-amber-700",
  fuera_de_uso: "border-muted bg-muted text-muted-foreground"
};
const SENSOR_LABEL = {
  temperatura: "Temperatura",
  humedad: "Humedad",
  co2: "CO₂",
  vpd: "VPD",
  temperatura_hoja: "Temp. hoja",
  ph: "PH",
  ec: "EC",
  otro: "Otro"
};
const SENSOR_CLASS = {
  temperatura: "border-red-200 bg-red-500/10 text-red-700",
  humedad: "border-sky-200 bg-sky-500/10 text-sky-700",
  co2: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  vpd: "border-violet-200 bg-violet-500/10 text-violet-700",
  temperatura_hoja: "border-orange-200 bg-orange-500/10 text-orange-700",
  ph: "border-yellow-200 bg-yellow-500/10 text-yellow-700",
  ec: "border-cyan-200 bg-cyan-500/10 text-cyan-700",
  otro: "border-muted bg-muted text-muted-foreground"
};
function yesNo(value) {
  return value ? "Si" : "No";
}
function splitRoomTypes(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
function GrowRoomsPage() {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void getGrowRooms().then(setRooms);
  }, []);
  const flatRooms = useMemo(() => rooms.map((r) => ({
    ...r,
    _powerWatts: r.technicalConfig.installedPowerWatts,
    _irrigation: r.technicalConfig.irrigationSystem
  })), [rooms]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(flatRooms);
  if (location.pathname !== "/app/cultivo/salas") {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteGrowRoom(deleteTarget.id);
      setRooms((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage("Sala eliminada correctamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la sala.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Salas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Vista tecnica de salas registradas para el seguimiento interno de cultivo." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/salas/nueva", search: {
        edit: void 0
      }, children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Nueva sala"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-3", children: [{
      label: "Salas registradas",
      value: rooms.length,
      Icon: Warehouse,
      accent: "bg-sky-500",
      panel: "bg-sky-500/10",
      iconClass: "text-sky-600 dark:text-sky-400"
    }, {
      label: "Potencia instalada",
      value: `${rooms.reduce((t, r) => t + r.technicalConfig.installedPowerWatts, 0)} W`,
      Icon: Zap,
      accent: "bg-amber-500",
      panel: "bg-amber-500/10",
      iconClass: "text-amber-600 dark:text-amber-400"
    }, {
      label: "Salas activas",
      value: rooms.filter((r) => r.status === "activa").length,
      Icon: CheckCircle2,
      accent: "bg-emerald-500",
      panel: "bg-emerald-500/10",
      iconClass: "text-emerald-600 dark:text-emerald-400"
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
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Listado de salas" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Datos conectados al backend local de cultivo." }),
        message ? /* @__PURE__ */ jsx(CultivationStatusMessage, { message }) : null
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border [&_td]:text-center [&_th]:text-center", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(SortHead, { label: "Nombre", sortKey: "name", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Codigo", sortKey: "code", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Tipo", sortKey: "type", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Potencia", sortKey: "_powerWatts", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Riego", sortKey: "_irrigation", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(TableHead, { children: "A/C" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Deshumidificador" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Sensores" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sorted.map((room) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: room.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: room.code }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-1", children: splitRoomTypes(room.type).map((type) => /* @__PURE__ */ jsx("span", { className: "capitalize leading-tight", children: type }, type)) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[room.status], children: STATUS_LABEL[room.status] }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs", children: [
            room.technicalConfig.installedPowerWatts,
            " W"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: room.technicalConfig.irrigationSystem }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center gap-1 text-sm", children: [
            /* @__PURE__ */ jsx(Snowflake, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            yesNo(room.technicalConfig.hasAirConditioning)
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center gap-1 text-sm", children: [
            /* @__PURE__ */ jsx(Wind, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            yesNo(room.technicalConfig.hasDehumidifier)
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "max-w-[240px]", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-1", children: room.technicalConfig.installedSensors.map((sensor) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: SENSOR_CLASS[sensor], children: SENSOR_LABEL[sensor] }, sensor)) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/salas/nueva", search: {
                edit: room.id
              }, children: [
                /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                "Editar"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => setDeleteTarget(room), children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "Eliminar"
              ] })
            ] })
          ] }) })
        ] }, room.id)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: Boolean(deleteTarget), entityLabel: "sala", itemName: deleteTarget?.name, description: `Estas por eliminar la sala ${deleteTarget?.name ?? ""}. Si tiene camillas o registros asociados, la base puede impedir la eliminacion.`, onOpenChange: (open) => !open && setDeleteTarget(null), onConfirm: handleDelete })
  ] });
}
export {
  GrowRoomsPage as component
};
