import { jsx, jsxs } from "react/jsx-runtime";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-CV3L0vss.js";
function DeleteConfirmDialog({
  open,
  entityLabel,
  itemName,
  description,
  onOpenChange,
  onConfirm
}) {
  return /* @__PURE__ */ jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "border-border bg-background shadow-xl", children: [
    /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
        "Eliminar ",
        entityLabel
      ] }),
      /* @__PURE__ */ jsx(AlertDialogDescription, { children: description ?? `Estas por eliminar ${itemName ? `"${itemName}"` : "este registro"}. Esta accion no se puede deshacer.` })
    ] }),
    /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
      /* @__PURE__ */ jsx(
        AlertDialogAction,
        {
          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          onClick: () => void onConfirm(),
          children: "Eliminar"
        }
      )
    ] })
  ] }) });
}
export {
  DeleteConfirmDialog as D
};
