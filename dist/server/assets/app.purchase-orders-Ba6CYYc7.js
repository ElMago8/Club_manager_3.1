import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Filter, X, Plus, Send, Ban, Pencil, Trash2, PackageCheck, Check, Printer, ExternalLink, Clock, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, a as CardContent, O as OrderStatus, t as cn, h as Route, E as ErrorBoundary, M as MovementType } from "./router-Rtc38bRC.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { u as useIsMobile } from "./use-mobile-BsFue-bT.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { S as Sheet, e as SheetTrigger, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { C as Checkbox } from "./checkbox-B23p2a-S.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { F as Form, b as FormField, c as FormItem, d as FormLabel, a as FormControl, e as FormMessage } from "./form-Db0Abg1K.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { S as Separator } from "./separator-DaOJH6Mm.js";
import { b as useCreatePurchaseOrder, j as useUpdatePurchaseOrder, f as useDeletePurchaseOrder, a as useCreateMovement, h as useUpdateItem } from "./useInventoryMutations-yEtOdo22.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { Link } from "@tanstack/react-router";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction, h as AlertDialogTrigger } from "./alert-dialog-CV3L0vss.js";
import { u as usePermissions, a as useRole } from "./usePermissions-DbMx0bgh.js";
import { d as usePurchaseOrders, f as useSuppliers, a as useItems, c as useMovements } from "./useInventoryData-B4MqeUD9.js";
import { E as EmptyState } from "./EmptyState-Dkmucllf.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
import "@radix-ui/react-separator";
import "@radix-ui/react-alert-dialog";
const STATUS_STYLE = {
  [OrderStatus.Draft]: { label: "Draft", variant: "secondary" },
  [OrderStatus.Submitted]: { label: "Submitted", variant: "default" },
  [OrderStatus.Partial]: { label: "Partially Received", variant: "outline" },
  [OrderStatus.Received]: { label: "Fully Received", variant: "default" },
  [OrderStatus.Cancelled]: { label: "Cancelled", variant: "destructive" }
};
const STATUS_CLASS$1 = {
  [OrderStatus.Draft]: "bg-muted text-muted-foreground",
  [OrderStatus.Submitted]: "bg-primary/15 text-primary border-primary/20",
  [OrderStatus.Partial]: "bg-amber-accent/15 text-amber-accent border-amber-accent/20",
  [OrderStatus.Received]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [OrderStatus.Cancelled]: "bg-destructive/15 text-destructive border-destructive/20"
};
const PER_PAGE = 20;
function PurchaseOrdersTable({ purchaseOrders, suppliers, onRowClick }) {
  const [page, setPage] = useState(0);
  const isMobile = useIsMobile();
  const supplierMap = useMemo(() => new Map(suppliers.map((s) => [s.id, s.name])), [suppliers]);
  const sorted = useMemo(() => [...purchaseOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [purchaseOrders]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);
  const start = safePage * PER_PAGE + 1;
  const end = Math.min((safePage + 1) * PER_PAGE, sorted.length);
  if (sorted.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: "No purchase orders yet" });
  }
  const pagination = sorted.length > PER_PAGE && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxs("span", { children: [
      "Showing ",
      start,
      "–",
      end,
      " of ",
      sorted.length,
      " orders"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: safePage === 0, onClick: () => setPage(safePage - 1), children: "Previous" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: safePage >= totalPages - 1, onClick: () => setPage(safePage + 1), children: "Next" })
    ] })
  ] });
  if (isMobile) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: paged.map((po) => {
        const statusMeta = STATUS_STYLE[po.status];
        return /* @__PURE__ */ jsxs(Card, { className: "cursor-pointer hover:bg-muted/50 transition-colors", onClick: () => onRowClick(po), children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-mono font-medium", children: po.orderNumber }),
            /* @__PURE__ */ jsx(Badge, { variant: statusMeta.variant, className: STATUS_CLASS$1[po.status], children: statusMeta.label })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "px-4 pb-3 space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Supplier" }),
              /* @__PURE__ */ jsx("span", { className: "truncate ml-2", children: supplierMap.get(po.supplierId) ?? "Unknown" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Items" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono", children: po.items.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono font-medium", children: [
                "$",
                po.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Created" }),
              /* @__PURE__ */ jsx("span", { children: format(new Date(po.createdAt), "MMM d, yyyy") })
            ] })
          ] })
        ] }, po.id);
      }) }),
      pagination
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 bg-card", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[130px]", children: "PO Number" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Supplier" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[160px]", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[80px] text-center", children: "Items" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[120px] text-right", children: "Total Cost" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[130px]", children: "Expected" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[130px]", children: "Created" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: paged.map((po) => {
        const statusMeta = STATUS_STYLE[po.status];
        return /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer hover:bg-muted/50", onClick: () => onRowClick(po), children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm font-medium", children: po.orderNumber }),
          /* @__PURE__ */ jsx(TableCell, { children: supplierMap.get(po.supplierId) ?? "Unknown" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: statusMeta.variant, className: STATUS_CLASS$1[po.status], children: statusMeta.label }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center font-mono text-sm", children: po.items.length }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono text-sm font-medium", children: [
            "$",
            po.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: po.expectedDelivery ? format(new Date(po.expectedDelivery), "MMM d, yyyy") : "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: format(new Date(po.createdAt), "MMM d, yyyy") })
        ] }, po.id);
      }) })
    ] }) }),
    pagination
  ] });
}
function POSummaryStats({ purchaseOrders }) {
  const stats = useMemo(() => {
    let draft = 0;
    let awaiting = 0;
    let completed = 0;
    for (const po of purchaseOrders) {
      if (po.status === OrderStatus.Draft) draft++;
      else if (po.status === OrderStatus.Submitted) awaiting++;
      else if (po.status === OrderStatus.Received) completed++;
    }
    return { total: purchaseOrders.length, draft, awaiting, completed };
  }, [purchaseOrders]);
  const pills = [
    { label: "Total", value: stats.total },
    { label: "Draft", value: stats.draft },
    { label: "Awaiting Delivery", value: stats.awaiting },
    { label: "Completed", value: stats.completed }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 lg:grid-cols-4", children: pills.map((p) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "rounded-xl border border-border/50 bg-muted/50 px-3 py-2 text-center",
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: p.label }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-lg font-semibold text-foreground", children: p.value })
      ]
    },
    p.label
  )) });
}
const EMPTY_PO_FILTERS = {
  statuses: [],
  supplierId: null,
  dateFrom: null,
  dateTo: null
};
function isFiltersActive(f) {
  return f.statuses.length > 0 || f.supplierId !== null || f.dateFrom !== null || f.dateTo !== null;
}
function activeFilterCount(f) {
  let c = 0;
  if (f.statuses.length > 0) c++;
  if (f.supplierId) c++;
  if (f.dateFrom || f.dateTo) c++;
  return c;
}
const STATUS_OPTIONS = [
  { value: OrderStatus.Draft, label: "Draft" },
  { value: OrderStatus.Submitted, label: "Submitted" },
  { value: OrderStatus.Partial, label: "Partially Received" },
  { value: OrderStatus.Received, label: "Fully Received" },
  { value: OrderStatus.Cancelled, label: "Cancelled" }
];
function FilterControls({ filters, onChange, suppliers }) {
  const toggleStatus = (s) => {
    const next = filters.statuses.includes(s) ? filters.statuses.filter((v) => v !== s) : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Status" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: filters.statuses.includes(o.value),
            onCheckedChange: () => toggleStatus(o.value)
          }
        ),
        o.label
      ] }, o.value)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Supplier" }),
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: filters.supplierId ?? "__all__",
          onValueChange: (v) => onChange({ ...filters, supplierId: v === "__all__" ? null : v }),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All suppliers" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "All suppliers" }),
              suppliers.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s.id, children: s.name }, s.id))
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "From" }),
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: filters.dateFrom ?? "",
            onChange: (v) => onChange({ ...filters, dateFrom: v || null })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "To" }),
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: filters.dateTo ?? "",
            onChange: (v) => onChange({ ...filters, dateTo: v || null })
          }
        )
      ] })
    ] }),
    isFiltersActive(filters) && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "w-fit gap-1 text-xs", onClick: () => onChange(EMPTY_PO_FILTERS), children: [
      /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }),
      "Clear Filters"
    ] })
  ] });
}
function PurchaseOrdersFilters(props) {
  const isMobile = useIsMobile();
  const count = activeFilterCount(props.filters);
  if (isMobile) {
    return /* @__PURE__ */ jsxs(Sheet, { children: [
      /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
        "Filters",
        count > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1 h-5 px-1.5 text-xs", children: count })
      ] }) }),
      /* @__PURE__ */ jsxs(SheetContent, { side: "left", className: "w-[300px]", children: [
        /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { children: "Filters" }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(FilterControls, { ...props }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Status" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: props.filters.statuses.includes(o.value),
            onCheckedChange: () => {
              const next = props.filters.statuses.includes(o.value) ? props.filters.statuses.filter((v) => v !== o.value) : [...props.filters.statuses, o.value];
              props.onChange({ ...props.filters, statuses: next });
            }
          }
        ),
        o.label
      ] }, o.value)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Supplier" }),
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: props.filters.supplierId ?? "__all__",
          onValueChange: (v) => props.onChange({ ...props.filters, supplierId: v === "__all__" ? null : v }),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All suppliers" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "__all__", children: "All suppliers" }),
              props.suppliers.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s.id, children: s.name }, s.id))
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "mb-1.5 block text-xs text-muted-foreground", children: "Date Range" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: props.filters.dateFrom ?? "",
            onChange: (v) => props.onChange({ ...props.filters, dateFrom: v || null })
          }
        ),
        /* @__PURE__ */ jsx(
          DateInput,
          {
            className: "h-8 text-xs",
            value: props.filters.dateTo ?? "",
            onChange: (v) => props.onChange({ ...props.filters, dateTo: v || null })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-end", children: isFiltersActive(props.filters) && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "h-8 gap-1 text-xs", onClick: () => props.onChange(EMPTY_PO_FILTERS), children: [
      /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }),
      "Clear Filters"
    ] }) })
  ] }) });
}
function LineItemsEditor({ items, lineItems, onChange, error }) {
  function addRow() {
    onChange([
      ...lineItems,
      { id: crypto.randomUUID(), itemId: "", quantity: 1, unitCost: 0 }
    ]);
  }
  function removeRow(id) {
    onChange(lineItems.filter((r) => r.id !== id));
  }
  function updateRow(id, field, value) {
    onChange(
      lineItems.map(
        (r) => r.id === id ? { ...r, [field]: value } : r
      )
    );
  }
  function handleItemSelect(rowId, itemId) {
    const item = items.find((i) => i.id === itemId);
    onChange(
      lineItems.map(
        (r) => r.id === rowId ? { ...r, itemId, unitCost: item?.costPrice ?? r.unitCost } : r
      )
    );
  }
  const runningTotal = lineItems.reduce(
    (sum, r) => sum + r.quantity * r.unitCost,
    0
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "Line Items" }),
      /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: addRow, className: "gap-1", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
        "Add Item"
      ] })
    ] }),
    lineItems.length === 0 && /* @__PURE__ */ jsx("p", { className: "py-4 text-center text-sm text-muted-foreground", children: 'No line items. Click "Add Item" to start.' }),
    lineItems.map((row, idx) => {
      const lineTotal = row.quantity * row.unitCost;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "grid grid-cols-[1fr_80px_100px_90px_32px] items-end gap-2 rounded-md border border-border bg-muted/30 p-3",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              idx === 0 && /* @__PURE__ */ jsx(Label, { className: "mb-1 block text-xs text-muted-foreground", children: "Item" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: row.itemId || "__none__",
                  onValueChange: (v) => handleItemSelect(row.id, v === "__none__" ? "" : v),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select item" }) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "__none__", disabled: true, children: "Select item" }),
                      items.map((item) => /* @__PURE__ */ jsxs(SelectItem, { value: item.id, children: [
                        item.name,
                        " (",
                        item.sku,
                        ")"
                      ] }, item.id))
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              idx === 0 && /* @__PURE__ */ jsx(Label, { className: "mb-1 block text-xs text-muted-foreground", children: "Qty" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  className: "h-8 text-xs",
                  value: row.quantity,
                  onChange: (e) => updateRow(row.id, "quantity", Math.max(1, Number(e.target.value) || 1))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              idx === 0 && /* @__PURE__ */ jsx(Label, { className: "mb-1 block text-xs text-muted-foreground", children: "Unit Cost" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  step: "0.01",
                  className: "h-8 text-xs",
                  value: row.unitCost,
                  onChange: (e) => updateRow(row.id, "unitCost", Math.max(0, Number(e.target.value) || 0))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              idx === 0 && /* @__PURE__ */ jsx(Label, { className: "mb-1 block text-xs text-muted-foreground", children: "Total" }),
              /* @__PURE__ */ jsxs("span", { className: "flex h-8 items-center text-xs font-mono font-medium text-foreground", children: [
                "$",
                lineTotal.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              idx === 0 && /* @__PURE__ */ jsx("div", { className: "mb-1 h-4" }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive",
                  onClick: () => removeRow(row.id),
                  "aria-label": "Remove line item",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ] })
          ]
        },
        row.id
      );
    }),
    error && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: error }),
    lineItems.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex justify-end border-t border-border pt-3", children: /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-foreground", children: [
      "Total:",
      " ",
      /* @__PURE__ */ jsxs("span", { className: "font-mono text-base", children: [
        "$",
        runningTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      ] })
    ] }) })
  ] });
}
function LowStockSuggestions({ items, supplierId, lineItems, onAdd }) {
  const suggestions = useMemo(() => {
    if (!supplierId) return [];
    const alreadyAdded = new Set(lineItems.map((r) => r.itemId));
    return items.filter(
      (i) => i.supplierId === supplierId && i.currentStock <= i.reorderPoint && !alreadyAdded.has(i.id)
    );
  }, [items, supplierId, lineItems]);
  if (suggestions.length === 0) return null;
  function handleAdd(item) {
    const deficit = item.reorderPoint - item.currentStock;
    const suggestedQty = Math.ceil(deficit * 1.2);
    onAdd({
      id: crypto.randomUUID(),
      itemId: item.id,
      quantity: Math.max(1, suggestedQty),
      unitCost: item.costPrice
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-amber-accent/30 bg-amber-accent/5 p-3", children: [
    /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-medium text-amber-accent", children: "Low-stock items from this supplier" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: suggestions.map((item) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-between gap-2 text-sm",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: item.name }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 font-mono text-xs text-muted-foreground", children: item.sku }),
            /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-muted-foreground", children: [
              "Stock: ",
              item.currentStock,
              " / Reorder: ",
              item.reorderPoint
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "h-7 gap-1 text-xs",
              onClick: () => handleAdd(item),
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }),
                "Add"
              ]
            }
          )
        ]
      },
      item.id
    )) })
  ] });
}
const STATUS_LABEL$2 = {
  [OrderStatus.Draft]: "Draft",
  [OrderStatus.Submitted]: "Submitted",
  [OrderStatus.Partial]: "Partially Received",
  [OrderStatus.Received]: "Fully Received",
  [OrderStatus.Cancelled]: "Cancelled"
};
const schema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  expectedDelivery: z.string().min(1, "Expected delivery date is required"),
  notes: z.string()
});
function generatePONumber() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const seq = String(Math.floor(Math.random() * 9e3) + 1e3);
  return `PO-${year}-${seq}`;
}
function PurchaseOrderFormSheet({
  open,
  onOpenChange,
  purchaseOrder,
  suppliers,
  items
}) {
  const isEdit = !!purchaseOrder;
  const createPO = useCreatePurchaseOrder();
  const updatePO = useUpdatePurchaseOrder();
  const [lineItems, setLineItems] = useState([]);
  const [lineError, setLineError] = useState("");
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { supplierId: "", expectedDelivery: "", notes: "" }
  });
  useEffect(() => {
    if (open) {
      if (purchaseOrder) {
        form.reset({
          supplierId: purchaseOrder.supplierId,
          expectedDelivery: purchaseOrder.expectedDelivery?.slice(0, 10) ?? "",
          notes: purchaseOrder.notes ?? ""
        });
        setLineItems(
          purchaseOrder.items.map((li) => ({
            id: li.id,
            itemId: li.itemId,
            quantity: li.quantityOrdered,
            unitCost: li.unitCost
          }))
        );
      } else {
        form.reset({ supplierId: "", expectedDelivery: "", notes: "" });
        setLineItems([]);
      }
      setLineError("");
    }
  }, [open, purchaseOrder, form]);
  function onSubmit(values) {
    if (lineItems.length === 0) {
      setLineError("At least one line item is required");
      return;
    }
    if (lineItems.some((r) => !r.itemId)) {
      setLineError("All line items must have an item selected");
      return;
    }
    setLineError("");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const poItems = lineItems.map((r) => ({
      id: r.id,
      purchaseOrderId: "",
      itemId: r.itemId,
      quantityOrdered: r.quantity,
      quantityReceived: 0,
      unitCost: r.unitCost
    }));
    const totalCost = poItems.reduce((s, i) => s + i.quantityOrdered * i.unitCost, 0);
    if (isEdit && purchaseOrder) {
      poItems.forEach((p) => p.purchaseOrderId = purchaseOrder.id);
      updatePO.mutate(
        {
          id: purchaseOrder.id,
          updates: {
            supplierId: values.supplierId,
            expectedDelivery: new Date(values.expectedDelivery).toISOString(),
            notes: values.notes,
            items: poItems,
            totalCost,
            updatedAt: now
          }
        },
        {
          onSuccess: () => {
            toast.success(`${purchaseOrder.orderNumber} updated`);
            onOpenChange(false);
          },
          onError: (e) => toast.error(e.message || "Failed to update purchase order.")
        }
      );
    } else {
      const orderNumber = generatePONumber();
      const id = crypto.randomUUID();
      poItems.forEach((p) => p.purchaseOrderId = id);
      const newPO = {
        id,
        orderNumber,
        supplierId: values.supplierId,
        status: OrderStatus.Draft,
        items: poItems,
        totalCost,
        expectedDelivery: new Date(values.expectedDelivery).toISOString(),
        notes: values.notes,
        createdBy: "demo-user",
        createdAt: now,
        updatedAt: now
      };
      createPO.mutate(newPO, {
        onSuccess: () => {
          toast.success(`${orderNumber} created`);
          onOpenChange(false);
        },
        onError: (e) => toast.error(e.message || "Failed to create purchase order.")
      });
    }
  }
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full overflow-y-auto sm:max-w-[600px]", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: isEdit ? `Edit ${purchaseOrder?.orderNumber}` : "New Purchase Order" }),
      /* @__PURE__ */ jsx(SheetDescription, { children: isEdit ? "Update purchase order details." : "Create a new purchase order for a supplier." })
    ] }),
    isEdit && purchaseOrder && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Status" }),
      /* @__PURE__ */ jsx(Badge, { variant: "outline", children: STATUS_LABEL$2[purchaseOrder.status] })
    ] }),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "supplierId",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Supplier *" }),
            /* @__PURE__ */ jsxs(Select, { value: field.value, onValueChange: field.onChange, children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a supplier" }) }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: suppliers.filter((s) => s.isActive).map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s.id, children: s.name }, s.id)) })
            ] }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "expectedDelivery",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Expected Delivery *" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(DateInput, { value: field.value ?? "", onChange: field.onChange }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "notes",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Notes" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Textarea, { ...field, rows: 2, placeholder: "Additional notes…" }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(Separator, {}),
      !isEdit && /* @__PURE__ */ jsx(
        LowStockSuggestions,
        {
          items,
          supplierId: form.watch("supplierId"),
          lineItems,
          onAdd: (row) => setLineItems((prev) => [...prev, row])
        }
      ),
      /* @__PURE__ */ jsx(
        LineItemsEditor,
        {
          items,
          lineItems,
          onChange: setLineItems,
          error: lineError
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", children: isEdit ? "Save Changes" : "Create PO" })
      ] })
    ] }) })
  ] }) });
}
function POStatusActions({ purchaseOrder }) {
  const { can } = usePermissions();
  const canManage = can("create_po");
  const updatePO = useUpdatePurchaseOrder();
  const [cancelOpen, setCancelOpen] = useState(false);
  if (!canManage) return null;
  const { status } = purchaseOrder;
  const isTerminal = status === OrderStatus.Received || status === OrderStatus.Cancelled;
  if (isTerminal) return null;
  function handleSubmit() {
    updatePO.mutate(
      {
        id: purchaseOrder.id,
        updates: { status: OrderStatus.Submitted, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
      },
      {
        onSuccess: () => toast.success(`${purchaseOrder.orderNumber} submitted`)
      }
    );
  }
  function handleCancel() {
    updatePO.mutate(
      {
        id: purchaseOrder.id,
        updates: { status: OrderStatus.Cancelled, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
      },
      {
        onSuccess: () => {
          toast.success(`${purchaseOrder.orderNumber} cancelled`);
          setCancelOpen(false);
        }
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      status === OrderStatus.Draft && /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleSubmit, className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5" }),
        "Submit"
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "gap-1.5 text-destructive hover:bg-destructive/10",
          onClick: () => setCancelOpen(true),
          children: [
            /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" }),
            "Cancel PO"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: cancelOpen, onOpenChange: setCancelOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
          "Cancel ",
          purchaseOrder.orderNumber,
          "?"
        ] }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This will mark the purchase order as cancelled. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Keep Order" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleCancel,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Confirm Cancel"
          }
        )
      ] })
    ] }) })
  ] });
}
const STATUS_LABEL$1 = {
  [OrderStatus.Draft]: "Draft",
  [OrderStatus.Submitted]: "Submitted",
  [OrderStatus.Partial]: "Partially Received",
  [OrderStatus.Received]: "Fully Received",
  [OrderStatus.Cancelled]: "Cancelled"
};
function POPrintView({ purchaseOrder, supplier, items }) {
  return /* @__PURE__ */ jsxs("div", { className: "po-print-view hidden print:block print:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start justify-between border-b border-black pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Cannabis Club Manager" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Purchase Order" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xl font-bold", children: purchaseOrder.orderNumber }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          "Status: ",
          STATUS_LABEL$1[purchaseOrder.status]
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase text-gray-500", children: "Supplier" }),
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: supplier?.name ?? "Unknown" }),
        supplier?.contactName && /* @__PURE__ */ jsx("p", { className: "text-sm", children: supplier.contactName }),
        supplier?.email && /* @__PURE__ */ jsx("p", { className: "text-sm", children: supplier.email }),
        supplier?.phone && /* @__PURE__ */ jsx("p", { className: "text-sm", children: supplier.phone }),
        supplier?.address && /* @__PURE__ */ jsx("p", { className: "text-sm", children: supplier.address })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase text-gray-500", children: "Dates" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          "Created: ",
          format(new Date(purchaseOrder.createdAt), "MMM d, yyyy")
        ] }),
        purchaseOrder.expectedDelivery && /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          "Expected: ",
          format(new Date(purchaseOrder.expectedDelivery), "MMM d, yyyy")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("table", { className: "mb-4 w-full border-collapse text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b-2 border-black", children: [
        /* @__PURE__ */ jsx("th", { className: "py-2 text-left", children: "Item" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 text-left", children: "SKU" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 text-right", children: "Qty Ordered" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 text-right", children: "Received" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 text-right", children: "Unit Cost" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 text-right", children: "Line Total" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: purchaseOrder.items.map((li) => {
        const item = items.get(li.itemId);
        return /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-300", children: [
          /* @__PURE__ */ jsx("td", { className: "py-1.5", children: item?.name ?? li.itemId }),
          /* @__PURE__ */ jsx("td", { className: "py-1.5 font-mono text-xs", children: item?.sku ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "py-1.5 text-right font-mono", children: li.quantityOrdered }),
          /* @__PURE__ */ jsx("td", { className: "py-1.5 text-right font-mono", children: li.quantityReceived }),
          /* @__PURE__ */ jsxs("td", { className: "py-1.5 text-right font-mono", children: [
            "$",
            li.unitCost.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "py-1.5 text-right font-mono font-medium", children: [
            "$",
            (li.quantityOrdered * li.unitCost).toFixed(2)
          ] })
        ] }, li.id);
      }) }),
      /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: "border-t-2 border-black", children: [
        /* @__PURE__ */ jsx("td", { colSpan: 5, className: "py-2 text-right font-semibold", children: "Total" }),
        /* @__PURE__ */ jsxs("td", { className: "py-2 text-right font-mono font-bold", children: [
          "$",
          purchaseOrder.totalCost.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ] })
      ] }) })
    ] }),
    purchaseOrder.notes && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase text-gray-500", children: "Notes" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: purchaseOrder.notes })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-300 pt-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase text-gray-500", children: "Receiving Summary" }),
      purchaseOrder.items.map((li) => {
        const item = items.get(li.itemId);
        const pct = li.quantityOrdered > 0 ? Math.round(li.quantityReceived / li.quantityOrdered * 100) : 0;
        return /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          item?.name ?? li.itemId,
          ": ",
          li.quantityReceived,
          "/",
          li.quantityOrdered,
          " (",
          pct,
          "%)"
        ] }, li.id);
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 border-t border-black pt-2 text-center text-xs text-gray-500", children: [
      "Printed from Cannabis Club Manager · ",
      format(/* @__PURE__ */ new Date(), "MMM d, yyyy h:mm a")
    ] })
  ] });
}
const STATUS_LABEL = {
  [OrderStatus.Draft]: "Draft",
  [OrderStatus.Submitted]: "Submitted",
  [OrderStatus.Partial]: "Partially Received",
  [OrderStatus.Received]: "Fully Received",
  [OrderStatus.Cancelled]: "Cancelled"
};
const STATUS_CLASS = {
  [OrderStatus.Draft]: "bg-muted text-muted-foreground",
  [OrderStatus.Submitted]: "bg-primary/15 text-primary border-primary/20",
  [OrderStatus.Partial]: "bg-amber-accent/15 text-amber-accent border-amber-accent/20",
  [OrderStatus.Received]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [OrderStatus.Cancelled]: "bg-destructive/15 text-destructive border-destructive/20"
};
function PurchaseOrderDetailSheet({
  open,
  onOpenChange,
  purchaseOrder,
  suppliers,
  items,
  canEdit,
  isAdmin,
  onEdit,
  onDelete,
  onReceive,
  movements = []
}) {
  const supplierMap = useMemo(
    () => new Map(suppliers.map((s) => [s.id, s])),
    [suppliers]
  );
  const itemMap = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items]
  );
  const poMovements = useMemo(
    () => purchaseOrder ? movements.filter((m) => m.reference === purchaseOrder.orderNumber).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [],
    [movements, purchaseOrder]
  );
  if (!purchaseOrder) return null;
  const supplier = supplierMap.get(purchaseOrder.supplierId);
  const isDraft = purchaseOrder.status === OrderStatus.Draft;
  const canReceive = purchaseOrder.status === OrderStatus.Submitted || purchaseOrder.status === OrderStatus.Partial;
  const showHistory = purchaseOrder.status === OrderStatus.Submitted || purchaseOrder.status === OrderStatus.Partial || purchaseOrder.status === OrderStatus.Received;
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full overflow-y-auto sm:max-w-[600px]", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: purchaseOrder.orderNumber }),
      /* @__PURE__ */ jsx(SheetDescription, { children: "Purchase order details" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[purchaseOrder.status], children: STATUS_LABEL[purchaseOrder.status] }),
        isDraft && canEdit && /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            onClick: () => onEdit(purchaseOrder),
            children: [
              /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }),
              "Edit"
            ]
          }
        ),
        isDraft && isAdmin && /* @__PURE__ */ jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "gap-1.5 text-destructive hover:text-destructive", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
            "Delete"
          ] }) }),
          /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
                "Delete ",
                purchaseOrder.orderNumber,
                "?"
              ] }),
              /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Delete this draft purchase order? This cannot be undone." })
            ] }),
            /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
              /* @__PURE__ */ jsx(
                AlertDialogAction,
                {
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  onClick: () => onDelete(purchaseOrder.id),
                  children: "Confirm Delete"
                }
              )
            ] })
          ] })
        ] }),
        canReceive && canEdit && onReceive && /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            onClick: () => onReceive(purchaseOrder),
            children: [
              /* @__PURE__ */ jsx(PackageCheck, { className: "h-3.5 w-3.5" }),
              "Receive Shipment"
            ]
          }
        ),
        purchaseOrder.status === OrderStatus.Received && /* @__PURE__ */ jsxs(Badge, { className: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20 gap-1", children: [
          /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }),
          "Fully Received"
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            onClick: () => window.print(),
            children: [
              /* @__PURE__ */ jsx(Printer, { className: "h-3.5 w-3.5" }),
              "Print"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Supplier" }),
        supplier ? /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/app/suppliers",
            search: { supplier: supplier.id },
            className: "inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline",
            children: [
              supplier.name,
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            ]
          }
        ) : /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: "Unknown" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Created" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: format(new Date(purchaseOrder.createdAt), "MMM d, yyyy") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Expected Delivery" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: purchaseOrder.expectedDelivery ? format(new Date(purchaseOrder.expectedDelivery), "MMM d, yyyy") : "—" })
        ] })
      ] }),
      purchaseOrder.notes && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Notes" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: purchaseOrder.notes })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "mb-2 text-sm font-medium text-foreground", children: [
          "Line Items (",
          purchaseOrder.items.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Item" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[60px] text-right", children: "Ordered" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[70px] text-right", children: "Received" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[70px] text-right", children: "Remaining" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Progress" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[80px] text-right", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: purchaseOrder.items.map((li) => {
            const item = itemMap.get(li.itemId);
            const pct = li.quantityOrdered > 0 ? Math.round(li.quantityReceived / li.quantityOrdered * 100) : 0;
            const remaining = Math.max(0, li.quantityOrdered - li.quantityReceived);
            const barColor = pct === 0 ? "bg-muted-foreground/30" : pct >= 100 ? "bg-stock-healthy" : "bg-amber-accent";
            return /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxs(TableCell, { children: [
                /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${!item ? "italic text-muted-foreground/60 line-through" : ""}`, children: item?.name ?? "Deleted Item" }),
                /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-muted-foreground", children: item?.sku ?? "—" })
              ] }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: li.quantityOrdered }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: li.quantityReceived }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: remaining }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("div", { className: "h-2 flex-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn("h-full rounded-full transition-all", barColor),
                    style: { width: `${Math.min(100, pct)}%` }
                  }
                ) }),
                pct >= 100 && /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 shrink-0 text-stock-healthy" })
              ] }) }),
              /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono text-sm font-medium", children: [
                "$",
                (li.quantityOrdered * li.unitCost).toFixed(2)
              ] })
            ] }, li.id);
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-foreground", children: [
        "Total:",
        " ",
        /* @__PURE__ */ jsxs("span", { className: "font-mono text-base", children: [
          "$",
          purchaseOrder.totalCost.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Separator, {}),
      showHistory && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm font-medium text-foreground", children: "Receiving History" }),
        poMovements.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No shipments received yet." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: poMovements.map((m) => {
          const item = itemMap.get(m.itemId);
          return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3", children: [
            /* @__PURE__ */ jsx(Clock, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: `font-medium ${!item ? "italic text-muted-foreground/60 line-through" : "text-foreground"}`, children: item?.name ?? "[Item Deleted]" }),
                /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                  "+",
                  m.quantity
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                m.performedBy,
                " · ",
                formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })
              ] }),
              m.notes && /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground italic", children: m.notes })
            ] })
          ] }, m.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(POStatusActions, { purchaseOrder })
    ] }),
    /* @__PURE__ */ jsx(
      POPrintView,
      {
        purchaseOrder,
        supplier,
        items: itemMap
      }
    )
  ] }) });
}
function ReceiveShipmentSheet({
  open,
  onOpenChange,
  purchaseOrder,
  items,
  onConfirm
}) {
  const itemMap = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items]
  );
  const initialQtys = useMemo(
    () => Object.fromEntries(
      purchaseOrder.items.map((li) => [
        li.id,
        Math.max(0, li.quantityOrdered - li.quantityReceived)
      ])
    ),
    [purchaseOrder.items]
  );
  const [qtys, setQtys] = useState(initialQtys);
  const [notes, setNotes] = useState("");
  const [lastPOId, setLastPOId] = useState(purchaseOrder.id);
  if (purchaseOrder.id !== lastPOId) {
    setLastPOId(purchaseOrder.id);
    setQtys(initialQtys);
    setNotes("");
  }
  const hasAnyQty = useMemo(
    () => Object.values(qtys).some((q) => q > 0),
    [qtys]
  );
  function handleQtyChange(lineId, remaining, value) {
    const num = Math.max(0, Math.min(remaining, Math.floor(Number(value) || 0)));
    setQtys((prev) => ({ ...prev, [lineId]: num }));
  }
  function handleConfirm() {
    const lines = purchaseOrder.items.filter((li) => (qtys[li.id] ?? 0) > 0).map((li) => ({ lineItemId: li.id, itemId: li.itemId, qty: qtys[li.id] }));
    onConfirm(lines, notes);
  }
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full overflow-y-auto sm:max-w-[560px]", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxs(SheetTitle, { children: [
        "Receive Shipment — ",
        purchaseOrder.orderNumber
      ] }),
      /* @__PURE__ */ jsx(SheetDescription, { children: "Enter the quantity received for each line item." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-5", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Item" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[60px] text-right", children: "Ordered" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[70px] text-right", children: "Received" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[70px] text-right", children: "Remaining" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[90px] text-right", children: "Receiving" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: purchaseOrder.items.map((li) => {
          const item = itemMap.get(li.itemId);
          const remaining = Math.max(0, li.quantityOrdered - li.quantityReceived);
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: item?.name ?? li.itemId }),
              /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-muted-foreground", children: item?.sku ?? "—" })
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: li.quantityOrdered }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: li.quantityReceived }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: remaining }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: 0,
                max: remaining,
                value: qtys[li.id] ?? 0,
                onChange: (e) => handleQtyChange(li.id, remaining, e.target.value),
                className: "h-8 w-[70px] text-right font-mono text-sm ml-auto",
                disabled: remaining === 0
              }
            ) })
          ] }, li.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "receive-notes", children: "Shipment Notes" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "receive-notes",
            placeholder: "Optional notes about this shipment...",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          className: "w-full",
          disabled: !hasAnyQty,
          onClick: handleConfirm,
          children: "Confirm Receipt"
        }
      )
    ] })
  ] }) });
}
function PurchaseOrdersPage() {
  const {
    po: poParam
  } = Route.useSearch();
  const {
    data: purchaseOrders
  } = usePurchaseOrders();
  const {
    data: suppliers
  } = useSuppliers();
  const {
    data: catalogItems
  } = useItems();
  const {
    data: allMovements
  } = useMovements();
  const {
    can
  } = usePermissions();
  const {
    role
  } = useRole();
  const deletePO = useDeletePurchaseOrder();
  const updatePO = useUpdatePurchaseOrder();
  const createMovement = useCreateMovement();
  const updateItem = useUpdateItem();
  const canManagePOs = can("create_po");
  const isAdmin = role === "admin";
  const [filters, setFilters] = useState(EMPTY_PO_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editPO, setEditPO] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPO, setDetailPO] = useState(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [receivePO, setReceivePO] = useState(null);
  useEffect(() => {
    if (poParam && purchaseOrders.length > 0) {
      const match = purchaseOrders.find((p) => p.id === poParam);
      if (match) {
        setDetailPO(match);
        setDetailOpen(true);
      }
    }
  }, [poParam, purchaseOrders]);
  const filtered = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(po.status)) return false;
      if (filters.supplierId && po.supplierId !== filters.supplierId) return false;
      if (filters.dateFrom && po.createdAt < new Date(filters.dateFrom).toISOString()) return false;
      if (filters.dateTo) {
        const toEnd = new Date(filters.dateTo);
        toEnd.setDate(toEnd.getDate() + 1);
        if (po.createdAt >= toEnd.toISOString()) return false;
      }
      return true;
    });
  }, [purchaseOrders, filters]);
  const currentDetailPO = useMemo(() => {
    if (!detailPO) return null;
    return purchaseOrders.find((po) => po.id === detailPO.id) ?? detailPO;
  }, [purchaseOrders, detailPO]);
  function openCreate() {
    setEditPO(null);
    setFormOpen(true);
  }
  function handleRowClick(po) {
    setDetailPO(po);
    setDetailOpen(true);
  }
  function handleEdit(po) {
    setDetailOpen(false);
    setEditPO(po);
    setFormOpen(true);
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Purchase orders" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          filtered.length,
          " orders"
        ] })
      ] }),
      canManagePOs && /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: openCreate, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
        "New PO"
      ] })
    ] }),
    /* @__PURE__ */ jsx(POSummaryStats, { purchaseOrders: filtered }),
    /* @__PURE__ */ jsx(PurchaseOrdersFilters, { filters, onChange: setFilters, suppliers }),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: purchaseOrders.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: ClipboardList, title: "No purchase orders created", description: "Create purchase orders to track inventory procurement from your suppliers.", actionLabel: canManagePOs ? "Create PO" : void 0, onAction: canManagePOs ? openCreate : void 0 }) : /* @__PURE__ */ jsx(PurchaseOrdersTable, { purchaseOrders: filtered, suppliers, onRowClick: handleRowClick }) }),
    /* @__PURE__ */ jsx(PurchaseOrderDetailSheet, { open: detailOpen, onOpenChange: setDetailOpen, purchaseOrder: currentDetailPO, suppliers, items: catalogItems, movements: allMovements, canEdit: canManagePOs, isAdmin, onEdit: handleEdit, onDelete: (id) => {
      deletePO.mutate(id, {
        onSuccess: () => {
          setDetailOpen(false);
          setDetailPO(null);
          toast.success("Purchase order deleted");
        }
      });
    }, onReceive: (po) => {
      setReceivePO(po);
      setReceiveOpen(true);
    } }),
    receivePO && /* @__PURE__ */ jsx(ReceiveShipmentSheet, { open: receiveOpen, onOpenChange: setReceiveOpen, purchaseOrder: receivePO, items: catalogItems, onConfirm: (receivedLines, notes) => {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const po = receivePO;
      for (const line of receivedLines) {
        createMovement.mutate({
          id: crypto.randomUUID(),
          itemId: line.itemId,
          type: MovementType.Received,
          quantity: line.qty,
          fromLocationId: null,
          toLocationId: null,
          reference: po.orderNumber,
          notes: notes || `Received via ${po.orderNumber}`,
          performedBy: "demo-user",
          createdAt: now
        });
        const item = catalogItems.find((i) => i.id === line.itemId);
        if (item) {
          updateItem.mutate({
            id: item.id,
            updates: {
              currentStock: item.currentStock + line.qty,
              updatedAt: now
            }
          });
        }
      }
      const updatedItems = po.items.map((li) => {
        const received = receivedLines.find((r) => r.lineItemId === li.id);
        if (received) {
          return {
            ...li,
            quantityReceived: li.quantityReceived + received.qty
          };
        }
        return li;
      });
      const allFullyReceived = updatedItems.every((li) => li.quantityReceived >= li.quantityOrdered);
      const newStatus = allFullyReceived ? OrderStatus.Received : OrderStatus.Partial;
      updatePO.mutate({
        id: po.id,
        updates: {
          items: updatedItems,
          status: newStatus,
          updatedAt: now
        }
      });
      const totalQty = receivedLines.reduce((sum, l) => sum + l.qty, 0);
      toast.success(`Received ${totalQty} items across ${receivedLines.length} line items`);
      setReceiveOpen(false);
    } }),
    /* @__PURE__ */ jsx(PurchaseOrderFormSheet, { open: formOpen, onOpenChange: setFormOpen, purchaseOrder: editPO, suppliers, items: catalogItems })
  ] });
}
export {
  PurchaseOrdersPage as component
};
