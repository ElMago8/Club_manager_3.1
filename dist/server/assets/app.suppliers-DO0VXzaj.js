import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, FileText, BarChart3, Trash2, Pencil, Mail, Phone, Clock, MapPin, Package, ExternalLink, Plus, Truck } from "lucide-react";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, a as CardContent, O as OrderStatus, f as Route, E as ErrorBoundary } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { u as useIsMobile } from "./use-mobile-BsFue-bT.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { S as Sheet, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { F as Form, b as FormField, c as FormItem, d as FormLabel, a as FormControl, e as FormMessage } from "./form-Db0Abg1K.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { toast } from "sonner";
import { d as useCreateSupplier, k as useUpdateSupplier, g as useDeleteSupplier, h as useUpdateItem } from "./useInventoryMutations-yEtOdo22.js";
import { S as StatusBadge } from "./StatusBadge-BHTeS9Kz.js";
import { format } from "date-fns";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-CV3L0vss.js";
import { C as CSVExportButton } from "./CSVExportButton-iwRbplCM.js";
import { f as useSuppliers, a as useItems, d as usePurchaseOrders } from "./useInventoryData-B4MqeUD9.js";
import { u as usePermissions, a as useRole } from "./usePermissions-DbMx0bgh.js";
import { E as EmptyState } from "./EmptyState-Dkmucllf.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "./label-CoCKMbcU.js";
import "@radix-ui/react-label";
import "@radix-ui/react-alert-dialog";
const PER_PAGE = 20;
function SuppliersTable({ suppliers, items, onRowClick }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const isMobile = useIsMobile();
  const itemCountMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const item of items) {
      if (item.supplierId) map.set(item.supplierId, (map.get(item.supplierId) ?? 0) + 1);
    }
    return map;
  }, [items]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = q ? suppliers.filter((s) => s.name.toLowerCase().includes(q)) : suppliers;
    return [...result].sort((a, b) => a.name.localeCompare(b.name));
  }, [suppliers, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);
  const start = safePage * PER_PAGE + 1;
  const end = Math.min((safePage + 1) * PER_PAGE, filtered.length);
  const pagination = filtered.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxs("span", { children: [
      "Showing ",
      start,
      "–",
      end,
      " of ",
      filtered.length,
      " suppliers"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: safePage === 0, onClick: () => setPage(safePage - 1), children: "Previous" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: safePage >= totalPages - 1, onClick: () => setPage(safePage + 1), children: "Next" })
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-xs", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx(Input, { placeholder: "Search suppliers…", className: "h-9 pl-8 text-sm bg-card", value: search, onChange: (e) => {
        setSearch(e.target.value);
        setPage(0);
      } })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: search ? "No suppliers match your search" : "No suppliers added yet" }) : isMobile ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: paged.map((s) => /* @__PURE__ */ jsxs(Card, { className: "cursor-pointer hover:bg-muted/50 transition-colors", onClick: () => onRowClick?.(s), children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 pt-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: s.name }),
          /* @__PURE__ */ jsx("span", { className: `inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`, children: s.isActive ? "Active" : "Inactive" })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "px-4 pb-3 space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Contact" }),
            /* @__PURE__ */ jsx("span", { children: s.contactName || "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Lead Time" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
              s.leadTimeDays,
              "d"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Items" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: itemCountMap.get(s.id) ?? 0 })
          ] })
        ] })
      ] }, s.id)) }),
      pagination
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 bg-card", children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Contact Person" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Email" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Phone" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Lead Time" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Items" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[90px]", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: paged.map((s) => /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer hover:bg-muted/50", onClick: () => onRowClick?.(s), children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: s.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: s.contactName || "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: s.email || "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: s.phone || "—" }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-sm font-mono", children: [
            s.leadTimeDays,
            "d"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm font-mono", children: itemCountMap.get(s.id) ?? 0 }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: `inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`, children: s.isActive ? "Active" : "Inactive" }) })
        ] }, s.id)) })
      ] }) }),
      pagination
    ] })
  ] });
}
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  contactName: z.string(),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string(),
  address: z.string(),
  notes: z.string(),
  paymentTerms: z.string(),
  leadTimeDays: z.coerce.number().int().min(0, "Must be 0 or more"),
  minOrderQuantity: z.coerce.number().int().min(0, "Must be 0 or more")
});
function SupplierFormSheet({ open, onOpenChange, supplier }) {
  const isEdit = !!supplier;
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      paymentTerms: "",
      leadTimeDays: 0,
      minOrderQuantity: 0
    }
  });
  useEffect(() => {
    if (open) {
      if (supplier) {
        form.reset({
          name: supplier.name,
          contactName: supplier.contactName ?? "",
          email: supplier.email ?? "",
          phone: supplier.phone ?? "",
          address: supplier.address ?? "",
          notes: supplier.notes ?? "",
          paymentTerms: "",
          leadTimeDays: supplier.leadTimeDays ?? 0,
          minOrderQuantity: 0
        });
      } else {
        form.reset();
      }
    }
  }, [open, supplier, form]);
  function onSubmit(values) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (isEdit && supplier) {
      updateSupplier.mutate(
        {
          id: supplier.id,
          updates: {
            name: values.name,
            contactName: values.contactName ?? "",
            email: values.email ?? "",
            phone: values.phone ?? "",
            address: values.address ?? "",
            notes: values.notes ?? "",
            leadTimeDays: values.leadTimeDays ?? 0,
            updatedAt: now
          }
        },
        {
          onSuccess: () => {
            toast.success("Supplier updated");
            onOpenChange(false);
          },
          onError: (e) => toast.error(e.message || "Failed to update supplier.")
        }
      );
    } else {
      const newSupplier = {
        id: crypto.randomUUID(),
        name: values.name,
        contactName: values.contactName ?? "",
        email: values.email ?? "",
        phone: values.phone ?? "",
        address: values.address ?? "",
        notes: values.notes ?? "",
        leadTimeDays: values.leadTimeDays ?? 0,
        rating: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };
      createSupplier.mutate(newSupplier, {
        onSuccess: () => {
          toast.success("Supplier created");
          onOpenChange(false);
        },
        onError: (e) => toast.error(e.message || "Failed to create supplier.")
      });
    }
  }
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-lg overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: isEdit ? "Edit Supplier" : "New Supplier" }),
      /* @__PURE__ */ jsx(SheetDescription, { children: isEdit ? "Update supplier details." : "Add a new supplier to the directory." })
    ] }),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "name",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Name *" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { ...field, placeholder: "Supplier name" }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "contactName",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Contact Person" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { ...field, placeholder: "Contact name" }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Email" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "email", ...field, placeholder: "email@example.com" }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "phone",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Phone" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { ...field, placeholder: "+1 555 000 0000" }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "address",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Address" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Textarea, { ...field, rows: 2, placeholder: "Street, City, State" }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "leadTimeDays",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Lead Time (days)" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 0, ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "minOrderQuantity",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Min Order Qty" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 0, ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "paymentTerms",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Payment Terms" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { ...field, placeholder: "Net 30, COD, etc." }) }),
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
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Textarea, { ...field, rows: 3, placeholder: "Additional notes…" }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", children: isEdit ? "Save Changes" : "Create Supplier" })
      ] })
    ] }) })
  ] }) });
}
const MAX_ORDERS = 10;
const STATUS_COLORS = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-blue-500/10 text-blue-600",
  partial: "bg-amber-500/10 text-amber-600",
  received: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-destructive/10 text-destructive"
};
function SupplierOrderHistory({ purchaseOrders, supplierId }) {
  const filtered = useMemo(() => {
    return purchaseOrders.filter((po) => po.supplierId === supplierId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [purchaseOrders, supplierId]);
  const displayed = filtered.slice(0, MAX_ORDERS);
  return /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
        "Order History (",
        filtered.length,
        ")"
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground py-4", children: "No orders placed with this supplier." }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs", children: "PO #" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs w-[60px]", children: "Items" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs", children: "Total" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs", children: "Expected" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-xs", children: "Created" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: displayed.map((po) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: po.orderNumber }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: `inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[po.status] ?? "bg-muted text-muted-foreground"}`, children: po.status }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: po.items.length }),
          /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs", children: [
            "$",
            po.totalCost.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: po.expectedDelivery ? format(new Date(po.expectedDelivery), "MMM d, yyyy") : "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: format(new Date(po.createdAt), "MMM d, yyyy") })
        ] }, po.id)) })
      ] }) }),
      filtered.length > MAX_ORDERS && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Showing ",
        MAX_ORDERS,
        " of ",
        filtered.length,
        " orders"
      ] })
    ] })
  ] });
}
const MIN_POS = 3;
function computeMetrics(pos) {
  const total = pos.length;
  const received = pos.filter((po) => po.status === OrderStatus.Received);
  if (received.length < MIN_POS) {
    return { avgLeadTime: null, fulfillmentAccuracy: null, totalOrders: total, onTimeRate: null };
  }
  const leadTimes = received.map((po) => {
    const created = new Date(po.createdAt).getTime();
    const updated = new Date(po.updatedAt).getTime();
    return Math.max(1, Math.round((updated - created) / (1e3 * 60 * 60 * 24)));
  });
  const avgLeadTime = leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length;
  let totalLines = 0;
  let fulfilledLines = 0;
  for (const po of received) {
    for (const line of po.items) {
      totalLines++;
      if (line.quantityReceived >= line.quantityOrdered) fulfilledLines++;
    }
  }
  const fulfillmentAccuracy = totalLines > 0 ? fulfilledLines / totalLines * 100 : 100;
  const withExpected = received.filter((po) => po.expectedDelivery);
  let onTime = 0;
  for (const po of withExpected) {
    const expected = new Date(po.expectedDelivery).getTime();
    const actual = new Date(po.updatedAt).getTime();
    if (actual <= expected) onTime++;
  }
  const onTimeRate = withExpected.length > 0 ? onTime / withExpected.length * 100 : null;
  return { avgLeadTime, fulfillmentAccuracy, totalOrders: total, onTimeRate };
}
function SupplierPerformance({ purchaseOrders, supplierId }) {
  const supplierPOs = useMemo(
    () => purchaseOrders.filter((po) => po.supplierId === supplierId),
    [purchaseOrders, supplierId]
  );
  const metrics = useMemo(() => computeMetrics(supplierPOs), [supplierPOs]);
  return /* @__PURE__ */ jsxs("div", { className: "mt-8", "data-testid": "supplier-performance", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Performance" })
    ] }),
    metrics.avgLeadTime === null ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground py-4", children: "Not enough data to calculate performance." }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsx(MetricCard, { label: "Avg Lead Time", value: `${metrics.avgLeadTime.toFixed(0)} days` }),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          label: "Fulfillment Accuracy",
          value: metrics.fulfillmentAccuracy !== null ? `${metrics.fulfillmentAccuracy.toFixed(1)}%` : "—"
        }
      ),
      /* @__PURE__ */ jsx(MetricCard, { label: "Total Orders", value: String(metrics.totalOrders) }),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          label: "On-Time Delivery",
          value: metrics.onTimeRate !== null ? `${metrics.onTimeRate.toFixed(1)}%` : "—"
        }
      )
    ] })
  ] });
}
function MetricCard({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-3", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 text-lg font-semibold font-mono text-foreground", children: value })
  ] });
}
function SupplierDeleteDialog({ supplier, items, purchaseOrders, onDelete }) {
  const [open, setOpen] = useState(false);
  const linkedCount = useMemo(
    () => items.filter((i) => i.supplierId === supplier.id).length,
    [items, supplier.id]
  );
  const openPOs = useMemo(
    () => purchaseOrders.filter(
      (po) => po.supplierId === supplier.id && [OrderStatus.Draft, OrderStatus.Submitted, OrderStatus.Partial].includes(po.status)
    ),
    [purchaseOrders, supplier.id]
  );
  const hasOpenPOs = openPOs.length > 0;
  function handleClick() {
    if (hasOpenPOs) {
      toast.error(`Cannot delete supplier with ${openPOs.length} open purchase order${openPOs.length > 1 ? "s" : ""}.`);
      return;
    }
    setOpen(true);
  }
  function handleConfirm() {
    onDelete(supplier.id);
    setOpen(false);
    toast.success("Supplier deleted");
  }
  return /* @__PURE__ */ jsxs(AlertDialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "destructive", onClick: handleClick, children: [
      /* @__PURE__ */ jsx(Trash2, { className: "mr-1.5 h-3.5 w-3.5" }),
      "Delete"
    ] }),
    /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
          "Delete ",
          supplier.name,
          "?"
        ] }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: linkedCount > 0 ? `This supplier is linked to ${linkedCount} item${linkedCount > 1 ? "s" : ""}. Deleting will remove the supplier reference from those items. Continue?` : "This action cannot be undone. The supplier will be permanently removed." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleConfirm, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] })
  ] });
}
const MAX_LINKED = 10;
function SupplierDetailSheet({
  open,
  onOpenChange,
  supplier,
  items,
  purchaseOrders,
  canEdit,
  canDelete,
  onEdit,
  onDelete
}) {
  const linkedItems = useMemo(() => {
    if (!supplier) return [];
    return items.filter((i) => i.supplierId === supplier.id);
  }, [items, supplier]);
  if (!supplier) return null;
  const displayed = linkedItems.slice(0, MAX_LINKED);
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-[560px] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: supplier.name }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          canDelete && /* @__PURE__ */ jsx(
            SupplierDeleteDialog,
            {
              supplier,
              items,
              purchaseOrders,
              onDelete: (id) => {
                onDelete(id);
                onOpenChange(false);
              }
            }
          ),
          canEdit && /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => {
                onOpenChange(false);
                onEdit(supplier);
              },
              children: [
                /* @__PURE__ */ jsx(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }),
                "Edit"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(SheetDescription, { children: supplier.isActive ? "Active supplier" : "Inactive supplier" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(DetailField, { icon: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), label: "Email", children: supplier.email ? /* @__PURE__ */ jsx("a", { href: `mailto:${supplier.email}`, className: "text-primary hover:underline", children: supplier.email }) : "—" }),
      /* @__PURE__ */ jsx(DetailField, { icon: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), label: "Phone", children: supplier.phone ? /* @__PURE__ */ jsx("a", { href: `tel:${supplier.phone}`, className: "text-primary hover:underline", children: supplier.phone }) : "—" }),
      /* @__PURE__ */ jsx(DetailField, { label: "Contact Person", children: supplier.contactName || "—" }),
      /* @__PURE__ */ jsx(DetailField, { icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }), label: "Lead Time", children: /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
        supplier.leadTimeDays,
        "d"
      ] }) }),
      /* @__PURE__ */ jsx(DetailField, { icon: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }), label: "Address", full: true, children: supplier.address || "—" }),
      supplier.notes && /* @__PURE__ */ jsx(DetailField, { label: "Notes", full: true, children: supplier.notes })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
          "Linked Items (",
          linkedItems.length,
          ")"
        ] })
      ] }),
      linkedItems.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground py-4", children: "No items from this supplier" }) : /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        displayed.map((item) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: item.name }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 font-mono text-xs text-muted-foreground", children: item.sku })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                  item.currentStock,
                  " ",
                  item.unit
                ] }),
                /* @__PURE__ */ jsx(StatusBadge, { status: item.currentStock <= 0 ? "out-of-stock" : item.currentStock <= item.reorderPoint ? "low-stock" : "in-stock" })
              ] })
            ]
          },
          item.id
        )),
        linkedItems.length > MAX_LINKED && /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/app/catalog",
            className: "mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline",
            children: [
              "View all in catalog",
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(SupplierPerformance, { purchaseOrders, supplierId: supplier.id }),
    /* @__PURE__ */ jsx(SupplierOrderHistory, { purchaseOrders, supplierId: supplier.id })
  ] }) });
}
function DetailField({
  icon,
  label,
  children,
  full
}) {
  return /* @__PURE__ */ jsxs("div", { className: full ? "sm:col-span-2" : "", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-0.5", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground", children })
  ] });
}
function SuppliersPage() {
  const {
    supplier: supplierParam
  } = Route.useSearch();
  const navigate = useNavigate();
  const {
    data: suppliers
  } = useSuppliers();
  const {
    data: items
  } = useItems();
  const {
    data: purchaseOrders
  } = usePurchaseOrders();
  const {
    can
  } = usePermissions();
  const {
    role
  } = useRole();
  const canManageSuppliers = can("manage_suppliers");
  const isAdmin = role === "admin";
  const deleteSupplier = useDeleteSupplier();
  const updateItem = useUpdateItem();
  const [formOpen, setFormOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSupplier, setDetailSupplier] = useState(null);
  const supplierCsvColumns = useMemo(() => [{
    header: "Name",
    accessor: (s) => s.name
  }, {
    header: "Contact Person",
    accessor: (s) => s.contactName
  }, {
    header: "Email",
    accessor: (s) => s.email
  }, {
    header: "Phone",
    accessor: (s) => s.phone
  }, {
    header: "Address",
    accessor: (s) => s.address
  }, {
    header: "Lead Time Days",
    accessor: (s) => s.leadTimeDays
  }, {
    header: "Rating",
    accessor: (s) => s.rating
  }, {
    header: "Notes",
    accessor: (s) => s.notes
  }], []);
  useEffect(() => {
    if (supplierParam && suppliers.length > 0) {
      const found = suppliers.find((s) => s.id === supplierParam);
      if (found) {
        setDetailSupplier(found);
        setDetailOpen(true);
      }
    }
  }, [supplierParam, suppliers]);
  function openCreate() {
    setEditSupplier(null);
    setFormOpen(true);
  }
  function openDetail(s) {
    setDetailSupplier(s);
    setDetailOpen(true);
    navigate({
      to: "/app/suppliers",
      search: {
        supplier: s.id
      },
      replace: true
    });
  }
  function handleDetailClose(open) {
    setDetailOpen(open);
    if (!open) {
      navigate({
        to: "/app/suppliers",
        search: {},
        replace: true
      });
    }
  }
  function openEdit(s) {
    setEditSupplier(s);
    setFormOpen(true);
  }
  function handleDelete(id) {
    for (const item of items) {
      if (item.supplierId === id) {
        updateItem.mutate({
          id: item.id,
          updates: {
            supplierId: null
          }
        });
      }
    }
    deleteSupplier.mutate(id);
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Supplier Directory" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          suppliers.length,
          " suppliers"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CSVExportButton, { data: suppliers, columns: supplierCsvColumns, filename: "stackwise-suppliers" }),
        canManageSuppliers && /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: openCreate, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
          "New Supplier"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: suppliers.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Truck, title: "No suppliers added yet", description: "Add your suppliers to track lead times, contact info, and order history.", actionLabel: canManageSuppliers ? "Add Supplier" : void 0, onAction: canManageSuppliers ? openCreate : void 0 }) : /* @__PURE__ */ jsx(SuppliersTable, { suppliers, items, onRowClick: openDetail }) }),
    /* @__PURE__ */ jsx(SupplierDetailSheet, { open: detailOpen, onOpenChange: handleDetailClose, supplier: detailSupplier, items, purchaseOrders, canEdit: canManageSuppliers, canDelete: isAdmin, onEdit: openEdit, onDelete: handleDelete }),
    /* @__PURE__ */ jsx(SupplierFormSheet, { open: formOpen, onOpenChange: setFormOpen, supplier: editSupplier })
  ] });
}
export {
  SuppliersPage as component
};
