import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Users, AlertTriangle } from "lucide-react";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { B as Button } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { toast } from "sonner";
import { b as bulkCreatePlantsForBed } from "./plantService-BxfJ2ZYq.js";
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
const EMPTY_FORM = {
  cantidad: 1,
  bedId: "",
  geneticsId: "",
  geneticsFromMother: false,
  motherPlantId: "",
  batchId: "",
  origin: "esqueje",
  stage: "vegetativo",
  status: "normal",
  startDate: todayISO(),
  notes: "",
  internalCodePrefix: "PLT"
};
const ORIGEN_LABEL = {
  semilla: "Semilla",
  esqueje: "Esqueje interno",
  madre: "Madre interna",
  planta: "Planta externa"
};
const ETAPA_LABEL = {
  vegetativo: "Vegetativo",
  floracion: "Floración",
  cosecha: "Cosecha",
  secado: "Secado",
  curado: "Curado",
  liberado: "Liberado",
  a_limpiar: "A limpiar",
  a_reparar: "A reparar"
};
const ESTADO_LABEL = {
  normal: "Normal",
  observacion: "Observación",
  alerta: "Alerta",
  descartada: "Descartada",
  cosechada: "Cosechada"
};
function BulkCreatePlantsDialog({
  open,
  onOpenChange,
  beds,
  genetics,
  mothers,
  onSuccess,
  defaultBedId
}) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    bedId: defaultBedId ?? ""
  }));
  const [saving, setSaving] = useState(false);
  const camillasBeds = useMemo(
    () => beds.filter((b) => b.tipo === "camilla"),
    [beds]
  );
  const selectedBed = useMemo(
    () => camillasBeds.find((b) => b.id === form.bedId),
    [camillasBeds, form.bedId]
  );
  const selectedGenetics = useMemo(
    () => genetics.find((g) => g.id === form.geneticsId),
    [genetics, form.geneticsId]
  );
  const selectedMother = useMemo(
    () => mothers.find((m) => m.id === form.motherPlantId),
    [mothers, form.motherPlantId]
  );
  const freeSlots = selectedBed ? selectedBed.maxPlants - selectedBed.currentPlants : null;
  const capacityWarning = freeSlots !== null && form.cantidad > freeSlots ? `La camilla ${selectedBed?.name ?? ""} tiene solo ${freeSlots} posición${freeSlots !== 1 ? "es" : ""} libre${freeSlots !== 1 ? "s" : ""}.` : null;
  const previewRows = useMemo(
    () => Array.from({ length: Math.min(form.cantidad, 10) }, (_, i) => ({
      key: i,
      estimatedCode: `${form.internalCodePrefix}-${String(i + 1).padStart(4, "0")}`
    })),
    [form.cantidad, form.internalCodePrefix]
  );
  function resetAndClose() {
    setStep("form");
    setForm({ ...EMPTY_FORM, bedId: defaultBedId ?? "" });
    onOpenChange(false);
  }
  function handleMotherChange(motherPlantId) {
    const mother = mothers.find((m) => m.id === motherPlantId);
    setForm((prev) => ({
      ...prev,
      motherPlantId,
      geneticsId: mother?.geneticsId ?? prev.geneticsId,
      geneticsFromMother: !!mother?.geneticsId
    }));
  }
  function validate() {
    if (!form.bedId) return "Seleccioná una camilla.";
    if (!form.geneticsId) return "Seleccioná una genética.";
    if (!form.startDate) return "Ingresá una fecha de ingreso.";
    if (!form.internalCodePrefix.trim()) return "El prefijo de código no puede estar vacío.";
    if (form.cantidad < 1 || form.cantidad > 100)
      return "La cantidad debe estar entre 1 y 100.";
    return null;
  }
  function handleNext() {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setStep("preview");
  }
  async function handleSubmit() {
    setSaving(true);
    try {
      const roomId = selectedBed?.roomId ?? "";
      const created = await bulkCreatePlantsForBed({
        bedId: form.bedId,
        count: form.cantidad,
        plant: {
          roomId,
          geneticsId: form.geneticsId || void 0,
          motherPlantId: form.motherPlantId || void 0,
          batchId: form.batchId || void 0,
          origin: form.origin,
          stage: form.stage,
          status: form.status,
          startDate: form.startDate,
          notes: form.notes || void 0,
          internalCodePrefix: form.internalCodePrefix
        }
      });
      toast.success(`${created.length} plantas creadas correctamente.`);
      onSuccess(created);
      resetAndClose();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudieron crear las plantas."
      );
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) resetAndClose();
        else onOpenChange(o);
      },
      children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }),
            "Ingreso múltiple de plantas"
          ] }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Creá varias plantas con el mismo origen, genética, lote y ubicación." })
        ] }),
        step === "form" ? /* @__PURE__ */ jsx(
          FormStep,
          {
            form,
            setForm,
            beds: camillasBeds,
            genetics,
            mothers,
            capacityWarning,
            onMotherChange: handleMotherChange,
            bedLocked: !!defaultBedId
          }
        ) : /* @__PURE__ */ jsx(
          PreviewStep,
          {
            form,
            previewRows,
            selectedBed,
            selectedGenetics,
            selectedMother
          }
        ),
        /* @__PURE__ */ jsx(DialogFooter, { className: "gap-2 pt-2", children: step === "form" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetAndClose, children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { onClick: handleNext, children: "Ver vista previa" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setStep("form"), children: "Volver" }),
          /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: saving, children: saving ? "Creando plantas…" : `Crear ${form.cantidad} planta${form.cantidad !== 1 ? "s" : ""}` })
        ] }) })
      ] })
    }
  );
}
function FormStep({
  form,
  setForm,
  beds,
  genetics,
  mothers,
  capacityWarning,
  onMotherChange,
  bedLocked = false
}) {
  const selectedBed = beds.find((b) => b.id === form.bedId);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Cantidad *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: 1,
            max: 100,
            value: form.cantidad,
            onChange: (e) => setForm((f) => ({
              ...f,
              cantidad: Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
            }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Camilla *" }),
        bedLocked ? /* @__PURE__ */ jsx("div", { className: "flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground", children: selectedBed?.name ?? form.bedId }) : /* @__PURE__ */ jsxs(
          Select,
          {
            value: form.bedId || "_none",
            onValueChange: (v) => setForm((f) => ({ ...f, bedId: v === "_none" ? "" : v })),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccioná camilla" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: beds.map((b) => /* @__PURE__ */ jsxs(SelectItem, { value: b.id, children: [
                b.name,
                " ",
                /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                  "(",
                  b.currentPlants,
                  "/",
                  b.maxPlants,
                  ")"
                ] })
              ] }, b.id)) })
            ]
          }
        )
      ] })
    ] }),
    capacityWarning && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 shrink-0" }),
      capacityWarning
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Madre (opcional)" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: form.motherPlantId || "_none",
            onValueChange: (v) => onMotherChange(v === "_none" ? "" : v),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sin madre" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "_none", children: "Sin madre" }),
                mothers.map((m) => /* @__PURE__ */ jsxs(SelectItem, { value: m.id, children: [
                  m.code,
                  m.name ? ` – ${m.name}` : ""
                ] }, m.id))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs(Label, { children: [
          "Genética *",
          form.geneticsFromMother && /* @__PURE__ */ jsx("span", { className: "ml-1.5 text-xs text-muted-foreground", children: "(de la madre)" })
        ] }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: form.geneticsId || "_none",
            onValueChange: (v) => setForm((f) => ({
              ...f,
              geneticsId: v === "_none" ? "" : v,
              geneticsFromMother: false
            })),
            disabled: form.geneticsFromMother,
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccioná genética" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: genetics.map((g) => /* @__PURE__ */ jsx(SelectItem, { value: g.id, children: g.name }, g.id)) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Origen" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: form.origin,
            onValueChange: (v) => setForm((f) => ({ ...f, origin: v })),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(ORIGEN_LABEL).map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o, children: ORIGEN_LABEL[o] }, o)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Etapa" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: form.stage,
            onValueChange: (v) => setForm((f) => ({ ...f, stage: v })),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(ETAPA_LABEL).map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: ETAPA_LABEL[s] }, s)) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Estado" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: form.status,
            onValueChange: (v) => setForm((f) => ({ ...f, status: v })),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(ESTADO_LABEL).map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: ESTADO_LABEL[s] }, s)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Fecha de ingreso *" }),
        /* @__PURE__ */ jsx(
          DateInput,
          {
            value: form.startDate,
            onChange: (v) => setForm((f) => ({ ...f, startDate: v }))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "ID de lote (opcional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "ej: 3",
            value: form.batchId,
            onChange: (e) => setForm((f) => ({ ...f, batchId: e.target.value }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Prefijo de código" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: form.internalCodePrefix,
            onChange: (e) => setForm((f) => ({
              ...f,
              internalCodePrefix: e.target.value.toUpperCase().replace(/\s/g, "")
            }))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: "Observaciones (opcional)" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          rows: 2,
          placeholder: "Notas sobre este ingreso…",
          value: form.notes,
          onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value }))
        }
      )
    ] })
  ] });
}
function PreviewStep({
  form,
  previewRows,
  selectedBed,
  selectedGenetics,
  selectedMother
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
        "Se crearán",
        " ",
        /* @__PURE__ */ jsxs("span", { className: "text-primary", children: [
          form.cantidad,
          " plantas"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1.5 grid grid-cols-2 gap-x-6 gap-y-0.5 text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Camilla: ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: selectedBed?.name ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Genética: ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: selectedGenetics?.name ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Madre: ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: selectedMother?.code ?? "Sin madre" })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Origen: ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: ORIGEN_LABEL[form.origin] })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Etapa: ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: ETAPA_LABEL[form.stage] })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Estado: ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: ESTADO_LABEL[form.status] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-md border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Código estimado" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Genética" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Madre" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Camilla" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        previewRows.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: row.estimatedCode }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: selectedGenetics?.name ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: selectedMother?.code ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: selectedBed?.name ?? "—" })
        ] }, row.key)),
        form.cantidad > 10 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(
          TableCell,
          {
            colSpan: 4,
            className: "py-2 text-center text-xs text-muted-foreground",
            children: [
              "… y ",
              form.cantidad - 10,
              " planta",
              form.cantidad - 10 !== 1 ? "s" : "",
              " más"
            ]
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "* Los códigos finales son asignados por el servidor. La numeración mostrada es estimada." })
  ] });
}
export {
  BulkCreatePlantsDialog as B
};
