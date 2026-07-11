import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Save, Plus, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { C as CultivationStatusMessage } from "./RelationshipWarning-BRJ5EkHV.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent, B as Button } from "./router-Rtc38bRC.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { g as getGenetics } from "./geneticsService-1lKUW0eY.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { u as updateMotherPlant, g as getMotherPlants, c as createMotherPlant, d as deleteMotherPlant } from "./motherPlantService-BEybLeEn.js";
import "@radix-ui/react-dropdown-menu";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "class-variance-authority";
import "@tanstack/react-router";
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
const STATUS_CLASS = {
  activa: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  observacion: "border-sky-200 bg-sky-500/10 text-sky-700",
  descartada: "border-muted bg-muted text-muted-foreground",
  archivada: "border-amber-200 bg-amber-500/10 text-amber-700"
};
const SANITARY_STATUS_CLASS = {
  bueno: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  preventivo: "border-amber-200 bg-amber-500/10 text-amber-700",
  observacion: "border-sky-200 bg-sky-500/10 text-sky-700",
  critico: "border-red-200 bg-red-500/10 text-red-700"
};
const SANITARY_STATUS_LABEL = {
  bueno: "Bueno",
  preventivo: "Preventivo",
  observacion: "En observacion",
  critico: "Critico"
};
const emptyForm = {
  code: "",
  name: "",
  geneticsId: "",
  geneticsName: "",
  roomId: "",
  bedId: "",
  status: "activa",
  sanitaryStatus: "bueno",
  startDate: "2026-05-26",
  lastCutDate: "",
  availableClones: 0,
  origin: "",
  notes: ""
};
function MotherPlantsPage() {
  const [mothers, setMothers] = useState([]);
  const [genetics, setGenetics] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  async function loadData() {
    const [nextMothers, nextGenetics, nextRooms, nextBeds] = await Promise.all([getMotherPlants(), getGenetics(), getGrowRooms(), getGrowBeds()]);
    setMothers(nextMothers);
    setGenetics(nextGenetics);
    setRooms(nextRooms);
    setBeds(nextBeds);
    const firstRoomId = nextRooms[0]?.id ?? nextBeds[0]?.roomId ?? "";
    const firstBed = nextBeds.find((bed) => bed.roomId === firstRoomId) ?? nextBeds[0];
    setForm((current) => ({
      ...current,
      geneticsId: current.geneticsId || nextGenetics[0]?.id || "",
      geneticsName: current.geneticsName || nextGenetics[0]?.name || "",
      roomId: current.roomId || firstRoomId,
      bedId: current.bedId || firstBed?.id || ""
    }));
  }
  useEffect(() => {
    void loadData();
  }, []);
  function roomName(id) {
    if (!id) return "-";
    return rooms.find((room) => room.id === id)?.name ?? id;
  }
  function bedName(id) {
    if (!id) return "-";
    return beds.find((bed) => bed.id === id)?.name ?? id;
  }
  function bedsByRoom(roomId) {
    return roomId ? beds.filter((bed) => bed.roomId === roomId) : beds;
  }
  const flatMothers = useMemo(() => mothers.map((m) => ({
    ...m,
    _roomName: roomName(m.roomId),
    _bedName: bedName(m.bedId)
  })), [mothers, rooms, beds]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(flatMothers);
  function updateGeneticsSelection(geneticsId) {
    const selected = genetics.find((item) => item.id === geneticsId);
    setForm({
      ...form,
      geneticsId,
      geneticsName: selected?.name ?? ""
    });
  }
  function startCreate() {
    const firstRoomId = rooms[0]?.id ?? beds[0]?.roomId ?? "";
    const firstBed = beds.find((bed) => bed.roomId === firstRoomId) ?? beds[0];
    setEditingId(null);
    setForm({
      ...emptyForm,
      geneticsId: genetics[0]?.id ?? "",
      geneticsName: genetics[0]?.name ?? "",
      roomId: firstRoomId,
      bedId: firstBed?.id ?? ""
    });
    setMessage("");
  }
  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      code: item.code,
      name: item.name ?? "",
      geneticsId: item.geneticsId,
      geneticsName: item.geneticsName,
      roomId: item.roomId ?? "",
      bedId: item.bedId ?? "",
      status: item.status,
      sanitaryStatus: item.sanitaryStatus ?? "bueno",
      startDate: item.startDate,
      lastCutDate: item.lastCutDate ?? "",
      availableClones: item.availableClones ?? 0,
      origin: item.origin ?? "",
      notes: item.notes ?? ""
    });
    setMessage("");
  }
  async function handleSave() {
    if (!form.code.trim() || !form.geneticsId || !form.roomId || !form.bedId) {
      setMessage("Codigo, genetica, sala y camilla son obligatorios.");
      return;
    }
    const payload = {
      ...form,
      name: form.name?.trim() || void 0,
      roomId: form.roomId || void 0,
      bedId: form.bedId || void 0,
      lastCutDate: form.lastCutDate || void 0,
      availableClones: form.availableClones ?? 0,
      origin: form.origin?.trim() || void 0,
      notes: form.notes || void 0,
      geneticsName: form.geneticsName || genetics.find((item) => item.id === form.geneticsId)?.name || "Genetica pendiente"
    };
    if (editingId) {
      await updateMotherPlant(editingId, payload);
      setMessage("Madre actualizada en mock data.");
    } else {
      await createMotherPlant(payload);
      setMessage("Madre creada en mock data.");
    }
    startCreate();
    await loadData();
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMotherPlant(deleteTarget.id);
      setMothers((current) => current.filter((mother) => mother.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) startCreate();
      if (detailTarget?.id === deleteTarget.id) setDetailTarget(null);
      setDeleteTarget(null);
      setMessage("Madre eliminada correctamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la madre.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Plantas madre" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Registro mock de madres y plantas asociadas por origen." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: editingId ? "Editar madre" : "Crear madre" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Formulario visual local, sin backend conectado." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Codigo madre" }),
              /* @__PURE__ */ jsx(Input, { value: form.code, onChange: (event) => setForm({
                ...form,
                code: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Nombre madre" }),
              /* @__PURE__ */ jsx(Input, { value: form.name ?? "", onChange: (event) => setForm({
                ...form,
                name: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Genetica" }),
              /* @__PURE__ */ jsxs(Select, { value: form.geneticsId, onValueChange: updateGeneticsSelection, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: genetics.map((item) => /* @__PURE__ */ jsx(SelectItem, { value: item.id, children: item.name }, item.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Sala" }),
              /* @__PURE__ */ jsxs(Select, { value: form.roomId ?? "", onValueChange: (roomId) => {
                const nextBed = beds.find((bed) => bed.roomId === roomId);
                setForm({
                  ...form,
                  roomId,
                  bedId: nextBed?.id ?? ""
                });
              }, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Camilla" }),
              /* @__PURE__ */ jsxs(Select, { value: form.bedId ?? "", onValueChange: (bedId) => setForm({
                ...form,
                bedId
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: bedsByRoom(form.roomId).map((bed) => /* @__PURE__ */ jsx(SelectItem, { value: bed.id, children: bed.name }, bed.id)) })
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
                  /* @__PURE__ */ jsx(SelectItem, { value: "observacion", children: "Observacion" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "descartada", children: "Descartada" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "archivada", children: "Archivada" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Estado sanitario" }),
              /* @__PURE__ */ jsxs(Select, { value: form.sanitaryStatus ?? "bueno", onValueChange: (sanitaryStatus) => setForm({
                ...form,
                sanitaryStatus
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
              /* @__PURE__ */ jsx(Label, { children: "Fecha de inicio" }),
              /* @__PURE__ */ jsx(DateInput, { value: form.startDate, onChange: (v) => setForm({
                ...form,
                startDate: v
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Fecha ultimo corte" }),
              /* @__PURE__ */ jsx(DateInput, { value: form.lastCutDate ?? "", onChange: (v) => setForm({
                ...form,
                lastCutDate: v || void 0
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Esquejes disponibles" }),
              /* @__PURE__ */ jsx(Input, { type: "number", min: "0", step: "1", value: form.availableClones ?? 0, onChange: (event) => setForm({
                ...form,
                availableClones: Number(event.target.value)
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Origen" }),
              /* @__PURE__ */ jsx(Input, { value: form.origin ?? "", onChange: (event) => setForm({
                ...form,
                origin: event.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Observaciones" }),
            /* @__PURE__ */ jsx(Textarea, { value: form.notes ?? "", onChange: (event) => setForm({
              ...form,
              notes: event.target.value
            }) })
          ] }),
          message ? /* @__PURE__ */ jsx(CultivationStatusMessage, { message }) : null,
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs(Button, { onClick: handleSave, className: "gap-2", children: [
              editingId ? /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
              editingId ? "Guardar cambios" : "Crear madre"
            ] }),
            editingId ? /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: startCreate, children: "Cancelar" }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Listado de madres" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Conteos calculados desde plantas mock." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          detailTarget ? /* @__PURE__ */ jsx(MotherDetailSection, { item: detailTarget, roomName, bedName, onClose: () => setDetailTarget(null), onEdit: () => {
            startEdit(detailTarget);
            setDetailTarget(null);
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          } }) : null,
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border [&_td]:text-center [&_th]:text-center", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(SortHead, { label: "Codigo", sortKey: "code", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Nombre madre", sortKey: "name", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Genetica", sortKey: "geneticsName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Sala", sortKey: "_roomName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Camilla", sortKey: "_bedName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(TableHead, { children: "Estado sanitario" }),
              /* @__PURE__ */ jsx(SortHead, { label: "Fecha inicio", sortKey: "startDate", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Esquejes disp.", sortKey: "availableClones", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: sorted.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs font-medium", children: item.code }),
              /* @__PURE__ */ jsx(TableCell, { children: item.name ?? "-" }),
              /* @__PURE__ */ jsx(TableCell, { children: item.geneticsName }),
              /* @__PURE__ */ jsx(TableCell, { children: roomName(item.roomId) }),
              /* @__PURE__ */ jsx(TableCell, { children: bedName(item.bedId) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[item.status], children: item.status }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(SanitaryStatusSelect, { value: item.sanitaryStatus ?? "bueno", onChange: async (next) => {
                setMothers((prev) => prev.map((m) => m.id === item.id ? {
                  ...m,
                  sanitaryStatus: next
                } : m));
                await updateMotherPlant(item.id, {
                  sanitaryStatus: next
                });
              } }) }),
              /* @__PURE__ */ jsx(TableCell, { children: item.startDate }),
              /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: item.availableClones ?? 0 }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => setDetailTarget(item), children: [
                    /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }),
                    "Ver"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => startEdit(item), children: [
                    /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                    "Editar"
                  ] }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => setDeleteTarget(item), children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                    "Eliminar"
                  ] })
                ] })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: Boolean(deleteTarget), entityLabel: "madre", itemName: deleteTarget?.code, description: `Estas por eliminar la madre ${deleteTarget?.code ?? ""}. Si tiene plantas asociadas, la base puede impedir la eliminacion.`, onOpenChange: (open) => !open && setDeleteTarget(null), onConfirm: handleDelete })
  ] });
}
function MotherDetailSection({
  item,
  roomName,
  bedName,
  onClose,
  onEdit
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-md border bg-muted/20 p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Detalle de madre" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold tracking-tight", children: item.code }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: item.name || "Sin nombre asignado" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: onClose, children: "Cerrar" }),
        /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", className: "gap-2", onClick: onEdit, children: [
          /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
          "Editar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-md border bg-background/70 p-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Ficha principal" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Codigo madre", value: item.code }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Nombre madre", value: item.name }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Genetica", value: item.geneticsName }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Origen", value: item.origin })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-md border bg-background/70 p-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Ubicacion y estado" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Sala", value: roomName(item.roomId) }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Camilla", value: bedName(item.bedId) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Estado" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[item.status], children: item.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Sanitario" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: SANITARY_STATUS_CLASS[item.sanitaryStatus ?? "bueno"], children: SANITARY_STATUS_LABEL[item.sanitaryStatus ?? "bueno"] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-md border bg-background/70 p-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Produccion" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Fecha inicio", value: item.startDate }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Ultimo corte", value: item.lastCutDate }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Esquejes disp.", value: `${item.availableClones ?? 0}` }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Plantas asociadas", value: `${item.derivedPlantsCount}` })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-md border bg-background/70 p-3", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Observaciones" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm text-muted-foreground", children: item.notes || "Sin observaciones." })
    ] })
  ] });
}
function DetailRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-right font-medium", children: value || "-" })
  ] });
}
function SanitaryStatusSelect({
  value,
  onChange
}) {
  const [loading, setLoading] = useState(false);
  async function handleChange(next) {
    setLoading(true);
    try {
      await onChange(next);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs(Select, { value, onValueChange: handleChange, disabled: loading, children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className: `h-7 w-[140px] border text-xs font-medium ${SANITARY_STATUS_CLASS[value]}`, children: /* @__PURE__ */ jsx(SelectValue, {}) }),
    /* @__PURE__ */ jsxs(SelectContent, { children: [
      /* @__PURE__ */ jsx(SelectItem, { value: "bueno", children: "Bueno" }),
      /* @__PURE__ */ jsx(SelectItem, { value: "preventivo", children: "Preventivo" }),
      /* @__PURE__ */ jsx(SelectItem, { value: "observacion", children: "En observacion" }),
      /* @__PURE__ */ jsx(SelectItem, { value: "critico", children: "Critico" })
    ] })
  ] });
}
export {
  MotherPlantsPage as component
};
