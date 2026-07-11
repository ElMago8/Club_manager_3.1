import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useLocation, Outlet, Link } from "@tanstack/react-router";
import { Plus, MoreVertical, Eye } from "lucide-react";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem } from "./dropdown-menu-CVBxbGj8.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from "./router-Rtc38bRC.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
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
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const STATUS_LABEL = {
  vacia: "Vacia",
  activa: "Activa",
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
const PARAM_STATUS_CLASS = {
  normal: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  observation: "border-sky-200 bg-sky-500/10 text-sky-700",
  alert: "border-amber-200 bg-amber-500/10 text-amber-700",
  critical: "border-red-200 bg-red-500/10 text-red-700"
};
const MEASUREMENT_COLUMNS = [{
  key: "substratePH",
  label: "PH sustrato",
  getValue: (item) => item?.substratePH
}, {
  key: "substratePPM",
  label: "PPM sustrato",
  getValue: (item) => item?.substratePPM
}, {
  key: "liquidPH",
  label: "PH liquido",
  getValue: (item) => item?.liquidPH
}, {
  key: "liquidPPM",
  label: "PPM liquido",
  getValue: (item) => item?.liquidPPM
}, {
  key: "runoffPH",
  label: "PH drenaje",
  getValue: (item) => item?.runoffPH
}, {
  key: "runoffPPM",
  label: "PPM drenaje",
  getValue: (item) => item?.runoffPPM
}];
function splitMeasurementLabel(label) {
  const [first, ...rest] = label.split(" ");
  return {
    first,
    second: rest.join(" ")
  };
}
function GrowBedsPage() {
  const location = useLocation();
  const [beds, setBeds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [roomId, setRoomId] = useState("all");
  const [status, setStatus] = useState("all");
  const [capacity, setCapacity] = useState("");
  const [occupancy, setOccupancy] = useState("all");
  const [visibleMeasurementColumns, setVisibleMeasurementColumns] = useState([]);
  useEffect(() => {
    void Promise.all([getGrowBeds(), getGrowRooms(), getMeasurements()]).then(([nextBeds, nextRooms, nextMeasurements]) => {
      setBeds(nextBeds);
      setRooms(nextRooms);
      setMeasurements(nextMeasurements);
    });
  }, []);
  const filteredBeds = useMemo(() => {
    const minCapacity = Number(capacity);
    return beds.filter((bed) => {
      if (roomId !== "all" && bed.roomId !== roomId) return false;
      if (status !== "all" && bed.status !== status) return false;
      if (capacity && Number.isFinite(minCapacity) && bed.maxPlants < minCapacity) return false;
      if (occupancy === "with_plants" && bed.currentPlants <= 0) return false;
      if (occupancy === "empty" && bed.currentPlants > 0) return false;
      return true;
    });
  }, [beds, capacity, occupancy, roomId, status]);
  function roomName(id) {
    return rooms.find((room) => room.id === id)?.name ?? id;
  }
  const flatBeds = useMemo(() => filteredBeds.map((b) => ({
    ...b,
    _roomName: roomName(b.roomId)
  })), [filteredBeds, rooms]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(flatBeds);
  function latestBedMeasurement(bedId) {
    return measurements.find((item) => item.bedId === bedId);
  }
  function toggleMeasurementColumn(key, checked) {
    setVisibleMeasurementColumns((current) => checked ? [...current, key] : current.filter((item) => item !== key));
  }
  if (location.pathname !== "/app/cultivo/camillas") {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Camillas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Administracion visual de camillas, capacidad y ocupacion por sala." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/camillas/nueva", search: {
        edit: void 0
      }, children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Nueva camilla"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Filtros" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Filtra camillas por sala, estado, capacidad u ocupacion." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-3 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs(Select, { value: roomId, onValueChange: setRoomId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las salas" }),
            rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: status, onValueChange: (value) => setStatus(value), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "vacia", children: "Vacia" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "activa", children: "Activa" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "limpieza", children: "Limpieza" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "mantenimiento", children: "Mantenimiento" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "fuera_de_uso", children: "Fuera de uso" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Input, { type: "number", min: 0, max: 100, placeholder: "Capacidad minima", value: capacity, onChange: (event) => setCapacity(event.target.value) }),
        /* @__PURE__ */ jsxs(Select, { value: occupancy, onValueChange: (value) => setOccupancy(value), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "with_plants", children: "Con plantas" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "empty", children: "Vacias" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Listado de camillas" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Datos conectados al backend local de cultivo." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 p-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "mx-4 rounded-md border border-input bg-background/70 p-3 shadow-sm dark:bg-muted/35 dark:shadow-[0_0_0_1px_color-mix(in_oklch,var(--input)_45%,transparent)]", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Elementos de medicion visibles" }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6", children: MEASUREMENT_COLUMNS.map((column) => {
            const checked = visibleMeasurementColumns.includes(column.key);
            return /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/60", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked, onCheckedChange: (nextChecked) => toggleMeasurementColumn(column.key, Boolean(nextChecked)) }),
              column.label
            ] }, column.key);
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-b-md border-t [&_td]:text-center [&_th]:text-center [&_td]:px-2 [&_th]:px-2 [&_td]:py-2 [&_th]:py-2", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(SortHead, { label: "Nombre", sortKey: "name", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Codigo", sortKey: "code", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Sala", sortKey: "_roomName", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center leading-tight", children: [
              /* @__PURE__ */ jsx("span", { children: "Capacidad" }),
              /* @__PURE__ */ jsx("span", { children: "máxima" })
            ] }), sortKey: "maxPlants", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center leading-tight", children: [
              /* @__PURE__ */ jsx("span", { children: "Plantas" }),
              /* @__PURE__ */ jsx("span", { children: "actuales" })
            ] }), sortKey: "currentPlants", col: sCol, dir: sDir, onSort: sort }),
            MEASUREMENT_COLUMNS.filter((column) => visibleMeasurementColumns.includes(column.key)).map((column) => {
              const {
                first,
                second
              } = splitMeasurementLabel(column.label);
              return /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center leading-tight", children: [
                /* @__PURE__ */ jsx("span", { children: first }),
                /* @__PURE__ */ jsx("span", { children: second })
              ] }) }, column.key);
            }),
            visibleMeasurementColumns.length ? /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center leading-tight", children: [
              /* @__PURE__ */ jsx("span", { children: "Estado" }),
              /* @__PURE__ */ jsx("span", { children: "parametros" })
            ] }) }) : null,
            /* @__PURE__ */ jsx(SortHead, { label: /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center leading-tight", children: [
              /* @__PURE__ */ jsx("span", { children: "Lote" }),
              /* @__PURE__ */ jsx("span", { children: "principal" })
            ] }), sortKey: "mainBatchId", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Responsable", sortKey: "responsibleUserId", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: sorted.map((bed) => {
            const latest = latestBedMeasurement(bed.id);
            return /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: bed.name }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.code }),
              /* @__PURE__ */ jsx(TableCell, { children: roomName(bed.roomId) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[bed.status], children: STATUS_LABEL[bed.status] }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.maxPlants }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.currentPlants }),
              MEASUREMENT_COLUMNS.filter((column) => visibleMeasurementColumns.includes(column.key)).map((column) => /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: column.getValue(latest) ?? "-" }, column.key)),
              visibleMeasurementColumns.length ? /* @__PURE__ */ jsx(TableCell, { children: latest ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PARAM_STATUS_CLASS[latest.status], children: latest.status }) : "-" }) : null,
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.mainBatchId ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: bed.responsibleUserId ?? "Sin asignar" }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
                /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", children: /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/camillas/$id", params: {
                  id: bed.id
                }, children: [
                  /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }),
                  "Ver detalles"
                ] }) }) })
              ] }) })
            ] }, bed.id);
          }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  GrowBedsPage as component
};
