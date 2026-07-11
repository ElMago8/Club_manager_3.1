import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import { Trash2, MapPin, ChevronRight, Package, DollarSign, ExternalLink, ArrowRightLeft, Plus } from "lucide-react";
import { v as useDemo, t as cn, B as Button, M as MovementType, E as ErrorBoundary } from "./router-Rtc38bRC.js";
import { a as useItems, b as useLocations$1 } from "./useInventoryData-B4MqeUD9.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { toast } from "sonner";
import { A as AlertDialog, h as AlertDialogTrigger, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-CV3L0vss.js";
import { e as useDeleteLocation, h as useUpdateItem, u as useCreateLocation, i as useUpdateLocation, a as useCreateMovement } from "./useInventoryMutations-yEtOdo22.js";
import { u as usePermissions, P as PermissionGate } from "./usePermissions-DbMx0bgh.js";
import { S as StatusBadge } from "./StatusBadge-BHTeS9Kz.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { S as Sheet, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { F as Form, b as FormField, c as FormItem, d as FormLabel, a as FormControl, e as FormMessage } from "./form-Db0Abg1K.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { S as Switch } from "./switch-CE8zHCZK.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { E as EmptyState } from "./EmptyState-Dkmucllf.js";
import "@tanstack/react-router";
import "date-fns";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-dialog";
import "./label-CoCKMbcU.js";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-select";
function buildTree(locations) {
  const map = /* @__PURE__ */ new Map();
  const roots = [];
  for (const loc of locations) {
    map.set(loc.id, { ...loc, children: [], depth: 0 });
  }
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      const parent = map.get(node.parentId);
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  function setDepth(nodes, depth) {
    for (const n of nodes) {
      n.depth = depth;
      setDepth(n.children, depth + 1);
    }
  }
  setDepth(roots, 0);
  return roots;
}
function useLocations() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) {
      return { data: [...demoStore.getLocations()], isLoading: false, error: null };
    }
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version]);
}
function useLocationTree() {
  const { data: locations } = useLocations();
  return useMemo(() => buildTree(locations), [locations]);
}
function LocationDeleteDialog({
  node,
  items,
  onDeleted
}) {
  const [open, setOpen] = useState(false);
  const deleteLocation = useDeleteLocation();
  const updateItem = useUpdateItem();
  const hasChildren = node.children.length > 0;
  const affectedItems = items.filter((i) => i.locationId === node.id);
  const hasItems = affectedItems.length > 0;
  function handleDelete() {
    for (const item of affectedItems) {
      updateItem.mutate({ id: item.id, updates: { locationId: null } });
    }
    deleteLocation.mutate(node.id, {
      onSuccess: () => {
        toast.success(`Location "${node.name}" deleted`);
        setOpen(false);
        onDeleted();
      },
      onError: (e) => toast.error(e.message || "Failed to delete location.")
    });
  }
  return /* @__PURE__ */ jsxs(AlertDialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "span",
      {
        role: "button",
        tabIndex: 0,
        onClick: (e) => {
          e.stopPropagation();
          setOpen(true);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.stopPropagation();
            setOpen(true);
          }
        },
        className: "shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100",
        "aria-label": "Delete location",
        children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
      }
    ) }),
    /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
          'Delete "',
          node.name,
          '"?'
        ] }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: hasChildren ? /* @__PURE__ */ jsx(Fragment, { children: "Cannot delete a location with sub-locations. Remove or move children first." }) : hasItems ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "This location has ",
          affectedItems.length,
          " item",
          affectedItems.length !== 1 && "s",
          ". They will become unassigned."
        ] }) : /* @__PURE__ */ jsx(Fragment, { children: "This location will be permanently deleted." }) })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        !hasChildren && /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Delete"
          }
        )
      ] })
    ] })
  ] });
}
const TYPE_COLOR = {
  warehouse: "bg-teal-500/15 text-teal-600 border-teal-500/20",
  zone: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  aisle: "bg-purple-500/15 text-purple-600 border-purple-500/20",
  shelf: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  bin: "bg-muted text-muted-foreground"
};
const TYPE_LABEL$1 = {
  warehouse: "Warehouse",
  zone: "Zone",
  aisle: "Aisle",
  shelf: "Shelf",
  bin: "Bin"
};
function LocationTree({ tree, items, selectedId, onSelect }) {
  const itemCounts = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const item of items) {
      if (item.locationId) {
        counts.set(item.locationId, (counts.get(item.locationId) ?? 0) + 1);
      }
    }
    return counts;
  }, [items]);
  if (tree.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-12 text-center", children: [
      /* @__PURE__ */ jsx(MapPin, { className: "h-8 w-8 text-muted-foreground/40" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No locations configured yet." })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-0.5", role: "tree", "aria-label": "Location hierarchy", children: tree.map((node) => /* @__PURE__ */ jsx(
    TreeNode,
    {
      node,
      items,
      itemCounts,
      selectedId,
      onSelect
    },
    node.id
  )) });
}
function TreeNode({
  node,
  items,
  itemCounts,
  selectedId,
  onSelect
}) {
  const [expanded, setExpanded] = useState(node.depth < 1);
  const { can } = usePermissions();
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;
  const count = itemCounts.get(node.id) ?? 0;
  const isAdmin = can("delete_item");
  return /* @__PURE__ */ jsxs("div", { role: "treeitem", "aria-expanded": hasChildren ? expanded : void 0, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => onSelect(node.id),
        onKeyDown: (e) => {
          if (e.key === "Enter") onSelect(node.id);
        },
        className: cn(
          "group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/50",
          isSelected && "bg-accent text-accent-foreground"
        ),
        style: { paddingLeft: `${node.depth * 20 + 8}px` },
        children: [
          hasChildren ? /* @__PURE__ */ jsx(
            "span",
            {
              role: "button",
              tabIndex: 0,
              onClick: (e) => {
                e.stopPropagation();
                setExpanded((p) => !p);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  setExpanded((p) => !p);
                }
              },
              className: "shrink-0 rounded p-0.5 hover:bg-muted",
              "aria-label": expanded ? "Collapse" : "Expand",
              children: /* @__PURE__ */ jsx(
                ChevronRight,
                {
                  className: cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform",
                    expanded && "rotate-90"
                  )
                }
              )
            }
          ) : /* @__PURE__ */ jsx("span", { className: "w-[18px]" }),
          /* @__PURE__ */ jsx("span", { className: "flex-1 truncate font-medium", children: node.name }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: cn("shrink-0 text-[10px]", TYPE_COLOR[node.type]), children: TYPE_LABEL$1[node.type] }),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "shrink-0 font-mono text-xs text-muted-foreground", children: count }),
          isAdmin && /* @__PURE__ */ jsx(
            LocationDeleteDialog,
            {
              node,
              items,
              onDeleted: () => {
                if (selectedId === node.id) onSelect("");
              }
            }
          )
        ]
      }
    ),
    hasChildren && expanded && /* @__PURE__ */ jsx("div", { children: node.children.map((child) => /* @__PURE__ */ jsx(
      TreeNode,
      {
        node: child,
        items,
        itemCounts,
        selectedId,
        onSelect
      },
      child.id
    )) })
  ] });
}
const TYPE_LABEL = {
  warehouse: "Warehouse",
  zone: "Zone",
  aisle: "Aisle",
  shelf: "Shelf",
  bin: "Bin"
};
function getFullPath(locationId, locations) {
  const map = new Map(locations.map((l) => [l.id, l]));
  const parts = [];
  let current = map.get(locationId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? map.get(current.parentId) : void 0;
  }
  return parts.join(" › ");
}
function getDescendantIds(node) {
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...getDescendantIds(child));
  }
  return ids;
}
function LocationSummary({ node, allLocations, items }) {
  const fullPath = useMemo(() => getFullPath(node.id, allLocations), [node.id, allLocations]);
  const locationIds = useMemo(() => new Set(getDescendantIds(node)), [node]);
  const locationItems = useMemo(
    () => items.filter((i) => i.locationId && locationIds.has(i.locationId)),
    [items, locationIds]
  );
  const totalValue = useMemo(
    () => locationItems.reduce((sum, i) => sum + i.currentStock * i.costPrice, 0),
    [locationItems]
  );
  const top10 = useMemo(() => locationItems.slice(0, 10), [locationItems]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: node.name }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: TYPE_LABEL[node.type] ?? node.type })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: fullPath }),
      node.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: node.description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-muted/40 p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-3.5 w-3.5" }),
          "Items"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-foreground", children: locationItems.length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-muted/40 p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(DollarSign, { className: "h-3.5 w-3.5" }),
          "Total Value"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xl font-semibold text-foreground", children: [
          "$",
          totalValue.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ] })
      ] })
    ] }),
    locationItems.length === 0 ? /* @__PURE__ */ jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "No items stored here" }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-foreground", children: [
        "Top Items ",
        locationItems.length > 10 && `(${locationItems.length} total)`
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-border rounded-md border border-border", children: top10.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate font-medium text-foreground", children: item.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: item.sku })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            item.currentStock,
            " ",
            item.unit
          ] }),
          /* @__PURE__ */ jsx(StatusBadge, { status: item.status })
        ] })
      ] }, item.id)) }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `/app/catalog?location=${node.id}`,
          className: "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
          children: [
            "View all in catalog",
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
          ]
        }
      )
    ] })
  ] });
}
const LOCATION_TYPES = [
  { value: "warehouse", label: "Warehouse" },
  { value: "zone", label: "Zone" },
  { value: "aisle", label: "Aisle" },
  { value: "shelf", label: "Shelf" },
  { value: "bin", label: "Bin" }
];
const VALID_PARENTS = {
  warehouse: [],
  zone: ["warehouse"],
  aisle: ["zone"],
  shelf: ["aisle"],
  bin: ["shelf"]
};
const schema$1 = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["warehouse", "zone", "aisle", "shelf", "bin"]),
  parentId: z.string().nullable(),
  description: z.string().max(500),
  isActive: z.boolean()
});
function LocationFormSheet({ open, onOpenChange, editLocation }) {
  const { data: allLocations } = useLocations();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const isEdit = !!editLocation;
  const form = useForm({
    resolver: zodResolver(schema$1),
    defaultValues: {
      name: "",
      type: "warehouse",
      parentId: null,
      description: "",
      isActive: true
    }
  });
  const watchedType = form.watch("type");
  const validParents = useMemo(() => {
    const allowedParentTypes = VALID_PARENTS[watchedType] ?? [];
    if (allowedParentTypes.length === 0) return [];
    return allLocations.filter(
      (l) => allowedParentTypes.includes(l.type) && l.id !== editLocation?.id
    );
  }, [watchedType, allLocations, editLocation?.id]);
  useEffect(() => {
    const currentParent = form.getValues("parentId");
    if (currentParent && !validParents.find((p) => p.id === currentParent)) {
      form.setValue("parentId", null);
    }
  }, [validParents, form]);
  useEffect(() => {
    if (open && editLocation) {
      form.reset({
        name: editLocation.name,
        type: editLocation.type,
        parentId: editLocation.parentId,
        description: editLocation.description ?? "",
        isActive: editLocation.isActive
      });
    } else if (open) {
      form.reset({
        name: "",
        type: "warehouse",
        parentId: null,
        description: "",
        isActive: true
      });
    }
  }, [open, editLocation, form]);
  function onSubmit(values) {
    if (isEdit && editLocation) {
      updateMutation.mutate(
        { id: editLocation.id, updates: { name: values.name, type: values.type, parentId: values.parentId, description: values.description, isActive: values.isActive } },
        {
          onSuccess: () => {
            toast.success("Location updated");
            onOpenChange(false);
          },
          onError: (e) => toast.error(e.message || "Failed to update location.")
        }
      );
    } else {
      const newLocation = {
        id: `loc-${Date.now()}`,
        name: values.name,
        type: values.type,
        parentId: values.parentId,
        description: values.description ?? "",
        address: "",
        isActive: values.isActive,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      createMutation.mutate(newLocation, {
        onSuccess: () => {
          toast.success("Location created");
          onOpenChange(false);
        },
        onError: (e) => toast.error(e.message || "Failed to create location.")
      });
    }
  }
  const noParentAllowed = VALID_PARENTS[watchedType].length === 0;
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-md overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsx(SheetTitle, { children: isEdit ? "Edit Location" : "New Location" }),
      /* @__PURE__ */ jsx(SheetDescription, { children: isEdit ? "Update location details." : "Add a new storage location." })
    ] }),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 pt-4", children: [
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "name",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Name" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g. Main Warehouse", ...field }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "type",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Type" }),
            /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: LOCATION_TYPES.map((t) => /* @__PURE__ */ jsx(SelectItem, { value: t.value, children: t.label }, t.value)) })
            ] }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      !noParentAllowed && /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "parentId",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Parent Location" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                onValueChange: (v) => field.onChange(v === "__none__" ? null : v),
                value: field.value ?? "__none__",
                children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select parent" }) }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "__none__", children: "None" }),
                    validParents.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id, children: loc.name }, loc.id))
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "description",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Description" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Textarea, { placeholder: "Optional description", rows: 3, ...field }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "isActive",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex items-center justify-between rounded-md border border-border p-3", children: [
            /* @__PURE__ */ jsx(FormLabel, { className: "cursor-pointer", children: "Active" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: createMutation.isLoading || updateMutation.isLoading, children: isEdit ? "Update" : "Create" })
      ] })
    ] }) })
  ] }) });
}
const schema = z.object({
  itemId: z.string().min(1, "Select an item"),
  fromLocationId: z.string().min(1, "Select source location"),
  toLocationId: z.string().min(1, "Select destination location"),
  quantity: z.coerce.number().int().min(1, "Minimum 1")
});
function TransferStockSheet({
  open,
  onOpenChange,
  preselectedItemId
}) {
  const { data: items } = useItems();
  const { data: locations } = useLocations$1();
  const createMovement = useCreateMovement();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      itemId: preselectedItemId ?? "",
      fromLocationId: "",
      toLocationId: "",
      quantity: 1
    }
  });
  const selectedItemId = form.watch("itemId");
  const fromLocationId = form.watch("fromLocationId");
  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedItemId),
    [items, selectedItemId]
  );
  const assignedItems = useMemo(
    () => items.filter((i) => i.locationId),
    [items]
  );
  const maxQty = selectedItem?.currentStock ?? 0;
  function onSubmit(values) {
    if (values.fromLocationId === values.toLocationId) {
      form.setError("toLocationId", {
        message: "Destination must differ from source"
      });
      return;
    }
    if (values.quantity > maxQty) {
      form.setError("quantity", {
        message: `Only ${maxQty} available`
      });
      return;
    }
    const fromLoc = locations.find((l) => l.id === values.fromLocationId);
    const toLoc = locations.find((l) => l.id === values.toLocationId);
    createMovement.mutate(
      {
        id: crypto.randomUUID(),
        itemId: values.itemId,
        type: MovementType.Transferred,
        quantity: values.quantity,
        fromLocationId: values.fromLocationId,
        toLocationId: values.toLocationId,
        reference: `Transfer: ${fromLoc?.name ?? ""} → ${toLoc?.name ?? ""}`,
        notes: "",
        performedBy: "demo-user",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        onSuccess: () => {
          toast.success("Stock transferred successfully");
          form.reset();
          onOpenChange(false);
        }
      }
    );
  }
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { className: "overflow-y-auto sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ArrowRightLeft, { className: "h-5 w-5 text-primary" }),
        "Transfer Stock"
      ] }),
      /* @__PURE__ */ jsx(SheetDescription, { children: "Move inventory between locations" })
    ] }),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: form.handleSubmit(onSubmit),
        className: "mt-6 space-y-5",
        children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "itemId",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Item" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: (v) => {
                      field.onChange(v);
                      const item = items.find((i) => i.id === v);
                      if (item?.locationId) {
                        form.setValue("fromLocationId", item.locationId);
                      }
                    },
                    value: field.value,
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select item" }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: assignedItems.map((item) => /* @__PURE__ */ jsxs(SelectItem, { value: item.id, children: [
                        item.name,
                        " (",
                        item.sku,
                        ")"
                      ] }, item.id)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "fromLocationId",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "From Location" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: field.onChange,
                    value: field.value,
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Source location" }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: locations.map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id, children: loc.name }, loc.id)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "toLocationId",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "To Location" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: field.onChange,
                    value: field.value,
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Destination location" }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: locations.filter((l) => l.id !== fromLocationId).map((loc) => /* @__PURE__ */ jsx(SelectItem, { value: loc.id, children: loc.name }, loc.id)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "quantity",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { children: [
                  "Quantity",
                  selectedItem && /* @__PURE__ */ jsxs("span", { className: "ml-1 font-normal text-muted-foreground", children: [
                    "(max ",
                    maxQty,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: maxQty,
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "w-full",
              disabled: createMovement.isLoading,
              children: createMovement.isLoading ? "Transferring…" : "Transfer Stock"
            }
          )
        ]
      }
    ) })
  ] }) });
}
function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNode(n.children, id);
    if (found) return found;
  }
  return null;
}
function LocationsPage() {
  const tree = useLocationTree();
  const {
    data: items
  } = useItems();
  const {
    data: allLocations
  } = useLocations$1();
  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const selectedNode = useMemo(() => selectedId ? findNode(tree, selectedId) : null, [tree, selectedId]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Locations" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          allLocations.length,
          " location",
          allLocations.length !== 1 && "s"
        ] })
      ] }),
      /* @__PURE__ */ jsx(PermissionGate, { permission: "create_item", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => setTransferOpen(true), children: [
          /* @__PURE__ */ jsx(ArrowRightLeft, { className: "mr-1.5 h-4 w-4" }),
          "Transfer Stock"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => setFormOpen(true), children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
          "New Location"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: tree.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: MapPin, title: "No locations configured", description: "Add warehouses, zones, and shelves to organize your inventory by location.", actionLabel: "Add Location", onAction: () => setFormOpen(true) }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[2fr_3fr]", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-4", children: /* @__PURE__ */ jsx(LocationTree, { tree, items, selectedId, onSelect: setSelectedId }) }),
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-4", children: selectedNode ? /* @__PURE__ */ jsx(LocationSummary, { node: selectedNode, allLocations, items }) : /* @__PURE__ */ jsx("p", { className: "py-12 text-center text-sm text-muted-foreground", children: "Select a location to view details" }) })
    ] }) }),
    /* @__PURE__ */ jsx(LocationFormSheet, { open: formOpen, onOpenChange: setFormOpen }),
    /* @__PURE__ */ jsx(TransferStockSheet, { open: transferOpen, onOpenChange: setTransferOpen })
  ] });
}
export {
  LocationsPage as component
};
