import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X, Plus, Check, Circle, FileText } from "lucide-react";
import { toast } from "sonner";
import { B as Button, R as RequestStatus, t as cn, v as useDemo, M as MovementType, g as Route, E as ErrorBoundary } from "./router-Rtc38bRC.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-Dt8gr3JP.js";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-CV3L0vss.js";
import { z } from "zod";
import { S as Sheet, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { c as useCreateRequest } from "./useInventoryMutations-yEtOdo22.js";
import { format } from "date-fns";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import { D as DateInput } from "./date-input--5OGyKIn.js";
import { S as Separator } from "./separator-DaOJH6Mm.js";
import { a as useItems, e as useRequests } from "./useInventoryData-B4MqeUD9.js";
import { a as useRole, u as usePermissions } from "./usePermissions-DbMx0bgh.js";
import { E as EmptyState } from "./EmptyState-Dkmucllf.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-tabs";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-separator";
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  reason: z.string().min(1, "Reason is required"),
  priority: z.enum(["normal", "urgent"]),
  lines: z.array(
    z.object({
      itemId: z.string().min(1, "Select an item"),
      quantity: z.number().min(1, "Qty must be at least 1")
    })
  ).min(1, "Add at least one line item")
});
function RequestFormSheet({ open, onOpenChange, items }) {
  const createRequest = useCreateRequest();
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState("normal");
  const [lines, setLines] = useState([
    { id: crypto.randomUUID(), itemId: "", quantity: 1 }
  ]);
  const [errors, setErrors] = useState({});
  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  function resetForm() {
    setTitle("");
    setReason("");
    setPriority("normal");
    setLines([{ id: crypto.randomUUID(), itemId: "", quantity: 1 }]);
    setErrors({});
  }
  function addLine() {
    setLines((prev) => [...prev, { id: crypto.randomUUID(), itemId: "", quantity: 1 }]);
  }
  function removeLine(id) {
    setLines((prev) => prev.length > 1 ? prev.filter((l) => l.id !== id) : prev);
  }
  function updateLine(id, field, value) {
    setLines(
      (prev) => prev.map((l) => {
        if (l.id !== id) return l;
        if (field === "itemId") return { ...l, itemId: value };
        const item = itemMap.get(l.itemId);
        const max = item ? item.currentStock : 9999;
        const qty = Math.max(1, Math.min(Number(value), max));
        return { ...l, quantity: qty };
      })
    );
  }
  function handleSubmit() {
    const result = schema.safeParse({
      title,
      reason,
      priority,
      lines: lines.map((l) => ({ itemId: l.itemId, quantity: l.quantity }))
    });
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        fieldErrors[key] = issue.message;
      }
      if (result.error.issues.some((i) => i.path[0] === "lines" && i.path.length === 1)) {
        fieldErrors["lines"] = "Add at least one line item";
      }
      setErrors(fieldErrors);
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const reqId = crypto.randomUUID();
    const reqNum = `REQ-${Date.now().toString(36).toUpperCase()}`;
    createRequest.mutate(
      {
        id: reqId,
        requestNumber: reqNum,
        title,
        status: RequestStatus.Pending,
        priority,
        items: lines.map((l, i) => ({
          id: `ri-${reqId}-${i + 1}`,
          requestId: reqId,
          itemId: l.itemId,
          quantity: l.quantity,
          notes: ""
        })),
        requestedBy: "demo-user",
        approvedBy: null,
        reason,
        createdAt: now,
        updatedAt: now
      },
      {
        onSuccess: () => {
          toast.success("Request submitted");
          resetForm();
          onOpenChange(false);
        },
        onError: (e) => toast.error(e.message || "Failed to submit request.")
      }
    );
  }
  return /* @__PURE__ */ jsx(
    Sheet,
    {
      open,
      onOpenChange: (v) => {
        if (!v) resetForm();
        onOpenChange(v);
      },
      children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full overflow-y-auto sm:max-w-[560px]", children: [
        /* @__PURE__ */ jsxs(SheetHeader, { children: [
          /* @__PURE__ */ jsx(SheetTitle, { children: "New Request" }),
          /* @__PURE__ */ jsx(SheetDescription, { children: "Submit an inventory request" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "req-title", children: "Title *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "req-title",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "Short description of what you need"
              }
            ),
            errors["title"] && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors["title"] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "req-reason", children: "Reason / Justification *" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "req-reason",
                value: reason,
                onChange: (e) => setReason(e.target.value),
                placeholder: "Why do you need these items?",
                rows: 3
              }
            ),
            errors["reason"] && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors["reason"] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Priority" }),
            /* @__PURE__ */ jsxs(Select, { value: priority, onValueChange: (v) => setPriority(v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "normal", children: "Normal" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "urgent", children: "Urgent" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Line Items *" }),
            errors["lines"] && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors["lines"] }),
            lines.map((line, idx) => {
              const selectedItem = itemMap.get(line.itemId);
              const maxQty = selectedItem ? selectedItem.currentStock : 9999;
              return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
                  /* @__PURE__ */ jsxs(
                    Select,
                    {
                      value: line.itemId || void 0,
                      onValueChange: (v) => updateLine(line.id, "itemId", v),
                      children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select item" }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: items.filter((i) => i.currentStock > 0).map((i) => /* @__PURE__ */ jsxs(SelectItem, { value: i.id, children: [
                          i.name,
                          " (",
                          i.currentStock,
                          " avail)"
                        ] }, i.id)) })
                      ]
                    }
                  ),
                  errors[`lines.${idx}.itemId`] && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors[`lines.${idx}.itemId`] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-20 space-y-1", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: maxQty,
                    value: line.quantity,
                    onChange: (e) => updateLine(line.id, "quantity", Number(e.target.value)),
                    className: "font-mono"
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "mt-0.5 shrink-0",
                    onClick: () => removeLine(line.id),
                    disabled: lines.length === 1,
                    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }, line.id);
            }),
            /* @__PURE__ */ jsxs(Button, { type: "button", size: "sm", variant: "outline", onClick: addLine, className: "gap-1.5", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Add Item"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, className: "w-full", disabled: createRequest.isLoading, children: "Submit Request" })
        ] })
      ] })
    }
  );
}
const STATUS_LABEL$1 = {
  [RequestStatus.Pending]: "Pending",
  [RequestStatus.Approved]: "Approved",
  [RequestStatus.PartiallyFulfilled]: "Partial",
  [RequestStatus.Fulfilled]: "Fulfilled",
  [RequestStatus.Declined]: "Declined",
  [RequestStatus.Cancelled]: "Cancelled"
};
const STATUS_CLASS$1 = {
  [RequestStatus.Pending]: "bg-primary/15 text-primary border-primary/20",
  [RequestStatus.Approved]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [RequestStatus.PartiallyFulfilled]: "bg-amber-accent/15 text-amber-accent border-amber-accent/20",
  [RequestStatus.Fulfilled]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [RequestStatus.Declined]: "bg-destructive/15 text-destructive border-destructive/20",
  [RequestStatus.Cancelled]: "bg-muted text-muted-foreground"
};
function RequestsTable({ requests, onRowClick, showRequestor = false, preSorted = false }) {
  const sorted = useMemo(
    () => preSorted ? requests : [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [requests, preSorted]
  );
  if (sorted.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No requests submitted yet." }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { children: "Request ID" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Title" }),
      showRequestor && /* @__PURE__ */ jsx(TableHead, { children: "Requestor" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Items" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Priority" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Created" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: sorted.map((req) => /* @__PURE__ */ jsxs(
      TableRow,
      {
        className: "cursor-pointer",
        onClick: () => onRowClick(req),
        children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: req.requestNumber }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: req.title }),
          showRequestor && /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: req.requestedBy }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS$1[req.status], children: STATUS_LABEL$1[req.status] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center font-mono text-sm", children: req.items.length }),
          /* @__PURE__ */ jsx(TableCell, { children: req.priority === "urgent" ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-amber-accent/15 text-amber-accent border-amber-accent/20", children: "Urgent" }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Normal" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: format(new Date(req.createdAt), "MMM d, yyyy") })
        ]
      },
      req.id
    )) })
  ] }) });
}
const EMPTY_REQUEST_FILTERS = {
  statuses: [],
  requestor: "",
  dateFrom: "",
  dateTo: ""
};
const STATUSES = [
  { value: RequestStatus.Pending, label: "Pending" },
  { value: RequestStatus.Approved, label: "Approved" },
  { value: RequestStatus.PartiallyFulfilled, label: "Partial" },
  { value: RequestStatus.Fulfilled, label: "Fulfilled" },
  { value: RequestStatus.Declined, label: "Declined" },
  { value: RequestStatus.Cancelled, label: "Cancelled" }
];
function RequestsFilters({ filters, onChange }) {
  const hasFilters = filters.statuses.length > 0 || filters.requestor || filters.dateFrom || filters.dateTo;
  function toggleStatus(status) {
    const next = filters.statuses.includes(status) ? filters.statuses.filter((s) => s !== status) : [...filters.statuses, status];
    onChange({ ...filters, statuses: next });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    STATUSES.map((s) => /* @__PURE__ */ jsx(
      Badge,
      {
        variant: filters.statuses.includes(s.value) ? "default" : "outline",
        className: "cursor-pointer select-none",
        onClick: () => toggleStatus(s.value),
        children: s.label
      },
      s.value
    )),
    /* @__PURE__ */ jsx(
      Input,
      {
        placeholder: "Requestor...",
        value: filters.requestor,
        onChange: (e) => onChange({ ...filters, requestor: e.target.value }),
        className: "h-8 w-32"
      }
    ),
    /* @__PURE__ */ jsx(
      DateInput,
      {
        value: filters.dateFrom,
        onChange: (v) => onChange({ ...filters, dateFrom: v }),
        className: "h-8 w-36"
      }
    ),
    /* @__PURE__ */ jsx(
      DateInput,
      {
        value: filters.dateTo,
        onChange: (v) => onChange({ ...filters, dateTo: v }),
        className: "h-8 w-36",
        "aria-label": "To date"
      }
    ),
    hasFilters && /* @__PURE__ */ jsxs(
      Button,
      {
        size: "sm",
        variant: "ghost",
        className: "h-8 gap-1 text-xs",
        onClick: () => onChange(EMPTY_REQUEST_FILTERS),
        children: [
          /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }),
          "Clear"
        ]
      }
    )
  ] });
}
const STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "review", label: "Under Review" },
  { key: "decision", label: "Decision" },
  { key: "fulfilled", label: "Fulfilled" }
];
function resolveStep(status) {
  switch (status) {
    case RequestStatus.Pending:
      return { activeIdx: 1, decisionLabel: "Decision", isTerminal: false, isNegative: false };
    case RequestStatus.Approved:
      return { activeIdx: 2, decisionLabel: "Approved", isTerminal: false, isNegative: false };
    case RequestStatus.PartiallyFulfilled:
      return { activeIdx: 2, decisionLabel: "Partial", isTerminal: false, isNegative: false };
    case RequestStatus.Fulfilled:
      return { activeIdx: 3, decisionLabel: "Approved", isTerminal: true, isNegative: false };
    case RequestStatus.Declined:
      return { activeIdx: 2, decisionLabel: "Declined", isTerminal: true, isNegative: true };
    case RequestStatus.Cancelled:
      return { activeIdx: 1, decisionLabel: "Decision", isTerminal: true, isNegative: true };
    default:
      return { activeIdx: 0, decisionLabel: "Decision", isTerminal: false, isNegative: false };
  }
}
function StatusStepper({ status }) {
  const { activeIdx, decisionLabel, isTerminal, isNegative } = resolveStep(status);
  const labels = STEPS.map(
    (s) => s.key === "decision" ? decisionLabel : s.label
  );
  return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0", role: "list", "aria-label": "Request status", children: labels.map((label, idx) => {
    const isCompleted = idx < activeIdx;
    const isActive = idx === activeIdx;
    const isFuture = idx > activeIdx;
    const isLast = idx === labels.length - 1;
    if (isLast && isTerminal && isNegative && idx > activeIdx) return null;
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center", role: "listitem", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
              isCompleted && "border-stock-healthy bg-stock-healthy text-stock-healthy-foreground",
              isActive && !isNegative && "border-primary bg-primary text-primary-foreground",
              isActive && isNegative && "border-destructive bg-destructive text-destructive-foreground",
              isFuture && "border-muted-foreground/30 bg-transparent text-muted-foreground/30"
            ),
            children: isCompleted ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : isActive && isNegative ? /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Circle, { className: "h-3 w-3" })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "text-[10px] font-medium leading-tight",
              isCompleted && "text-stock-healthy",
              isActive && !isNegative && "text-primary",
              isActive && isNegative && "text-destructive",
              isFuture && "text-muted-foreground/50"
            ),
            children: label
          }
        )
      ] }),
      !isLast && !(isLast && isTerminal && isNegative) && /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "mx-1 h-0.5 w-6 sm:w-10",
            idx < activeIdx ? "bg-stock-healthy" : "bg-muted-foreground/20"
          )
        }
      )
    ] }, idx);
  }) });
}
const STATUS_LABEL = {
  [RequestStatus.Pending]: "Pending",
  [RequestStatus.Approved]: "Approved",
  [RequestStatus.PartiallyFulfilled]: "Partial",
  [RequestStatus.Fulfilled]: "Fulfilled",
  [RequestStatus.Declined]: "Declined",
  [RequestStatus.Cancelled]: "Cancelled"
};
const STATUS_CLASS = {
  [RequestStatus.Pending]: "bg-primary/15 text-primary border-primary/20",
  [RequestStatus.Approved]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [RequestStatus.PartiallyFulfilled]: "bg-amber-accent/15 text-amber-accent border-amber-accent/20",
  [RequestStatus.Fulfilled]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [RequestStatus.Declined]: "bg-destructive/15 text-destructive border-destructive/20",
  [RequestStatus.Cancelled]: "bg-muted text-muted-foreground"
};
function RequestDetailSheet({
  open,
  onOpenChange,
  request,
  items,
  canApprove,
  onApprove,
  onDecline,
  onPartial,
  onCancel
}) {
  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  if (!request) return null;
  const isPending = request.status === RequestStatus.Pending;
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full overflow-y-auto sm:max-w-[560px]", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: request.requestNumber }),
      /* @__PURE__ */ jsx(SheetDescription, { children: "Request details" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-5", children: [
      /* @__PURE__ */ jsx(StatusStepper, { status: request.status }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: STATUS_CLASS[request.status], children: STATUS_LABEL[request.status] }),
        request.priority === "urgent" && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-amber-accent/15 text-amber-accent border-amber-accent/20", children: "Urgent" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Submitted by" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: request.requestedBy })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Date" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: format(new Date(request.createdAt), "MMM d, yyyy") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Title" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: request.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Reason / Justification" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: request.reason })
      ] }),
      request.declineReason && /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-destructive/20 bg-destructive/5 p-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-destructive", children: "Decline Reason" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: request.declineReason })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "mb-2 text-sm font-medium text-foreground", children: [
          "Line Items (",
          request.items.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Item" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[60px] text-right", children: "Requested" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: request.items.map((li) => {
            const item = itemMap.get(li.itemId);
            return /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxs(TableCell, { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: item?.name ?? li.itemId }),
                /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-muted-foreground", children: item?.sku ?? "—" })
              ] }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: li.quantity })
            ] }, li.id);
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm font-medium text-foreground", children: "Timeline" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(TimelineEntry, { label: "Submitted", date: request.createdAt, by: request.requestedBy }),
          request.status !== RequestStatus.Pending && request.status !== RequestStatus.Cancelled && /* @__PURE__ */ jsx(
            TimelineEntry,
            {
              label: STATUS_LABEL[request.status],
              date: request.updatedAt,
              by: request.approvedBy ?? void 0
            }
          ),
          request.status === RequestStatus.Cancelled && /* @__PURE__ */ jsx(TimelineEntry, { label: "Cancelled", date: request.updatedAt, by: request.requestedBy })
        ] })
      ] }),
      isPending && canApprove && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          onApprove && /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => onApprove(request), children: "Approve" }),
          onPartial && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => onPartial(request), children: "Partial Fulfill" }),
          onDecline && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "text-destructive hover:text-destructive", onClick: () => onDecline(request), children: "Decline" })
        ] })
      ] }),
      isPending && !canApprove && onCancel && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "text-destructive hover:text-destructive",
            onClick: () => onCancel(request),
            children: "Cancel Request"
          }
        )
      ] })
    ] })
  ] }) });
}
function TimelineEntry({ label, date, by }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "h-2 w-2 shrink-0 rounded-full bg-primary" }),
    /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: format(new Date(date), "MMM d, yyyy") }),
    by && /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
      "by ",
      by
    ] })
  ] });
}
function checkStock(reqItems, itemMap, qtys) {
  for (const li of reqItems) {
    const qty = qtys ? qtys[li.id] ?? 0 : li.quantity;
    if (qty === 0) continue;
    const item = itemMap.get(li.itemId);
    if (!item) continue;
    if (qty > item.currentStock) {
      return `Insufficient stock for ${item.name} (available: ${item.currentStock}, requested: ${qty})`;
    }
  }
  return null;
}
function buildMovements(request, qtys) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return request.items.filter((li) => {
    const q = qtys ? qtys[li.id] ?? 0 : li.quantity;
    return q > 0;
  }).map((li) => ({
    id: crypto.randomUUID(),
    itemId: li.itemId,
    type: MovementType.Shipped,
    quantity: qtys ? qtys[li.id] ?? li.quantity : li.quantity,
    fromLocationId: null,
    toLocationId: null,
    reference: request.requestNumber,
    notes: `Auto-generated from request ${request.requestNumber}`,
    performedBy: "demo-admin",
    createdAt: now
  }));
}
function useApprovalActions({ items }) {
  const { isDemo, demoStore, bumpVersion } = useDemo();
  const [dialog, setDialog] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [partialQtys, setPartialQtys] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  function openApprove(req) {
    setActiveRequest(req);
    setDialog("approve");
  }
  function openDecline(req) {
    setActiveRequest(req);
    setDeclineReason("");
    setDialog("decline");
  }
  function openPartial(req) {
    setActiveRequest(req);
    const initial = {};
    for (const li of req.items) {
      initial[li.id] = li.quantity;
    }
    setPartialQtys(initial);
    setDialog("partial");
  }
  function confirmApprove() {
    if (!activeRequest || !isDemo || !demoStore) return;
    const err = checkStock(activeRequest.items, itemMap);
    if (err) {
      toast.error(err);
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const movements = buildMovements(activeRequest);
    setIsLoading(true);
    try {
      for (const m of movements) demoStore.createMovement(m);
      demoStore.updateRequest(activeRequest.id, {
        status: RequestStatus.Approved,
        approvedBy: "demo-admin",
        updatedAt: now
      });
      bumpVersion();
      toast.success(`${activeRequest.requestNumber} approved`);
      setDialog(null);
      setActiveRequest(null);
    } finally {
      setIsLoading(false);
    }
  }
  function confirmDecline() {
    if (!activeRequest || !declineReason.trim() || !isDemo || !demoStore) return;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    setIsLoading(true);
    try {
      demoStore.updateRequest(activeRequest.id, {
        status: RequestStatus.Declined,
        approvedBy: "demo-admin",
        declineReason: declineReason.trim(),
        updatedAt: now
      });
      bumpVersion();
      toast.success(`${activeRequest.requestNumber} declined`);
      setDialog(null);
      setActiveRequest(null);
    } finally {
      setIsLoading(false);
    }
  }
  function confirmPartial() {
    if (!activeRequest || !isDemo || !demoStore) return;
    const allZero = activeRequest.items.every((li) => (partialQtys[li.id] ?? 0) === 0);
    if (allZero) {
      toast.error("Approve at least one item quantity");
      return;
    }
    const err = checkStock(activeRequest.items, itemMap, partialQtys);
    if (err) {
      toast.error(err);
      return;
    }
    const allFull = activeRequest.items.every((li) => (partialQtys[li.id] ?? 0) >= li.quantity);
    const newStatus = allFull ? RequestStatus.Approved : RequestStatus.PartiallyFulfilled;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const movements = buildMovements(activeRequest, partialQtys);
    setIsLoading(true);
    try {
      for (const m of movements) demoStore.createMovement(m);
      demoStore.updateRequest(activeRequest.id, {
        status: newStatus,
        approvedBy: "demo-admin",
        updatedAt: now
      });
      bumpVersion();
      toast.success(
        `${activeRequest.requestNumber} ${allFull ? "approved" : "partially fulfilled"}`
      );
      setDialog(null);
      setActiveRequest(null);
    } finally {
      setIsLoading(false);
    }
  }
  function renderDialogs() {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(AlertDialog, { open: dialog === "approve", onOpenChange: (o) => !o && setDialog(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
            "Approve ",
            activeRequest?.requestNumber,
            "?"
          ] }),
          /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This will approve all requested quantities and create stock movements." })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
          /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmApprove, children: "Confirm Approve" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(AlertDialog, { open: dialog === "decline", onOpenChange: (o) => !o && setDialog(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
            "Decline ",
            activeRequest?.requestNumber,
            "?"
          ] }),
          /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Please provide a reason for declining this request." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "decline-reason", children: "Reason *" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "decline-reason",
              value: declineReason,
              onChange: (e) => setDeclineReason(e.target.value),
              placeholder: "Why is this request being declined?",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
          /* @__PURE__ */ jsx(
            AlertDialogAction,
            {
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              onClick: confirmDecline,
              disabled: !declineReason.trim(),
              children: "Confirm Decline"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(AlertDialog, { open: dialog === "partial", onOpenChange: (o) => !o && setDialog(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
            "Partial Fulfill ",
            activeRequest?.requestNumber
          ] }),
          /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Enter the approved quantity for each line item." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 py-2", children: activeRequest?.items.map((li) => {
          const item = itemMap.get(li.itemId);
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm font-medium", children: item?.name ?? li.itemId }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "of ",
              li.quantity,
              " (avail: ",
              item?.currentStock ?? 0,
              ")"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: 0,
                max: li.quantity,
                value: partialQtys[li.id] ?? 0,
                onChange: (e) => setPartialQtys((prev) => ({
                  ...prev,
                  [li.id]: Math.max(0, Math.min(li.quantity, Number(e.target.value)))
                })),
                className: "w-20 font-mono"
              }
            )
          ] }, li.id);
        }) }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
          /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmPartial, children: "Confirm" })
        ] })
      ] }) })
    ] });
  }
  return { openApprove, openDecline, openPartial, renderDialogs, isLoading };
}
function applyFilters(requests, filters) {
  return requests.filter((r) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false;
    if (filters.requestor && !r.requestedBy.toLowerCase().includes(filters.requestor.toLowerCase())) return false;
    if (filters.dateFrom && r.createdAt < new Date(filters.dateFrom).toISOString()) return false;
    if (filters.dateTo) {
      const toEnd = new Date(filters.dateTo);
      toEnd.setDate(toEnd.getDate() + 1);
      if (r.createdAt >= toEnd.toISOString()) return false;
    }
    return true;
  });
}
function RequestsPage() {
  const {
    data: catalogItems
  } = useItems();
  const {
    data: requests
  } = useRequests();
  const {
    role
  } = useRole();
  const {
    can
  } = usePermissions();
  const {
    demoStore,
    bumpVersion
  } = useDemo();
  const navigate = useNavigate();
  const {
    request: requestParam
  } = Route.useSearch();
  const isManagerOrAdmin = role === "admin" || role === "manager";
  const canApproveReq = can("approve_request");
  const [formOpen, setFormOpen] = useState(false);
  const [filters, setFilters] = useState(EMPTY_REQUEST_FILTERS);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  useEffect(() => {
    if (requestParam && requests.length > 0 && !detailRequest) {
      const found = requests.find((r) => r.id === requestParam);
      if (found) {
        setDetailRequest(found);
        setDetailOpen(true);
      }
    }
  }, [requestParam, requests, detailRequest]);
  const approval = useApprovalActions({
    items: catalogItems
  });
  const pendingCount = useMemo(() => requests.filter((r) => r.status === RequestStatus.Pending).length, [requests]);
  const pendingRequests = useMemo(() => applyFilters(requests.filter((r) => r.status === RequestStatus.Pending), filters).sort((a, b) => {
    if (a.priority === "urgent" && b.priority !== "urgent") return -1;
    if (b.priority === "urgent" && a.priority !== "urgent") return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }), [requests, filters]);
  const allFiltered = useMemo(() => applyFilters(requests, filters), [requests, filters]);
  const currentDetail = useMemo(() => detailRequest ? requests.find((r) => r.id === detailRequest.id) ?? detailRequest : null, [requests, detailRequest]);
  function handleRowClick(req) {
    setDetailRequest(req);
    setDetailOpen(true);
    navigate({
      to: "/app/requests",
      search: {
        request: req.id
      },
      replace: true
    });
  }
  function handleDetailClose(open) {
    setDetailOpen(open);
    if (!open) {
      navigate({
        to: "/app/requests",
        search: {
          request: void 0
        },
        replace: true
      });
    }
  }
  function handleCancel(req) {
    setCancelTarget(req);
  }
  function confirmCancel() {
    if (!cancelTarget || !demoStore) return;
    demoStore.updateRequest(cancelTarget.id, {
      status: RequestStatus.Cancelled,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    bumpVersion();
    toast.success(`${cancelTarget.requestNumber} cancelled`);
    setCancelTarget(null);
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Inventory Requests" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          requests.length,
          " requests"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => setFormOpen(true), children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
        "New Request"
      ] })
    ] }),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: requests.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: FileText, title: "No requests submitted", description: "Inventory requests let team members request stock for their departments.", actionLabel: "New Request", onAction: () => setFormOpen(true) }) : isManagerOrAdmin ? /* @__PURE__ */ jsxs(Tabs, { defaultValue: "all", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "all", children: "All Requests" }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "pending", className: "gap-1.5", children: [
          "Pending Approval",
          pendingCount > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1 h-5 min-w-5 px-1.5 text-xs", children: pendingCount })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(RequestsFilters, { filters, onChange: setFilters }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "all", className: "mt-4", children: /* @__PURE__ */ jsx(RequestsTable, { requests: allFiltered, onRowClick: handleRowClick, showRequestor: true }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "pending", className: "mt-4", children: /* @__PURE__ */ jsx(RequestsTable, { requests: pendingRequests, onRowClick: handleRowClick, showRequestor: true, preSorted: true }) })
    ] }) : /* @__PURE__ */ jsx(RequestsTable, { requests, onRowClick: handleRowClick }) }),
    /* @__PURE__ */ jsx(RequestDetailSheet, { open: detailOpen, onOpenChange: handleDetailClose, request: currentDetail, items: catalogItems, canApprove: canApproveReq, onApprove: approval.openApprove, onDecline: approval.openDecline, onPartial: approval.openPartial, onCancel: handleCancel }),
    approval.renderDialogs(),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!cancelTarget, onOpenChange: (o) => !o && setCancelTarget(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
          "Cancel ",
          cancelTarget?.requestNumber,
          "?"
        ] }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This action cannot be undone. The request will be marked as cancelled." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Keep Request" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", onClick: confirmCancel, children: "Confirm Cancel" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(RequestFormSheet, { open: formOpen, onOpenChange: setFormOpen, items: catalogItems })
  ] });
}
export {
  RequestsPage as component
};
