import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Leaf, Tag, Sparkles, Wind, Save } from "lucide-react";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { G as GeneticsProfileSlider, n as normalizeGeneticsProfile } from "./GeneticsProfileSlider-BNNomNMy.js";
import { c as createGenetics } from "./geneticsService-1lKUW0eY.js";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-slider";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
function optionalNumber(value) {
  if (!value.trim()) return void 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function NewGeneticsPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    breeder: "",
    origin: void 0,
    type: "feminizada",
    dominantProfile: "hibrida",
    cannabinoidProfile: void 0,
    thcPercent: void 0,
    cbdPercent: void 0,
    floweringTimeDays: void 0,
    sativaPercent: 50,
    indicaPercent: 50,
    taste: "",
    effect: "",
    aroma: "",
    description: "",
    notes: ""
  });
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("El nombre de la genética es obligatorio.");
      return;
    }
    try {
      setSaving(true);
      const profile = normalizeGeneticsProfile(form.sativaPercent, form.indicaPercent);
      await createGenetics({
        ...form,
        ...profile,
        name: form.name.trim(),
        breeder: form.breeder?.trim(),
        taste: form.taste?.trim(),
        effect: form.effect?.trim(),
        aroma: form.aroma?.trim(),
        notes: form.notes?.trim()
      });
      await navigate({
        to: "/app/cultivo/geneticas"
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo crear la genética.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1180px] space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/geneticas", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Genéticas"
      ] }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Nueva genética" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Ficha técnica de variedad para asociarla luego a plantas o madres." })
    ] }),
    error ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: error }) : null,
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Crear genética" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Completá las especificaciones principales de la variedad." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-x-4 gap-y-3 lg:grid-cols-[minmax(0,0.575fr)_minmax(0,0.575fr)_minmax(320px,0.85fr)]", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-md border bg-muted/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:col-span-2 lg:col-start-1", children: "Datos de variedad" }),
        /* @__PURE__ */ jsx("div", { className: "rounded-md border bg-muted/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:col-start-3 lg:row-start-1", children: "Medicion" }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1 lg:col-span-2 lg:col-start-1 lg:row-start-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "name", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Leaf, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Genética"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "name", value: form.name, onChange: (event) => setForm({
            ...form,
            name: event.target.value
          }), placeholder: "Blueberry x Thin Mint Girl Scout Cookies x Sunset Sherbert" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-span-2 lg:col-start-1 lg:row-start-3", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "breeder", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Breeder"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "breeder", value: form.breeder ?? "", onChange: (event) => setForm({
            ...form,
            breeder: event.target.value
          }), placeholder: "Banco o criador" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-1 lg:row-start-4", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Origen"
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: form.origin ?? "", onValueChange: (v) => setForm({
            ...form,
            origin: v === "" ? void 0 : v
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar origen" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "semilla", children: "Semilla" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "madre", children: "Madre" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "esqueje", children: "Esqueje" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-3 lg:row-start-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "thcPercent", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "THC %"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "thcPercent", type: "number", min: "0", max: "100", step: "0.1", value: form.thcPercent ?? "", onChange: (event) => setForm({
            ...form,
            thcPercent: optionalNumber(event.target.value)
          }), placeholder: "26" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-3 lg:row-start-3", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "cbdPercent", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "CBD %"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "cbdPercent", type: "number", min: "0", max: "100", step: "0.1", value: form.cbdPercent ?? "", onChange: (event) => setForm({
            ...form,
            cbdPercent: optionalNumber(event.target.value)
          }), placeholder: "0.5" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-3 lg:row-start-4", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "floweringTimeDays", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Tiempo de floración (días)"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "floweringTimeDays", type: "number", min: "1", max: "365", step: "1", value: form.floweringTimeDays ?? "", onChange: (event) => setForm({
            ...form,
            floweringTimeDays: optionalNumber(event.target.value)
          }), placeholder: "Ej: 63" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-2 lg:row-start-4", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Tipo"
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: form.type, onValueChange: (type) => setForm({
            ...form,
            type
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "regular", children: "Regular" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "feminizada", children: "Feminizada" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "automatica", children: "Automática" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "esqueje", children: "Esqueje" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "desconocida", children: "Desconocida" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-1 lg:row-start-5", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Perfil cannabinoide"
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: form.cannabinoidProfile ?? "desconocida", onValueChange: (v) => setForm({
            ...form,
            cannabinoidProfile: v === "desconocida" ? void 0 : v
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "desconocida", children: "Desconocida" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "thc_dominante", children: "THC dominante" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "cbd_dominante", children: "CBD dominante" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "balanceada_thc_cbd", children: "Balanceada THC:CBD" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "cbg", children: "CBG" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-2 lg:row-start-5", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "aroma", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Wind, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Aroma"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "aroma", value: form.aroma ?? "", onChange: (event) => setForm({
            ...form,
            aroma: event.target.value
          }), placeholder: "Fresco, frutal, frutos rojos" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-1 lg:row-start-6", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "taste", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Sabor"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "taste", value: form.taste ?? "", onChange: (event) => setForm({
            ...form,
            taste: event.target.value
          }), placeholder: "Dulce, terroso, cítrico" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-2 lg:row-start-6", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "effect", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Efecto"
          ] }),
          /* @__PURE__ */ jsx(Input, { id: "effect", value: form.effect ?? "", onChange: (event) => setForm({
            ...form,
            effect: event.target.value
          }), placeholder: "Lúcido, energético, creativo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 lg:col-start-3 lg:row-start-5 lg:row-span-2", children: [
          /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Leaf, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Perfil Sativa / Indica"
          ] }),
          /* @__PURE__ */ jsx(GeneticsProfileSlider, { sativaPercent: form.sativaPercent, indicaPercent: form.indicaPercent, onChange: (profile) => setForm({
            ...form,
            ...profile
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-md border bg-muted/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-start-7", children: "Detalle" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2 lg:col-span-3 lg:col-start-1", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "description", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Descripción"
          ] }),
          /* @__PURE__ */ jsx(Textarea, { id: "description", rows: 2, value: form.description ?? "", onChange: (event) => setForm({
            ...form,
            description: event.target.value
          }), placeholder: "Descripción general de la variedad." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 md:col-span-2 lg:col-span-3 lg:col-start-1", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "notes", className: "flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Observación"
          ] }),
          /* @__PURE__ */ jsx(Textarea, { id: "notes", rows: 2, value: form.notes ?? "", onChange: (event) => setForm({
            ...form,
            notes: event.target.value
          }), placeholder: "Notas internas sobre cultivo, comportamiento o trazabilidad." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2 flex justify-end pt-1 lg:col-span-3", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: saving, className: "gap-2", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          saving ? "Guardando..." : "Guardar genética"
        ] }) })
      ] }) })
    ] }) })
  ] });
}
export {
  NewGeneticsPage as component
};
