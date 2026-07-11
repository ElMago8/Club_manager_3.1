import { jsxs, jsx } from "react/jsx-runtime";
import { TrendingUp, TrendingDown } from "lucide-react";
const ACCENT_BAR = {
  healthy: "bg-stock-healthy",
  warning: "bg-stock-low",
  danger: "bg-stock-out",
  neutral: "bg-primary"
};
const ACCENT_BG = {
  healthy: "bg-metric-healthy-bg/50",
  warning: "bg-metric-warning-bg/50",
  danger: "bg-metric-danger-bg/50",
  neutral: "bg-metric-neutral-bg/50"
};
const ICON_COLOR = {
  healthy: "text-stock-healthy",
  warning: "text-stock-low",
  danger: "text-stock-out",
  neutral: "text-primary"
};
function MetricCard({ label, value, trend, accentColor = "neutral", icon: Icon }) {
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-lg ${ACCENT_BG[accentColor]} px-6 py-5`, children: [
    /* @__PURE__ */ jsx("div", { className: `absolute left-2 top-2 bottom-2 w-[3px] rounded-full ${ACCENT_BAR[accentColor]}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: label }),
      Icon && /* @__PURE__ */ jsx(Icon, { className: `h-5 w-5 ${ICON_COLOR[accentColor]} opacity-60` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-baseline gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono text-3xl font-semibold leading-tight text-foreground", children: value.toLocaleString() }),
      trend && /* @__PURE__ */ jsxs("span", { className: `flex items-center gap-0.5 text-xs font-medium ${trend.direction === "up" ? "text-stock-healthy" : "text-stock-out"}`, children: [
        trend.direction === "up" ? /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "h-3 w-3" }),
        trend.percentage,
        "%"
      ] })
    ] })
  ] });
}
export {
  MetricCard as M
};
