import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle } from "lucide-react";
function isRelationshipWarning(message) {
  const normalized = message.toLowerCase();
  return normalized.includes("no se puede") || normalized.includes("relacionad") || normalized.includes("reasigna") || normalized.includes("asociad");
}
function RelationshipWarning({ message, className = "" }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: [
        "flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive",
        className
      ].join(" "),
      children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "mt-0.5 h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsx("p", { children: message })
      ]
    }
  );
}
function CultivationStatusMessage({ message }) {
  if (isRelationshipWarning(message)) {
    return /* @__PURE__ */ jsx(RelationshipWarning, { message });
  }
  return /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: message });
}
export {
  CultivationStatusMessage as C,
  RelationshipWarning as R
};
