import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Droplets, Sprout, FlaskConical, Leaf, AlertTriangle, AlertCircle, Plus } from "lucide-react";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent, B as Button } from "./router-Rtc38bRC.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
import { g as getMotherPlants } from "./motherPlantService-BEybLeEn.js";
import { e as getPlants } from "./plantService-BxfJ2ZYq.js";
import { g as getLocalMeasurementStatus, b as getMeasurements, c as createMeasurement } from "./measurementService-L_YC84-q.js";
import "class-variance-authority";
import "@tanstack/react-router";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
const initialForm = {
  measurementType: "mixed",
  date: today,
  time: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5),
  roomId: "none",
  bedId: "none",
  plantId: "none",
  motherPlantId: "none",
  batchId: "",
  substratePH: "",
  substratePPM: "",
  substrateEC: "",
  liquidPH: "",
  liquidPPM: "",
  liquidEC: "",
  runoffPH: "",
  runoffPPM: "",
  runoffEC: "",
  waterTempC: "",
  substrateTempC: "",
  measurementMethod: "gota",
  responsibleName: "Operador demo",
  notes: ""
};
const STATUS_LABEL = {
  normal: "Normal",
  observation: "Observacion",
  alert: "Alerta",
  critical: "Critico"
};
const STATUS_CLASS = {
  normal: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  observation: "border-sky-200 bg-sky-500/10 text-sky-700",
  alert: "border-amber-200 bg-amber-500/10 text-amber-700",
  critical: "border-red-200 bg-red-500/10 text-red-700"
};
const TYPE_LABEL = {
  substrate: "Sustrato",
  liquid_input: "Liquido entrada",
  runoff: "Drenaje",
  mixed: "Mixta",
  corrective: "Correctiva",
  routine_check: "Control rutinario"
};
const METHOD_LABEL = {
  gota: "Gota",
  sensor: "Sensor",
  riego_continuo: "Riego continuo",
  riego_manual: "Riego manual",
  otro: "Otro"
};
function optionalNumber(value) {
  return value === "" ? void 0 : Number(value);
}
function latestValue(measurements, key) {
  return measurements.find((item) => typeof item[key] === "number")?.[key];
}
function statusBadge(status) {
  return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[status], children: STATUS_LABEL[status] });
}
function MeasurementsPage() {
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [plants, setPlants] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    roomId: "all",
    bedId: "all",
    plantId: "all",
    motherPlantId: "all",
    measurementType: "all",
    status: "all"
  });
  const [message, setMessage] = useState("");
  async function loadMeasurements(nextFilters = filters) {
    const apiFilters = {};
    if (nextFilters.dateFrom) apiFilters.dateFrom = nextFilters.dateFrom;
    if (nextFilters.dateTo) apiFilters.dateTo = nextFilters.dateTo;
    if (nextFilters.roomId !== "all") apiFilters.roomId = nextFilters.roomId;
    if (nextFilters.bedId !== "all") apiFilters.bedId = nextFilters.bedId;
    if (nextFilters.plantId !== "all") apiFilters.plantId = nextFilters.plantId;
    if (nextFilters.motherPlantId !== "all") apiFilters.motherPlantId = nextFilters.motherPlantId;
    if (nextFilters.measurementType !== "all") apiFilters.measurementType = nextFilters.measurementType;
    if (nextFilters.status !== "all") apiFilters.status = nextFilters.status;
    setMeasurements(await getMeasurements(apiFilters));
  }
  useEffect(() => {
    void Promise.all([getGrowRooms(), getGrowBeds(), getPlants(), getMotherPlants()]).then(([nextRooms, nextBeds, nextPlants, nextMothers]) => {
      setRooms(nextRooms);
      setBeds(nextBeds);
      setPlants(nextPlants);
      setMothers(nextMothers);
    });
  }, []);
  useEffect(() => {
    void loadMeasurements(filters);
  }, [filters.dateFrom, filters.dateTo, filters.roomId, filters.bedId, filters.plantId, filters.motherPlantId, filters.measurementType, filters.status]);
  const flatMeasurements = useMemo(() => measurements.map((m) => ({
    ...m,
    _roomName: rooms.find((r) => r.id === m.roomId)?.name ?? m.roomId ?? "-",
    _bedName: beds.find((b) => b.id === m.bedId)?.name ?? "-"
  })), [measurements, rooms, beds]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(flatMeasurements);
  const summary = useMemo(() => {
    const latest = measurements.slice(0, 6);
    return {
      latestMeasurements: latest,
      latestLiquidPH: latestValue(measurements, "liquidPH"),
      latestSubstratePH: latestValue(measurements, "substratePH"),
      latestLiquidPPM: latestValue(measurements, "liquidPPM"),
      latestSubstratePPM: latestValue(measurements, "substratePPM"),
      alertsCount: measurements.filter((item) => item.status === "alert").length,
      criticalCount: measurements.filter((item) => item.status === "critical").length
    };
  }, [measurements]);
  const previewStatus = getLocalMeasurementStatus({
    substratePH: optionalNumber(form.substratePH),
    substratePPM: optionalNumber(form.substratePPM),
    liquidPH: optionalNumber(form.liquidPH),
    liquidPPM: optionalNumber(form.liquidPPM)
  });
  function roomName(id) {
    if (!id) return "-";
    return rooms.find((room) => room.id === id)?.name ?? id;
  }
  function bedName(id) {
    if (!id) return "-";
    return beds.find((bed) => bed.id === id)?.name ?? id;
  }
  function plantName(id) {
    if (!id) return "-";
    return plants.find((plant) => plant.id === id)?.internalCode ?? id;
  }
  function motherName(id) {
    if (!id) return "-";
    return mothers.find((mother) => mother.id === id)?.code ?? id;
  }
  async function handleSave() {
    if (!form.date || !form.time) {
      setMessage("Fecha y hora son obligatorias.");
      return;
    }
    if (form.roomId === "none") {
      setMessage("Selecciona una sala.");
      return;
    }
    const payload = {
      measurementType: form.measurementType,
      date: form.date,
      time: form.time,
      roomId: form.roomId === "none" ? void 0 : form.roomId,
      bedId: form.bedId === "none" ? void 0 : form.bedId,
      plantId: form.plantId === "none" ? void 0 : form.plantId,
      motherPlantId: form.motherPlantId === "none" ? void 0 : form.motherPlantId,
      batchId: form.batchId || void 0,
      relatedModule: form.motherPlantId !== "none" ? "mother" : form.plantId !== "none" ? "plant" : form.bedId !== "none" ? "bed" : "general",
      substratePH: optionalNumber(form.substratePH),
      substratePPM: optionalNumber(form.substratePPM),
      substrateEC: optionalNumber(form.substrateEC),
      liquidPH: optionalNumber(form.liquidPH),
      liquidPPM: optionalNumber(form.liquidPPM),
      liquidEC: optionalNumber(form.liquidEC),
      runoffPH: optionalNumber(form.runoffPH),
      runoffPPM: optionalNumber(form.runoffPPM),
      runoffEC: optionalNumber(form.runoffEC),
      waterTempC: optionalNumber(form.waterTempC),
      substrateTempC: optionalNumber(form.substrateTempC),
      measurementMethod: form.measurementMethod,
      responsibleName: form.responsibleName || void 0,
      notes: form.notes || void 0
    };
    const created = await createMeasurement(payload);
    setMeasurements((current) => [created, ...current]);
    setForm((current) => ({
      ...initialForm,
      roomId: current.roomId,
      bedId: current.bedId
    }));
    setMessage(`Medicion guardada con estado ${STATUS_LABEL[created.status]}.`);
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1500px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Mediciones PH / PPM" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Control quimico de liquidos, sustrato y drenaje." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-6", children: [{
      label: "Ultimo PH liquido",
      value: summary.latestLiquidPH ?? "-",
      Icon: Droplets,
      accent: "bg-sky-500",
      panel: "bg-sky-500/10",
      iconClass: "text-sky-600 dark:text-sky-400"
    }, {
      label: "Ultimo PH sustrato",
      value: summary.latestSubstratePH ?? "-",
      Icon: Sprout,
      accent: "bg-lime-500",
      panel: "bg-lime-500/10",
      iconClass: "text-lime-600 dark:text-lime-400"
    }, {
      label: "Ultimo PPM liquido",
      value: summary.latestLiquidPPM ?? "-",
      Icon: FlaskConical,
      accent: "bg-teal-500",
      panel: "bg-teal-500/10",
      iconClass: "text-teal-600 dark:text-teal-400"
    }, {
      label: "Ultimo PPM sustrato",
      value: summary.latestSubstratePPM ?? "-",
      Icon: Leaf,
      accent: "bg-emerald-500",
      panel: "bg-emerald-500/10",
      iconClass: "text-emerald-600 dark:text-emerald-400"
    }, {
      label: "En alerta",
      value: summary.alertsCount,
      Icon: AlertTriangle,
      accent: "bg-amber-500",
      panel: "bg-amber-500/10",
      iconClass: "text-amber-600 dark:text-amber-400"
    }, {
      label: "Criticas",
      value: summary.criticalCount,
      Icon: AlertCircle,
      accent: "bg-red-500",
      panel: "bg-red-500/10",
      iconClass: "text-red-600 dark:text-red-400"
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
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-[440px_1fr]", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Nueva medicion" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "El estado se calcula automaticamente al guardar." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Tipo de medicion" }),
              /* @__PURE__ */ jsxs(Select, { value: form.measurementType, onValueChange: (measurementType) => setForm({
                ...form,
                measurementType
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(TYPE_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Fecha" }),
              /* @__PURE__ */ jsx(DateInput, { value: form.date, onChange: (v) => setForm({
                ...form,
                date: v
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Hora" }),
              /* @__PURE__ */ jsx(Input, { type: "time", value: form.time, onChange: (event) => setForm({
                ...form,
                time: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Sala" }),
              /* @__PURE__ */ jsxs(Select, { value: form.roomId, onValueChange: (roomId) => setForm({
                ...form,
                roomId,
                bedId: "none"
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin sala" }),
                  rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Camilla" }),
              /* @__PURE__ */ jsxs(Select, { value: form.bedId, onValueChange: (bedId) => setForm({
                ...form,
                bedId
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin camilla" }),
                  beds.map((bed) => /* @__PURE__ */ jsx(SelectItem, { value: bed.id, children: bed.name }, bed.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Planta" }),
              /* @__PURE__ */ jsxs(Select, { value: form.plantId, onValueChange: (plantId) => setForm({
                ...form,
                plantId
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin planta" }),
                  plants.map((plant) => /* @__PURE__ */ jsx(SelectItem, { value: plant.id, children: plant.internalCode }, plant.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Madre" }),
              /* @__PURE__ */ jsxs(Select, { value: form.motherPlantId, onValueChange: (motherPlantId) => setForm({
                ...form,
                motherPlantId
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin madre" }),
                  mothers.map((mother) => /* @__PURE__ */ jsx(SelectItem, { value: mother.id, children: mother.code }, mother.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Lote" }),
              /* @__PURE__ */ jsx(Input, { value: form.batchId, onChange: (event) => setForm({
                ...form,
                batchId: event.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "PH sustrato" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, max: 14, value: form.substratePH, onChange: (event) => setForm({
                ...form,
                substratePH: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "PPM sustrato" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.substratePPM, onChange: (event) => setForm({
                ...form,
                substratePPM: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "EC sustrato" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.substrateEC, onChange: (event) => setForm({
                ...form,
                substrateEC: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "PH liquido" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, max: 14, value: form.liquidPH, onChange: (event) => setForm({
                ...form,
                liquidPH: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "PPM liquido" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.liquidPPM, onChange: (event) => setForm({
                ...form,
                liquidPPM: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "EC liquido" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.liquidEC, onChange: (event) => setForm({
                ...form,
                liquidEC: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "PH drenaje" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, max: 14, value: form.runoffPH, onChange: (event) => setForm({
                ...form,
                runoffPH: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "PPM drenaje" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.runoffPPM, onChange: (event) => setForm({
                ...form,
                runoffPPM: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "EC drenaje" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.runoffEC, onChange: (event) => setForm({
                ...form,
                runoffEC: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Temp. agua" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, max: 50, value: form.waterTempC, onChange: (event) => setForm({
                ...form,
                waterTempC: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Temp. sustrato" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: 0, max: 50, value: form.substrateTempC, onChange: (event) => setForm({
                ...form,
                substrateTempC: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Metodo" }),
              /* @__PURE__ */ jsxs(Select, { value: form.measurementMethod, onValueChange: (measurementMethod) => setForm({
                ...form,
                measurementMethod
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(METHOD_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Responsable" }),
            /* @__PURE__ */ jsx(Input, { value: form.responsibleName, onChange: (event) => setForm({
              ...form,
              responsibleName: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Observaciones" }),
            /* @__PURE__ */ jsx(Textarea, { value: form.notes, onChange: (event) => setForm({
              ...form,
              notes: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsx("span", { children: "Estado previsto" }),
            statusBadge(previewStatus)
          ] }),
          message ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: message }) : null,
          /* @__PURE__ */ jsxs(Button, { className: "w-full gap-2", onClick: handleSave, children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Guardar medicion"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Historial" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Mediciones por sala, camilla, planta, madre y lote." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(DateInput, { className: "h-8 w-36 text-xs", value: filters.dateFrom, onChange: (v) => setFilters({
              ...filters,
              dateFrom: v
            }) }),
            /* @__PURE__ */ jsx(DateInput, { className: "h-8 w-36 text-xs", value: filters.dateTo, onChange: (v) => setFilters({
              ...filters,
              dateTo: v
            }) }),
            /* @__PURE__ */ jsxs(Select, { value: filters.roomId, onValueChange: (roomId) => setFilters({
              ...filters,
              roomId
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-36 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las salas" }),
                rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: filters.bedId, onValueChange: (bedId) => setFilters({
              ...filters,
              bedId
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-36 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las camillas" }),
                beds.map((bed) => /* @__PURE__ */ jsx(SelectItem, { value: bed.id, children: bed.name }, bed.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: filters.measurementType, onValueChange: (measurementType) => setFilters({
              ...filters,
              measurementType
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-40 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los tipos" }),
                Object.entries(TYPE_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: filters.status, onValueChange: (status) => setFilters({
              ...filters,
              status
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-36 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
                Object.entries(STATUS_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(SortHead, { label: "Fecha", sortKey: "date", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Hora", sortKey: "time", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Tipo", sortKey: "measurementType", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Sala", sortKey: "_roomName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Camilla", sortKey: "_bedName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(TableHead, { children: "Planta/Madre" }),
              /* @__PURE__ */ jsx(SortHead, { label: "PH liq.", sortKey: "liquidPH", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "PPM liq.", sortKey: "liquidPPM", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "PH sust.", sortKey: "substratePH", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "PPM sust.", sortKey: "substratePPM", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "PH dren.", sortKey: "runoffPH", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "PPM dren.", sortKey: "runoffPPM", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Responsable", sortKey: "responsibleName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: sorted.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: item.date }),
              /* @__PURE__ */ jsx(TableCell, { children: item.time }),
              /* @__PURE__ */ jsx(TableCell, { children: TYPE_LABEL[item.measurementType] }),
              /* @__PURE__ */ jsx(TableCell, { children: roomName(item.roomId) }),
              /* @__PURE__ */ jsx(TableCell, { children: bedName(item.bedId) }),
              /* @__PURE__ */ jsx(TableCell, { children: item.plantId ? plantName(item.plantId) : motherName(item.motherPlantId) }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: item.liquidPH ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: item.liquidPPM ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: item.substratePH ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: item.substratePPM ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: item.runoffPH ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: item.runoffPPM ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: statusBadge(item.status) }),
              /* @__PURE__ */ jsx(TableCell, { children: item.responsibleName ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", disabled: true, children: "Ver" }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  MeasurementsPage as component
};
