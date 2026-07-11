import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DollarSign, X, Package, Clock, CheckCircle, Target, Layers, TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";
import { subDays, format, startOfWeek, startOfDay, startOfMonth } from "date-fns";
import { u as usePermissions } from "./usePermissions-DbMx0bgh.js";
import { a as useItems, u as useCategories, f as useSuppliers, b as useLocations, c as useMovements, d as usePurchaseOrders } from "./useInventoryData-B4MqeUD9.js";
import { M as MovementType, C as Card, c as CardHeader, d as CardTitle, a as CardContent, B as Button, O as OrderStatus, E as ErrorBoundary } from "./router-Rtc38bRC.js";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-Dt8gr3JP.js";
import { M as MetricCard } from "./MetricCard-DQTOhwsX.js";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell, PieChart, Pie, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { E as EmptyState } from "./EmptyState-Dkmucllf.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "@radix-ui/react-select";
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
function StockSummaryCards({ items }) {
  const metrics = useMemo(() => {
    const totalValue = items.reduce((sum, i) => sum + i.currentStock * i.costPrice, 0);
    const totalSkus = items.length;
    const avgStock = items.length > 0 ? Math.round(items.reduce((sum, i) => sum + i.currentStock, 0) / items.length) : 0;
    const belowReorder = items.filter((i) => i.currentStock < i.reorderPoint).length;
    return { totalValue, totalSkus, avgStock, belowReorder };
  }, [items]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-md border border-border bg-card p-5 pl-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-2 top-2 bottom-2 w-[3px] rounded-full bg-primary" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Total Inventory Value" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-2xl font-bold text-foreground", children: metrics.totalValue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Total SKUs", value: metrics.totalSkus, accentColor: "neutral" }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Avg Stock Level", value: metrics.avgStock, accentColor: "healthy" }),
    /* @__PURE__ */ jsx(MetricCard, { label: "Below Reorder Point", value: metrics.belowReorder, accentColor: metrics.belowReorder > 0 ? "warning" : "healthy" })
  ] });
}
function StockByCategoryChart({ items, categories }) {
  const navigate = useNavigate();
  const data = useMemo(() => {
    const countMap = /* @__PURE__ */ new Map();
    items.forEach((i) => {
      if (i.categoryId) countMap.set(i.categoryId, (countMap.get(i.categoryId) ?? 0) + 1);
    });
    return categories.map((c) => ({ name: c.name, count: countMap.get(c.id) ?? 0, id: c.id })).filter((d) => d.count > 0).sort((a, b) => b.count - a.count);
  }, [items, categories]);
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No category data available" });
  }
  const height = Math.max(200, data.length * 40 + 40);
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(BarChart, { data, layout: "vertical", margin: { left: 0, right: 20, top: 5, bottom: 5 }, children: [
    /* @__PURE__ */ jsx(XAxis, { type: "number", tick: { fontSize: 12 } }),
    /* @__PURE__ */ jsx(YAxis, { type: "category", dataKey: "name", width: 120, tick: { fontSize: 12 } }),
    /* @__PURE__ */ jsx(Tooltip, { formatter: (value) => [value, "Items"] }),
    /* @__PURE__ */ jsx(
      Bar,
      {
        dataKey: "count",
        radius: [0, 4, 4, 0],
        cursor: "pointer",
        onClick: (d) => navigate({ to: "/app/catalog", search: { category: d.id } }),
        children: data.map((_, i) => /* @__PURE__ */ jsx(Cell, { className: "fill-primary" }, i))
      }
    )
  ] }) });
}
const STATUS_COLORS = ["hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];
const STATUS_LABELS = ["In Stock", "Low Stock", "Out of Stock"];
function StockStatusChart({ items }) {
  const data = useMemo(() => {
    const inStock = items.filter((i) => i.currentStock > i.reorderPoint).length;
    const low = items.filter((i) => i.currentStock > 0 && i.currentStock <= i.reorderPoint).length;
    const out = items.filter((i) => i.currentStock === 0).length;
    return [
      { name: "In Stock", value: inStock },
      { name: "Low Stock", value: low },
      { name: "Out of Stock", value: out }
    ].filter((d) => d.value > 0);
  }, [items]);
  const total = items.length;
  if (total === 0) {
    return /* @__PURE__ */ jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No items to display" });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(PieChart, { children: [
    /* @__PURE__ */ jsx(Pie, { data, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 90, paddingAngle: 2, dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: data.map((entry) => {
      const idx = STATUS_LABELS.indexOf(entry.name);
      return /* @__PURE__ */ jsx(Cell, { fill: STATUS_COLORS[idx] ?? STATUS_COLORS[0] }, entry.name);
    }) }),
    /* @__PURE__ */ jsx(Tooltip, { formatter: (value, name) => [`${value} (${(value / total * 100).toFixed(1)}%)`, name] }),
    /* @__PURE__ */ jsx(Legend, {}),
    /* @__PURE__ */ jsx("text", { x: "50%", y: "50%", textAnchor: "middle", dominantBaseline: "middle", className: "fill-foreground text-lg font-bold", children: total })
  ] }) });
}
const LINE_COLORS = {
  received: "hsl(142, 71%, 45%)",
  shipped: "hsl(220, 70%, 55%)",
  adjusted: "hsl(38, 92%, 50%)",
  transferred: "hsl(280, 60%, 55%)"
};
function MovementTrendsChart({ movements, days }) {
  const data = useMemo(() => {
    const cutoff = subDays(/* @__PURE__ */ new Date(), days);
    const filtered = movements.filter((m) => new Date(m.createdAt) >= cutoff);
    const weekly = days > 30;
    const buckets = /* @__PURE__ */ new Map();
    for (const m of filtered) {
      const d = new Date(m.createdAt);
      const key = weekly ? format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd") : format(startOfDay(d), "yyyy-MM-dd");
      if (!buckets.has(key)) buckets.set(key, { received: 0, shipped: 0, adjusted: 0, transferred: 0 });
      const b = buckets.get(key);
      b[m.type] = (b[m.type] ?? 0) + 1;
    }
    return Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, counts]) => ({
      date: format(new Date(date), weekly ? "MMM d" : "MMM d"),
      ...counts
    }));
  }, [movements, days]);
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No movements in this period" });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data, margin: { left: 0, right: 10, top: 5, bottom: 5 }, children: [
    /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: { fontSize: 11 } }),
    /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 }, allowDecimals: false }),
    /* @__PURE__ */ jsx(Tooltip, {}),
    /* @__PURE__ */ jsx(Legend, {}),
    Object.entries(LINE_COLORS).map(([key, color]) => /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: key, stroke: color, strokeWidth: 2, dot: false }, key))
  ] }) });
}
function TurnoverAnalysis({ items, movements }) {
  const navigate = useNavigate();
  const { fastest, slowest, mostReordered } = useMemo(() => {
    const outbound = /* @__PURE__ */ new Map();
    const receivedCount = /* @__PURE__ */ new Map();
    for (const m of movements) {
      if (m.type === MovementType.Shipped) outbound.set(m.itemId, (outbound.get(m.itemId) ?? 0) + Math.abs(m.quantity));
      if (m.type === MovementType.Received) receivedCount.set(m.itemId, (receivedCount.get(m.itemId) ?? 0) + 1);
    }
    const turnover = items.map((i) => {
      const out = outbound.get(i.id) ?? 0;
      const avgStock = Math.max(i.currentStock, 1);
      return { ...i, turnoverRate: out / avgStock, receivedCount: receivedCount.get(i.id) ?? 0 };
    });
    const fastest2 = [...turnover].sort((a, b) => b.turnoverRate - a.turnoverRate).slice(0, 10);
    const slowest2 = [...turnover].sort((a, b) => a.turnoverRate - b.turnoverRate).slice(0, 10);
    const mostReordered2 = [...turnover].sort((a, b) => b.receivedCount - a.receivedCount).slice(0, 10);
    return { fastest: fastest2, slowest: slowest2, mostReordered: mostReordered2 };
  }, [items, movements]);
  const renderList = (title, list, metric) => /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: title }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "px-4 pb-4 text-sm text-muted-foreground", children: "No data" }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: list.map((item, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => navigate({ to: "/app/catalog", search: { item: item.id } }),
        className: "flex w-full items-center justify-between px-4 py-2 text-left hover:bg-muted/50 transition-colors",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground w-5 shrink-0", children: [
              i + 1,
              "."
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm truncate", children: item.name }),
            /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-muted-foreground shrink-0", children: item.sku })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground shrink-0", children: metric(item) })
        ]
      },
      item.id
    )) }) })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
    renderList("Fastest Moving", fastest, (i) => `${i.turnoverRate.toFixed(1)}× turnover`),
    renderList("Slowest Moving", slowest, (i) => `${i.turnoverRate.toFixed(1)}× turnover`),
    renderList("Most Reordered", mostReordered, (i) => `${i.receivedCount} receipts`)
  ] });
}
const DATE_PRESETS = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "This Year", value: 365 }
];
function AnalyticsFilters({ filters, onChange, categories, suppliers, locations }) {
  const activeCount = [filters.categoryId, filters.supplierId, filters.locationId].filter(Boolean).length;
  const set = (key, value) => onChange({ ...filters, [key]: value });
  const clearAll = () => onChange({ ...filters, categoryId: null, supplierId: null, locationId: null });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ jsxs(Select, { value: String(filters.days), onValueChange: (v) => set("days", Number(v)), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-[140px] text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
      /* @__PURE__ */ jsx(SelectContent, { children: DATE_PRESETS.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: String(p.value), children: p.label }, p.value)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-border" }),
    /* @__PURE__ */ jsxs(Select, { value: filters.categoryId ?? "__all__", onValueChange: (v) => set("categoryId", v === "__all__" ? null : v), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-[130px] text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Category" }) }),
      /* @__PURE__ */ jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "All Categories" }),
        categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id, children: c.name }, c.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Select, { value: filters.supplierId ?? "__all__", onValueChange: (v) => set("supplierId", v === "__all__" ? null : v), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-[130px] text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Supplier" }) }),
      /* @__PURE__ */ jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "All Suppliers" }),
        suppliers.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s.id, children: s.name }, s.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Select, { value: filters.locationId ?? "__all__", onValueChange: (v) => set("locationId", v === "__all__" ? null : v), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-[130px] text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Location" }) }),
      /* @__PURE__ */ jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "All Locations" }),
        locations.map((l) => /* @__PURE__ */ jsx(SelectItem, { value: l.id, children: l.name }, l.id))
      ] })
    ] }),
    activeCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
        activeCount,
        " filter",
        activeCount !== 1 && "s"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs", onClick: clearAll, children: [
        /* @__PURE__ */ jsx(X, { className: "mr-1 h-3 w-3" }),
        " Clear"
      ] })
    ] })
  ] });
}
function rateColor(rate) {
  if (rate >= 90) return "text-green-600 dark:text-green-400";
  if (rate >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}
function computeMetrics(suppliers, pos) {
  return suppliers.map((supplier) => {
    const supplierPOs = pos.filter((po) => po.supplierId === supplier.id);
    if (supplierPOs.length === 0) return null;
    const receivedPOs = supplierPOs.filter(
      (po) => po.status === OrderStatus.Received || po.status === OrderStatus.Partial
    );
    const leadTimes = receivedPOs.map((po) => {
      const created = new Date(po.createdAt).getTime();
      const updated = new Date(po.updatedAt).getTime();
      return Math.max(1, Math.round((updated - created) / 864e5));
    });
    const avgLeadTime = leadTimes.length > 0 ? Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length) : 0;
    const withExpected = receivedPOs.filter((po) => po.expectedDelivery);
    const onTime = withExpected.filter((po) => new Date(po.updatedAt) <= new Date(po.expectedDelivery));
    const onTimeRate = withExpected.length > 0 ? Math.round(onTime.length / withExpected.length * 100) : 100;
    let totalLines = 0;
    let accurateLines = 0;
    receivedPOs.forEach((po) => {
      po.items.forEach((li) => {
        totalLines++;
        if (li.quantityReceived >= li.quantityOrdered) accurateLines++;
      });
    });
    const fulfillmentAccuracy = totalLines > 0 ? Math.round(accurateLines / totalLines * 100) : 100;
    return { supplier, totalPOs: supplierPOs.length, avgLeadTime, onTimeRate, fulfillmentAccuracy };
  }).filter(Boolean);
}
function SupplierScoreCards({ suppliers, purchaseOrders }) {
  const metrics = useMemo(() => computeMetrics(suppliers, purchaseOrders), [suppliers, purchaseOrders]);
  if (metrics.length === 0) {
    return /* @__PURE__ */ jsx(EmptyState, { icon: Package, title: "No supplier data", description: "No suppliers have purchase orders yet." });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3", children: metrics.map((m) => /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: m.supplier.name }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-3.5 w-3.5" }),
          " Total POs"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: m.totalPOs })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
          " Avg Lead Time"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          m.avgLeadTime,
          "d"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-3.5 w-3.5" }),
          " On-Time Rate"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: `font-medium ${rateColor(m.onTimeRate)}`, children: [
          m.onTimeRate,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Target, { className: "h-3.5 w-3.5" }),
          " Fulfillment"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: `font-medium ${rateColor(m.fulfillmentAccuracy)}`, children: [
          m.fulfillmentAccuracy,
          "%"
        ] })
      ] })
    ] })
  ] }, m.supplier.id)) });
}
function formatCurrency$2(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}
function SpendBySupplierChart({ suppliers, purchaseOrders }) {
  const navigate = useNavigate();
  const data = useMemo(() => {
    const receivedPOs = purchaseOrders.filter(
      (po) => po.status === OrderStatus.Received || po.status === OrderStatus.Partial
    );
    const spendMap = /* @__PURE__ */ new Map();
    receivedPOs.forEach((po) => {
      const spend = po.items.reduce((sum, li) => sum + li.quantityReceived * li.unitCost, 0);
      spendMap.set(po.supplierId, (spendMap.get(po.supplierId) || 0) + spend);
    });
    return [...spendMap.entries()].map(([supplierId, spend]) => {
      const supplier = suppliers.find((s) => s.id === supplierId);
      return supplier ? { id: supplierId, name: supplier.name, spend } : null;
    }).filter(Boolean).sort((a, b) => b.spend - a.spend);
  }, [suppliers, purchaseOrders]);
  if (data.length === 0) {
    return /* @__PURE__ */ jsx(EmptyState, { icon: DollarSign, title: "No spending data", description: "No received purchase orders to analyze." });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: Math.max(200, data.length * 48), children: /* @__PURE__ */ jsxs(BarChart, { data, layout: "vertical", margin: { left: 10, right: 20, top: 5, bottom: 5 }, children: [
    /* @__PURE__ */ jsx(XAxis, { type: "number", tickFormatter: (v) => formatCurrency$2(v), tick: { fontSize: 12 } }),
    /* @__PURE__ */ jsx(YAxis, { type: "category", dataKey: "name", width: 120, tick: { fontSize: 12 } }),
    /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => formatCurrency$2(v), labelFormatter: (l) => `Supplier: ${l}` }),
    /* @__PURE__ */ jsx(
      Bar,
      {
        dataKey: "spend",
        radius: [0, 4, 4, 0],
        cursor: "pointer",
        onClick: (entry) => navigate({ to: "/app/suppliers", search: { supplier: entry.id } }),
        children: data.map((_, i) => /* @__PURE__ */ jsx(Cell, { className: "fill-primary/80 hover:fill-primary" }, i))
      }
    )
  ] }) });
}
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(180 60% 45%)",
  "hsl(30 80% 55%)",
  "hsl(270 50% 55%)"
];
function formatCurrency$1(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}
function CostByCategoryChart({ items, categories }) {
  const { data, total } = useMemo(() => {
    const costMap = /* @__PURE__ */ new Map();
    items.forEach((item) => {
      const key = item.categoryId || "uncategorized";
      costMap.set(key, (costMap.get(key) || 0) + item.currentStock * item.costPrice);
    });
    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const data2 = [...costMap.entries()].map(([id, cost]) => ({ name: catMap.get(id) || "Uncategorized", value: Math.round(cost * 100) / 100 })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
    const total2 = data2.reduce((s, d) => s + d.value, 0);
    return { data: data2, total: total2 };
  }, [items, categories]);
  if (data.length === 0) {
    return /* @__PURE__ */ jsx(EmptyState, { icon: Layers, title: "No cost data", description: "No categorized items with cost data." });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(PieChart, { children: [
    /* @__PURE__ */ jsx(
      Pie,
      {
        data,
        cx: "50%",
        cy: "50%",
        innerRadius: 60,
        outerRadius: 100,
        dataKey: "value",
        paddingAngle: 2,
        label: false,
        children: data.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))
      }
    ),
    /* @__PURE__ */ jsx("text", { x: "50%", y: "48%", textAnchor: "middle", className: "fill-foreground text-xs", children: "Total" }),
    /* @__PURE__ */ jsx("text", { x: "50%", y: "56%", textAnchor: "middle", className: "fill-foreground text-sm font-semibold", children: formatCurrency$1(total) }),
    /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => formatCurrency$1(v) }),
    /* @__PURE__ */ jsx(Legend, { formatter: (value) => /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: value }) })
  ] }) });
}
function formatCurrency(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}
function CostTrendChart({ purchaseOrders }) {
  const [cumulative, setCumulative] = useState(false);
  const data = useMemo(() => {
    const receivedPOs = purchaseOrders.filter(
      (po) => po.status === OrderStatus.Received || po.status === OrderStatus.Partial
    );
    if (receivedPOs.length === 0) return [];
    const monthMap = /* @__PURE__ */ new Map();
    receivedPOs.forEach((po) => {
      const monthKey = format(startOfMonth(new Date(po.updatedAt)), "yyyy-MM");
      const spend = po.items.reduce((s, li) => s + li.quantityReceived * li.unitCost, 0);
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + spend);
    });
    const sorted = [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    let runningTotal = 0;
    return sorted.map(([month, spend]) => {
      runningTotal += spend;
      return {
        month: format(/* @__PURE__ */ new Date(month + "-01"), "MMM yyyy"),
        spend: Math.round(spend * 100) / 100,
        cumulative: Math.round(runningTotal * 100) / 100
      };
    });
  }, [purchaseOrders]);
  if (data.length === 0) {
    return /* @__PURE__ */ jsx(EmptyState, { icon: TrendingUp, title: "No spending trend", description: "No received POs to chart over time." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: cumulative ? "outline" : "default", onClick: () => setCumulative(false), children: "Per Period" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: cumulative ? "default" : "outline", onClick: () => setCumulative(true), children: "Cumulative" })
    ] }),
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(LineChart, { data, margin: { left: 10, right: 20, top: 5, bottom: 5 }, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", className: "stroke-border" }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "month", tick: { fontSize: 12 } }),
      /* @__PURE__ */ jsx(YAxis, { tickFormatter: (v) => formatCurrency(v), tick: { fontSize: 12 } }),
      /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => formatCurrency(v) }),
      /* @__PURE__ */ jsx(
        Line,
        {
          type: "monotone",
          dataKey: cumulative ? "cumulative" : "spend",
          className: "stroke-primary",
          strokeWidth: 2,
          dot: { r: 4, className: "fill-primary" }
        }
      )
    ] }) })
  ] });
}
function AnalyticsPage() {
  const {
    can
  } = usePermissions();
  const navigate = useNavigate();
  useEffect(() => {
    if (!can("view_analytics")) {
      toast.error("Access denied");
      navigate({
        to: "/app/dashboard"
      });
    }
  }, [can, navigate]);
  const [tab, setTab] = useState("stock");
  const [filters, setFilters] = useState({
    categoryId: null,
    supplierId: null,
    locationId: null,
    days: 30
  });
  const [stockOpen, setStockOpen] = useState(true);
  const [movementOpen, setMovementOpen] = useState(true);
  const [turnoverOpen, setTurnoverOpen] = useState(true);
  const {
    data: allItems
  } = useItems();
  const {
    data: categories
  } = useCategories();
  const {
    data: suppliers
  } = useSuppliers();
  const {
    data: locations
  } = useLocations();
  const {
    data: allMovements
  } = useMovements();
  const {
    data: purchaseOrders
  } = usePurchaseOrders();
  const items = useMemo(() => {
    let result = allItems;
    if (filters.categoryId) result = result.filter((i) => i.categoryId === filters.categoryId);
    if (filters.supplierId) result = result.filter((i) => i.supplierId === filters.supplierId);
    if (filters.locationId) result = result.filter((i) => i.locationId === filters.locationId);
    return result;
  }, [allItems, filters]);
  const movements = useMemo(() => {
    const cutoff = subDays(/* @__PURE__ */ new Date(), filters.days);
    let result = allMovements.filter((m) => new Date(m.createdAt) >= cutoff);
    if (filters.categoryId || filters.supplierId || filters.locationId) {
      const itemIds = new Set(items.map((i) => i.id));
      result = result.filter((m) => itemIds.has(m.itemId));
    }
    return result;
  }, [allMovements, items, filters]);
  const handleExportStock = () => {
    if (items.length === 0 && movements.length === 0) {
      toast.error("No data to export");
      return;
    }
    const rows = ["Section,Name,SKU,Qty,Cost,Value,Status"];
    items.forEach((i) => rows.push(`Stock,${i.name},${i.sku},${i.currentStock},${i.costPrice},${(i.currentStock * i.costPrice).toFixed(2)},${i.status}`));
    rows.push("", "Section,Date,Item,Type,Qty,Reference");
    movements.forEach((m) => rows.push(`Movement,${m.createdAt},${m.itemId},${m.type},${m.quantity},${m.reference}`));
    downloadCsv(rows.join("\n"), "stackwise-analytics");
  };
  const handleExportSupplier = () => {
    const metrics = computeMetrics(suppliers, purchaseOrders);
    if (metrics.length === 0) {
      toast.error("No data to export");
      return;
    }
    const rows = ["Section,Name,Total POs,Avg Lead Time (days),On-Time Rate (%),Fulfillment Accuracy (%)"];
    metrics.forEach((m) => rows.push(`Supplier,${m.supplier.name},${m.totalPOs},${m.avgLeadTime},${m.onTimeRate},${m.fulfillmentAccuracy}`));
    rows.push("", "Section,Category,Cost");
    const costMap = /* @__PURE__ */ new Map();
    items.forEach((item) => {
      const catName = categories.find((c) => c.id === item.categoryId)?.name || "Uncategorized";
      costMap.set(catName, (costMap.get(catName) || 0) + item.currentStock * item.costPrice);
    });
    [...costMap.entries()].sort((a, b) => b[1] - a[1]).forEach(([name, cost]) => rows.push(`Category Cost,${name},${cost.toFixed(2)}`));
    downloadCsv(rows.join("\n"), "stackwise-supplier-report");
  };
  if (!can("view_analytics")) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Analytics" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Stock, movement & supplier reports" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: tab === "suppliers" ? handleExportSupplier : handleExportStock, children: [
        /* @__PURE__ */ jsx(Download, { className: "mr-1.5 h-4 w-4" }),
        " Export CSV"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "w-full justify-start overflow-x-auto", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "stock", children: "Stock Overview" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "suppliers", children: "Suppliers" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(AnalyticsFilters, { filters, onChange: setFilters, categories, suppliers, locations }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "stock", className: "space-y-6 mt-4", children: [
        /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(StockSummaryCards, { items }) }),
        /* @__PURE__ */ jsx(Collapsible, { open: stockOpen, onOpenChange: setStockOpen, children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(CardHeader, { className: "cursor-pointer hover:bg-muted/30 transition-colors", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Stock Overview" }) }) }),
          /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "mb-3 text-sm font-medium text-muted-foreground", children: "Items by Category" }),
              /* @__PURE__ */ jsx(StockByCategoryChart, { items, categories })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "mb-3 text-sm font-medium text-muted-foreground", children: "Stock Status Distribution" }),
              /* @__PURE__ */ jsx(StockStatusChart, { items })
            ] })
          ] }) }) }) })
        ] }) }),
        /* @__PURE__ */ jsx(Collapsible, { open: movementOpen, onOpenChange: setMovementOpen, children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(CardHeader, { className: "cursor-pointer hover:bg-muted/30 transition-colors", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Movement Trends" }) }) }),
          /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(MovementTrendsChart, { movements, days: filters.days }) }) }) })
        ] }) }),
        /* @__PURE__ */ jsx(Collapsible, { open: turnoverOpen, onOpenChange: setTurnoverOpen, children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(CardHeader, { className: "cursor-pointer hover:bg-muted/30 transition-colors", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Turnover & Reorder Analysis" }) }) }),
          /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(TurnoverAnalysis, { items, movements }) }) }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "suppliers", className: "space-y-6 mt-4", children: [
        /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Supplier Performance" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(SupplierScoreCards, { suppliers, purchaseOrders }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Spending by Supplier" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(SpendBySupplierChart, { suppliers, purchaseOrders }) })
          ] }) }),
          /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Cost by Category" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CostByCategoryChart, { items, categories }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Cost Trend Over Time" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CostTrendChart, { purchaseOrders }) })
        ] }) })
      ] })
    ] })
  ] });
}
function downloadCsv(content, prefix) {
  const blob = new Blob([content], {
    type: "text/csv"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${prefix}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Report exported");
}
export {
  AnalyticsPage as component
};
