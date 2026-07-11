import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { l as Route, B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { l as getGrowBedsByRoom } from "./growBedService-CR9jvSKV.js";
import { g as getGrowRoomById, b as updateGrowRoomTechnicalConfig } from "./growRoomService-BUC_ARXZ.js";
import { a as getMeasurementSummary } from "./measurementService-L_YC84-q.js";
import "class-variance-authority";
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
const SENSOR_OPTIONS = ["temperatura", "humedad", "co2", "vpd", "temperatura_hoja", "ph", "ec", "otro"];
function boolValue(value) {
  return value ? "si" : "no";
}
function displayBool(value) {
  return value ? "Si" : "No";
}
function GrowRoomDetailPage() {
  const {
    id
  } = Route.useParams();
  const [room, setRoom] = useState(null);
  const [roomBeds, setRoomBeds] = useState([]);
  const [measurementSummary, setMeasurementSummary] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");
  useEffect(() => {
    void Promise.all([getGrowRoomById(id), getGrowBedsByRoom(id), getMeasurementSummary({
      roomId: id
    })]).then(([nextRoom, nextBeds, nextSummary]) => {
      setRoom(nextRoom);
      setRoomBeds(nextBeds);
      setMeasurementSummary(nextSummary);
    });
  }, [id]);
  const [form, setForm] = useState(null);
  useEffect(() => {
    if (room) setForm({
      ...room.technicalConfig
    });
  }, [room]);
  const sensorLabel = useMemo(() => form?.installedSensors.map((sensor) => sensor.replace("_", " ")).join(", ") ?? "", [form]);
  if (!room || !form) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1000px] space-y-4", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/salas", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Volver"
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-10 text-sm text-muted-foreground", children: "Sala no encontrada." }) })
    ] });
  }
  async function handleSave() {
    if (!room || !form) return;
    const updatedRoom = await updateGrowRoomTechnicalConfig(room.id, form);
    setRoom({
      ...updatedRoom
    });
    setSavedMessage("Configuracion tecnica actualizada correctamente.");
  }
  function toggleSensor(sensor) {
    setForm((current) => {
      if (!current) return current;
      const enabled = current.installedSensors.includes(sensor);
      return {
        ...current,
        installedSensors: enabled ? current.installedSensors.filter((item) => item !== sensor) : [...current.installedSensors, sensor]
      };
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/salas", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Salas"
        ] }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: room.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Ficha tecnica de sala y configuracion editable." })
      ] }),
      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "capitalize", children: room.status.replace("_", " ") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-[1fr_1.2fr]", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Ficha de sala" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Informacion operativa general." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "grid gap-3 text-sm", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Codigo" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: room.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Tipo" }),
            /* @__PURE__ */ jsx("p", { className: "capitalize", children: room.type })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Estado" }),
            /* @__PURE__ */ jsx("p", { className: "capitalize", children: room.status.replace("_", " ") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Capacidad" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono", children: [
              room.capacity ?? "-",
              " plantas"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Responsable" }),
            /* @__PURE__ */ jsx("p", { children: room.responsibleUserId ?? "Sin asignar" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Observaciones" }),
            /* @__PURE__ */ jsx("p", { children: room.notes ?? "Sin observaciones" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Configuracion tecnica" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Resumen de equipamiento y sensores registrados." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-3 text-sm md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Iluminacion" }),
            /* @__PURE__ */ jsx("p", { className: "uppercase", children: room.technicalConfig.lightingType })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Potencia total" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono", children: [
              room.technicalConfig.installedPowerWatts,
              " W"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Ventilacion" }),
            /* @__PURE__ */ jsx("p", { children: room.technicalConfig.ventilationSystem ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Extraccion" }),
            /* @__PURE__ */ jsx("p", { children: room.technicalConfig.extractionSystem ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Riego" }),
            /* @__PURE__ */ jsx("p", { className: "capitalize", children: room.technicalConfig.irrigationSystem })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Aire acondicionado" }),
            /* @__PURE__ */ jsx("p", { children: displayBool(room.technicalConfig.hasAirConditioning) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Deshumidificador" }),
            /* @__PURE__ */ jsx("p", { children: displayBool(room.technicalConfig.hasDehumidifier) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Sensores" }),
            /* @__PURE__ */ jsx("p", { children: sensorLabel })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Observaciones tecnicas" }),
            /* @__PURE__ */ jsx("p", { children: room.technicalConfig.notes ?? "-" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Resumen de parametros" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Promedios y alertas quimicas de la sala." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-6", children: [
        [["Promedio PH liquido", measurementSummary?.averageLiquidPH ?? "-"], ["Promedio PH sustrato", measurementSummary?.averageSubstratePH ?? "-"], ["Promedio PPM liquido", measurementSummary?.averageLiquidPPM ?? "-"], ["Promedio PPM sustrato", measurementSummary?.averageSubstratePPM ?? "-"], ["Alertas", measurementSummary?.alertsCount ?? 0], ["Criticas", measurementSummary?.criticalCount ?? 0]].map(([label, value]) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: label }),
          /* @__PURE__ */ jsx("p", { className: "font-mono text-xl font-semibold", children: value })
        ] }, label)),
        /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3 sm:col-span-2 lg:col-span-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ultima medicion registrada" }),
          /* @__PURE__ */ jsx("p", { className: "font-mono text-sm", children: measurementSummary?.latestMeasurements[0] ? `${measurementSummary.latestMeasurements[0].date} ${measurementSummary.latestMeasurements[0].time}` : "Sin mediciones" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Editar configuracion tecnica" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Actualiza la configuracion tecnica registrada para esta sala." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Tipo de iluminacion" }),
            /* @__PURE__ */ jsxs(Select, { value: form.lightingType, onValueChange: (value) => setForm({
              ...form,
              lightingType: value
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "led", children: "LED" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "hps", children: "HPS" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "cmh", children: "CMH" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "mixta", children: "Mixta" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "otra", children: "Otra" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Potencia total instalada" }),
            /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.installedPowerWatts, onChange: (event) => setForm({
              ...form,
              installedPowerWatts: Number(event.target.value)
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Sistema de ventilacion" }),
            /* @__PURE__ */ jsx(Input, { value: form.ventilationSystem ?? "", onChange: (event) => setForm({
              ...form,
              ventilationSystem: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Sistema de extraccion" }),
            /* @__PURE__ */ jsx(Input, { value: form.extractionSystem ?? "", onChange: (event) => setForm({
              ...form,
              extractionSystem: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Sistema de riego" }),
            /* @__PURE__ */ jsxs(Select, { value: form.irrigationSystem, onValueChange: (value) => setForm({
              ...form,
              irrigationSystem: value
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "manual", children: "Manual" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "automatico", children: "Automatico" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "mixto", children: "Mixto" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Aire acondicionado" }),
              /* @__PURE__ */ jsxs(Select, { value: boolValue(form.hasAirConditioning), onValueChange: (value) => setForm({
                ...form,
                hasAirConditioning: value === "si"
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "si", children: "Si" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "no", children: "No" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Deshumidificador" }),
              /* @__PURE__ */ jsxs(Select, { value: boolValue(form.hasDehumidifier), onValueChange: (value) => setForm({
                ...form,
                hasDehumidifier: value === "si"
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "si", children: "Si" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "no", children: "No" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sensores instalados" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: SENSOR_OPTIONS.map((sensor) => {
            const active = form.installedSensors.includes(sensor);
            return /* @__PURE__ */ jsx(Button, { type: "button", variant: active ? "default" : "outline", size: "sm", onClick: () => toggleSensor(sensor), className: "capitalize", children: sensor.replace("_", " ") }, sensor);
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-4", children: [["targetLiquidPHMin", "PH liquido min"], ["targetLiquidPHMax", "PH liquido max"], ["targetSubstratePHMin", "PH sustrato min"], ["targetSubstratePHMax", "PH sustrato max"], ["targetLiquidPPMMin", "PPM liquido min"], ["targetLiquidPPMMax", "PPM liquido max"], ["targetSubstratePPMMin", "PPM sustrato min"], ["targetSubstratePPMMax", "PPM sustrato max"]].map(([key, label]) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: label }),
          /* @__PURE__ */ jsx(Input, { type: "number", value: form[key] ?? "", onChange: (event) => setForm({
            ...form,
            [key]: event.target.value === "" ? void 0 : Number(event.target.value)
          }) })
        ] }, key)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Observaciones tecnicas" }),
          /* @__PURE__ */ jsx(Textarea, { value: form.notes ?? "", onChange: (event) => setForm({
            ...form,
            notes: event.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxs(Button, { onClick: handleSave, className: "gap-2", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            "Guardar configuracion"
          ] }),
          savedMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-600", children: savedMessage }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Camillas de la sala" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Relacion visual sala - camillas con datos registrados." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Codigo" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Capacidad" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Plantas actuales" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Lote principal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Accion" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: roomBeds.map((bed) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: bed.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.code }),
          /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: bed.status.replace("_", " ") }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.maxPlants }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.currentPlants }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: bed.mainBatchId ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(Link, { to: "/app/cultivo/camillas/$id", params: {
            id: bed.id
          }, children: "Ver camilla" }) }) })
        ] }, bed.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  GrowRoomDetailPage as component
};
