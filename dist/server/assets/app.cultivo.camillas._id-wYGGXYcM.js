import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2, Plus, Droplets, MoreVertical } from "lucide-react";
import { B as BulkCreatePlantsDialog } from "./BulkCreatePlantsDialog-CF9HDhhR.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { R as RelationshipWarning } from "./RelationshipWarning-BRJ5EkHV.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem } from "./dropdown-menu-CVBxbGj8.js";
import { r as Route, B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { g as getGenetics } from "./geneticsService-1lKUW0eY.js";
import { a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
import { i as getGrowBedById, j as getGrowBedOccupancy, o as updateGrowBedCapacity, b as deleteGrowBed } from "./growBedService-CR9jvSKV.js";
import { g as getGrowRoomById } from "./growRoomService-BUC_ARXZ.js";
import { b as getMeasurements } from "./measurementService-L_YC84-q.js";
import { g as getMotherPlants } from "./motherPlantService-BEybLeEn.js";
import { f as getPlantsByBed, h as updatePlantStage, i as updatePlantStatus } from "./plantService-BxfJ2ZYq.js";
import "./date-input--5OGyKIn.js";
import "sonner";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "class-variance-authority";
import "@radix-ui/react-dropdown-menu";
import "date-fns";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
function mapApi(r) {
  return {
    id: String(r.id),
    codigoRiego: r.codigoRiego,
    camillaId: String(r.camillaId),
    picosPorPlanta: r.picosPorPlanta ?? null,
    horarioApertura: r.horarioApertura ?? null,
    cantidadLitros: r.cantidadLitros ?? null,
    tanque: r.tanque ?? null,
    frecuenciaTiempo: r.frecuenciaTiempo ?? null,
    sistemaRegado: r.sistemaRegado,
    sistemaRegadoCustom: r.sistemaRegadoCustom ?? null,
    notas: r.notas ?? null,
    creadoEn: r.creadoEn,
    actualizadoEn: r.actualizadoEn,
    camilla: r.camilla ?? null
  };
}
async function getSistemaRiegoByCamilla(camillaId) {
  const data = await apiRequest(
    `/cultivation/irrigation-systems?camillaId=${camillaId}`
  );
  return data.map(mapApi);
}
async function createSistemaRiego(payload) {
  const data = await apiRequest("/cultivation/irrigation-systems", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      camillaId: Number(payload.camillaId)
    })
  });
  return mapApi(data);
}
async function updateSistemaRiego(id, payload) {
  const data = await apiRequest(`/cultivation/irrigation-systems/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...payload,
      camillaId: payload.camillaId ? Number(payload.camillaId) : void 0
    })
  });
  return mapApi(data);
}
async function deleteSistemaRiego(id) {
  await apiRequest(`/cultivation/irrigation-systems/${id}`, { method: "DELETE" });
}
const BED_STATUS_CLASS = {
  vacia: "border-muted bg-muted text-muted-foreground",
  activa: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  limpieza: "border-sky-200 bg-sky-500/10 text-sky-700",
  mantenimiento: "border-amber-200 bg-amber-500/10 text-amber-700",
  fuera_de_uso: "border-red-200 bg-red-500/10 text-red-700"
};
const PLANT_STATUS_CLASS = {
  normal: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  observacion: "border-sky-200 bg-sky-500/10 text-sky-700",
  alerta: "border-amber-200 bg-amber-500/10 text-amber-700",
  descartada: "border-muted bg-muted text-muted-foreground",
  cosechada: "border-violet-200 bg-violet-500/10 text-violet-700"
};
const PLANT_STAGE_CLASS = {
  vegetativo: "border-emerald-200 bg-emerald-500/15 text-emerald-800 hover:bg-emerald-500/20",
  floracion: "border-fuchsia-200 bg-fuchsia-500/15 text-fuchsia-800 hover:bg-fuchsia-500/20",
  cosecha: "border-amber-200 bg-amber-500/20 text-amber-900 hover:bg-amber-500/25",
  secado: "border-orange-200 bg-orange-500/20 text-orange-900 hover:bg-orange-500/25",
  curado: "border-violet-200 bg-violet-500/15 text-violet-800 hover:bg-violet-500/20",
  liberado: "border-sky-200 bg-sky-500/15 text-sky-800 hover:bg-sky-500/20",
  a_limpiar: "border-teal-200 bg-teal-500/15 text-teal-800 hover:bg-teal-500/20",
  a_reparar: "border-rose-200 bg-rose-500/15 text-rose-800 hover:bg-rose-500/20"
};
const STAGE_LABEL = {
  vegetativo: "Vegetativo",
  floracion: "Floracion",
  cosecha: "Cosecha",
  secado: "Secado",
  curado: "Curado",
  liberado: "Liberado",
  a_limpiar: "A Limpiar",
  a_reparar: "A Reparar"
};
const PARAM_STATUS_CLASS = {
  normal: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  observation: "border-sky-200 bg-sky-500/10 text-sky-700",
  alert: "border-amber-200 bg-amber-500/10 text-amber-700",
  critical: "border-red-200 bg-red-500/10 text-red-700"
};
const PLANT_STATUS_LABEL = {
  normal: "Normal",
  observacion: "Observación",
  alerta: "Alerta",
  descartada: "Descartada",
  cosechada: "Cosechada"
};
const PLANT_ORIGIN_LABEL = {
  semilla: "Semilla",
  esqueje: "Esqueje",
  madre: "Madre",
  planta: "Planta"
};
const SISTEMA_REGADO_LABEL = {
  goteo: "Por goteo",
  continuo_intermitente: "Riego continuo intermitente",
  otro: "Otro"
};
function initialRiegoForm() {
  return {
    codigoRiego: "",
    picosPorPlanta: "",
    horarioApertura: "",
    cantidadLitros: "",
    tanque: "",
    frecuenciaTiempo: "",
    sistemaRegado: "goteo",
    sistemaRegadoCustom: "",
    notas: ""
  };
}
function shortCode(code) {
  const parts = code.split("-");
  return parts.slice(-2).join("-");
}
function GrowBedDetailPage() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const [bed, setBed] = useState(null);
  const [room, setRoom] = useState(null);
  const [plants, setPlants] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [genetics, setGenetics] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [riegos, setRiegos] = useState([]);
  const [riegoForm, setRiegoForm] = useState(initialRiegoForm());
  const [riegoSaving, setRiegoSaving] = useState(false);
  const [riegoError, setRiegoError] = useState("");
  const [editRiego, setEditRiego] = useState(null);
  const [editRiegoForm, setEditRiegoForm] = useState(initialRiegoForm());
  const [editRiegoSaving, setEditRiegoSaving] = useState(false);
  const [editRiegoError, setEditRiegoError] = useState("");
  const [deleteRiegoId, setDeleteRiegoId] = useState(null);
  const [capacityValue, setCapacityValue] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [detailPlant, setDetailPlant] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [quickNotes, setQuickNotes] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [gridStage, setGridStage] = useState(null);
  async function loadData() {
    const nextBed = await getGrowBedById(id);
    setBed(nextBed);
    setPlants(nextBed ? await getPlantsByBed(nextBed.id) : []);
    setOccupancy(nextBed ? await getGrowBedOccupancy(nextBed.id) : null);
    setCapacityValue(nextBed ? String(nextBed.maxPlants) : "");
    setRoom(nextBed ? await getGrowRoomById(nextBed.roomId) : null);
    const [nextGenetics, nextMothers, nextMeasurements, nextRiegos] = await Promise.all([getGenetics(), getMotherPlants(), nextBed ? getMeasurements({
      bedId: nextBed.id
    }) : Promise.resolve([]), nextBed ? getSistemaRiegoByCamilla(nextBed.id) : Promise.resolve([])]);
    setGenetics(nextGenetics);
    setMothers(nextMothers);
    setMeasurements(nextMeasurements);
    setRiegos(nextRiegos);
  }
  useEffect(() => {
    void loadData();
  }, [id]);
  const plantsByPosition = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const plant of plants) map.set(plant.bedPosition, plant);
    return map;
  }, [plants]);
  const predominantGenetics = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const plant of plants) {
      const name = plant.geneticsName ?? "genetica pendiente";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sin plantas";
  }, [plants]);
  const freePositions = bed ? Math.max(Math.min(bed.maxPlants, 100) - plants.filter((p) => p.status !== "descartada").length, 0) : 0;
  const latestMeasurement = measurements[0];
  async function handleRiegoCreate() {
    if (!bed) return;
    setRiegoError("");
    if (!riegoForm.codigoRiego.trim()) {
      setRiegoError("El código de riego es requerido.");
      return;
    }
    if (!riegoForm.sistemaRegado) {
      setRiegoError("Seleccioná un sistema de regado.");
      return;
    }
    if (riegoForm.sistemaRegado === "otro" && !riegoForm.sistemaRegadoCustom.trim()) {
      setRiegoError("Describí el sistema de regado personalizado.");
      return;
    }
    setRiegoSaving(true);
    try {
      await createSistemaRiego({
        codigoRiego: riegoForm.codigoRiego.trim(),
        camillaId: bed.id,
        picosPorPlanta: riegoForm.picosPorPlanta ? Number(riegoForm.picosPorPlanta) : void 0,
        horarioApertura: riegoForm.horarioApertura || void 0,
        cantidadLitros: riegoForm.cantidadLitros ? Number(riegoForm.cantidadLitros) : void 0,
        tanque: riegoForm.tanque || void 0,
        frecuenciaTiempo: riegoForm.frecuenciaTiempo || void 0,
        sistemaRegado: riegoForm.sistemaRegado,
        sistemaRegadoCustom: riegoForm.sistemaRegado === "otro" ? riegoForm.sistemaRegadoCustom : void 0,
        notas: riegoForm.notas || void 0
      });
      setRiegos(await getSistemaRiegoByCamilla(bed.id));
      setRiegoForm(initialRiegoForm());
    } catch (err) {
      setRiegoError(err instanceof Error ? err.message : "No se pudo crear el sistema de riego.");
    } finally {
      setRiegoSaving(false);
    }
  }
  async function handleRiegoEdit() {
    if (!editRiego) return;
    setEditRiegoError("");
    if (!editRiegoForm.codigoRiego.trim()) {
      setEditRiegoError("El código de riego es requerido.");
      return;
    }
    if (editRiegoForm.sistemaRegado === "otro" && !editRiegoForm.sistemaRegadoCustom.trim()) {
      setEditRiegoError("Describí el sistema de regado personalizado.");
      return;
    }
    setEditRiegoSaving(true);
    try {
      await updateSistemaRiego(editRiego.id, {
        codigoRiego: editRiegoForm.codigoRiego.trim(),
        picosPorPlanta: editRiegoForm.picosPorPlanta ? Number(editRiegoForm.picosPorPlanta) : void 0,
        horarioApertura: editRiegoForm.horarioApertura || void 0,
        cantidadLitros: editRiegoForm.cantidadLitros ? Number(editRiegoForm.cantidadLitros) : void 0,
        tanque: editRiegoForm.tanque || void 0,
        frecuenciaTiempo: editRiegoForm.frecuenciaTiempo || void 0,
        sistemaRegado: editRiegoForm.sistemaRegado,
        sistemaRegadoCustom: editRiegoForm.sistemaRegado === "otro" ? editRiegoForm.sistemaRegadoCustom : void 0,
        notas: editRiegoForm.notas || void 0
      });
      setRiegos(await getSistemaRiegoByCamilla(bed.id));
      setEditRiego(null);
    } catch (err) {
      setEditRiegoError(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setEditRiegoSaving(false);
    }
  }
  async function handleRiegoDelete() {
    if (!deleteRiegoId || !bed) return;
    try {
      await deleteSistemaRiego(deleteRiegoId);
      setRiegos(await getSistemaRiegoByCamilla(bed.id));
      setDeleteRiegoId(null);
    } catch (err) {
      setDeleteRiegoId(null);
    }
  }
  async function handleCapacityUpdate() {
    if (!bed) return;
    setCapacityError("");
    const maxPlants = Number(capacityValue);
    if (!Number.isFinite(maxPlants) || maxPlants < 0 || maxPlants > 100) {
      setCapacityError("La capacidad debe estar entre 0 y 100.");
      return;
    }
    try {
      await updateGrowBedCapacity(bed.id, maxPlants);
      await loadData();
    } catch (error) {
      setCapacityError(error instanceof Error ? error.message : "No se pudo actualizar la capacidad.");
    }
  }
  async function handleQuickPlantSave() {
    if (!selectedPlant) return;
    await updatePlantStage(selectedPlant.id, {
      stage: selectedPlant.stage,
      stageStartDate: selectedPlant.stageStartDate,
      notes: quickNotes || void 0
    });
    await updatePlantStatus(selectedPlant.id, {
      status: selectedPlant.status,
      notes: quickNotes || void 0
    });
    setSelectedPlant(null);
    setQuickNotes("");
    await loadData();
  }
  async function handleDeleteBed() {
    if (!bed) return;
    try {
      await deleteGrowBed(bed.id);
      await navigate({
        to: "/app/cultivo/camillas"
      });
    } catch (error) {
      setDeleteMessage(error instanceof Error ? error.message : "No se pudo eliminar la camilla.");
      setDeleteOpen(false);
    }
  }
  if (!bed) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1000px] space-y-4", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/camillas", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Volver"
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-10 text-sm text-muted-foreground", children: "Camilla no encontrada." }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/camillas", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Camillas"
        ] }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: bed.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Grilla de posiciones y ocupacion de plantas." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2 bg-emerald-700 hover:bg-emerald-800", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/camillas/nueva", search: {
          edit: bed.id
        }, children: [
          /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
          "Editar"
        ] }) }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive", onClick: () => setDeleteOpen(true), children: [
          /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
          "Eliminar"
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => setBulkOpen(true), className: "gap-2", disabled: bed.status === "fuera_de_uso", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Carga masiva de plantas"
        ] })
      ] })
    ] }),
    deleteMessage ? /* @__PURE__ */ jsx(RelationshipWarning, { message: deleteMessage }) : null,
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-[1fr_1fr]", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Ficha de camilla" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Datos operativos y capacidad." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-3 text-sm md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Codigo" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: bed.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Sala asociada" }),
            /* @__PURE__ */ jsx("p", { children: room?.name ?? bed.roomId })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Estado" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: BED_STATUS_CLASS[bed.status], children: bed.status.replace("_", " ") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Capacidad maxima" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: bed.maxPlants })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Plantas actuales" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: bed.currentPlants })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Lote principal" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: bed.mainBatchId ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Genetica predominante" }),
            /* @__PURE__ */ jsx("p", { children: predominantGenetics })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Responsable" }),
            /* @__PURE__ */ jsx("p", { children: bed.responsibleUserId ?? "Sin asignar" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Observaciones" }),
            /* @__PURE__ */ jsx("p", { children: bed.notes ?? "Sin observaciones" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Capacidad disponible" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Capacidad maxima de macetas/plantas y ocupacion real." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Maximo" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-semibold", children: occupancy?.maxPlants ?? Math.min(bed.maxPlants, 100) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ocupadas" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-semibold", children: occupancy?.occupied ?? plants.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Libres" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-semibold", children: occupancy?.available ?? freePositions })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-3 space-y-2 rounded-md border p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ocupacion" }),
                /* @__PURE__ */ jsxs("p", { className: "font-mono text-sm", children: [
                  occupancy?.occupancyPercentage ?? 0,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Input, { className: "w-24", type: "number", min: 0, max: 100, value: capacityValue, onChange: (event) => setCapacityValue(event.target.value) }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => void handleCapacityUpdate(), children: "Editar capacidad" })
              ] })
            ] }),
            capacityError ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: capacityError }) : null
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Control de parametros" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Ultimas mediciones quimicas asociadas a esta camilla." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4", children: [
        [["Ultimo PH sustrato", latestMeasurement?.substratePH], ["Ultimo PPM sustrato", latestMeasurement?.substratePPM], ["Ultimo EC sustrato", latestMeasurement?.substrateEC], ["Ultimo PH liquido", latestMeasurement?.liquidPH], ["Ultimo PPM liquido", latestMeasurement?.liquidPPM], ["Ultimo EC liquido", latestMeasurement?.liquidEC], ["Ultimo PH drenaje", latestMeasurement?.runoffPH], ["Ultimo PPM drenaje", latestMeasurement?.runoffPPM]].map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: label }),
          /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-semibold", children: value ?? "-" })
        ] }, label)),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border p-3 sm:col-span-2 lg:col-span-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Estado general" }),
          latestMeasurement ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PARAM_STATUS_CLASS[latestMeasurement.status], children: latestMeasurement.status }) : /* @__PURE__ */ jsx("span", { children: "Sin mediciones" })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", className: "gap-2 sm:col-span-2 lg:col-span-4", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/mediciones", search: {}, children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Registrar medicion"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Droplets, { className: "h-5 w-5" }),
          "Sistema de riego"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Configuraciones de riego asociadas a esta camilla." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Nuevo sistema de riego" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Código de riego *" }),
              /* @__PURE__ */ jsx(Input, { placeholder: "Ej: RIE-001", value: riegoForm.codigoRiego, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                codigoRiego: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Picos por planta" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, placeholder: "Ej: 2", value: riegoForm.picosPorPlanta, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                picosPorPlanta: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Horario de apertura" }),
              /* @__PURE__ */ jsx(Input, { type: "time", value: riegoForm.horarioApertura, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                horarioApertura: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Cantidad de litros" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, step: "0.1", placeholder: "Ej: 1.5", value: riegoForm.cantidadLitros, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                cantidadLitros: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Tanque" }),
              /* @__PURE__ */ jsx(Input, { placeholder: "Nombre o código del tanque", value: riegoForm.tanque, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                tanque: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Frecuencia de tiempo" }),
              /* @__PURE__ */ jsx(Input, { placeholder: "Ej: cada 6 hs", value: riegoForm.frecuenciaTiempo, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                frecuenciaTiempo: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Sistema de regado *" }),
              /* @__PURE__ */ jsxs(Select, { value: riegoForm.sistemaRegado, onValueChange: (v) => setRiegoForm((f) => ({
                ...f,
                sistemaRegado: v,
                sistemaRegadoCustom: ""
              })), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "goteo", children: "Por goteo" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "continuo_intermitente", children: "Riego continuo intermitente" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "otro", children: "Otro" })
                ] })
              ] })
            ] }),
            riegoForm.sistemaRegado === "otro" ? /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { children: "Descripción del sistema *" }),
              /* @__PURE__ */ jsx(Input, { placeholder: "Describí el sistema", value: riegoForm.sistemaRegadoCustom, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                sistemaRegadoCustom: e.target.value
              })) })
            ] }) : null,
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 sm:col-span-2 lg:col-span-3", children: [
              /* @__PURE__ */ jsx(Label, { children: "Notas" }),
              /* @__PURE__ */ jsx(Textarea, { placeholder: "Observaciones adicionales", value: riegoForm.notas, onChange: (e) => setRiegoForm((f) => ({
                ...f,
                notas: e.target.value
              })) })
            ] })
          ] }),
          riegoError ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-red-200 bg-red-500/10 p-3 text-sm text-red-700", children: riegoError }) : null,
          /* @__PURE__ */ jsxs(Button, { onClick: () => void handleRiegoCreate(), disabled: riegoSaving, className: "gap-2", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            riegoSaving ? "Guardando…" : "Agregar sistema de riego"
          ] })
        ] }),
        riegos.length > 0 ? /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Código" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Picos/planta" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Horario apertura" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Litros" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Tanque" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Frecuencia" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Sistema" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: riegos.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm font-medium", children: r.codigoRiego }),
            /* @__PURE__ */ jsx(TableCell, { children: r.picosPorPlanta ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: r.horarioApertura ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: r.cantidadLitros != null ? `${r.cantidadLitros} L` : "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: r.tanque ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: r.frecuenciaTiempo ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { children: r.sistemaRegado === "otro" ? r.sistemaRegadoCustom ?? "Otro" : SISTEMA_REGADO_LABEL[r.sistemaRegado] }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => {
                  setEditRiegoForm({
                    codigoRiego: r.codigoRiego,
                    picosPorPlanta: r.picosPorPlanta != null ? String(r.picosPorPlanta) : "",
                    horarioApertura: r.horarioApertura ?? "",
                    cantidadLitros: r.cantidadLitros != null ? String(r.cantidadLitros) : "",
                    tanque: r.tanque ?? "",
                    frecuenciaTiempo: r.frecuenciaTiempo ?? "",
                    sistemaRegado: r.sistemaRegado,
                    sistemaRegadoCustom: r.sistemaRegadoCustom ?? "",
                    notas: r.notas ?? ""
                  });
                  setEditRiego(r);
                }, children: [
                  /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                  "Editar"
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-red-600 focus:text-red-600", onClick: () => setDeleteRiegoId(r.id), children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                  "Eliminar"
                ] })
              ] })
            ] }) })
          ] }, r.id)) })
        ] }) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No hay sistemas de riego registrados para esta camilla." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Grilla de posiciones" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Slots generados desde 1 hasta la capacidad maxima de la camilla." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: Object.keys(STAGE_LABEL).map((stage) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setGridStage((prev) => prev === stage ? null : stage), className: ["inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-all", PLANT_STAGE_CLASS[stage], gridStage === stage ? "ring-2 ring-offset-1 ring-current scale-105 shadow-sm" : gridStage !== null ? "opacity-40" : ""].join(" "), children: STAGE_LABEL[stage] }, stage)) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-12", children: Array.from({
          length: Math.min(bed.maxPlants, 100)
        }, (_, index) => {
          const position = index + 1;
          const plant = plantsByPosition.get(position);
          const displayStage = gridStage ?? plant?.stage;
          return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
            if (plant) setDetailPlant(plant);
          }, className: ["min-h-[6rem] rounded-md border p-1 text-left transition-colors", displayStage ? PLANT_STAGE_CLASS[displayStage] : "border-dashed bg-muted/30 text-muted-foreground hover:bg-muted/50"].join(" "), children: [
            /* @__PURE__ */ jsxs("span", { className: "block font-mono text-[10px] leading-none", children: [
              "#",
              position
            ] }),
            /* @__PURE__ */ jsx("span", { className: "mt-0.5 block truncate text-[11px] font-medium leading-tight", children: plant ? shortCode(plant.internalCode) : "vacío" }),
            plant ? /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] leading-tight", children: STAGE_LABEL[displayStage ?? plant.stage] }) : null,
            plant ? /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] leading-tight opacity-80", children: PLANT_STATUS_LABEL[plant.status] }) : null,
            plant ? /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] leading-tight opacity-70", children: plant.motherPlantCode ?? "Sin madre" }) : null,
            plant ? /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] font-medium leading-tight", children: plant.geneticsName ?? "Sin genética" }) : null
          ] }, position);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(detailPlant), onOpenChange: (open) => {
      if (!open) setDetailPlant(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Detalle de planta" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Información completa de la planta seleccionada." })
      ] }),
      detailPlant ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 text-sm sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Código" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.internalCode })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nombre" }),
            /* @__PURE__ */ jsx("p", { children: detailPlant.plantName ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Madre de origen" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.motherPlantCode ?? "Sin madre" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Camilla" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: bed?.name ?? detailPlant.bedId })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Posición" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono", children: [
              "#",
              detailPlant.bedPosition
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Lote" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.batchId ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Etapa" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PLANT_STAGE_CLASS[detailPlant.stage], children: STAGE_LABEL[detailPlant.stage] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Estado" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PLANT_STATUS_CLASS[detailPlant.status], children: PLANT_STATUS_LABEL[detailPlant.status] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Origen" }),
            /* @__PURE__ */ jsx("p", { children: PLANT_ORIGIN_LABEL[detailPlant.origin] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Fecha inicio" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.startDate ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Fecha inicio etapa" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.stageStartDate ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Código maceta" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.potCode ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Litros maceta" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.potSizeLiters != null ? `${detailPlant.potSizeLiters} L` : "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Tipo maceta" }),
            /* @__PURE__ */ jsx("p", { children: detailPlant.potType ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sustrato" }),
            /* @__PURE__ */ jsx("p", { children: detailPlant.substrate ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Observaciones" }),
            /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap", children: detailPlant.notes ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 space-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Genética" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: detailPlant.geneticsName ?? "Sin genética" }),
            (() => {
              const gen = genetics.find((g) => g.id === detailPlant.geneticsId);
              if (!gen || gen.sativaPercent == null && gen.indicaPercent == null) return null;
              const sativa = gen.sativaPercent ?? 0;
              const indica = gen.indicaPercent ?? 0;
              const dominant = sativa >= indica ? "sativa" : "indica";
              return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-semibold", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-green-700", children: [
                    sativa,
                    "% Sativa"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-violet-700", children: [
                    indica,
                    "% Indica"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex h-3 overflow-hidden rounded-full border", children: [
                  /* @__PURE__ */ jsx("div", { className: "bg-green-500 transition-all", style: {
                    width: `${sativa}%`
                  } }),
                  /* @__PURE__ */ jsx("div", { className: "bg-violet-500 transition-all", style: {
                    width: `${indica}%`
                  } })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Predomina:",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: `font-semibold ${dominant === "sativa" ? "text-green-700" : "text-violet-700"}`, children: dominant === "sativa" ? "Sativa" : "Indica" })
                ] })
              ] });
            })()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDetailPlant(null), children: "Cerrar" }),
          /* @__PURE__ */ jsxs(Button, { className: "gap-2", onClick: () => {
            const plant = detailPlant;
            setDetailPlant(null);
            setSelectedPlant(plant);
            setQuickNotes(plant.notes ?? "");
          }, children: [
            /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
            "Editar planta"
          ] })
        ] })
      ] }) : null
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(editRiego), onOpenChange: (open) => {
      if (!open) setEditRiego(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Editar sistema de riego" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Modificá los datos del sistema de riego." })
      ] }),
      editRiego ? /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Código de riego *" }),
          /* @__PURE__ */ jsx(Input, { value: editRiegoForm.codigoRiego, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            codigoRiego: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Picos por planta" }),
          /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: editRiegoForm.picosPorPlanta, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            picosPorPlanta: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Horario de apertura" }),
          /* @__PURE__ */ jsx(Input, { type: "time", value: editRiegoForm.horarioApertura, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            horarioApertura: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Cantidad de litros" }),
          /* @__PURE__ */ jsx(Input, { type: "number", min: 0, step: "0.1", value: editRiegoForm.cantidadLitros, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            cantidadLitros: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Tanque" }),
          /* @__PURE__ */ jsx(Input, { value: editRiegoForm.tanque, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            tanque: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Frecuencia de tiempo" }),
          /* @__PURE__ */ jsx(Input, { value: editRiegoForm.frecuenciaTiempo, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            frecuenciaTiempo: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sistema de regado *" }),
          /* @__PURE__ */ jsxs(Select, { value: editRiegoForm.sistemaRegado, onValueChange: (v) => setEditRiegoForm((f) => ({
            ...f,
            sistemaRegado: v,
            sistemaRegadoCustom: ""
          })), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "goteo", children: "Por goteo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "continuo_intermitente", children: "Riego continuo intermitente" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "otro", children: "Otro" })
            ] })
          ] })
        ] }),
        editRiegoForm.sistemaRegado === "otro" ? /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Descripción del sistema *" }),
          /* @__PURE__ */ jsx(Input, { value: editRiegoForm.sistemaRegadoCustom, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            sistemaRegadoCustom: e.target.value
          })) })
        ] }) : null,
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 sm:col-span-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Notas" }),
          /* @__PURE__ */ jsx(Textarea, { value: editRiegoForm.notas, onChange: (e) => setEditRiegoForm((f) => ({
            ...f,
            notas: e.target.value
          })) })
        ] })
      ] }) : null,
      editRiegoError ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-red-200 bg-red-500/10 p-3 text-sm text-red-700", children: editRiegoError }) : null,
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setEditRiego(null), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: () => void handleRiegoEdit(), disabled: editRiegoSaving, children: editRiegoSaving ? "Guardando…" : "Guardar cambios" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(deleteRiegoId), onOpenChange: (open) => {
      if (!open) setDeleteRiegoId(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Eliminar sistema de riego" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Esta acción no se puede deshacer. ¿Confirmás la eliminación?" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDeleteRiegoId(null), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: () => void handleRiegoDelete(), children: "Eliminar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(BulkCreatePlantsDialog, { open: bulkOpen, onOpenChange: setBulkOpen, beds: bed ? [bed] : [], genetics, mothers, defaultBedId: bed?.id, onSuccess: () => void loadData() }),
    /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: deleteOpen, entityLabel: "camilla", itemName: bed.name, description: `Estas por eliminar la camilla ${bed.name}. Si tiene plantas, madres o tareas asociadas, la base no va a permitir la eliminacion.`, onOpenChange: setDeleteOpen, onConfirm: handleDeleteBed }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(selectedPlant), onOpenChange: (open) => !open && setSelectedPlant(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Editar planta" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Actualiza etapa, estado y observaciones rapidas de la maceta seleccionada." })
      ] }),
      selectedPlant ? /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Planta" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-sm", children: selectedPlant.internalCode })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Maceta" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-sm", children: selectedPlant.potCode ?? `${selectedPlant.potSizeLiters ?? "-"} L` })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Etapa" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedPlant.stage, onValueChange: (stage) => setSelectedPlant({
            ...selectedPlant,
            stage
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "vegetativo", children: "Vegetativo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "floracion", children: "Floracion" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "cosecha", children: "Cosecha" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "secado", children: "Secado" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "curado", children: "Curado" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "liberado", children: "Liberado" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "a_limpiar", children: "A Limpiar" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "a_reparar", children: "A Reparar" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Estado" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedPlant.status, onValueChange: (status) => setSelectedPlant({
            ...selectedPlant,
            status
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "normal", children: "Normal" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "observacion", children: "Observacion" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "alerta", children: "Alerta" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "descartada", children: "Descartada" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "cosechada", children: "Cosechada" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Observaciones rapidas" }),
          /* @__PURE__ */ jsx(Textarea, { value: quickNotes, onChange: (event) => setQuickNotes(event.target.value) })
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: () => void handleQuickPlantSave(), children: "Guardar cambios" })
      ] }) : null
    ] }) })
  ] });
}
export {
  GrowBedDetailPage as component
};
