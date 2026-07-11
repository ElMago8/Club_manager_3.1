import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import { ArrowLeft, Wheat, Save } from "lucide-react";
import { B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { g as getBatches } from "./batchService-D6ZbIzbE.js";
import { g as getHarvestById, u as updateHarvest, c as createHarvest } from "./harvestService-8yHdLBj_.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
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
  code: "",
  batchId: "",
  roomId: "",
  harvestDate: today,
  wetWeight: "",
  dryWeight: "",
  shrinkage: "",
  status: "en_secado",
  notes: ""
};
function parseWeight(value) {
  if (!value.trim()) return void 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : void 0;
}
function formatCalculatedWeight(value) {
  return Number(value.toFixed(2)).toString();
}
function getCalculatedWeight(form) {
  const wetWeight = parseWeight(form.wetWeight);
  const dryWeight = parseWeight(form.dryWeight);
  const shrinkage = parseWeight(form.shrinkage);
  const filled = [wetWeight, dryWeight, shrinkage].filter((value) => value !== void 0);
  if (filled.length !== 2) return null;
  if (wetWeight === void 0 && dryWeight !== void 0 && shrinkage !== void 0) {
    return {
      field: "wetWeight",
      value: formatCalculatedWeight(dryWeight + shrinkage)
    };
  }
  if (dryWeight === void 0 && wetWeight !== void 0 && shrinkage !== void 0) {
    const value = wetWeight - shrinkage;
    return value >= 0 ? {
      field: "dryWeight",
      value: formatCalculatedWeight(value)
    } : null;
  }
  if (shrinkage === void 0 && wetWeight !== void 0 && dryWeight !== void 0) {
    const value = wetWeight - dryWeight;
    return value >= 0 ? {
      field: "shrinkage",
      value: formatCalculatedWeight(value)
    } : null;
  }
  return null;
}
function NewHarvestPage() {
  const navigate = useNavigate();
  const {
    edit: editId
  } = useSearch({
    from: "/app/cultivo/cosechas/nueva"
  });
  const [form, setForm] = useState(initialForm);
  const [batches, setBatches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const [batchList, roomList] = await Promise.all([getBatches(), getGrowRooms()]);
        setBatches(batchList);
        setRooms(roomList);
        if (editId) {
          const harvest = await getHarvestById(editId);
          if (!harvest) {
            setError("Cosecha no encontrada.");
            return;
          }
          setForm({
            code: harvest.code,
            batchId: harvest.batchId,
            roomId: harvest.roomId ?? "",
            harvestDate: harvest.harvestDate,
            wetWeight: harvest.wetWeightGrams != null ? String(harvest.wetWeightGrams) : "",
            dryWeight: harvest.dryWeightGrams != null ? String(harvest.dryWeightGrams) : "",
            shrinkage: harvest.shrinkageGrams != null ? String(harvest.shrinkageGrams) : "",
            status: harvest.status,
            notes: harvest.notes ?? ""
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar datos.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [editId]);
  const selectedBatch = useMemo(() => batches.find((b) => b.id === form.batchId), [batches, form.batchId]);
  const calculatedWeight = useMemo(() => getCalculatedWeight(form), [form]);
  function set(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }
  function weightValue(field) {
    return form[field] || (calculatedWeight?.field === field ? calculatedWeight.value : "");
  }
  function weightClass(field) {
    return calculatedWeight?.field === field ? "border-amber-400 bg-amber-500/15 font-semibold text-amber-900 ring-1 ring-amber-400/60 dark:border-amber-300 dark:bg-amber-400/20 dark:text-amber-100" : "";
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.code.trim()) {
      setError("El código de cosecha es obligatorio.");
      return;
    }
    if (!form.batchId) {
      setError("Seleccioná un lote de cultivo.");
      return;
    }
    if (!form.harvestDate) {
      setError("La fecha de cosecha es obligatoria.");
      return;
    }
    const wetWeightGrams = weightValue("wetWeight") ? parseFloat(weightValue("wetWeight")) : void 0;
    const dryWeightGrams = weightValue("dryWeight") ? parseFloat(weightValue("dryWeight")) : void 0;
    const shrinkageGrams = weightValue("shrinkage") ? parseFloat(weightValue("shrinkage")) : void 0;
    if (wetWeightGrams !== void 0 && (isNaN(wetWeightGrams) || wetWeightGrams < 0)) {
      setError("El peso húmedo debe ser un número válido mayor o igual a 0.");
      return;
    }
    if (dryWeightGrams !== void 0 && (isNaN(dryWeightGrams) || dryWeightGrams < 0)) {
      setError("El peso seco debe ser un número válido mayor o igual a 0.");
      return;
    }
    if (shrinkageGrams !== void 0 && (isNaN(shrinkageGrams) || shrinkageGrams < 0)) {
      setError("La merma debe ser un número válido mayor o igual a 0.");
      return;
    }
    if (wetWeightGrams !== void 0 && dryWeightGrams !== void 0 && shrinkageGrams !== void 0 && Math.abs(wetWeightGrams - dryWeightGrams - shrinkageGrams) > 0.01) {
      setError("Los pesos no coinciden: peso humedo debe ser igual a peso seco mas merma.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        code: form.code.trim(),
        batchId: form.batchId,
        batchCode: selectedBatch?.code,
        geneticsName: selectedBatch?.geneticsName,
        roomId: form.roomId || void 0,
        harvestDate: form.harvestDate,
        wetWeightGrams,
        dryWeightGrams,
        shrinkageGrams,
        status: form.status,
        notes: form.notes.trim() || void 0
      };
      if (editId) {
        await updateHarvest(editId, payload);
      } else {
        await createHarvest(payload);
      }
      await navigate({
        to: "/app/cultivo/cosechas"
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la cosecha.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[800px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/cosechas", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Cosechas"
      ] }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: editId ? "Editar cosecha" : "Nueva cosecha" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: editId ? "Modificá los datos de la cosecha registrada." : "Registrá una nueva cosecha asociada a un lote de cultivo." })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: error }),
    loading ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6 text-sm text-muted-foreground", children: "Cargando datos..." }) }) : /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Wheat, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx(CardTitle, { children: editId ? "Editar cosecha" : "Registrar cosecha" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Registrá los datos de la cosecha y su estado actual." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Código de cosecha *" }),
          /* @__PURE__ */ jsx(Input, { id: "code", placeholder: "COS-2026-003", value: form.code, onChange: (e) => set("code", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "harvestDate", children: "Fecha de cosecha *" }),
          /* @__PURE__ */ jsx(DateInput, { id: "harvestDate", value: form.harvestDate, onChange: (v) => set("harvestDate", v) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "batchId", children: "Lote de cultivo *" }),
          /* @__PURE__ */ jsxs(Select, { value: form.batchId, onValueChange: (v) => set("batchId", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "batchId", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar lote" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: batches.map((b) => /* @__PURE__ */ jsxs(SelectItem, { value: b.id, children: [
              b.code,
              b.geneticsName ? ` · ${b.geneticsName}` : "",
              b.roomName ? ` · ${b.roomName}` : ""
            ] }, b.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "roomId", children: "Sala de cultivo" }),
          /* @__PURE__ */ jsxs(Select, { value: form.roomId, onValueChange: (v) => set("roomId", v === "none" ? "" : v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "roomId", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar sala (opcional)" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin sala asignada" }),
              rooms.map((r) => /* @__PURE__ */ jsxs(SelectItem, { value: r.id, children: [
                r.name,
                " · ",
                r.code,
                r.cultivationType ? ` · ${r.cultivationType}` : ""
              ] }, r.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "wetWeight", children: "Peso húmedo (g)" }),
          /* @__PURE__ */ jsx(Input, { id: "wetWeight", type: "number", min: 0, step: "any", placeholder: "Ej: 1800", value: weightValue("wetWeight"), onChange: (e) => set("wetWeight", e.target.value), className: weightClass("wetWeight") }),
          calculatedWeight?.field === "wetWeight" ? /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-amber-700 dark:text-amber-300", children: "Calculado automaticamente." }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "dryWeight", children: "Peso seco (g)" }),
          /* @__PURE__ */ jsx(Input, { id: "dryWeight", type: "number", min: 0, step: "any", placeholder: "Ej: 420", value: weightValue("dryWeight"), onChange: (e) => set("dryWeight", e.target.value), className: weightClass("dryWeight") }),
          calculatedWeight?.field === "dryWeight" ? /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-amber-700 dark:text-amber-300", children: "Calculado automaticamente." }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "shrinkage", children: "Merma (g)" }),
          /* @__PURE__ */ jsx(Input, { id: "shrinkage", type: "number", min: 0, step: "any", placeholder: "Ej: 1380", value: weightValue("shrinkage"), onChange: (e) => set("shrinkage", e.target.value), className: weightClass("shrinkage") }),
          calculatedWeight?.field === "shrinkage" ? /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-amber-700 dark:text-amber-300", children: "Calculado automaticamente." }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "status", children: "Estado" }),
          /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (v) => set("status", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: "status", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "en_secado", children: "En secado" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "en_curado", children: "En curado" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "lista_para_stock", children: "Stock" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "descartada", children: "Descartada" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Observaciones" }),
          /* @__PURE__ */ jsx(Textarea, { id: "notes", placeholder: "Notas adicionales sobre la cosecha...", rows: 3, value: form.notes, onChange: (e) => set("notes", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 md:col-span-2", children: [
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: saving, children: [
            /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
            saving ? "Guardando..." : editId ? "Guardar cambios" : "Registrar cosecha"
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", type: "button", children: /* @__PURE__ */ jsx(Link, { to: "/app/cultivo/cosechas", children: "Cancelar" }) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  NewHarvestPage as component
};
