import { jsxs, jsx } from "react/jsx-runtime";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Leaf } from "lucide-react";
import { t as cn } from "./router-Rtc38bRC.js";
function clampPercent(value) {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value)));
}
function normalizeGeneticsProfile(sativaPercent, indicaPercent) {
  const sativa = Number.isFinite(sativaPercent) ? clampPercent(sativaPercent) : Number.isFinite(indicaPercent) ? 100 - clampPercent(indicaPercent) : 50;
  return {
    sativaPercent: sativa,
    indicaPercent: 100 - sativa
  };
}
function GeneticsProfileSlider({
  sativaPercent,
  indicaPercent,
  onChange,
  disabled = false
}) {
  const profile = normalizeGeneticsProfile(sativaPercent, indicaPercent);
  function handleValueChange(value) {
    const sativa = clampPercent(value[0] ?? 50);
    onChange({
      sativaPercent: sativa,
      indicaPercent: 100 - sativa
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md border bg-card/70 p-3 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400", children: [
        /* @__PURE__ */ jsx(Leaf, { className: "h-3.5 w-3.5" }),
        "Sativa ",
        profile.sativaPercent,
        "%"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-full border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground", children: "Balance genetico" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400", children: [
        /* @__PURE__ */ jsx(Leaf, { className: "h-3.5 w-3.5 rotate-180" }),
        "Indica ",
        profile.indicaPercent,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      SliderPrimitive.Root,
      {
        "aria-label": "Balance Sativa Indica",
        className: "relative flex h-7 w-full touch-none select-none items-center",
        min: 0,
        max: 100,
        step: 1,
        value: [profile.sativaPercent],
        onValueChange: handleValueChange,
        disabled,
        children: [
          /* @__PURE__ */ jsxs(SliderPrimitive.Track, { className: "relative h-3.5 w-full grow overflow-hidden rounded-full border border-border bg-gradient-to-r from-[#22C55E] to-[#8B5CF6] shadow-inner", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-y-0 left-0 bg-[#22C55E]/30",
                style: { width: `${profile.sativaPercent}%` }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-y-0 right-0 bg-[#8B5CF6]/30",
                style: { width: `${profile.indicaPercent}%` }
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            SliderPrimitive.Thumb,
            {
              className: cn(
                "block h-6 w-6 rounded-full border-2 border-background bg-foreground shadow-lg ring-2 ring-background transition-transform",
                "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50"
              )
            }
          )
        ]
      }
    )
  ] });
}
export {
  GeneticsProfileSlider as G,
  normalizeGeneticsProfile as n
};
