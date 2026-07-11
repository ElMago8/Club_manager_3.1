import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Clock, PlayCircle, CheckCircle2, AlertCircle, AlertTriangle, CalendarDays, Plus } from "lucide-react";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent, B as Button } from "./router-Rtc38bRC.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
import { e as getPlants } from "./plantService-BxfJ2ZYq.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
import "class-variance-authority";
import "@tanstack/react-router";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
const mockTasks = [];
function queryFromFilters(filters) {
  return new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== void 0 && value !== ""))
  ).toString();
}
async function getOperationalTasks(filters = {}) {
  return withMockFallback(
    async () => {
      const query = queryFromFilters(filters);
      return apiRequest(`/cultivation/operational-tasks${query ? `?${query}` : ""}`);
    },
    () => mockTasks
  );
}
async function createOperationalTask(payload) {
  return withMockFallback(
    async () => apiRequest("/cultivation/operational-tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
    () => {
      const task = { ...payload, id: `task-${Date.now()}` };
      mockTasks.unshift(task);
      return task;
    }
  );
}
async function updateOperationalTaskStatus(id, status) {
  return withMockFallback(
    async () => apiRequest(`/cultivation/operational-tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
    () => {
      const task = mockTasks.find((item) => item.id === id);
      if (!task) throw new Error("Tarea no encontrada.");
      task.status = status;
      return task;
    }
  );
}
async function completeOperationalTask(id, completedByName) {
  return withMockFallback(
    async () => apiRequest(`/cultivation/operational-tasks/${id}/complete`, {
      method: "PATCH",
      body: JSON.stringify({ completedByName })
    }),
    () => updateOperationalTaskStatus(id, "completed")
  );
}
const TASK_TYPE_LABEL = {
  irrigation: "Riego",
  nutrition: "Nutricion",
  environmental_check: "Control ambiental",
  drainage_check: "Drenaje",
  sanitary_inspection: "Inspeccion sanitaria",
  pruning: "Poda",
  transplant: "Trasplante",
  harvest_preparation: "Preparar cosecha",
  harvest: "Cosecha",
  drying_check: "Secado",
  curing_check: "Curado",
  cleaning: "Limpieza",
  maintenance: "Mantenimiento",
  inventory_check: "Stock insumos",
  custom: "Personalizada"
};
const PRIORITY_LABEL = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Critica"
};
const STATUS_LABEL = {
  pending: "Pendiente",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
  overdue: "Vencida"
};
const PRIORITY_CLASS = {
  low: "border-muted bg-muted text-muted-foreground",
  medium: "border-sky-200 bg-sky-500/10 text-sky-700",
  high: "border-amber-200 bg-amber-500/10 text-amber-700",
  critical: "border-red-200 bg-red-500/10 text-red-700"
};
const STATUS_CLASS = {
  pending: "border-slate-200 bg-slate-500/10 text-slate-700",
  in_progress: "border-sky-200 bg-sky-500/10 text-sky-700",
  completed: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  cancelled: "border-muted bg-muted text-muted-foreground",
  overdue: "border-red-200 bg-red-500/10 text-red-700"
};
const emptyForm = {
  title: "",
  description: "",
  taskType: "environmental_check",
  priority: "medium",
  status: "pending",
  dueDate: "2026-05-29",
  dueTime: "",
  assignedToName: "",
  bedId: "none",
  plantId: "none",
  batchId: "",
  recurrenceType: "none",
  notes: ""
};
function dateOnly(value) {
  return value.slice(0, 10);
}
function OperationalCalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [beds, setBeds] = useState([]);
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    taskType: "all",
    assignedToName: "",
    dateFrom: "",
    dateTo: "",
    bedId: "all",
    plantId: "all",
    overdueOnly: false
  });
  async function loadData() {
    const serviceFilters = {};
    if (filters.status !== "all") serviceFilters.status = filters.status;
    if (filters.priority !== "all") serviceFilters.priority = filters.priority;
    if (filters.taskType !== "all") serviceFilters.taskType = filters.taskType;
    if (filters.assignedToName) serviceFilters.assignedToName = filters.assignedToName;
    if (filters.dateFrom) serviceFilters.dateFrom = filters.dateFrom;
    if (filters.dateTo) serviceFilters.dateTo = filters.dateTo;
    if (filters.bedId !== "all") serviceFilters.bedId = filters.bedId;
    if (filters.plantId !== "all") serviceFilters.plantId = filters.plantId;
    if (filters.overdueOnly) serviceFilters.overdueOnly = true;
    setTasks(await getOperationalTasks(serviceFilters));
  }
  useEffect(() => {
    void Promise.all([getGrowBeds(), getPlants()]).then(([nextBeds, nextPlants]) => {
      setBeds(nextBeds);
      setPlants(nextPlants);
    });
  }, []);
  useEffect(() => {
    void loadData();
  }, [filters.status, filters.priority, filters.taskType, filters.assignedToName, filters.dateFrom, filters.dateTo, filters.bedId, filters.plantId, filters.overdueOnly]);
  const cards = useMemo(() => {
    const today = "2026-05-29";
    const weekLimit = "2026-06-05";
    return {
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      completedToday: tasks.filter((task) => task.status === "completed" && task.completedAt?.startsWith(today)).length,
      overdue: tasks.filter((task) => task.status === "overdue").length,
      critical: tasks.filter((task) => task.priority === "critical").length,
      thisWeek: tasks.filter((task) => dateOnly(task.dueDate) >= today && dateOnly(task.dueDate) <= weekLimit).length
    };
  }, [tasks]);
  async function handleCreateTask() {
    if (!form.title.trim()) {
      setMessage("El titulo es obligatorio.");
      return;
    }
    if (form.priority === "critical" && !form.description.trim()) {
      setMessage("Las tareas criticas requieren descripcion.");
      return;
    }
    await createOperationalTask({
      ...form,
      description: form.description || void 0,
      dueTime: form.dueTime || void 0,
      assignedToName: form.assignedToName || void 0,
      bedId: form.bedId === "none" ? void 0 : form.bedId,
      plantId: form.plantId === "none" ? void 0 : form.plantId,
      batchId: form.batchId || void 0,
      relatedModule: form.plantId !== "none" ? "plant" : form.bedId !== "none" ? "bed" : "cultivation",
      recurrenceType: form.recurrenceType,
      recurrenceInterval: void 0,
      notes: form.notes || void 0
    });
    setForm(emptyForm);
    setMessage("Tarea creada correctamente.");
    await loadData();
  }
  function relatedLabel(task) {
    if (task.plant) return `Planta ${task.plant.internalCode}`;
    if (task.bed) return `Camilla ${task.bed.name}`;
    if (task.batchId) return `Lote ${task.batchId}`;
    return "General";
  }
  async function setStatus(id, status) {
    await updateOperationalTaskStatus(id, status);
    await loadData();
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1500px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Calendario operativo" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Tareas reales del backend para cultivo, camillas, plantas y controles internos." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-3 shadow-xs", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-3 xl:grid-cols-6", children: [{
      label: "Pendientes",
      value: cards.pending,
      Icon: Clock,
      accent: "bg-slate-500",
      panel: "bg-slate-500/10",
      iconClass: "text-slate-600 dark:text-slate-400"
    }, {
      label: "En curso",
      value: cards.inProgress,
      Icon: PlayCircle,
      accent: "bg-sky-500",
      panel: "bg-sky-500/10",
      iconClass: "text-sky-600 dark:text-sky-400"
    }, {
      label: "Completadas hoy",
      value: cards.completedToday,
      Icon: CheckCircle2,
      accent: "bg-emerald-500",
      panel: "bg-emerald-500/10",
      iconClass: "text-emerald-600 dark:text-emerald-400"
    }, {
      label: "Vencidas",
      value: cards.overdue,
      Icon: AlertCircle,
      accent: "bg-red-500",
      panel: "bg-red-500/10",
      iconClass: "text-red-600 dark:text-red-400"
    }, {
      label: "Criticas",
      value: cards.critical,
      Icon: AlertTriangle,
      accent: "bg-amber-500",
      panel: "bg-amber-500/10",
      iconClass: "text-amber-600 dark:text-amber-400"
    }, {
      label: "Esta semana",
      value: cards.thisWeek,
      Icon: CalendarDays,
      accent: "bg-violet-500",
      panel: "bg-violet-500/10",
      iconClass: "text-violet-600 dark:text-violet-400"
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
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-[420px_1fr]", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Crear tarea" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Agenda una tarea operativa con datos ficticios." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Titulo" }),
            /* @__PURE__ */ jsx(Input, { value: form.title, onChange: (event) => setForm({
              ...form,
              title: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Descripcion" }),
            /* @__PURE__ */ jsx(Textarea, { value: form.description, onChange: (event) => setForm({
              ...form,
              description: event.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
              /* @__PURE__ */ jsxs(Select, { value: form.taskType, onValueChange: (taskType) => setForm({
                ...form,
                taskType
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(TASK_TYPE_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Prioridad" }),
              /* @__PURE__ */ jsxs(Select, { value: form.priority, onValueChange: (priority) => setForm({
                ...form,
                priority
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(PRIORITY_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Fecha limite" }),
              /* @__PURE__ */ jsx(DateInput, { value: form.dueDate, onChange: (v) => setForm({
                ...form,
                dueDate: v
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Hora limite" }),
              /* @__PURE__ */ jsx(Input, { type: "time", value: form.dueTime, onChange: (event) => setForm({
                ...form,
                dueTime: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Responsable" }),
              /* @__PURE__ */ jsx(Input, { value: form.assignedToName, onChange: (event) => setForm({
                ...form,
                assignedToName: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Lote" }),
              /* @__PURE__ */ jsx(Input, { value: form.batchId, onChange: (event) => setForm({
                ...form,
                batchId: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Camilla" }),
              /* @__PURE__ */ jsxs(Select, { value: form.bedId, onValueChange: (bedId) => setForm({
                ...form,
                bedId,
                plantId: "none"
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
                  plants.filter((plant) => form.bedId === "none" || plant.bedId === form.bedId).map((plant) => /* @__PURE__ */ jsx(SelectItem, { value: plant.id, children: plant.internalCode }, plant.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Notas" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.notes, onChange: (event) => setForm({
                ...form,
                notes: event.target.value
              }) })
            ] })
          ] }),
          message ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: message }) : null,
          /* @__PURE__ */ jsxs(Button, { onClick: () => void handleCreateTask(), className: "w-full gap-2", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Crear tarea"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Tareas operativas" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Listado filtrable conectado al backend local." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-4", children: [
            /* @__PURE__ */ jsxs(Select, { value: filters.status, onValueChange: (status) => setFilters({
              ...filters,
              status
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los estados" }),
                Object.entries(STATUS_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: filters.priority, onValueChange: (priority) => setFilters({
              ...filters,
              priority
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las prioridades" }),
                Object.entries(PRIORITY_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: filters.taskType, onValueChange: (taskType) => setFilters({
              ...filters,
              taskType
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los tipos" }),
                Object.entries(TASK_TYPE_LABEL).map(([value, label]) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value))
              ] })
            ] }),
            /* @__PURE__ */ jsx(Input, { placeholder: "Responsable", value: filters.assignedToName, onChange: (event) => setFilters({
              ...filters,
              assignedToName: event.target.value
            }) }),
            /* @__PURE__ */ jsx(DateInput, { value: filters.dateFrom, onChange: (v) => setFilters({
              ...filters,
              dateFrom: v
            }) }),
            /* @__PURE__ */ jsx(DateInput, { value: filters.dateTo, onChange: (v) => setFilters({
              ...filters,
              dateTo: v
            }) }),
            /* @__PURE__ */ jsxs(Select, { value: filters.bedId, onValueChange: (bedId) => setFilters({
              ...filters,
              bedId
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las camillas" }),
                beds.map((bed) => /* @__PURE__ */ jsx(SelectItem, { value: bed.id, children: bed.name }, bed.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border px-3", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked: filters.overdueOnly, onCheckedChange: (checked) => setFilters({
                ...filters,
                overdueOnly: checked === true
              }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Solo vencidas" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Tarea" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tipo" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Responsable" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Prioridad" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Hora" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Relacionado con" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: tasks.map((task) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: task.title }),
              /* @__PURE__ */ jsx(TableCell, { children: TASK_TYPE_LABEL[task.taskType] }),
              /* @__PURE__ */ jsx(TableCell, { children: task.assignedToName ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: PRIORITY_CLASS[task.priority], children: PRIORITY_LABEL[task.priority] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[task.status], children: STATUS_LABEL[task.status] }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: dateOnly(task.dueDate) }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: task.dueTime ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: relatedLabel(task) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", title: "Marcar en curso", onClick: () => void setStatus(task.id, "in_progress"), children: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", title: "Completar", onClick: () => void completeOperationalTask(task.id, "Operador demo").then(loadData), children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => void setStatus(task.id, "cancelled"), children: "Cancelar" })
              ] }) })
            ] }, task.id)) })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  OperationalCalendarPage as component
};
