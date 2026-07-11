import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { AlertTriangle, Clock, DollarSign, Settings2, TrendingDown, ShieldCheck, ArrowRight, Check, X, ShieldAlert, Search, Sparkles } from "lucide-react";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { S as Switch } from "./switch-CE8zHCZK.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { toast } from "sonner";
import { C as Card, a as CardContent, t as cn, c as CardHeader, d as CardTitle, M as MovementType, B as Button, v as useDemo } from "./router-Rtc38bRC.js";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceLine, Line } from "recharts";
import { subDays, format, differenceInDays } from "date-fns";
import { Link } from "@tanstack/react-router";
import { h as useUpdateItem } from "./useInventoryMutations-yEtOdo22.js";
import { u as usePermissions } from "./usePermissions-DbMx0bgh.js";
import "class-variance-authority";
import "@radix-ui/react-switch";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
function ForecastSummary({ analyses }) {
  const metrics = useMemo(() => {
    const atRisk = analyses.filter(
      (a) => a.daysUntilStockout !== null && a.daysUntilStockout <= 30
    ).length;
    const withStockout = analyses.filter((a) => a.daysUntilStockout !== null);
    const avgDaysOfSupply = withStockout.length > 0 ? Math.round(
      withStockout.reduce((s, a) => s + (a.daysUntilStockout ?? 0), 0) / withStockout.length
    ) : 0;
    const totalReorderValue = analyses.filter(
      (a) => Math.abs(a.suggestedReorderPoint - a.currentReorderPoint) / Math.max(a.currentReorderPoint, 1) > 0.15 || a.daysUntilStockout !== null && a.daysUntilStockout < 30
    ).reduce((s, a) => s + a.suggestedReorderQuantity * (a.currentStock > 0 ? 1 : 1), 0);
    const needsAttention = analyses.filter(
      (a) => Math.abs(a.suggestedReorderPoint - a.currentReorderPoint) / Math.max(a.currentReorderPoint, 1) > 0.15
    ).length;
    return [
      {
        label: "Items At Risk",
        value: atRisk,
        icon: AlertTriangle,
        accent: atRisk > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
      },
      {
        label: "Avg Days of Supply",
        value: `${avgDaysOfSupply}d`,
        icon: Clock
      },
      {
        label: "Suggested Reorder Units",
        value: totalReorderValue.toLocaleString(),
        icon: DollarSign
      },
      {
        label: "Items Needing Attention",
        value: needsAttention,
        icon: Settings2,
        accent: needsAttention > 0 ? "text-amber-600 dark:text-amber-400" : void 0
      }
    ];
  }, [analyses]);
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: metrics.map((m) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-muted p-2", children: /* @__PURE__ */ jsx(m.icon, { className: "h-4 w-4 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: cn("text-xl font-bold", m.accent), children: m.value }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: m.label })
    ] })
  ] }) }, m.label)) });
}
function buildChartData(item, movements) {
  const now = /* @__PURE__ */ new Date();
  const itemMoves = movements.filter((m) => m.itemId === item.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const cutoff = subDays(now, 90);
  const recentOutbound = itemMoves.filter(
    (m) => (m.type === MovementType.Shipped || m.type === MovementType.Adjusted && m.quantity < 0) && new Date(m.createdAt) >= cutoff
  );
  const totalOut = recentOutbound.reduce((s, m) => s + Math.abs(m.quantity), 0);
  const avgDaily = totalOut / 90;
  const data = [];
  for (let d = -30; d <= 0; d++) {
    const date = subDays(now, -d);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const futureOut = itemMoves.filter((m) => {
      const mDate = new Date(m.createdAt);
      return mDate > dayEnd && mDate <= now;
    });
    const netFuture = futureOut.reduce((s, m) => {
      if (m.type === MovementType.Received) return s - m.quantity;
      if (m.type === MovementType.Shipped) return s + m.quantity;
      if (m.type === MovementType.Adjusted) return s - m.quantity;
      return s;
    }, 0);
    data.push({ day: d, actual: Math.max(0, item.currentStock + netFuture) });
  }
  let projected = item.currentStock;
  for (let d = 1; d <= 90; d++) {
    projected = Math.max(0, projected - avgDaily);
    data.push({ day: d, projected: Math.round(projected * 10) / 10 });
  }
  const stockoutDay = avgDaily > 0 ? Math.ceil(item.currentStock / avgDaily) : null;
  return { data, avgDaily, stockoutDay };
}
function DemandForecastChart({ items, movements }) {
  const activeItems = useMemo(() => items.filter((i) => i.status === "active"), [items]);
  const [selectedId, setSelectedId] = useState(activeItems[0]?.id ?? "");
  const selectedItem = activeItems.find((i) => i.id === selectedId);
  const { data, avgDaily, stockoutDay } = useMemo(() => {
    if (!selectedItem) return { data: [], avgDaily: 0, stockoutDay: null };
    return buildChartData(selectedItem, movements);
  }, [selectedItem, movements]);
  if (activeItems.length === 0) return null;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex-row items-center justify-between gap-4 space-y-0 pb-2", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Demand Forecast" }),
      /* @__PURE__ */ jsxs(Select, { value: selectedId, onValueChange: setSelectedId, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[220px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select item" }) }),
        /* @__PURE__ */ jsx(SelectContent, { children: activeItems.map((item) => /* @__PURE__ */ jsx(SelectItem, { value: item.id, children: item.name }, item.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      stockoutDay !== null && stockoutDay <= 90 && /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "destructive", className: "text-xs", children: [
          "Projected stockout in ",
          stockoutDay,
          " days"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "Avg consumption: ",
          avgDaily.toFixed(1),
          " units/day"
        ] })
      ] }),
      /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data, margin: { top: 5, right: 10, left: 0, bottom: 5 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", className: "stroke-border" }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            dataKey: "day",
            tick: { fontSize: 11 },
            label: { value: "Days", position: "insideBottomRight", offset: -5, fontSize: 11 },
            className: "fill-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            tick: { fontSize: 11 },
            label: { value: "Qty", angle: -90, position: "insideLeft", fontSize: 11 },
            className: "fill-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            contentStyle: { fontSize: 12 },
            labelFormatter: (v) => `Day ${v}`
          }
        ),
        selectedItem && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            ReferenceArea,
            {
              y1: selectedItem.reorderPoint,
              y2: 0,
              fill: "hsl(0 84% 60%)",
              fillOpacity: 0.06
            }
          ),
          /* @__PURE__ */ jsx(
            ReferenceLine,
            {
              y: selectedItem.reorderPoint,
              stroke: "hsl(25 95% 53%)",
              strokeDasharray: "4 4",
              label: { value: "Reorder Point", fontSize: 10, fill: "hsl(25 95% 53%)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsx(ReferenceLine, { x: 0, stroke: "hsl(var(--muted-foreground))", strokeDasharray: "2 2" }),
        /* @__PURE__ */ jsx(
          Line,
          {
            type: "monotone",
            dataKey: "actual",
            stroke: "hsl(var(--primary))",
            strokeWidth: 2,
            dot: false,
            connectNulls: false
          }
        ),
        /* @__PURE__ */ jsx(
          Line,
          {
            type: "monotone",
            dataKey: "projected",
            stroke: "hsl(var(--primary))",
            strokeWidth: 2,
            strokeDasharray: "6 3",
            dot: false,
            connectNulls: false
          }
        )
      ] }) })
    ] })
  ] });
}
function getUrgencyBar(days) {
  if (days === null) return "bg-muted-foreground/30";
  if (days < 7) return "bg-destructive";
  if (days <= 14) return "bg-stock-low";
  return "bg-stock-healthy";
}
function getUrgencyBg(days) {
  if (days === null) return "text-muted-foreground";
  if (days < 7) return "text-destructive";
  if (days <= 14) return "text-stock-low";
  return "text-stock-healthy";
}
const confidenceVariant = {
  high: "default",
  medium: "secondary",
  low: "outline"
};
function ReorderSuggestionCard({ analysis, onApply, onDismiss }) {
  const [applied, setApplied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const delta = analysis.suggestedReorderPoint - analysis.currentReorderPoint;
  return /* @__PURE__ */ jsxs(Card, { className: cn(
    "relative overflow-hidden p-4 pl-5 transition-all",
    applied && "opacity-75"
  ), children: [
    /* @__PURE__ */ jsx("div", { className: cn(
      "absolute left-2 top-2 bottom-2 w-[3px] rounded-full",
      applied ? "bg-stock-healthy" : getUrgencyBar(analysis.daysUntilStockout)
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold truncate", children: analysis.itemName }),
          /* @__PURE__ */ jsx(Badge, { variant: confidenceVariant[analysis.confidence], className: "text-[10px] px-1.5 py-0", children: analysis.confidence })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: analysis.sku })
      ] }),
      analysis.daysUntilStockout !== null && /* @__PURE__ */ jsxs("div", { className: cn("text-right shrink-0", getUrgencyBg(analysis.daysUntilStockout)), children: [
        analysis.daysUntilStockout < 7 ? /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 mx-auto" }) : analysis.daysUntilStockout <= 14 ? /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 mx-auto" }) : /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 mx-auto" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold mt-0.5", children: [
          analysis.daysUntilStockout,
          "d"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs", children: [
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Current Stock" }),
      /* @__PURE__ */ jsx("div", { className: "font-medium text-right", children: analysis.currentStock }),
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Reorder Point" }),
      /* @__PURE__ */ jsxs("div", { className: "font-medium text-right flex items-center justify-end gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: analysis.currentReorderPoint }),
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 text-muted-foreground" }),
        /* @__PURE__ */ jsx("span", { className: cn(delta > 0 ? "text-stock-low" : "text-stock-healthy"), children: analysis.suggestedReorderPoint })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Order Qty" }),
      /* @__PURE__ */ jsx("div", { className: "font-medium text-right", children: analysis.suggestedReorderQuantity }),
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Avg Daily Use" }),
      /* @__PURE__ */ jsx("div", { className: "font-medium text-right", children: analysis.avgDailyConsumption.toFixed(1) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 flex items-center gap-2", children: applied ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-stock-healthy font-medium", children: [
      /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }),
      "Applied"
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          variant: "default",
          className: "h-7 text-xs",
          onClick: () => {
            onApply(analysis);
            setApplied(true);
          },
          children: "Apply"
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: "ghost",
          className: "h-7 text-xs",
          onClick: () => {
            onDismiss(analysis);
            setDismissed(true);
          },
          children: [
            /* @__PURE__ */ jsx(X, { className: "h-3 w-3 mr-1" }),
            "Dismiss"
          ]
        }
      )
    ] }) })
  ] });
}
function AnomalyAlertCard({ alert, itemName, itemSku, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const isCritical = alert.severity === "critical";
  const Icon = isCritical ? ShieldAlert : AlertTriangle;
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "relative overflow-hidden p-4 pl-5 transition-all",
        isCritical && "animate-pulse-subtle"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: cn(
          "absolute left-2 top-2 bottom-2 w-[3px] rounded-full",
          isCritical ? "bg-destructive" : "bg-stock-low"
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(
            Icon,
            {
              className: cn(
                "h-4 w-4 mt-0.5 shrink-0",
                isCritical ? "text-destructive" : "text-stock-low"
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: alert.title }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: isCritical ? "destructive" : "secondary",
                  className: "text-[10px] px-1.5 py-0",
                  children: alert.severity
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: alert.description }),
            (itemName || itemSku) && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs", children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/app/catalog",
                search: { item: alert.itemId },
                className: "text-primary hover:underline",
                children: [
                  itemName,
                  itemSku ? ` (${itemSku})` : ""
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsx("span", { children: format(new Date(alert.detectedAt), "MMM d, yyyy h:mm a") }),
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsx("span", { className: "capitalize", children: alert.type.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "h-6 text-xs", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/app/catalog", search: { item: alert.itemId }, children: [
                /* @__PURE__ */ jsx(Search, { className: "h-3 w-3 mr-1" }),
                "Investigate"
              ] }) }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "h-6 text-xs",
                  onClick: () => {
                    setDismissed(true);
                    onDismiss?.(alert);
                  },
                  children: [
                    /* @__PURE__ */ jsx(X, { className: "h-3 w-3 mr-1" }),
                    "Dismiss"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function getDailyConsumption(movements, windowDays = 90) {
  const now = /* @__PURE__ */ new Date();
  const cutoff = new Date(now.getTime() - windowDays * 864e5);
  const outbound = movements.filter(
    (m) => (m.type === MovementType.Shipped || m.type === MovementType.Adjusted && m.quantity < 0) && new Date(m.createdAt) >= cutoff
  );
  const buckets = /* @__PURE__ */ new Map();
  for (let d = 0; d < windowDays; d++) buckets.set(d, 0);
  for (const m of outbound) {
    const dayOffset = Math.min(
      windowDays - 1,
      Math.max(0, differenceInDays(now, new Date(m.createdAt)))
    );
    buckets.set(dayOffset, (buckets.get(dayOffset) ?? 0) + Math.abs(m.quantity));
  }
  return Array.from(buckets.values());
}
function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function stdDev(arr) {
  if (arr.length < 2) return 0;
  const avg = mean(arr);
  const sqDiffs = arr.map((v) => (v - avg) ** 2);
  return Math.sqrt(mean(sqDiffs));
}
function calculateReorderPoint(movements, leadTimeDays) {
  const daily = getDailyConsumption(movements);
  const avg = mean(daily);
  const sd = stdDev(daily);
  const safetyStock = 1.5 * sd * Math.sqrt(Math.max(leadTimeDays, 1));
  return Math.ceil(avg * leadTimeDays + safetyStock);
}
function calculateReorderQuantity(avgDailyConsumption, leadTimeDays, orderFrequencyDays = 30) {
  if (avgDailyConsumption <= 0) return 1;
  return Math.max(1, Math.ceil(avgDailyConsumption * (leadTimeDays + orderFrequencyDays)));
}
function getConfidence(movements) {
  if (movements.length === 0) return "low";
  const oldest = new Date(
    Math.min(...movements.map((m) => new Date(m.createdAt).getTime()))
  );
  const historyDays = differenceInDays(/* @__PURE__ */ new Date(), oldest);
  if (historyDays >= 60) return "high";
  if (historyDays >= 30) return "medium";
  return "low";
}
function analyzeItem(item, movements, supplier) {
  const itemMovements = movements.filter((m) => m.itemId === item.id);
  const leadTimeDays = supplier?.leadTimeDays ?? 7;
  const daily = getDailyConsumption(itemMovements);
  const avgDailyConsumption = mean(daily);
  const suggestedReorderPoint = calculateReorderPoint(itemMovements, leadTimeDays);
  const suggestedReorderQuantity = calculateReorderQuantity(
    avgDailyConsumption,
    leadTimeDays
  );
  const daysUntilStockout = avgDailyConsumption > 0 ? Math.max(0, Math.floor(item.currentStock / avgDailyConsumption)) : null;
  return {
    itemId: item.id,
    itemName: item.name,
    sku: item.sku,
    currentStock: item.currentStock,
    currentReorderPoint: item.reorderPoint,
    currentReorderQuantity: item.reorderQuantity,
    suggestedReorderPoint,
    suggestedReorderQuantity,
    avgDailyConsumption,
    daysUntilStockout,
    confidence: getConfidence(itemMovements),
    leadTimeDays
  };
}
function analyzeAllItems(items, movements, suppliers) {
  const supplierMap = new Map(suppliers.map((s) => [s.id, s]));
  return items.filter((i) => i.status === "active").map((item) => analyzeItem(item, movements, supplierMap.get(item.supplierId ?? ""))).sort((a, b) => {
    const aD = a.daysUntilStockout ?? Infinity;
    const bD = b.daysUntilStockout ?? Infinity;
    return aD - bD;
  });
}
const MIN_HISTORY = 5;
function detectQuantitySpike(movement, itemHistory) {
  if (itemHistory.length < MIN_HISTORY) return null;
  const avg = itemHistory.reduce((s, m) => s + Math.abs(m.quantity), 0) / itemHistory.length;
  const qty = Math.abs(movement.quantity);
  if (avg === 0 || qty <= avg * 3) return null;
  const ratio = (qty / avg).toFixed(1);
  const isCritical = qty > avg * 5;
  return {
    movementId: movement.id,
    itemId: movement.itemId,
    type: "quantity_spike",
    severity: isCritical ? "critical" : "warning",
    title: `Quantity spike: ${qty} units`,
    description: `This movement of ${qty} units is ${ratio}× the average of ${Math.round(avg)} units for this item.`,
    detectedAt: movement.createdAt
  };
}
function detectFrequentAdjustments(itemMovements, windowDays = 7) {
  if (itemMovements.length < MIN_HISTORY) return null;
  const now = /* @__PURE__ */ new Date();
  const adjustments = itemMovements.filter(
    (m) => m.type === MovementType.Adjusted && differenceInDays(now, new Date(m.createdAt)) <= windowDays
  );
  if (adjustments.length <= 3) return null;
  const latest = adjustments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
  return {
    movementId: latest.id,
    itemId: latest.itemId,
    type: "frequent_adjustments",
    severity: adjustments.length > 5 ? "critical" : "warning",
    title: `${adjustments.length} adjustments in ${windowDays} days`,
    description: `This item has been adjusted ${adjustments.length} times in the last ${windowDays} days, which may indicate counting issues or process problems.`,
    detectedAt: latest.createdAt
  };
}
function detectUnusualTiming(movement, itemHistory) {
  if (itemHistory.length < MIN_HISTORY) return null;
  const movDay = new Date(movement.createdAt).getDay();
  const isWeekend = movDay === 0 || movDay === 6;
  if (!isWeekend) return null;
  const weekendHistory = itemHistory.filter((m) => {
    const d = new Date(m.createdAt).getDay();
    return d === 0 || d === 6;
  });
  if (weekendHistory.length / itemHistory.length < 0.1) {
    return {
      movementId: movement.id,
      itemId: movement.itemId,
      type: "unusual_timing",
      severity: "warning",
      title: "Unusual weekend activity",
      description: `This movement occurred on a weekend, while only ${weekendHistory.length} of ${itemHistory.length} prior movements were on weekends.`,
      detectedAt: movement.createdAt
    };
  }
  return null;
}
function analyzeMovements(movements) {
  const alerts = [];
  const seen = /* @__PURE__ */ new Set();
  const byItem = /* @__PURE__ */ new Map();
  for (const m of movements) {
    const arr = byItem.get(m.itemId) ?? [];
    arr.push(m);
    byItem.set(m.itemId, arr);
  }
  for (const [itemId, itemMoves] of byItem) {
    const sorted = [...itemMoves].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    for (let i = 0; i < sorted.length; i++) {
      const m = sorted[i];
      const prior = sorted.slice(0, i);
      const spike = detectQuantitySpike(m, prior);
      if (spike && !seen.has(`spike-${m.id}`)) {
        alerts.push(spike);
        seen.add(`spike-${m.id}`);
      }
      const timing = detectUnusualTiming(m, prior);
      if (timing && !seen.has(`timing-${m.id}`)) {
        alerts.push(timing);
        seen.add(`timing-${m.id}`);
      }
    }
    const freq = detectFrequentAdjustments(sorted);
    if (freq && !seen.has(`freq-${itemId}`)) {
      alerts.push(freq);
      seen.add(`freq-${itemId}`);
    }
  }
  return alerts.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
    return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
  });
}
function AiInsightsPage() {
  const {
    demoStore
  } = useDemo();
  const {
    can
  } = usePermissions();
  const updateItem = useUpdateItem();
  const [urgency, setUrgency] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [sortBy, setSortBy] = useState("stockout");
  const [anomSeverity, setAnomSeverity] = useState("all");
  const [anomType, setAnomType] = useState("all");
  const [showDismissed, setShowDismissed] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(/* @__PURE__ */ new Set());
  const items = demoStore?.getItems() ?? [];
  const movements = demoStore?.getMovements() ?? [];
  const suppliers = demoStore?.getSuppliers() ?? [];
  const allAnalyses = useMemo(() => analyzeAllItems(items, movements, suppliers), [items, movements, suppliers]);
  const allAnomalies = useMemo(() => {
    const cutoff = subDays(/* @__PURE__ */ new Date(), 90);
    const recent = movements.filter((m) => new Date(m.createdAt) >= cutoff);
    return analyzeMovements(recent);
  }, [movements]);
  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const filteredAnomalies = useMemo(() => {
    let result = [...allAnomalies];
    if (!showDismissed) result = result.filter((a) => !dismissedIds.has(`${a.type}-${a.movementId}`));
    if (anomSeverity !== "all") result = result.filter((a) => a.severity === anomSeverity);
    if (anomType !== "all") result = result.filter((a) => a.type === anomType);
    return result;
  }, [allAnomalies, anomSeverity, anomType, showDismissed, dismissedIds]);
  const filtered = useMemo(() => {
    let result = [...allAnalyses];
    if (urgency !== "all") {
      result = result.filter((a) => {
        if (a.daysUntilStockout === null) return urgency === "low";
        if (a.daysUntilStockout < 7) return urgency === "critical";
        if (a.daysUntilStockout <= 14) return urgency === "moderate";
        return urgency === "low";
      });
    }
    if (confidence !== "all") {
      result = result.filter((a) => a.confidence === confidence);
    }
    if (sortBy === "delta") {
      result.sort((a, b) => Math.abs(b.suggestedReorderPoint - b.currentReorderPoint) - Math.abs(a.suggestedReorderPoint - a.currentReorderPoint));
    }
    return result;
  }, [allAnalyses, urgency, confidence, sortBy]);
  if (!can("view_analytics")) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "You don't have permission to view this page." }) });
  }
  const handleApply = (a) => {
    updateItem.mutate({
      id: a.itemId,
      updates: {
        reorderPoint: a.suggestedReorderPoint,
        reorderQuantity: a.suggestedReorderQuantity
      }
    }, {
      onSuccess: () => toast.success(`Reorder settings updated for ${a.itemName}`),
      onError: (e) => toast.error(e.message || "Failed to update reorder settings.")
    });
  };
  const handleDismiss = (_a) => {
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "AI insights" }),
      /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Beta" })
    ] }),
    /* @__PURE__ */ jsx(ForecastSummary, { analyses: allAnalyses }),
    /* @__PURE__ */ jsx(DemandForecastChart, { items, movements }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxs(Select, { value: urgency, onValueChange: (v) => setUrgency(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Urgency" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Urgency" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "critical", children: "Critical (<7d)" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "moderate", children: "Moderate (7-14d)" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "low", children: "Low (>14d)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: confidence, onValueChange: (v) => setConfidence(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[150px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Confidence" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Confidence" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "high", children: "High" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "medium", children: "Medium" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "low", children: "Low" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: sortBy, onValueChange: (v) => setSortBy(v), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sort by" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "stockout", children: "Days to Stockout" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "delta", children: "Order delta" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
        filtered.length,
        " order",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-muted-foreground py-8", children: "No suggested orders match the current filters." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((a) => /* @__PURE__ */ jsx(ReorderSuggestionCard, { analysis: a, onApply: handleApply, onDismiss: handleDismiss }, a.itemId)) }),
    /* @__PURE__ */ jsxs("div", { id: "anomalies", className: "space-y-4 pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "h-5 w-5 text-destructive" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Anomaly Detection" }),
        /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: allAnomalies.length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Total: ",
          allAnomalies.length
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Critical: ",
          allAnomalies.filter((a) => a.severity === "critical").length
        ] }),
        allAnomalies.length > 0 && (() => {
          const counts = /* @__PURE__ */ new Map();
          allAnomalies.forEach((a) => counts.set(a.itemId, (counts.get(a.itemId) ?? 0) + 1));
          const [topId, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
          const topItem = itemMap.get(topId);
          return topItem ? /* @__PURE__ */ jsxs("span", { children: [
            "Most affected: ",
            topItem.name,
            " (",
            topCount,
            ")"
          ] }) : null;
        })()
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxs(Select, { value: anomSeverity, onValueChange: (v) => setAnomSeverity(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[130px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Severity" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Severity" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "critical", children: "Critical" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "warning", children: "Warning" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: anomType, onValueChange: (v) => setAnomType(v), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[170px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Type" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Types" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "quantity_spike", children: "Quantity Spike" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "frequent_adjustments", children: "Frequent Adjustments" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "unusual_timing", children: "Unusual Timing" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
          /* @__PURE__ */ jsx(Switch, { id: "show-dismissed", checked: showDismissed, onCheckedChange: setShowDismissed }),
          /* @__PURE__ */ jsx(Label, { htmlFor: "show-dismissed", className: "text-xs", children: "Show Dismissed" })
        ] })
      ] }),
      filteredAnomalies.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-muted-foreground py-8", children: "No anomalies match the current filters." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: filteredAnomalies.map((a) => {
        const item = itemMap.get(a.itemId);
        return /* @__PURE__ */ jsx(AnomalyAlertCard, { alert: a, itemName: item?.name, itemSku: item?.sku, onDismiss: (alert) => {
          setDismissedIds((prev) => /* @__PURE__ */ new Set([...prev, `${alert.type}-${alert.movementId}`]));
        } }, `${a.type}-${a.movementId}`);
      }) })
    ] })
  ] });
}
export {
  AiInsightsPage as component
};
