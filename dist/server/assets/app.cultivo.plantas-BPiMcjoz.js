import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useLocation, Outlet, Link } from "@tanstack/react-router";
import { Users, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { B as BulkCreatePlantsDialog } from "./BulkCreatePlantsDialog-CF9HDhhR.js";
import { C as CultivationStatusMessage } from "./RelationshipWarning-BRJ5EkHV.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { g as getGenetics } from "./geneticsService-1lKUW0eY.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
import { g as getMotherPlants } from "./motherPlantService-BEybLeEn.js";
import { u as updatePlant, e as getPlants, d as deletePlant } from "./plantService-BxfJ2ZYq.js";
import "@radix-ui/react-dropdown-menu";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "./dialog-D_bA4dyy.js";
import "@radix-ui/react-dialog";
import "./label-CoCKMbcU.js";
import "@radix-ui/react-label";
import "class-variance-authority";
import "./textarea-L-7m5wEf.js";
import "./date-input--5OGyKIn.js";
import "sonner";
import "date-fns";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const PLANT_STATUS_CLASS = {
  normal: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  observacion: "border-sky-200 bg-sky-500/10 text-sky-700",
  alerta: "border-amber-200 bg-amber-500/10 text-amber-700",
  descartada: "border-muted bg-muted text-muted-foreground",
  cosechada: "border-violet-200 bg-violet-500/10 text-violet-700"
};
const SANITARY_STATUS_CLASS = {
  bueno: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  preventivo: "border-amber-200 bg-amber-500/10 text-amber-700",
  observacion: "border-sky-200 bg-sky-500/10 text-sky-700",
  critico: "border-red-200 bg-red-500/10 text-red-700"
};
function PlantsPage() {
  const location = useLocation();
  const [plants, setPlants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [genetics, setGenetics] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    roomId: "all",
    bedId: "all",
    geneticsId: "all",
    batchId: "",
    motherPlantId: "all",
    stage: "all",
    status: "all"
  });
  useEffect(() => {
    void Promise.all([getGrowRooms(), getGrowBeds(), getGenetics(), getMotherPlants()]).then(([nextRooms, nextBeds, nextGenetics, nextMothers]) => {
      setRooms(nextRooms);
      setBeds(nextBeds);
      setGenetics(nextGenetics);
      setMothers(nextMothers);
    });
  }, []);
  const filteredBeds = useMemo(() => {
    if (filters.roomId === "all") return beds;
    return beds.filter((bed) => bed.roomId === filters.roomId);
  }, [beds, filters.roomId]);
  async function applyFilters(nextFilters = filters) {
    const serviceFilters = {};
    if (nextFilters.roomId !== "all") serviceFilters.roomId = nextFilters.roomId;
    if (nextFilters.bedId !== "all") serviceFilters.bedId = nextFilters.bedId;
    if (nextFilters.geneticsId !== "all") serviceFilters.geneticsId = nextFilters.geneticsId;
    if (nextFilters.batchId) serviceFilters.batchId = nextFilters.batchId;
    if (nextFilters.motherPlantId !== "all") serviceFilters.motherPlantId = nextFilters.motherPlantId;
    if (nextFilters.stage !== "all") serviceFilters.stage = nextFilters.stage;
    if (nextFilters.status !== "all") serviceFilters.status = nextFilters.status;
    setPlants(await getPlants(serviceFilters));
  }
  useEffect(() => {
    void applyFilters(filters);
  }, [filters.roomId, filters.bedId, filters.geneticsId, filters.batchId, filters.motherPlantId, filters.stage, filters.status]);
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deletePlant(deleteTarget.id);
      setPlants((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage("Planta eliminada correctamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la planta.");
    }
  }
  function roomName(id) {
    return rooms.find((room) => room.id === id)?.name ?? id;
  }
  function bedName(id) {
    return beds.find((bed) => bed.id === id)?.name ?? id;
  }
  function motherCode(id) {
    if (!id) return "-";
    return mothers.find((mother) => mother.id === id)?.code ?? id;
  }
  const flatPlants = useMemo(() => plants.map((p) => ({
    ...p,
    _roomName: roomName(p.roomId),
    _bedName: bedName(p.bedId),
    _motherCode: motherCode(p.motherPlantId)
  })), [plants, rooms, beds, mothers]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(flatPlants);
  if (location.pathname !== "/app/cultivo/plantas") {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Plantas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Listado operativo de plantas por sala, camilla y posicion." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", onClick: () => setBulkDialogOpen(true), children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
          "Ingreso múltiple"
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/plantas/nueva", search: {
          edit: void 0
        }, children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Nueva planta"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Filtros" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Filtra plantas registradas." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-3 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs(Select, { value: filters.roomId, onValueChange: (roomId) => setFilters({
          ...filters,
          roomId,
          bedId: "all"
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las salas" }),
            rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: filters.bedId, onValueChange: (bedId) => setFilters({
          ...filters,
          bedId
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las camillas" }),
            filteredBeds.map((bed) => /* @__PURE__ */ jsx(SelectItem, { value: bed.id, children: bed.name }, bed.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: filters.geneticsId, onValueChange: (geneticsId) => setFilters({
          ...filters,
          geneticsId
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las geneticas" }),
            genetics.map((item) => /* @__PURE__ */ jsx(SelectItem, { value: item.id, children: item.name }, item.id))
          ] })
        ] }),
        /* @__PURE__ */ jsx(Input, { placeholder: "Lote", value: filters.batchId, onChange: (event) => setFilters({
          ...filters,
          batchId: event.target.value
        }) }),
        /* @__PURE__ */ jsxs(Select, { value: filters.motherPlantId, onValueChange: (motherPlantId) => setFilters({
          ...filters,
          motherPlantId
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las madres" }),
            mothers.map((mother) => /* @__PURE__ */ jsx(SelectItem, { value: mother.id, children: mother.code }, mother.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: filters.stage, onValueChange: (stage) => setFilters({
          ...filters,
          stage
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las etapas" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "vegetativo", children: "Vegetativo" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "floracion", children: "Floracion" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "cosecha", children: "Cosecha" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "secado", children: "Secado" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "curado", children: "Curado" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "liberado", children: "Liberado" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "a_limpiar", children: "A Limpiar" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "a_reparar", children: "A Reparar" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: filters.status, onValueChange: (status) => setFilters({
          ...filters,
          status
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "normal", children: "Normal" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "observacion", children: "Observacion" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "alerta", children: "Alerta" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "descartada", children: "Descartada" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "cosechada", children: "Cosechada" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Listado de plantas" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          plants.length,
          " registros encontrados."
        ] }),
        message ? /* @__PURE__ */ jsx(CultivationStatusMessage, { message }) : null
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border [&_td]:text-center [&_th]:text-center", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(SortHead, { label: "Codigo interno", sortKey: "internalCode", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Nombre planta", sortKey: "plantName", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Genetica", sortKey: "geneticsName", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Lote", sortKey: "batchId", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Sala", sortKey: "_roomName", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Camilla", sortKey: "_bedName", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Posicion", sortKey: "bedPosition", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Madre", sortKey: "_motherCode", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Etapa", sortKey: "stage", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(TableHead, { children: "Estado sanitario" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sorted.map((plant) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: plant.internalCode }),
          /* @__PURE__ */ jsx(TableCell, { children: plant.plantName ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: plant.geneticsName ?? "genetica pendiente" }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: plant.batchId ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: roomName(plant.roomId) }),
          /* @__PURE__ */ jsx(TableCell, { children: bedName(plant.bedId) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: plant.bedPosition }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: motherCode(plant.motherPlantId) }),
          /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: plant.stage }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PLANT_STATUS_CLASS[plant.status], children: plant.status }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(SanitaryStatusSelect, { value: plant.sanitaryStatus ?? "bueno", onChange: async (next) => {
            setPlants((prev) => prev.map((p) => p.id === plant.id ? {
              ...p,
              sanitaryStatus: next
            } : p));
            await updatePlant(plant.id, {
              sanitaryStatus: next
            });
          } }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/plantas/nueva", search: {
                edit: plant.id
              }, children: [
                /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                "Editar"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => setDeleteTarget(plant), children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "Eliminar"
              ] })
            ] })
          ] }) })
        ] }, plant.id)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: Boolean(deleteTarget), entityLabel: "planta", itemName: deleteTarget?.internalCode, description: `Estas por eliminar la planta ${deleteTarget?.internalCode ?? ""}. Esta accion no se puede deshacer.`, onOpenChange: (open) => !open && setDeleteTarget(null), onConfirm: handleDelete }),
    /* @__PURE__ */ jsx(BulkCreatePlantsDialog, { open: bulkDialogOpen, onOpenChange: setBulkDialogOpen, beds, genetics, mothers, onSuccess: (created) => {
      setPlants((prev) => [...prev, ...created]);
      setMessage(`${created.length} plantas creadas correctamente.`);
    } })
  ] });
}
function SanitaryStatusSelect({
  value,
  onChange
}) {
  const [loading, setLoading] = useState(false);
  async function handleChange(next) {
    setLoading(true);
    try {
      await onChange(next);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs(Select, { value, onValueChange: handleChange, disabled: loading, children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className: `h-7 w-[140px] border text-xs font-medium ${SANITARY_STATUS_CLASS[value]}`, children: /* @__PURE__ */ jsx(SelectValue, {}) }),
    /* @__PURE__ */ jsxs(SelectContent, { children: [
      /* @__PURE__ */ jsx(SelectItem, { value: "bueno", children: "Bueno" }),
      /* @__PURE__ */ jsx(SelectItem, { value: "preventivo", children: "Preventivo" }),
      /* @__PURE__ */ jsx(SelectItem, { value: "observacion", children: "En observacion" }),
      /* @__PURE__ */ jsx(SelectItem, { value: "critico", children: "Critico" })
    ] })
  ] });
}
export {
  PlantsPage as component
};
