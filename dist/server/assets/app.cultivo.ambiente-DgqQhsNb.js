import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent, B as Button } from "./router-Rtc38bRC.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { k as getGrowBeds } from "./growBedService-CR9jvSKV.js";
import { a as getGrowRooms } from "./growRoomService-BUC_ARXZ.js";
import { c as calculateVPDPreview, g as getEnvironmentalLogs, a as createEnvironmentalLog } from "./environmentalService-P3TfdmOW.js";
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
const initialForm = {
  roomId: "",
  bedId: "none",
  batchId: "",
  date: "2026-05-26",
  time: "09:00",
  airTempC: "25",
  relativeHumidity: "60",
  leafTempC: "",
  co2ppm: "",
  recordedByUserId: "user-cultivo-01",
  notes: ""
};
function EnvironmentalPage() {
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: "",
    roomId: "all",
    bedId: "all"
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void Promise.all([getGrowRooms(), getGrowBeds()]).then(([nextRooms, nextBeds]) => {
      setRooms(nextRooms);
      setBeds(nextBeds);
      setForm((current) => ({
        ...current,
        roomId: nextRooms[0]?.id ?? ""
      }));
    });
  }, []);
  useEffect(() => {
    void refreshLogs(filters);
  }, [filters.dateFrom, filters.roomId, filters.bedId]);
  useEffect(() => {
    const airTempC = Number(form.airTempC);
    const relativeHumidity = Number(form.relativeHumidity);
    if (!Number.isFinite(airTempC) || !Number.isFinite(relativeHumidity)) {
      setPreview(null);
      return;
    }
    void calculateVPDPreview({
      airTempC,
      relativeHumidity,
      leafTempC: form.leafTempC ? Number(form.leafTempC) : void 0
    }).then(setPreview);
  }, [form.airTempC, form.relativeHumidity, form.leafTempC]);
  const bedsForSelectedRoom = useMemo(() => beds.filter((bed) => bed.roomId === form.roomId), [beds, form.roomId]);
  const filteredBeds = useMemo(() => {
    if (filters.roomId === "all") return beds;
    return beds.filter((bed) => bed.roomId === filters.roomId);
  }, [beds, filters.roomId]);
  async function refreshLogs(nextFilters = filters) {
    const serviceFilters = {};
    if (nextFilters.dateFrom) serviceFilters.dateFrom = nextFilters.dateFrom;
    if (nextFilters.roomId !== "all") serviceFilters.roomId = nextFilters.roomId;
    if (nextFilters.bedId !== "all") serviceFilters.bedId = nextFilters.bedId;
    setLogs(await getEnvironmentalLogs(serviceFilters));
  }
  async function handleCreateLog() {
    try {
      setSaving(true);
      setMessage("");
      const newLog = await createEnvironmentalLog({
        roomId: form.roomId,
        bedId: form.bedId === "none" ? void 0 : form.bedId,
        batchId: form.batchId || void 0,
        date: form.date,
        time: form.time,
        airTempC: Number(form.airTempC),
        relativeHumidity: Number(form.relativeHumidity),
        leafTempC: form.leafTempC ? Number(form.leafTempC) : void 0,
        co2ppm: form.co2ppm ? Number(form.co2ppm) : void 0,
        recordedByUserId: form.recordedByUserId,
        notes: form.notes || void 0
      });
      setLogs((current) => [newLog, ...current]);
      setForm((current) => ({
        ...current,
        notes: ""
      }));
      setMessage("Registro guardado correctamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el registro.");
    } finally {
      setSaving(false);
    }
  }
  function roomName(roomId) {
    return rooms.find((room) => room.id === roomId)?.name ?? roomId;
  }
  function bedName(bedId) {
    if (!bedId) return "-";
    return beds.find((bed) => bed.id === bedId)?.name ?? bedId;
  }
  const flatLogs = useMemo(() => logs.map((l) => ({
    ...l,
    _roomName: rooms.find((r) => r.id === l.roomId)?.name ?? l.roomId,
    _bedName: l.bedId ? beds.find((b) => b.id === l.bedId)?.name ?? "-" : "-"
  })), [logs, rooms, beds]);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(flatLogs);
  function leafTemperatureDisplay(log) {
    if (typeof log.leafTempC === "number") {
      return {
        value: `${log.leafTempC} C`,
        label: "medida",
        title: "Temperatura de hoja/canopia medida."
      };
    }
    if (typeof log.airTempC === "number") {
      return {
        value: `Estimada ${(log.airTempC - 2.8).toFixed(1)} C`,
        label: "estimada",
        title: "Temperatura estimada de hoja/canopia usada para calcular VPD"
      };
    }
    return {
      value: "Sin dato",
      label: "",
      title: ""
    };
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Parametros ambientales" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Registro interno de temperatura, humedad, CO2 y VPD con datos ficticios." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Nuevo registro" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "El VPD se calcula automaticamente antes de guardar." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Sala" }),
              /* @__PURE__ */ jsxs(Select, { value: form.roomId, onValueChange: (roomId) => setForm({
                ...form,
                roomId,
                bedId: "none"
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar sala" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Camilla opcional" }),
              /* @__PURE__ */ jsxs(Select, { value: form.bedId, onValueChange: (bedId) => setForm({
                ...form,
                bedId
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Sin camilla" }),
                  bedsForSelectedRoom.map((bed) => /* @__PURE__ */ jsx(SelectItem, { value: bed.id, children: bed.name }, bed.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Lote opcional" }),
              /* @__PURE__ */ jsx(Input, { value: form.batchId, onChange: (event) => setForm({
                ...form,
                batchId: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Fecha" }),
              /* @__PURE__ */ jsx(DateInput, { value: form.date, onChange: (v) => setForm({
                ...form,
                date: v
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Hora" }),
              /* @__PURE__ */ jsx(Input, { type: "time", value: form.time, onChange: (event) => setForm({
                ...form,
                time: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Temperatura ambiente C" }),
              /* @__PURE__ */ jsx(Input, { type: "number", value: form.airTempC, onChange: (event) => setForm({
                ...form,
                airTempC: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Humedad relativa %" }),
              /* @__PURE__ */ jsx(Input, { type: "number", value: form.relativeHumidity, onChange: (event) => setForm({
                ...form,
                relativeHumidity: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "CO2 ppm ",
                /* @__PURE__ */ jsx("span", { className: "font-normal text-muted-foreground", children: "(opcional)" })
              ] }),
              /* @__PURE__ */ jsx(Input, { type: "number", value: form.co2ppm, onChange: (event) => setForm({
                ...form,
                co2ppm: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Responsable" }),
              /* @__PURE__ */ jsx(Input, { value: form.recordedByUserId, onChange: (event) => setForm({
                ...form,
                recordedByUserId: event.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Observaciones" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.notes, onChange: (event) => setForm({
                ...form,
                notes: event.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-md border bg-muted/40 p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "VPD calculado" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-2xl font-semibold", children: preview ? `${preview.calculatedVPD} kPa` : "-" })
          ] }),
          message ? /* @__PURE__ */ jsx("p", { className: `rounded-md border px-3 py-2 text-sm ${message.startsWith("Registro") ? "border-emerald-200 bg-emerald-500/10 text-emerald-700" : "border-destructive/30 bg-destructive/10 text-destructive"}`, children: message }) : null,
          /* @__PURE__ */ jsxs(Button, { onClick: () => void handleCreateLog(), className: "w-full gap-2", disabled: !form.roomId || saving, children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            saving ? "Guardando..." : "Registrar parametro"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Historial ambiental" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Filtros locales sobre registros mock." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [
            /* @__PURE__ */ jsx(DateInput, { value: filters.dateFrom, onChange: (v) => setFilters({
              ...filters,
              dateFrom: v
            }) }),
            /* @__PURE__ */ jsxs(Select, { value: filters.roomId, onValueChange: (roomId) => setFilters({
              ...filters,
              roomId,
              bedId: "all"
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las salas" }),
                rooms.map((room) => /* @__PURE__ */ jsx(SelectItem, { value: room.id, children: room.name }, room.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: filters.bedId, onValueChange: (bedId) => setFilters({
              ...filters,
              bedId
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las camillas" }),
                filteredBeds.map((bed) => /* @__PURE__ */ jsx(SelectItem, { value: bed.id, children: bed.name }, bed.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(SortHead, { label: "Fecha", sortKey: "date", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Hora", sortKey: "time", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Sala", sortKey: "_roomName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Camilla", sortKey: "_bedName", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Temp.", sortKey: "airTempC", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "HR", sortKey: "relativeHumidity", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "Hoja", sortKey: "leafTempC", col: sCol, dir: sDir, onSort: sort }),
              /* @__PURE__ */ jsx(SortHead, { label: "CO2", sortKey: "co2ppm", col: sCol, dir: sDir, onSort: sort })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: sorted.map((log) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: log.date }),
              /* @__PURE__ */ jsx(TableCell, { children: log.time }),
              /* @__PURE__ */ jsx(TableCell, { children: roomName(log.roomId) }),
              /* @__PURE__ */ jsx(TableCell, { children: bedName(log.bedId) }),
              /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs", children: [
                log.airTempC,
                " C"
              ] }),
              /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs", children: [
                log.relativeHumidity,
                " %"
              ] }),
              /* @__PURE__ */ jsxs(TableCell, { className: "text-xs", title: leafTemperatureDisplay(log).title, children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: leafTemperatureDisplay(log).value }),
                leafTemperatureDisplay(log).label ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "ml-2 text-[10px]", children: leafTemperatureDisplay(log).label }) : null
              ] }),
              /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs", children: [
                log.co2ppm ?? "-",
                " ppm"
              ] })
            ] }, log.id)) })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  EnvironmentalPage as component
};
