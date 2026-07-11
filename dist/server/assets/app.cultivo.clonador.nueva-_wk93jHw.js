import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Scissors, Save } from "lucide-react";
import { o as Route, B as Button, C as Card, a as CardContent, c as CardHeader, d as CardTitle, b as CardDescription } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { e as getClonadorById, u as updateClonador, c as createClonador } from "./growBedService-CR9jvSKV.js";
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
const initialForm = {
  name: "",
  code: "",
  roomId: "",
  status: "activa",
  maxPlants: "30",
  currentPlants: "0",
  responsibleUserId: "",
  notes: ""
};
function NewClonadorPage() {
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
    async function load() {
      const nextRooms = await getGrowRooms();
      setRooms(nextRooms);
      if (editId) {
        try {
          const bed = await getClonadorById(editId);
          if (!bed) {
            setError("Clonador no encontrado.");
            return;
          }
          setForm({
            name: bed.name,
            code: bed.code,
            roomId: bed.roomId,
            status: bed.status,
            maxPlants: String(bed.maxPlants),
            currentPlants: String(bed.currentPlants),
            responsibleUserId: bed.responsibleUserId ?? "",
            notes: bed.notes ?? ""
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "No se pudo cargar el clonador.");
        } finally {
          setLoading(false);
        }
        return;
      }
      setForm((cur) => ({
        ...cur,
        roomId: cur.roomId || nextRooms[0]?.id || ""
      }));
      setLoading(false);
    }
    void load();
  }, [editId]);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const maxPlants = Number(form.maxPlants);
    const currentPlants = Number(form.currentPlants);
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!form.code.trim()) {
      setError("El código es obligatorio.");
      return;
    }
    if (!form.roomId) {
      setError("Seleccioná una sala.");
      return;
    }
    if (!Number.isInteger(maxPlants) || maxPlants < 0 || maxPlants > 60) {
      setError("La capacidad máxima debe estar entre 0 y 60 esquejes.");
      return;
    }
    if (!Number.isInteger(currentPlants) || currentPlants < 0) {
      setError("Los esquejes actuales deben ser un número entero ≥ 0.");
      return;
    }
    if (currentPlants > maxPlants) {
      setError("Los esquejes actuales no pueden superar la capacidad máxima.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        roomId: form.roomId,
        status: form.status,
        maxPlants,
        currentPlants,
        responsibleUserId: form.responsibleUserId.trim() || void 0,
        notes: form.notes.trim() || void 0
      };
      const bed = editId ? await updateClonador(editId, payload) : await createClonador(payload);
      await navigate({
        to: "/app/cultivo/clonador/$id",
        params: {
          id: bed.id
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el clonador.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1100px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "-ml-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/clonador", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Clonadores"
      ] }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: editId ? "Editar clonador" : "Nuevo clonador" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: editId ? "Modificación operativa del clonador." : "Registro de un nuevo clonador con capacidad y sala asociada." })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive", children: error }),
    loading ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6 text-sm text-muted-foreground", children: "Cargando datos..." }) }) : /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Scissors, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx(CardTitle, { children: editId ? "Editar clonador" : "Crear clonador" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Completá los datos del clonador." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nombre" }),
          /* @__PURE__ */ jsx(Input, { id: "name", value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Código" }),
          /* @__PURE__ */ jsx(Input, { id: "code", value: form.code, onChange: (e) => setForm({
            ...form,
            code: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Sala" }),
          /* @__PURE__ */ jsxs(Select, { value: form.roomId, onValueChange: (roomId) => setForm({
            ...form,
            roomId
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccioná sala" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: rooms.map((r) => /* @__PURE__ */ jsx(SelectItem, { value: r.id, children: r.name }, r.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Estado" }),
          /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (s) => setForm({
            ...form,
            status: s
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "activa", children: "Activo" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "vacia", children: "Vacío" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "limpieza", children: "Limpieza" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "mantenimiento", children: "Mantenimiento" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "fuera_de_uso", children: "Fuera de uso" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "maxPlants", children: "Capacidad máxima (esquejes)" }),
          /* @__PURE__ */ jsx(Input, { id: "maxPlants", type: "number", min: "0", max: "60", step: "1", value: form.maxPlants, onChange: (e) => setForm({
            ...form,
            maxPlants: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "currentPlants", children: "Esquejes actuales" }),
          /* @__PURE__ */ jsx(Input, { id: "currentPlants", type: "number", min: "0", step: "1", value: form.currentPlants, onChange: (e) => setForm({
            ...form,
            currentPlants: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "responsibleUserId", children: "Responsable" }),
          /* @__PURE__ */ jsx(Input, { id: "responsibleUserId", value: form.responsibleUserId, onChange: (e) => setForm({
            ...form,
            responsibleUserId: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Observaciones" }),
          /* @__PURE__ */ jsx(Textarea, { id: "notes", value: form.notes, onChange: (e) => setForm({
            ...form,
            notes: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end md:col-span-3", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: saving, className: "gap-2", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          saving ? "Guardando..." : editId ? "Guardar cambios" : "Guardar clonador"
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  NewClonadorPage as component
};
