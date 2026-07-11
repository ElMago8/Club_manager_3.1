import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { FlaskConical, AlertTriangle, ArrowLeft, Plus, Pencil, Trash2, SendHorizonal, TimerOff, Timer } from "lucide-react";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { R as RelationshipWarning } from "./RelationshipWarning-BRJ5EkHV.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { B as Button, p as Route, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { toast } from "sonner";
import { a as bulkCreatePlantsForClonador, e as getPlants } from "./plantService-BxfJ2ZYq.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { e as getClonadorById, f as getClonadorOccupancy, g as getCamillasOnly, m as updateClonadorCapacity, s as sendToGrowBed, d as deleteClonador } from "./growBedService-CR9jvSKV.js";
import { b as getMeasurements } from "./measurementService-L_YC84-q.js";
import { g as getGrowRoomById } from "./growRoomService-BUC_ARXZ.js";
import { g as getGenetics } from "./geneticsService-1lKUW0eY.js";
import { g as getMotherPlants } from "./motherPlantService-BEybLeEn.js";
import { a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-dialog";
import "date-fns";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "@radix-ui/react-checkbox";
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
const EMPTY_FORM = {
  cantidad: 1,
  geneticsId: "",
  geneticsFromMother: false,
  motherPlantId: "",
  batchId: "",
  origin: "esqueje",
  stage: "vegetativo",
  status: "normal",
  startDate: todayISO(),
  notes: "",
  internalCodePrefix: "ESQ"
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
function BulkCreateClonadorDialog({
  open,
  onOpenChange,
  clonadorId,
  clonadorName,
  freeSlots,
  genetics,
  mothers,
  onSuccess
}) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const selectedGenetics = useMemo(
    () => genetics.find((g) => g.id === form.geneticsId),
    [genetics, form.geneticsId]
  );
  const selectedMother = useMemo(
    () => mothers.find((m) => m.id === form.motherPlantId),
    [mothers, form.motherPlantId]
  );
  const capacityWarning = form.cantidad > freeSlots ? `El clonador ${clonadorName} tiene solo ${freeSlots} posición${freeSlots !== 1 ? "es" : ""} libre${freeSlots !== 1 ? "s" : ""}.` : null;
  const previewRows = useMemo(
    () => Array.from({ length: Math.min(form.cantidad, 10) }, (_, i) => ({
      key: i,
      estimatedCode: `${form.internalCodePrefix}-${String(i + 1).padStart(4, "0")}`
    })),
    [form.cantidad, form.internalCodePrefix]
  );
  function resetAndClose() {
    setStep("form");
    setForm(EMPTY_FORM);
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
    if (!form.geneticsId) return "Seleccioná una genética.";
    if (!form.startDate) return "Ingresá una fecha de ingreso.";
    if (!form.internalCodePrefix.trim()) return "El prefijo de código no puede estar vacío.";
    if (form.cantidad < 1 || form.cantidad > 60)
      return "La cantidad debe estar entre 1 y 60.";
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
      const created = await bulkCreatePlantsForClonador({
        clonadorId,
        count: form.cantidad,
        geneticsId: form.geneticsId || void 0,
        motherPlantId: form.motherPlantId || void 0,
        batchId: form.batchId || void 0,
        origin: form.origin,
        stage: form.stage,
        status: form.status,
        startDate: form.startDate,
        notes: form.notes || void 0,
        internalCodePrefix: form.internalCodePrefix
      });
      toast.success(
        `${created.length} esqueje${created.length !== 1 ? "s" : ""} creado${created.length !== 1 ? "s" : ""} correctamente.`
      );
      onSuccess(created);
      resetAndClose();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudieron crear los esquejes."
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
            /* @__PURE__ */ jsx(FlaskConical, { className: "h-5 w-5" }),
            "Ingreso múltiple de esquejes"
          ] }),
          /* @__PURE__ */ jsxs(DialogDescription, { children: [
            "Creá varios esquejes con la misma genética en",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: clonadorName }),
            "."
          ] })
        ] }),
        step === "form" ? /* @__PURE__ */ jsx(
          FormStep,
          {
            form,
            setForm,
            genetics,
            mothers,
            capacityWarning,
            onMotherChange: handleMotherChange
          }
        ) : /* @__PURE__ */ jsx(
          PreviewStep,
          {
            form,
            previewRows,
            clonadorName,
            selectedGenetics,
            selectedMother
          }
        ),
        /* @__PURE__ */ jsx(DialogFooter, { className: "gap-2 pt-2", children: step === "form" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetAndClose, children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { onClick: handleNext, children: "Ver vista previa" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setStep("form"), children: "Volver" }),
          /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: saving, children: saving ? "Creando esquejes…" : `Crear ${form.cantidad} esqueje${form.cantidad !== 1 ? "s" : ""}` })
        ] }) })
      ] })
    }
  );
}
function FormStep({
  form,
  setForm,
  genetics,
  mothers,
  capacityWarning,
  onMotherChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "Cantidad de esquejes *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: 1,
            max: 60,
            value: form.cantidad,
            onChange: (e) => setForm((f) => ({
              ...f,
              cantidad: Math.max(1, Math.min(60, parseInt(e.target.value) || 1))
            }))
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
  clonadorName,
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
          " esqueje",
          form.cantidad !== 1 ? "s" : ""
        ] }),
        " ",
        "en ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: clonadorName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1.5 grid grid-cols-2 gap-x-6 gap-y-0.5 text-muted-foreground", children: [
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
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-md border border-border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Código estimado" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Genética" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Madre" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Clonador" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        previewRows.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: row.estimatedCode }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: selectedGenetics?.name ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: selectedMother?.code ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: clonadorName })
        ] }, row.key)),
        form.cantidad > 10 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(
          TableCell,
          {
            colSpan: 4,
            className: "py-2 text-center text-xs text-muted-foreground",
            children: [
              "… y ",
              form.cantidad - 10,
              " esqueje",
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
const BED_STATUS_CLASS = {
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
const PLANT_STATUS_CLASS = {
  normal: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  observacion: "border-sky-200 bg-sky-500/10 text-sky-700",
  alerta: "border-amber-200 bg-amber-500/10 text-amber-700",
  descartada: "border-muted bg-muted text-muted-foreground",
  cosechada: "border-violet-200 bg-violet-500/10 text-violet-700"
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
function shortCode(code) {
  const parts = code.split("-");
  return parts.slice(-2).join("-");
}
function elapsedLabel(startIso, now) {
  const ms = now - new Date(startIso).getTime();
  if (ms < 0) return "0h";
  const totalHours = Math.floor(ms / 36e5);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${totalHours}h`;
}
function ClonadorDetailPage() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const [clonador, setClonador] = useState(null);
  const [room, setRoom] = useState(null);
  const [plants, setPlants] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [camillas, setCamillas] = useState([]);
  const [genetics, setGenetics] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [capacityValue, setCapacityValue] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [selected, setSelected] = useState(/* @__PURE__ */ new Set());
  const [sendOpen, setSendOpen] = useState(false);
  const [targetCamillaId, setTargetCamillaId] = useState("");
  const [sendError, setSendError] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [stopContadorOpen, setStopContadorOpen] = useState(false);
  const [detailPlant, setDetailPlant] = useState(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 6e4);
    return () => clearInterval(interval);
  }, []);
  const [incSubstratePH, setIncSubstratePH] = useState(false);
  const [incSubstratePPM, setIncSubstratePPM] = useState(false);
  const [incLiquidPH, setIncLiquidPH] = useState(false);
  const [incLiquidPPM, setIncLiquidPPM] = useState(false);
  const [mSubstratePH, setMSubstratePH] = useState("");
  const [mSubstratePPM, setMSubstratePPM] = useState("");
  const [mLiquidPH, setMLiquidPH] = useState("");
  const [mLiquidPPM, setMLiquidPPM] = useState("");
  const [mSaving, setMSaving] = useState(false);
  const [mError, setMError] = useState("");
  const [mDeleteId, setMDeleteId] = useState(null);
  const [mDeleting, setMDeleting] = useState(false);
  async function loadData() {
    const next = await getClonadorById(id);
    setClonador(next);
    if (!next) return;
    setPlants(await getPlants({
      clonadorId: next.id
    }));
    setOccupancy(await getClonadorOccupancy(next.id));
    setCapacityValue(String(next.maxPlants));
    setRoom(await getGrowRoomById(next.roomId));
    setMeasurements(await getMeasurements({
      clonadorId: next.id
    }));
    setCamillas(await getCamillasOnly());
    const [nextGenetics, nextMothers] = await Promise.all([getGenetics(), getMotherPlants()]);
    setGenetics(nextGenetics);
    setMothers(nextMothers);
  }
  useEffect(() => {
    void loadData();
  }, [id]);
  const plantsByPosition = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const p of plants) m.set(p.bedPosition, p);
    return m;
  }, [plants]);
  const latestMeasurement = measurements[0];
  const activePlants = plants.filter((p) => p.status !== "descartada");
  const freeSlots = clonador ? Math.max(clonador.maxPlants - activePlants.length, 0) : 0;
  function toggleSelect(plantId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(plantId)) next.delete(plantId);
      else next.add(plantId);
      return next;
    });
  }
  async function handleCapacityUpdate() {
    if (!clonador) return;
    setCapacityError("");
    const max = Number(capacityValue);
    if (!Number.isFinite(max) || max < 0 || max > 60) {
      setCapacityError("La capacidad debe estar entre 0 y 60.");
      return;
    }
    try {
      await updateClonadorCapacity(clonador.id, max);
      await loadData();
    } catch (err) {
      setCapacityError(err instanceof Error ? err.message : "Error al actualizar.");
    }
  }
  async function handleSendToCamilla() {
    if (!clonador || !targetCamillaId || selected.size === 0) return;
    setSendError("");
    setSendLoading(true);
    try {
      await sendToGrowBed(clonador.id, [...selected], targetCamillaId);
      setSelected(/* @__PURE__ */ new Set());
      setSendOpen(false);
      setTargetCamillaId("");
      await loadData();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "No se pudieron mover los esquejes.");
    } finally {
      setSendLoading(false);
    }
  }
  function optNum(v) {
    const n = Number(v);
    return v.trim() && Number.isFinite(n) ? n : void 0;
  }
  const anyMedicion = incSubstratePH || incSubstratePPM || incLiquidPH || incLiquidPPM;
  async function handleRegisterMedicion() {
    if (!clonador || !anyMedicion) return;
    setMError("");
    setMSaving(true);
    try {
      await apiRequest("/cultivation/measurements", {
        method: "POST",
        body: JSON.stringify({
          fecha: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          hora: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5),
          tipo: "mixed",
          salaCultivoId: Number(clonador.roomId),
          clonadorId: Number(clonador.id),
          phSustrato: incSubstratePH ? optNum(mSubstratePH) : void 0,
          ppmSustrato: incSubstratePPM ? optNum(mSubstratePPM) : void 0,
          phLiquido: incLiquidPH ? optNum(mLiquidPH) : void 0,
          ppmLiquido: incLiquidPPM ? optNum(mLiquidPPM) : void 0,
          estado: "normal",
          metodo: "manual_meter"
        })
      });
      setMSubstratePH("");
      setMSubstratePPM("");
      setMLiquidPH("");
      setMLiquidPPM("");
      setIncSubstratePH(false);
      setIncSubstratePPM(false);
      setIncLiquidPH(false);
      setIncLiquidPPM(false);
      await loadData();
    } catch (err) {
      setMError(err instanceof Error ? err.message : "No se pudo registrar la medición.");
    } finally {
      setMSaving(false);
    }
  }
  async function handleDeleteMedicion(id2) {
    setMDeleting(true);
    try {
      await apiRequest(`/cultivation/measurements/${id2}`, {
        method: "DELETE"
      });
      setMDeleteId(null);
      await loadData();
    } catch {
      setMDeleteId(null);
    } finally {
      setMDeleting(false);
    }
  }
  async function handleDelete() {
    if (!clonador) return;
    try {
      await deleteClonador(clonador.id);
      await navigate({
        to: "/app/cultivo/clonador"
      });
    } catch (err) {
      setDeleteMessage(err instanceof Error ? err.message : "No se pudo eliminar el clonador.");
      setDeleteOpen(false);
    }
  }
  if (!clonador) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1000px] space-y-4", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/clonador", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Volver"
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-10 text-sm text-muted-foreground", children: "Clonador no encontrado." }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/clonador", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Clonadores"
        ] }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: clonador.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Grilla de esquejes y ocupación del clonador." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", onClick: () => setBulkDialogOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Ingreso múltiple"
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2 bg-emerald-700 hover:bg-emerald-800", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/clonador/nueva", search: {
          edit: clonador.id
        }, children: [
          /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
          "Editar"
        ] }) }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive", onClick: () => setDeleteOpen(true), children: [
          /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
          "Eliminar"
        ] }),
        selected.size > 0 && /* @__PURE__ */ jsxs(Button, { className: "gap-2", onClick: () => setSendOpen(true), children: [
          /* @__PURE__ */ jsx(SendHorizonal, { className: "h-4 w-4" }),
          "Enviar a camilla (",
          selected.size,
          ")"
        ] })
      ] })
    ] }),
    deleteMessage && /* @__PURE__ */ jsx(RelationshipWarning, { message: deleteMessage }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Ficha de clonador" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Datos operativos y capacidad." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-3 text-sm md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Código" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: clonador.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Sala asociada" }),
            /* @__PURE__ */ jsx("p", { children: room?.name ?? clonador.roomId })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Estado" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: BED_STATUS_CLASS[clonador.status], children: clonador.status.replace(/_/g, " ") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Capacidad máxima" }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono", children: [
              clonador.maxPlants,
              " esquejes"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Esquejes actuales" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: clonador.currentPlants })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Responsable" }),
            /* @__PURE__ */ jsx("p", { children: clonador.responsibleUserId ?? "Sin asignar" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Observaciones" }),
            /* @__PURE__ */ jsx("p", { children: clonador.notes ?? "Sin observaciones" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Capacidad disponible" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Slots ocupados vs. capacidad máxima." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Máximo" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-semibold", children: occupancy?.maxPlants ?? clonador.maxPlants })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ocupados" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-semibold", children: occupancy?.occupied ?? activePlants.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Libres" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-semibold", children: occupancy?.available ?? freeSlots })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-3 space-y-2 rounded-md border p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Ocupación" }),
                /* @__PURE__ */ jsxs("p", { className: "font-mono text-sm", children: [
                  occupancy?.occupancyPercentage ?? 0,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Input, { className: "w-20", type: "number", min: 0, max: 60, value: capacityValue, onChange: (e) => setCapacityValue(e.target.value) }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => void handleCapacityUpdate(), children: "Editar capacidad" })
              ] })
            ] }),
            capacityError && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: capacityError })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Mediciones" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Seleccioná los parámetros a registrar y completá los valores." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        latestMeasurement && /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Última medición registrada · ",
                latestMeasurement.date
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PARAM_STATUS_CLASS[latestMeasurement.status], children: latestMeasurement.status })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive", onClick: () => setMDeleteId(latestMeasurement.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [["substratePH", "PH sustrato", latestMeasurement.substratePH], ["substratePPM", "PPM sustrato", latestMeasurement.substratePPM], ["liquidPH", "PH líquido", latestMeasurement.liquidPH], ["liquidPPM", "PPM líquido", latestMeasurement.liquidPPM]].map(([key, label, value]) => /* @__PURE__ */ jsxs("div", { className: `space-y-1.5 ${value == null ? "opacity-40" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked: value != null, disabled: true, className: "pointer-events-none" }),
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground cursor-default", children: label })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-lg font-semibold pl-6", children: value ?? "-" })
          ] }, key)) })
        ] }),
        measurements.length > 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Historial de mediciones" }),
          /* @__PURE__ */ jsx("div", { className: "divide-y rounded-md border text-xs", children: measurements.slice(1).map((m) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 px-3 py-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
                m.date,
                " ",
                m.time
              ] }),
              m.substratePH != null && /* @__PURE__ */ jsxs("span", { children: [
                "PH sus: ",
                /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-foreground", children: m.substratePH })
              ] }),
              m.substratePPM != null && /* @__PURE__ */ jsxs("span", { children: [
                "PPM sus: ",
                /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-foreground", children: m.substratePPM })
              ] }),
              m.liquidPH != null && /* @__PURE__ */ jsxs("span", { children: [
                "PH liq: ",
                /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-foreground", children: m.liquidPH })
              ] }),
              m.liquidPPM != null && /* @__PURE__ */ jsxs("span", { children: [
                "PPM liq: ",
                /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-foreground", children: m.liquidPPM })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-[10px] py-0 ${PARAM_STATUS_CLASS[m.status]}`, children: m.status }),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0 text-muted-foreground hover:text-destructive", onClick: () => setMDeleteId(m.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }) })
            ] })
          ] }, m.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-4 space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Registrar nueva medición" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Checkbox, { id: "incSubstratePH", checked: incSubstratePH, onCheckedChange: (v) => setIncSubstratePH(Boolean(v)) }),
                /* @__PURE__ */ jsx(Label, { htmlFor: "incSubstratePH", className: "cursor-pointer text-sm", children: "PH sustrato" })
              ] }),
              incSubstratePH && /* @__PURE__ */ jsx(Input, { type: "number", min: "0", max: "14", step: "0.01", placeholder: "0.00", value: mSubstratePH, onChange: (e) => setMSubstratePH(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Checkbox, { id: "incSubstratePPM", checked: incSubstratePPM, onCheckedChange: (v) => setIncSubstratePPM(Boolean(v)) }),
                /* @__PURE__ */ jsx(Label, { htmlFor: "incSubstratePPM", className: "cursor-pointer text-sm", children: "PPM sustrato" })
              ] }),
              incSubstratePPM && /* @__PURE__ */ jsx(Input, { type: "number", min: "0", step: "1", placeholder: "0", value: mSubstratePPM, onChange: (e) => setMSubstratePPM(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Checkbox, { id: "incLiquidPH", checked: incLiquidPH, onCheckedChange: (v) => setIncLiquidPH(Boolean(v)) }),
                /* @__PURE__ */ jsx(Label, { htmlFor: "incLiquidPH", className: "cursor-pointer text-sm", children: "PH líquido" })
              ] }),
              incLiquidPH && /* @__PURE__ */ jsx(Input, { type: "number", min: "0", max: "14", step: "0.01", placeholder: "0.00", value: mLiquidPH, onChange: (e) => setMLiquidPH(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Checkbox, { id: "incLiquidPPM", checked: incLiquidPPM, onCheckedChange: (v) => setIncLiquidPPM(Boolean(v)) }),
                /* @__PURE__ */ jsx(Label, { htmlFor: "incLiquidPPM", className: "cursor-pointer text-sm", children: "PPM líquido" })
              ] }),
              incLiquidPPM && /* @__PURE__ */ jsx(Input, { type: "number", min: "0", step: "1", placeholder: "0", value: mLiquidPPM, onChange: (e) => setMLiquidPPM(e.target.value) })
            ] })
          ] }),
          anyMedicion && /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { className: "gap-2", disabled: mSaving, onClick: () => void handleRegisterMedicion(), children: [
            /* @__PURE__ */ jsx(FlaskConical, { className: "h-4 w-4" }),
            mSaving ? "Registrando..." : "Registrar medición"
          ] }) }),
          mError && /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: mError })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Grilla de esquejes" }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            "Hacé click para seleccionar esquejes. Seleccionados: ",
            selected.size,
            ".",
            selected.size > 0 && /* @__PURE__ */ jsx("button", { type: "button", className: "ml-2 text-xs text-primary underline", onClick: () => setSelected(/* @__PURE__ */ new Set()), children: "Limpiar selección" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-3", children: [
          clonador.contadorInicioEn ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-amber-200 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-700", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold", children: elapsedLabel(clonador.contadorInicioEn, now) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-auto cursor-pointer p-0 text-amber-700 hover:text-amber-900", onClick: () => setStopContadorOpen(true), children: /* @__PURE__ */ jsx(TimerOff, { className: "h-4 w-4" }) })
          ] }) : /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2 cursor-pointer", onClick: () => {
            void apiRequest(`/cultivation/clonadores/${clonador.id}`, {
              method: "PUT",
              body: JSON.stringify({
                contadorInicioEn: (/* @__PURE__ */ new Date()).toISOString()
              })
            }).then(() => loadData());
          }, children: [
            /* @__PURE__ */ jsx(Timer, { className: "h-4 w-4" }),
            "Activar contador"
          ] }),
          selected.size > 0 && /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-2", onClick: () => setSendOpen(true), children: [
            /* @__PURE__ */ jsx(SendHorizonal, { className: "h-4 w-4" }),
            "Enviar a camilla (",
            selected.size,
            ")"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10", children: Array.from({
        length: Math.min(clonador.maxPlants, 60)
      }, (_, idx) => {
        const position = idx + 1;
        const plant = plantsByPosition.get(position);
        const isSelected = plant ? selected.has(plant.id) : false;
        return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
          if (plant) {
            if (isSelected) {
              toggleSelect(plant.id);
            } else {
              setDetailPlant(plant);
            }
          }
        }, onContextMenu: (e) => {
          e.preventDefault();
          if (plant) toggleSelect(plant.id);
        }, className: ["min-h-[5.5rem] rounded-md border p-1.5 text-left transition-colors", plant ? [PLANT_STAGE_CLASS[plant.stage] ?? "border-slate-200 bg-slate-100 text-slate-800", isSelected ? "ring-2 ring-primary ring-offset-1 shadow-md" : ""].join(" ") : "border-dashed border-muted bg-muted/20 cursor-default"].join(" "), title: plant ? `#${position} · ${plant.internalCode} · click para ver detalles, clic derecho para seleccionar` : `#${position} · vacío`, children: [
          /* @__PURE__ */ jsxs("span", { className: "block font-mono text-[10px] leading-none opacity-70", children: [
            "#",
            position
          ] }),
          /* @__PURE__ */ jsx("span", { className: "mt-0.5 block truncate text-[11px] font-semibold leading-tight", children: plant ? shortCode(plant.internalCode) : "vacío" }),
          plant && /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] leading-tight", children: STAGE_LABEL[plant.stage] }),
          plant && /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] leading-tight opacity-80", children: PLANT_STATUS_LABEL[plant.status] }),
          plant && /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] leading-tight opacity-70", children: plant.motherPlantCode ?? "Sin madre" }),
          plant && /* @__PURE__ */ jsx("span", { className: "block truncate text-[10px] font-medium leading-tight", children: plant.geneticsName ?? "Sin genética" })
        ] }, position);
      }) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: sendOpen, onOpenChange: (o) => {
      setSendOpen(o);
      if (!o) setSendError("");
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[440px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Enviar esquejes a camilla" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Seleccionaste ",
          selected.size,
          " esqueje",
          selected.size !== 1 ? "s" : "",
          ". Elegí la camilla destino."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxs(Select, { value: targetCamillaId, onValueChange: setTargetCamillaId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar camilla" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: camillas.map((c) => /* @__PURE__ */ jsxs(SelectItem, { value: c.id, children: [
            c.name,
            " · ",
            c.code,
            " (",
            c.maxPlants - c.currentPlants,
            " libres)"
          ] }, c.id)) })
        ] }),
        sendError && /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: sendError })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setSendOpen(false), disabled: sendLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { disabled: !targetCamillaId || sendLoading, onClick: () => void handleSendToCamilla(), className: "gap-2", children: [
          /* @__PURE__ */ jsx(SendHorizonal, { className: "h-4 w-4" }),
          sendLoading ? "Enviando..." : "Confirmar envío"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: stopContadorOpen, onOpenChange: setStopContadorOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[380px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Detener contador" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "¿Querés detener el contador? Se perderá el tiempo registrado",
          clonador.contadorInicioEn ? ` (${elapsedLabel(clonador.contadorInicioEn, now)})` : "",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setStopContadorOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { variant: "destructive", onClick: () => {
          void apiRequest(`/cultivation/clonadores/${clonador.id}`, {
            method: "PUT",
            body: JSON.stringify({
              contadorInicioEn: null
            })
          }).then(() => {
            setStopContadorOpen(false);
            void loadData();
          });
        }, children: [
          /* @__PURE__ */ jsx(TimerOff, { className: "mr-2 h-4 w-4" }),
          "Detener"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: deleteOpen, entityLabel: "clonador", itemName: clonador.name, description: `Estás por eliminar el clonador ${clonador.name}. Si tiene esquejes u otros datos asociados, no se podrá eliminar.`, onOpenChange: setDeleteOpen, onConfirm: handleDelete }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(detailPlant), onOpenChange: (open) => {
      if (!open) setDetailPlant(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Detalle de esqueje" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Información completa del esqueje seleccionado." })
      ] }),
      detailPlant && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
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
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Posición en clonador" }),
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
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Fecha inicio" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.startDate ?? "-" })
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
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Fecha inicio etapa" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono", children: detailPlant.stageStartDate ?? "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Genética" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: detailPlant.geneticsName ?? "Sin genética" }),
            (() => {
              const gen = genetics.find((g) => g.id === detailPlant.geneticsId);
              if (!gen || gen.sativaPercent == null && gen.indicaPercent == null) return null;
              const sativa = gen.sativaPercent ?? 0;
              const indica = gen.indicaPercent ?? 0;
              return /* @__PURE__ */ jsxs("div", { className: "mt-1.5 space-y-1", children: [
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
                ] })
              ] });
            })()
          ] }),
          detailPlant.notes && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Observaciones" }),
            /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap text-sm", children: detailPlant.notes })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/app/cultivo/plantas", children: "Ver en lista" }) }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            setDetailPlant(null);
            toggleSelect(detailPlant.id);
          }, children: "Seleccionar" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(BulkCreateClonadorDialog, { open: bulkDialogOpen, onOpenChange: setBulkDialogOpen, clonadorId: clonador.id, clonadorName: clonador.name, freeSlots, genetics, mothers, onSuccess: () => void loadData() }),
    /* @__PURE__ */ jsx(Dialog, { open: mDeleteId !== null, onOpenChange: (open) => {
      if (!open) setMDeleteId(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[380px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Eliminar medición" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "¿Eliminar esta medición? Esta acción no se puede deshacer." })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setMDeleteId(null), disabled: mDeleting, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { variant: "destructive", disabled: mDeleting, onClick: () => {
          if (mDeleteId) void handleDeleteMedicion(mDeleteId);
        }, children: mDeleting ? "Eliminando..." : "Eliminar" })
      ] })
    ] }) })
  ] });
}
export {
  ClonadorDetailPage as component
};
