import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { m as Route, B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { g as getGenetics } from "./geneticsService-1lKUW0eY.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
import { g as getMotherPlants } from "./motherPlantService-BEybLeEn.js";
import { g as getPlantById, u as updatePlant, c as createPlant } from "./plantService-BxfJ2ZYq.js";
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
const NEW_GENETICS_OPTION = "__new_genetics__";
function hasAvailablePlantSlot(bed) {
  return bed.currentPlants < bed.maxPlants;
}
function NewPlantPage() {
  const navigate = useNavigate();
  const {
    edit: editId
  } = Route.useSearch();
  const [beds, setBeds] = useState([]);
  const [genetics, setGenetics] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    internalCode: "",
    plantName: "",
    bedId: "",
    bedPosition: "1",
    batchId: "",
    geneticsId: "none",
    motherPlantId: "none",
    origin: "esqueje",
    stage: "vegetativo",
    status: "normal",
    sanitaryStatus: "bueno",
    startDate: today,
    stageStartDate: today,
    potSizeLiters: "",
    potType: "",
    substrate: "",
    notes: ""
  });
  useEffect(() => {
    setLoading(true);
    async function loadOptions() {
      try {
        const [nextBeds, nextGenetics, nextMothers] = await Promise.all([getGrowBeds(), getGenetics(), getMotherPlants()]);
        setBeds(nextBeds);
        setGenetics(nextGenetics);
        setMothers(nextMothers);
        if (editId) {
          const plant = await getPlantById(editId);
          if (!plant) {
            setError("Planta no encontrada.");
            return;
          }
          setForm({
            internalCode: plant.internalCode,
            plantName: plant.plantName ?? "",
            bedId: plant.bedId,
            bedPosition: String(plant.bedPosition),
            batchId: plant.batchId ?? "",
            geneticsId: plant.geneticsId ?? "none",
            motherPlantId: plant.motherPlantId ?? "none",
            origin: plant.origin,
            stage: plant.stage,
            status: plant.status,
            sanitaryStatus: plant.sanitaryStatus ?? "bueno",
            startDate: plant.startDate,
            stageStartDate: plant.stageStartDate ?? plant.startDate,
            potSizeLiters: plant.potSizeLiters ? String(plant.potSizeLiters) : "",
            potType: plant.potType ?? "",
            substrate: plant.substrate ?? "",
            notes: plant.notes ?? ""
          });
        } else {
          const firstBed = nextBeds.find(hasAvailablePlantSlot);
          setForm((current) => ({
            ...current,
            bedId: firstBed?.id ?? "",
            geneticsId: nextGenetics[0]?.id ?? "none"
          }));
        }
      } finally {
        setLoading(false);
      }
    }
    void loadOptions();
  }, [editId]);
  const filteredMothers = useMemo(() => {
    if (form.geneticsId === "none") return mothers;
    return mothers.filter((mother) => mother.geneticsId === form.geneticsId);
  }, [mothers, form.geneticsId]);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const selectedBed = beds.find((bed) => bed.id === form.bedId);
    const bedPosition = Number(form.bedPosition);
    const potSizeLiters = form.potSizeLiters ? Number(form.potSizeLiters) : void 0;
    if (!selectedBed) {
      setError("Selecciona una camilla.");
      return;
    }
    if (!form.internalCode.trim()) {
      setError("Ingresa el codigo interno de la planta.");
      return;
    }
    if (!form.plantName.trim()) {
      setError("Ingresa el nombre de la planta.");
      return;
    }
    if (form.geneticsId === "none") {
      setError("Selecciona una genetica para la planta.");
      return;
    }
    if (!Number.isInteger(bedPosition) || bedPosition < 1) {
      setError("La posicion debe ser un numero entero mayor a 0.");
      return;
    }
    if (potSizeLiters !== void 0 && (!Number.isFinite(potSizeLiters) || potSizeLiters <= 0)) {
      setError("El tamano de maceta debe ser mayor a 0.");
      return;
    }
    try {
      setSaving(true);
      const selectedGenetics = genetics.find((item) => item.id === form.geneticsId);
      const selectedMother = mothers.find((item) => item.id === form.motherPlantId);
      const payload = {
        internalCode: form.internalCode.trim(),
        plantName: form.plantName.trim(),
        roomId: selectedBed.roomId,
        bedId: form.bedId,
        bedPosition,
        batchId: form.batchId.trim() || void 0,
        geneticsId: form.geneticsId === "none" ? void 0 : form.geneticsId,
        geneticsName: selectedGenetics?.name,
        motherPlantId: form.motherPlantId === "none" ? void 0 : form.motherPlantId,
        motherPlantCode: selectedMother?.code,
        origin: form.origin,
        stage: form.stage,
        status: form.status,
        sanitaryStatus: form.sanitaryStatus,
        startDate: form.startDate,
        stageStartDate: form.stageStartDate || void 0,
        potSizeLiters,
        potType: form.potType.trim() || void 0,
        substrate: form.substrate.trim() || void 0,
        notes: form.notes.trim() || void 0
      };
      if (editId) {
        await updatePlant(editId, payload);
      } else {
        await createPlant(payload);
      }
      await navigate({
        to: "/app/cultivo/plantas"
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo guardar la planta.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1100px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/plantas", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Plantas"
      ] }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: editId ? "Editar planta" : "Nueva planta" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: editId ? "Actualiza los datos operativos de la planta." : "Alta operativa de planta individual por sala, camilla y posicion." })
    ] }),
    error ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: error }) : null,
    loading ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6 text-sm text-muted-foreground", children: "Cargando datos de la planta..." }) }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: editId ? "Editar planta" : "Crear planta" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Define donde queda registrada la planta dentro del cultivo." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "internalCode", children: "Codigo interno" }),
            /* @__PURE__ */ jsx(Input, { id: "internalCode", value: form.internalCode, onChange: (event) => setForm({
              ...form,
              internalCode: event.target.value
            }), placeholder: "PL-2026-001" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "plantName", children: "Nombre planta" }),
            /* @__PURE__ */ jsx(Input, { id: "plantName", value: form.plantName, onChange: (event) => setForm({
              ...form,
              plantName: event.target.value
            }), placeholder: "Madre 1 - esqueje A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Destino" }),
            /* @__PURE__ */ jsxs(Select, { value: form.bedId, onValueChange: (bedId) => setForm({
              ...form,
              bedId
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona destino" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: beds.map((bed) => {
                const isCurrentBed = editId && bed.id === form.bedId;
                const isFull = !hasAvailablePlantSlot(bed) && !isCurrentBed;
                return /* @__PURE__ */ jsxs(SelectItem, { value: bed.id, disabled: isFull, children: [
                  bed.name,
                  " - ",
                  bed.currentPlants,
                  "/",
                  bed.maxPlants,
                  isFull ? " - Llena" : ""
                ] }, bed.id);
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "bedPosition", children: "Posicion" }),
            /* @__PURE__ */ jsx(Input, { id: "bedPosition", type: "number", min: "1", step: "1", value: form.bedPosition, onChange: (event) => setForm({
              ...form,
              bedPosition: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "batchId", children: "Lote" }),
            /* @__PURE__ */ jsx(Input, { id: "batchId", value: form.batchId, onChange: (event) => setForm({
              ...form,
              batchId: event.target.value
            }), placeholder: "Opcional" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Genetica" }),
            /* @__PURE__ */ jsxs(Select, { value: form.geneticsId, onValueChange: (geneticsId) => {
              if (geneticsId === NEW_GENETICS_OPTION) {
                void navigate({
                  to: "/app/cultivo/geneticas/nueva"
                });
                return;
              }
              setForm({
                ...form,
                geneticsId,
                motherPlantId: "none"
              });
            }, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: NEW_GENETICS_OPTION, children: "Nueva genética" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "none", disabled: true, children: "Selecciona genetica" }),
                genetics.map((item) => /* @__PURE__ */ jsx(SelectItem, { value: item.id, children: item.name }, item.id))
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mt-6", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Datos de seguimiento" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Estado inicial y trazabilidad basica de la planta." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Planta madre" }),
            /* @__PURE__ */ jsxs(Select, { value: form.motherPlantId, onValueChange: (motherPlantId) => setForm({
              ...form,
              motherPlantId
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin asignar" }),
                filteredMothers.map((mother) => /* @__PURE__ */ jsxs(SelectItem, { value: mother.id, children: [
                  mother.code,
                  " - ",
                  mother.geneticsName
                ] }, mother.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Origen de la planta" }),
            /* @__PURE__ */ jsxs(Select, { value: form.origin, onValueChange: (origin) => setForm({
              ...form,
              origin
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "semilla", children: "Semilla" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "esqueje", children: "Esqueje" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "madre", children: "Madre" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "planta", children: "Planta" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Etapa" }),
            /* @__PURE__ */ jsxs(Select, { value: form.stage, onValueChange: (stage) => setForm({
              ...form,
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
            /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (status) => setForm({
              ...form,
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
            /* @__PURE__ */ jsx(Label, { children: "Estado sanitario" }),
            /* @__PURE__ */ jsxs(Select, { value: form.sanitaryStatus, onValueChange: (v) => setForm({
              ...form,
              sanitaryStatus: v
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "bueno", children: "Bueno" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "preventivo", children: "Preventivo" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "observacion", children: "En observacion" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "critico", children: "Critico" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "startDate", children: "Fecha de inicio" }),
            /* @__PURE__ */ jsx(DateInput, { id: "startDate", value: form.startDate, onChange: (v) => setForm({
              ...form,
              startDate: v
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "stageStartDate", children: "Inicio de etapa" }),
            /* @__PURE__ */ jsx(DateInput, { id: "stageStartDate", value: form.stageStartDate, onChange: (v) => setForm({
              ...form,
              stageStartDate: v
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "potSizeLiters", children: "Tamano de maceta (L)" }),
            /* @__PURE__ */ jsx(Input, { id: "potSizeLiters", type: "number", min: "0", step: "0.1", value: form.potSizeLiters, onChange: (event) => setForm({
              ...form,
              potSizeLiters: event.target.value
            }), placeholder: "Opcional" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "potType", children: "Tipo de maceta" }),
            /* @__PURE__ */ jsx(Input, { id: "potType", value: form.potType, onChange: (event) => setForm({
              ...form,
              potType: event.target.value
            }), placeholder: "Opcional" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-3", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "substrate", children: "Sustrato" }),
            /* @__PURE__ */ jsx(Input, { id: "substrate", value: form.substrate, onChange: (event) => setForm({
              ...form,
              substrate: event.target.value
            }), placeholder: "Opcional" })
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
            saving ? "Guardando..." : editId ? "Guardar cambios" : "Guardar planta"
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  NewPlantPage as component
};
