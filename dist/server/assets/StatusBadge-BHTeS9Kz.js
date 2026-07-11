import { jsxs, jsx } from "react/jsx-runtime";
import { t as cn } from "./router-Rtc38bRC.js";
const config = {
  "in-stock": {
    label: "En stock",
    dotClass: "bg-stock-healthy",
    textClass: "text-stock-healthy"
  },
  "low-stock": {
    label: "Bajo stock",
    dotClass: "bg-stock-low animate-pulse",
    textClass: "text-stock-low"
  },
  "out-of-stock": {
    label: "Sin stock",
    dotClass: "bg-stock-out",
    textClass: "text-stock-out"
  },
  active: {
    label: "Activo",
    dotClass: "bg-primary",
    textClass: "text-primary"
  },
  discontinued: {
    label: "Inactivo",
    dotClass: "bg-muted-foreground",
    textClass: "text-muted-foreground"
  },
  archived: {
    label: "Archivado",
    dotClass: "bg-muted-foreground/50",
    textClass: "text-muted-foreground/50"
  }
};
function StatusBadge({ status, className }) {
  const { label, dotClass, textClass } = config[status];
  return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-1.5 text-xs font-medium", className), children: [
    /* @__PURE__ */ jsx("span", { className: cn("h-2 w-2 shrink-0 rounded-full", dotClass) }),
    /* @__PURE__ */ jsx("span", { className: textClass, children: label })
  ] });
}
export {
  StatusBadge as S
};
