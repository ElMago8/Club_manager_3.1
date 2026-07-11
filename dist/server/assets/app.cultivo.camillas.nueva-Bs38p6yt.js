import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Ruler, Save } from "lucide-react";
import { q as Route, B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { i as getGrowBedById, n as updateGrowBed, a as createGrowBed } from "./growBedService-CR9jvSKV.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
import { g as getLocalMeasurementStatus, b as getMeasurements, c as createMeasurement } from "./measurementService-L_YC84-q.js";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
const initialForm = {
  name: "",
  code: "",
  roomId: "",
  status: "activa",
  maxPlants: "30",
  currentPlants: "0",
  mainBatchId: "",
  responsibleUserId: "",
  substratePH: "",
  substratePPM: "",
  liquidPH: "",
  liquidPPM: "",
  runoffPH: "",
  runoffPPM: "",
  measurementMethod: "otro",
  notes: ""
};
function optionalNumber(value) {
  if (!value.trim()) return void 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function optionalFieldValue(value) {
  return value === void 0 || value === null ? "" : String(value);
}
function NewGrowBedPage() {
  const navigate = useNavigate();
  const {
    edit: editId
  } = Route.useSearch();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(Boolean(editId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadRooms() {
      const nextRooms = await getGrowRooms();
      setRooms(nextRooms);
      if (editId) {
        try {
          const bed = await getGrowBedById(editId);
          if (!bed) {
            setError("Camilla no encontrada.");
            return;
          }
          let latestMeasurement;
          try {
            const measurements = await getMeasurements({
              bedId: editId
            });
            latestMeasurement = measurements[0];
          } catch {
          }
          setForm({
            name: bed.name,
            code: bed.code,
            roomId: bed.roomId,
            status: bed.status,
            maxPlants: String(bed.maxPlants),
            currentPlants: String(bed.currentPlants),
            mainBatchId: bed.mainBatchId ?? latestMeasurement?.batchId ?? "",
            responsibleUserId: bed.responsibleUserId ?? latestMeasurement?.responsibleName ?? "",
            substratePH: optionalFieldValue(latestMeasurement?.substratePH),
            substratePPM: optionalFieldValue(latestMeasurement?.substratePPM),
            liquidPH: optionalFieldValue(latestMeasurement?.liquidPH),
            liquidPPM: optionalFieldValue(latestMeasurement?.liquidPPM),
            runoffPH: optionalFieldValue(latestMeasurement?.runoffPH),
            runoffPPM: optionalFieldValue(latestMeasurement?.runoffPPM),
            measurementMethod: latestMeasurement?.measurementMethod ?? "otro",
            notes: bed.notes ?? ""
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "No se pudo cargar la camilla.");
        } finally {
          setLoading(false);
        }
        return;
      }
      setForm((current) => ({
        ...current,
        roomId: current.roomId || nextRooms[0]?.id || ""
      }));
      setLoading(false);
    }
    void loadRooms();
  }, [editId]);
  const previewStatus = getLocalMeasurementStatus({
    substratePH: optionalNumber(form.substratePH),
    substratePPM: optionalNumber(form.substratePPM),
    liquidPH: optionalNumber(form.liquidPH),
    liquidPPM: optionalNumber(form.liquidPPM),
    runoffPH: optionalNumber(form.runoffPH),
    runoffPPM: optionalNumber(form.runoffPPM)
  });
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const maxPlants = Number(form.maxPlants);
    const currentPlants = Number(form.currentPlants);
    const hasInitialMeasurement = Boolean(form.substratePH || form.substratePPM || form.liquidPH || form.liquidPPM || form.runoffPH || form.runoffPPM);
    if (!form.name.trim()) {
      setError("El nombre de la camilla es obligatorio.");
      return;
    }
    if (!form.code.trim()) {
      setError("El codigo de la camilla es obligatorio.");
      return;
    }
    if (!form.roomId) {
      setError("Selecciona una sala.");
      return;
    }
    if (!Number.isInteger(maxPlants) || maxPlants < 0 || maxPlants > 100) {
      setError("La capacidad maxima debe ser un numero entero entre 0 y 100.");
      return;
    }
    if (!Number.isInteger(currentPlants) || currentPlants < 0) {
      setError("Las plantas actuales deben ser un numero entero mayor o igual a 0.");
      return;
    }
    if (currentPlants > maxPlants) {
      setError("Las plantas actuales no pueden superar la capacidad maxima.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        tipo: "camilla",
        roomId: form.roomId,
        status: form.status,
        maxPlants,
        currentPlants,
        mainBatchId: form.mainBatchId.trim() || void 0,
        responsibleUserId: form.responsibleUserId.trim() || void 0,
        notes: form.notes.trim() || void 0
      };
      const bed = editId ? await updateGrowBed(editId, payload) : await createGrowBed(payload);
      if (hasInitialMeasurement) {
        await createMeasurement({
          measurementType: "mixed",
          date: today,
          time: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5),
          roomId: bed.roomId,
          bedId: bed.id,
          batchId: form.mainBatchId.trim() || void 0,
          relatedModule: "bed",
          substratePH: optionalNumber(form.substratePH),
          substratePPM: optionalNumber(form.substratePPM),
          liquidPH: optionalNumber(form.liquidPH),
          liquidPPM: optionalNumber(form.liquidPPM),
          runoffPH: optionalNumber(form.runoffPH),
          runoffPPM: optionalNumber(form.runoffPPM),
          measurementMethod: form.measurementMethod,
          responsibleName: form.responsibleUserId.trim() || void 0
        });
      }
      await navigate({
        to: "/app/cultivo/camillas/$id",
        params: {
          id: bed.id
        }
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo crear la camilla.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1100px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/camillas", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Camillas"
      ] }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: editId ? "Editar camilla" : "Nueva camilla" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: editId ? "Modificacion operativa de camilla, capacidad y sala asociada." : "Alta operativa de camilla con capacidad, sala y parametros iniciales." })
    ] }),
    error ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: error }) : null,
    loading ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6 text-sm text-muted-foreground", children: "Cargando datos de la camilla..." }) }) : /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Ruler, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx(CardTitle, { children: editId ? "Editar camilla" : "Crear camilla" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Completa los datos principales que aparecen en el listado." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
          /* @__PURE__ */ jsx(Input, { id: "name", value: form.name, onChange: (event) => setForm({
            ...form,
            name: event.target.value
          }), placeholder: "Camilla A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Codigo" }),
          /* @__PURE__ */ jsx(Input, { id: "code", value: form.code, onChange: (event) => setForm({
            ...form,
            code: event.target.value
          }), placeholder: "FL1-A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sala" }),
          /* @__PURE__ */ jsxs(Select, { value: form.roomId, onValueChange: (roomId) => setForm({
            ...form,
            roomId
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona sala" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Estado" }),
          /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (status) => setForm({
            ...form,
            status
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "activa", children: "Activa" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "vacia", children: "Vacia" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "limpieza", children: "Limpieza" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "mantenimiento", children: "Mantenimiento" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "fuera_de_uso", children: "Fuera de uso" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "maxPlants", children: "Capacidad maxima" }),
          /* @__PURE__ */ jsx(Input, { id: "maxPlants", type: "number", min: "0", max: "100", step: "1", value: form.maxPlants, onChange: (event) => setForm({
            ...form,
            maxPlants: event.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "currentPlants", children: "Plantas actuales" }),
          /* @__PURE__ */ jsx(Input, { id: "currentPlants", type: "number", min: "0", step: "1", value: form.currentPlants, onChange: (event) => setForm({
            ...form,
            currentPlants: event.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "mainBatchId", children: "Lote principal" }),
          /* @__PURE__ */ jsx(Input, { id: "mainBatchId", value: form.mainBatchId, onChange: (event) => setForm({
            ...form,
            mainBatchId: event.target.value
          }), placeholder: "Opcional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "responsibleUserId", children: "Responsable" }),
          /* @__PURE__ */ jsx(Input, { id: "responsibleUserId", value: form.responsibleUserId, onChange: (event) => setForm({
            ...form,
            responsibleUserId: event.target.value
          }), placeholder: "Sin asignar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Metodo de medicion" }),
          /* @__PURE__ */ jsxs(Select, { value: form.measurementMethod, onValueChange: (measurementMethod) => setForm({
            ...form,
            measurementMethod
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "manual_meter", children: "Medidor manual" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "drops", children: "Gotas" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "lab", children: "Laboratorio" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "sensor", children: "Sensor" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "estimated", children: "Estimado" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "other", children: "Otro" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "substratePH", children: "PH sustrato" }),
          /* @__PURE__ */ jsx(Input, { id: "substratePH", type: "number", min: "0", max: "14", step: "0.01", value: form.substratePH, onChange: (event) => setForm({
            ...form,
            substratePH: event.target.value
          }), placeholder: "Opcional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "substratePPM", children: "PPM sustrato" }),
          /* @__PURE__ */ jsx(Input, { id: "substratePPM", type: "number", min: "0", step: "1", value: form.substratePPM, onChange: (event) => setForm({
            ...form,
            substratePPM: event.target.value
          }), placeholder: "Opcional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "liquidPH", children: "PH liquido" }),
          /* @__PURE__ */ jsx(Input, { id: "liquidPH", type: "number", min: "0", max: "14", step: "0.01", value: form.liquidPH, onChange: (event) => setForm({
            ...form,
            liquidPH: event.target.value
          }), placeholder: "Opcional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "liquidPPM", children: "PPM liquido" }),
          /* @__PURE__ */ jsx(Input, { id: "liquidPPM", type: "number", min: "0", step: "1", value: form.liquidPPM, onChange: (event) => setForm({
            ...form,
            liquidPPM: event.target.value
          }), placeholder: "Opcional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "runoffPH", children: "PH drenaje" }),
          /* @__PURE__ */ jsx(Input, { id: "runoffPH", type: "number", min: "0", max: "14", step: "0.01", value: form.runoffPH, onChange: (event) => setForm({
            ...form,
            runoffPH: event.target.value
          }), placeholder: "Opcional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "runoffPPM", children: "PPM drenaje" }),
          /* @__PURE__ */ jsx(Input, { id: "runoffPPM", type: "number", min: "0", step: "1", value: form.runoffPPM, onChange: (event) => setForm({
            ...form,
            runoffPPM: event.target.value
          }), placeholder: "Opcional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Estado parametros" }),
          /* @__PURE__ */ jsx("div", { className: "flex h-10 items-center rounded-md border bg-muted/40 px-3 text-sm capitalize", children: previewStatus })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Observaciones" }),
          /* @__PURE__ */ jsx(Textarea, { id: "notes", value: form.notes, onChange: (event) => setForm({
            ...form,
            notes: event.target.value
          }), placeholder: "Notas internas" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end md:col-span-3", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: saving, className: "gap-2", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          saving ? "Guardando..." : editId ? "Guardar cambios" : "Guardar camilla"
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  NewGrowBedPage as component
};
