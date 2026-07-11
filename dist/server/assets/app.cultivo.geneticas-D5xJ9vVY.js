import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation, Outlet, Link } from "@tanstack/react-router";
import { Plus, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, b as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-CVBxbGj8.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription } from "./dialog-D_bA4dyy.js";
import { C as CultivationStatusMessage } from "./RelationshipWarning-BRJ5EkHV.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, b as CardDescription, a as CardContent } from "./router-Rtc38bRC.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { g as getGenetics, d as deleteGenetics } from "./geneticsService-1lKUW0eY.js";
import "@radix-ui/react-dropdown-menu";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "./cultivationMockData-B9eg4-Ml.js";
import "./vpdCalculator-CDiK96pa.js";
import "./cultivationApi-DWB3k4sN.js";
function ExpandableTextCell({
  title,
  text,
  emptyLabel = "-",
  className = "max-w-[260px]"
}) {
  const [open, setOpen] = useState(false);
  const trimmedText = text?.trim();
  if (!trimmedText) {
    return /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: emptyLabel });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: [
          "mx-auto block cursor-pointer truncate text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
          className
        ].join(" "),
        title: "Ver contenido completo",
        onClick: () => setOpen(true),
        children: trimmedText
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: title }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Contenido completo del registro seleccionado." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-h-[60vh] overflow-y-auto rounded-md border bg-muted/20 p-4 text-sm leading-relaxed whitespace-pre-wrap", children: trimmedText })
    ] }) })
  ] });
}
const DOMINANT_LABEL = {
  indica: "Índica",
  sativa: "Sativa",
  hibrida: "Híbrida",
  desconocida: "Desconocida"
};
const DOMINANT_CLASS = {
  indica: "border-violet-200 bg-violet-500/10 text-violet-700",
  sativa: "border-green-200 bg-green-500/10 text-green-700",
  hibrida: "border-amber-200 bg-amber-500/10 text-amber-700",
  desconocida: "border-muted bg-muted text-muted-foreground"
};
const CANNABINOID_LABEL = {
  thc_dominante: "THC dominante",
  cbd_dominante: "CBD dominante",
  balanceada_thc_cbd: "Balanceada THC:CBD",
  cbg: "CBG",
  desconocida: "Desconocida"
};
const CANNABINOID_CLASS = {
  thc_dominante: "border-amber-200 bg-amber-500/10 text-amber-700",
  cbd_dominante: "border-sky-200 bg-sky-500/10 text-sky-700",
  balanceada_thc_cbd: "border-emerald-200 bg-emerald-500/10 text-emerald-700",
  cbg: "border-teal-200 bg-teal-500/10 text-teal-700",
  desconocida: "border-muted bg-muted text-muted-foreground"
};
function GeneticsPage() {
  const location = useLocation();
  const [genetics, setGenetics] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function loadData() {
      const nextGenetics = await getGenetics();
      setGenetics(nextGenetics);
    }
    void loadData();
  }, []);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(genetics);
  if (location.pathname !== "/app/cultivo/geneticas") {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteGenetics(deleteTarget.id);
      setGenetics((current) => current.filter((genetic) => genetic.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage("Genetica eliminada correctamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la genetica.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Geneticas" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Listado operativo de geneticas registradas." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/geneticas/nueva", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Nueva genetica"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Geneticas registradas" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Datos cargados desde el modulo de cultivo." }),
        message ? /* @__PURE__ */ jsx(CultivationStatusMessage, { message }) : null
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border [&_td]:text-center [&_th]:text-center", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(SortHead, { label: "Nombre", sortKey: "name", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Breeder", sortKey: "breeder", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "THC %", sortKey: "thcPercent", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "CBD %", sortKey: "cbdPercent", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Sativa %", sortKey: "sativaPercent", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Indica %", sortKey: "indicaPercent", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(SortHead, { label: "Predominancia", sortKey: "dominantProfile", col: sCol, dir: sDir, onSort: sort }),
          /* @__PURE__ */ jsx(TableHead, { children: "Perfil cannabinoide" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Observaciones" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sorted.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsx(Link, { to: "/app/cultivo/geneticas/$id", params: {
            id: item.id
          }, className: "hover:underline", children: item.name }) }),
          /* @__PURE__ */ jsx(TableCell, { children: item.breeder ?? "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: typeof item.thcPercent === "number" ? `${item.thcPercent}%` : "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: typeof item.cbdPercent === "number" ? `${item.cbdPercent}%` : "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: typeof item.sativaPercent === "number" ? /* @__PURE__ */ jsxs(Badge, { className: "border-green-500/40 bg-green-500/10 text-green-700 hover:bg-green-500/10 dark:text-green-300", children: [
            item.sativaPercent,
            "%"
          ] }) : "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: typeof item.indicaPercent === "number" ? /* @__PURE__ */ jsxs(Badge, { className: "border-violet-500/40 bg-violet-500/10 text-violet-700 hover:bg-violet-500/10 dark:text-violet-300", children: [
            item.indicaPercent,
            "%"
          ] }) : "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: DOMINANT_CLASS[item.dominantProfile], children: DOMINANT_LABEL[item.dominantProfile] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: item.cannabinoidProfile ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: CANNABINOID_CLASS[item.cannabinoidProfile], children: CANNABINOID_LABEL[item.cannabinoidProfile] }) : "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(ExpandableTextCell, { title: `Observaciones de ${item.name}`, text: item.notes, className: "max-w-[180px]" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/geneticas/$id", params: {
                id: item.id
              }, children: [
                /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }),
                "Ver"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/cultivo/geneticas/$id", params: {
                id: item.id
              }, search: {
                mode: "edit"
              }, children: [
                /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                "Editar"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => setDeleteTarget(item), children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "Eliminar"
              ] })
            ] })
          ] }) })
        ] }, item.id)) })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: Boolean(deleteTarget), entityLabel: "genetica", itemName: deleteTarget?.name, description: `Estas por eliminar la genetica ${deleteTarget?.name ?? ""}. Si esta asociada a madres, lotes o plantas, la base puede impedir la eliminacion.`, onOpenChange: (open) => !open && setDeleteTarget(null), onConfirm: handleDelete })
  ] });
}
export {
  GeneticsPage as component
};
