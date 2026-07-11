import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { k as Route, B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { g as getGrowRoomById, u as updateGrowRoom, c as createGrowRoom } from "./growRoomService-BUC_ARXZ.js";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
const PRESET_ENTORNOS = ["indoor", "outdoor", "invernadero"];
const PRESET_MEDIOS = ["sustrato", "fibra_de_coco", "lana_de_roca", "hidroponia", "aeroponia"];
const ROOM_TYPE_OPTIONS = [{
  value: "vegetativo",
  label: "Vegetativo"
}, {
  value: "floracion",
  label: "Floracion"
}, {
  value: "madres",
  label: "Madres"
}, {
  value: "esquejes",
  label: "Esquejes"
}, {
  value: "secado",
  label: "Secado"
}, {
  value: "curado",
  label: "Curado"
}];
const initialForm = {
  code: "",
  name: "",
  type: "vegetativo",
  status: "activa",
  installedPowerWatts: "0",
  irrigationSystem: "manual",
  hasAirConditioning: "no",
  hasDehumidifier: "no",
  sensors: "",
  cultivationType: "",
  growMedium: "",
  notes: ""
};
function parseRoomTypes(value) {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}
function joinRoomTypes(values) {
  return values.join(", ");
}
function NewGrowRoomPage() {
  const navigate = useNavigate();
  const {
    edit: editId
  } = Route.useSearch();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(Boolean(editId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customTypeOpen, setCustomTypeOpen] = useState(false);
  const [customTypeInput, setCustomTypeInput] = useState("");
  const customTypeRef = useRef(null);
  const [customMediumOpen, setCustomMediumOpen] = useState(false);
  const [customMediumInput, setCustomMediumInput] = useState("");
  const customMediumRef = useRef(null);
  useEffect(() => {
    if (!editId) {
      setLoading(false);
      return;
    }
    const safeId = editId;
    async function loadRoom() {
      try {
        const room = await getGrowRoomById(safeId);
        if (!room) {
          setError("Sala no encontrada.");
          return;
        }
        setForm({
          code: room.code,
          name: room.name,
          type: room.type,
          status: room.status,
          installedPowerWatts: String(room.technicalConfig.installedPowerWatts),
          irrigationSystem: room.technicalConfig.irrigationSystem === "automatico" ? "automatico" : "manual",
          hasAirConditioning: room.technicalConfig.hasAirConditioning ? "si" : "no",
          hasDehumidifier: room.technicalConfig.hasDehumidifier ? "si" : "no",
          sensors: room.technicalConfig.installedSensors.join(", "),
          cultivationType: room.cultivationType ?? "",
          growMedium: room.growMedium ?? "",
          notes: room.notes ?? ""
        });
      } finally {
        setLoading(false);
      }
    }
    void loadRoom();
  }, [editId]);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.code.trim()) {
      setError("El codigo de sala es obligatorio.");
      return;
    }
    if (!form.name.trim()) {
      setError("El nombre de sala es obligatorio.");
      return;
    }
    if (!parseRoomTypes(form.type).length) {
      setError("Selecciona al menos un tipo de sala.");
      return;
    }
    const installedPowerWatts = Number(form.installedPowerWatts);
    if (!Number.isInteger(installedPowerWatts) || installedPowerWatts < 0) {
      setError("La potencia debe ser un numero entero mayor o igual a 0.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        type: form.type,
        status: form.status,
        installedPowerWatts,
        irrigationSystem: form.irrigationSystem,
        hasAirConditioning: form.hasAirConditioning === "si",
        hasDehumidifier: form.hasDehumidifier === "si",
        installedSensors: form.sensors.split(",").map((sensor) => sensor.trim()).filter(Boolean),
        cultivationType: form.cultivationType.trim() || void 0,
        growMedium: form.growMedium.trim() || void 0,
        notes: form.notes.trim() || void 0
      };
      const room = editId ? await updateGrowRoom(editId, payload) : await createGrowRoom(payload);
      await navigate({
        to: "/app/cultivo/salas/$id",
        params: {
          id: room.id
        }
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo crear la sala.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[900px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/salas", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Salas"
      ] }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: editId ? "Editar sala" : "Nueva sala" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: editId ? "Modificacion de sala de cultivo segun la estructura actual de la base." : "Alta de sala de cultivo segun la estructura actual de la base." })
    ] }),
    error ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: error }) : null,
    loading ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6 text-sm text-muted-foreground", children: "Cargando datos de la sala..." }) }) : /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: editId ? "Editar sala" : "Crear sala" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "La capacidad total se calcula desde sus camillas." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Codigo de sala" }),
            /* @__PURE__ */ jsx(Input, { id: "code", value: form.code, onChange: (event) => setForm({
              ...form,
              code: event.target.value
            }), placeholder: "SALA-FL-01" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
            /* @__PURE__ */ jsx(Input, { id: "name", value: form.name, onChange: (event) => setForm({
              ...form,
              name: event.target.value
            }), placeholder: "Floracion 1" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Estado" }),
            /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (status) => setForm({
              ...form,
              status
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "activa", children: "Activa" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "limpieza", children: "Limpieza" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "mantenimiento", children: "Mantenimiento" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "fuera_de_uso", children: "Fuera de uso" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "sensors", children: "Sensores" }),
            /* @__PURE__ */ jsx(Input, { id: "sensors", value: form.sensors, onChange: (event) => setForm({
              ...form,
              sensors: event.target.value
            }), placeholder: "temperatura, humedad, co2" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Tipo (permite varias opciones)" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-2 rounded-md border border-input bg-background/70 p-3 shadow-sm dark:bg-muted/35 sm:grid-cols-3", children: ROOM_TYPE_OPTIONS.map((option) => {
            const selectedTypes = parseRoomTypes(form.type);
            const checked = selectedTypes.includes(option.value);
            return /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked, onCheckedChange: (nextChecked) => {
                const nextTypes = nextChecked ? [...selectedTypes, option.value] : selectedTypes.filter((item) => item !== option.value);
                setForm({
                  ...form,
                  type: joinRoomTypes(nextTypes)
                });
              } }),
              option.label
            ] }, option.value);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "installedPowerWatts", children: "Potencia" }),
            /* @__PURE__ */ jsx(Input, { id: "installedPowerWatts", type: "number", min: "0", step: "1", value: form.installedPowerWatts, onChange: (event) => setForm({
              ...form,
              installedPowerWatts: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Riego" }),
            /* @__PURE__ */ jsxs(Select, { value: form.irrigationSystem, onValueChange: (irrigationSystem) => setForm({
              ...form,
              irrigationSystem
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "manual", children: "Manual" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "automatico", children: "Automatico" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "A/C" }),
            /* @__PURE__ */ jsxs(Select, { value: form.hasAirConditioning, onValueChange: (hasAirConditioning) => setForm({
              ...form,
              hasAirConditioning
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "si", children: "Si" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "no", children: "No" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Deshumidificador" }),
            /* @__PURE__ */ jsxs(Select, { value: form.hasDehumidifier, onValueChange: (hasDehumidifier) => setForm({
              ...form,
              hasDehumidifier
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "si", children: "Si" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "no", children: "No" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Entorno de cultivo" }),
            /* @__PURE__ */ jsxs(Select, { value: PRESET_ENTORNOS.includes(form.cultivationType) ? form.cultivationType : form.cultivationType ? "otro" : "", onValueChange: (v) => {
              if (v === "otro") {
                setCustomTypeInput("");
                setCustomTypeOpen(true);
              } else setForm({
                ...form,
                cultivationType: v
              });
            }, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar entorno", children: form.cultivationType && !PRESET_ENTORNOS.includes(form.cultivationType) ? form.cultivationType : void 0 }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "indoor", children: "Indoor" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "outdoor", children: "Outdoor" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "invernadero", children: "Invernadero" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "otro", children: "Otro" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Tipo de cultivo" }),
            /* @__PURE__ */ jsxs(Select, { value: PRESET_MEDIOS.includes(form.growMedium) ? form.growMedium : form.growMedium ? "otro" : "", onValueChange: (v) => {
              if (v === "otro") {
                setCustomMediumInput("");
                setCustomMediumOpen(true);
              } else setForm({
                ...form,
                growMedium: v
              });
            }, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar tipo", children: form.growMedium && !PRESET_MEDIOS.includes(form.growMedium) ? form.growMedium : void 0 }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "sustrato", children: "Sustrato" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "fibra_de_coco", children: "Fibra de coco" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "lana_de_roca", children: "Lana de roca" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "hidroponia", children: "Hidroponia" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "aeroponia", children: "Aeroponia" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "otro", children: "Otro" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Descripcion" }),
          /* @__PURE__ */ jsx(Textarea, { id: "notes", rows: 2, value: form.notes, onChange: (event) => setForm({
            ...form,
            notes: event.target.value
          }), placeholder: "Observaciones operativas de la sala" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: saving, className: "gap-2", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          saving ? "Guardando..." : editId ? "Guardar cambios" : "Guardar sala"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: customTypeOpen, onOpenChange: (open) => {
      if (!open && !form.cultivationType) setForm((f) => ({
        ...f,
        cultivationType: ""
      }));
      setCustomTypeOpen(open);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[380px]", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Entorno de cultivo personalizado" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 py-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "customType", children: "Describí el entorno de cultivo" }),
        /* @__PURE__ */ jsx(Input, { id: "customType", ref: customTypeRef, autoFocus: true, value: customTypeInput, onChange: (e) => setCustomTypeInput(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (customTypeInput.trim()) {
              setForm((f) => ({
                ...f,
                cultivationType: customTypeInput.trim()
              }));
              setCustomTypeOpen(false);
            }
          }
        } })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setCustomTypeOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { disabled: !customTypeInput.trim(), onClick: () => {
          setForm((f) => ({
            ...f,
            cultivationType: customTypeInput.trim()
          }));
          setCustomTypeOpen(false);
        }, children: "Confirmar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: customMediumOpen, onOpenChange: (open) => {
      if (!open && !form.growMedium) setForm((f) => ({
        ...f,
        growMedium: ""
      }));
      setCustomMediumOpen(open);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[380px]", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Tipo de cultivo personalizado" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 py-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "customMedium", children: "Describí el tipo de cultivo" }),
        /* @__PURE__ */ jsx(Input, { id: "customMedium", ref: customMediumRef, autoFocus: true, value: customMediumInput, onChange: (e) => setCustomMediumInput(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (customMediumInput.trim()) {
              setForm((f) => ({
                ...f,
                growMedium: customMediumInput.trim()
              }));
              setCustomMediumOpen(false);
            }
          }
        } })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setCustomMediumOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { disabled: !customMediumInput.trim(), onClick: () => {
          setForm((f) => ({
            ...f,
            growMedium: customMediumInput.trim()
          }));
          setCustomMediumOpen(false);
        }, children: "Confirmar" })
      ] })
    ] }) })
  ] });
}
export {
  NewGrowRoomPage as component
};
