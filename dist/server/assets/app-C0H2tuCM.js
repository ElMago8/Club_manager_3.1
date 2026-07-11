import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useLocation, Link, useNavigate, Outlet } from "@tanstack/react-router";
import * as React from "react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, Package, Leaf, ArrowLeftRight, Receipt, BellRing, ShieldCheck, FileSearch, Settings, ChevronDown, Bell, Settings2, ScanBarcode, X, Search, ArrowRightLeft, Plus, FileDown, Info, ClipboardList, ShoppingCart, AlertTriangle, CheckCheck, Menu, User, LogOut, MoreHorizontal } from "lucide-react";
import { t as cn, v as useDemo, B as Button, M as MovementType, I as ItemStatus } from "./router-Rtc38bRC.js";
import { t as tickerLogo, T as ThemeToggle } from "./ThemeToggle-2jtcJdtG.js";
import { S as Switch } from "./switch-CE8zHCZK.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle } from "./dialog-D_bA4dyy.js";
import { toast } from "sonner";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { S as Sheet, a as SheetContent, c as SheetHeader, d as SheetTitle, b as SheetDescription } from "./sheet-BkIzkJWM.js";
import { D as DropdownMenu, e as DropdownMenuTrigger, a as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, b as DropdownMenuItem } from "./dropdown-menu-CVBxbGj8.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Textarea } from "./textarea-L-7m5wEf.js";
import { a as useItems } from "./useInventoryData-B4MqeUD9.js";
import { a as useCreateMovement } from "./useInventoryMutations-yEtOdo22.js";
import { u as usePermissions, a as useRole, P as PermissionGate } from "./usePermissions-DbMx0bgh.js";
import { Command as Command$1 } from "cmdk";
import { formatDistanceToNow } from "date-fns";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { T as Tabs, b as TabsList, c as TabsTrigger } from "./tabs-Dt8gr3JP.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-switch";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-select";
import "@radix-ui/react-tabs";
const NAV_ITEMS$1 = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Socios · Pacientes", href: "/app/socios", icon: Users },
  { label: "Productos · Stock", href: "/app/catalog", icon: Package },
  { label: "Cultivo", href: "/app/cultivo", icon: Leaf },
  { label: "Movimientos", href: "/app/movements", icon: ArrowLeftRight },
  { label: "Facturación ARCA", href: "/app/facturacion", icon: Receipt },
  { label: "Alertas", href: "/app/alertas", icon: BellRing },
  { label: "Usuarios y Roles", href: "/app/usuarios", icon: ShieldCheck },
  { label: "Auditoría", href: "/app/auditoria", icon: FileSearch },
  { label: "Configuración", href: "/app/settings", icon: Settings }
];
const CULTIVO_SECTIONS = [
  { label: "Cultivo general", href: "/app/cultivo" },
  { label: "Salas", href: "/app/cultivo/salas" },
  { label: "Camillas", href: "/app/cultivo/camillas" },
  { label: "Clonador", href: "/app/cultivo/clonador" },
  { label: "Plantas", href: "/app/cultivo/plantas" },
  { label: "Geneticas", href: "/app/cultivo/geneticas" },
  { label: "Madres", href: "/app/cultivo/madres" },
  { label: "Calendario operativo", href: "/app/cultivo/calendario" },
  { label: "Parametros ambientales", href: "/app/cultivo/ambiente" },
  { label: "Mediciones PH / PPM", href: "/app/cultivo/mediciones" },
  { label: "Tabla VPD", href: "/app/cultivo/vpd" },
  { label: "Cosechas", href: "/app/cultivo/cosechas" }
];
function Sidebar({ onNavigate }) {
  const location = useLocation();
  const isActive = (href) => location.pathname === href;
  const [cultivoOpen, setCultivoOpen] = useState(location.pathname.startsWith("/app/cultivo"));
  useEffect(() => {
    if (location.pathname.startsWith("/app/cultivo")) setCultivoOpen(true);
  }, [location.pathname]);
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      "data-tour": "sidebar",
      className: "flex h-full flex-col bg-sidebar text-sidebar-foreground",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-14 items-center gap-2 px-5", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: tickerLogo,
              alt: "",
              "aria-hidden": "true",
              className: "h-[52px] w-[52px] shrink-0 object-contain"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight text-sidebar-foreground", children: "Cannabis Club Manager" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-3 pb-2", children: /* @__PURE__ */ jsx("span", { className: "block px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/50", children: "Panel interno" }) }),
        /* @__PURE__ */ jsx("div", { className: "sidebar-scrollbar flex-1 overflow-y-auto px-3 pb-3", children: /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: NAV_ITEMS$1.map((item) => {
          if (item.href === "/app/cultivo") {
            return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCultivoOpen((open) => !open),
                  className: cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    isActive(item.href) ? "bg-sidebar-accent/90 font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  ),
                  "aria-expanded": cultivoOpen,
                  children: [
                    /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1", children: item.label }),
                    /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        className: cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform",
                          cultivoOpen && "rotate-180"
                        )
                      }
                    )
                  ]
                }
              ),
              cultivoOpen && /* @__PURE__ */ jsx("div", { className: "ml-7 space-y-0.5 border-l border-sidebar-border/70 pl-2", children: CULTIVO_SECTIONS.map((section) => /* @__PURE__ */ jsx(
                Link,
                {
                  to: section.href,
                  onClick: onNavigate,
                  className: cn(
                    "block rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    (section.href === "/app/cultivo" ? location.pathname === section.href : location.pathname === section.href || location.pathname.startsWith(`${section.href}/`)) ? "bg-sidebar-accent/70 text-sidebar-foreground" : "text-sidebar-foreground/70"
                  ),
                  children: section.label
                },
                section.href
              )) })
            ] }, item.href);
          }
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: item.href,
              onClick: onNavigate,
              className: cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive(item.href) ? "bg-sidebar-accent/90 font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              ),
              children: [
                /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 shrink-0" }),
                item.label
              ]
            },
            item.href
          );
        }) }) }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-sidebar-border px-5 py-3", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] leading-relaxed text-sidebar-foreground/55", children: "Entorno de demostración · datos ficticios. Sin backend ni base de datos real." }) })
      ]
    }
  );
}
function useNotifications() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) {
      return { data: demoStore.getNotifications(), isLoading: false, error: null };
    }
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version]);
}
function useUnreadCount() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) return demoStore.getUnreadCount();
    return 0;
  }, [isDemo, demoStore, version]);
}
function useMarkAsRead() {
  const { demoStore, bumpVersion } = useDemo();
  return useCallback(
    (id) => {
      demoStore?.markAsRead(id);
      bumpVersion();
    },
    [demoStore, bumpVersion]
  );
}
function useMarkAllAsRead() {
  const { demoStore, bumpVersion } = useDemo();
  return useCallback(() => {
    demoStore?.markAllAsRead();
    bumpVersion();
  }, [demoStore, bumpVersion]);
}
function useDismissNotification() {
  const { demoStore, bumpVersion } = useDemo();
  return useCallback(
    (id) => {
      demoStore?.dismissNotification(id);
      bumpVersion();
    },
    [demoStore, bumpVersion]
  );
}
function NotificationBell({ onClick }) {
  const count = useUnreadCount();
  const displayCount = count > 99 ? "99+" : count;
  return /* @__PURE__ */ jsxs(
    Button,
    {
      size: "icon",
      variant: "ghost",
      className: "relative shrink-0",
      onClick,
      "aria-label": count > 0 ? `${count} unread notifications` : "Notifications",
      children: [
        /* @__PURE__ */ jsx(Bell, { className: cn("h-4 w-4", count > 0 && "animate-[shake_0.5s_ease-in-out]") }),
        count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[10px] font-bold text-destructive-foreground", children: displayCount })
      ]
    }
  );
}
const PREF_LABELS = [
  { key: "low_stock", label: "Low Stock Alerts", description: "When an item drops below its reorder point" },
  { key: "zero_stock", label: "Zero Stock Alerts", description: "When an item reaches zero stock" },
  { key: "po_reminder", label: "PO Reminders", description: "When a PO delivery date is within 3 days" },
  { key: "po_overdue", label: "PO Overdue", description: "When a PO passes its expected delivery date" },
  { key: "request_update", label: "Request Updates", description: "When an inventory request status changes" }
];
function NotificationPreferences({ open, onOpenChange }) {
  const { demoStore, bumpVersion } = useDemo();
  const [prefs, setPrefs] = useState(
    () => demoStore?.getNotificationPrefs() ?? {
      low_stock: true,
      zero_stock: true,
      po_reminder: true,
      po_overdue: true,
      request_update: true
    }
  );
  const handleToggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };
  const handleSave = () => {
    demoStore?.setNotificationPrefs(prefs);
    bumpVersion();
    toast.success("Notification preferences saved.");
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsx(Settings2, { className: "h-4 w-4" }),
      "Notification Preferences"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: PREF_LABELS.map(({ key, label, description }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 rounded-lg border border-border p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: `pref-${key}`, className: "text-sm font-medium", children: label }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: description })
      ] }),
      /* @__PURE__ */ jsx(
        Switch,
        {
          id: `pref-${key}`,
          checked: prefs[key],
          onCheckedChange: () => handleToggle(key)
        }
      )
    ] }, key)) }),
    /* @__PURE__ */ jsx(Button, { onClick: handleSave, className: "w-full mt-2", children: "Save Preferences" })
  ] }) });
}
function QuickEntryMode({ open, onOpenChange }) {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [foundItem, setFoundItem] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [movementType, setMovementType] = useState(MovementType.Received);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const inputRef = useRef(null);
  const { data: items } = useItems();
  const createMovement = useCreateMovement();
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);
  const resetForm = useCallback(() => {
    setFoundItem(null);
    setNotFound(null);
    setMovementType(MovementType.Received);
    setQuantity("");
    setNotes("");
    setBarcodeInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);
  const handleLookup = useCallback(() => {
    const query = barcodeInput.trim();
    if (!query) return;
    const item = items.find(
      (i) => i.barcode?.toLowerCase() === query.toLowerCase() || i.sku.toLowerCase() === query.toLowerCase()
    );
    if (item) {
      setFoundItem(item);
      setNotFound(null);
    } else {
      setFoundItem(null);
      setNotFound(query);
    }
  }, [barcodeInput, items]);
  const handleSubmit = useCallback(() => {
    if (!foundItem || !quantity) return;
    const movement = {
      id: `mov-${Date.now()}`,
      itemId: foundItem.id,
      type: movementType,
      quantity: Number(quantity),
      fromLocationId: null,
      toLocationId: null,
      reference: `Quick Entry`,
      notes,
      performedBy: "Demo Admin",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    createMovement.mutate(movement, {
      onSuccess: () => {
        toast.success(`${movementType} ${quantity} × ${foundItem.name}`);
        resetForm();
      }
    });
  }, [foundItem, movementType, quantity, notes, createMovement, resetForm]);
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (foundItem || notFound) {
        resetForm();
      } else {
        onOpenChange(false);
      }
    }
  };
  return /* @__PURE__ */ jsx(Sheet, { open, onOpenChange: (v) => {
    if (!v) resetForm();
    onOpenChange(v);
  }, children: /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-[480px]", onKeyDown: handleKeyDown, children: [
    /* @__PURE__ */ jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ScanBarcode, { className: "h-5 w-5" }),
        "Quick Entry"
      ] }),
      /* @__PURE__ */ jsx(SheetDescription, { children: "Scan or type a barcode to look up an item and log a movement." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "barcode-scan", className: "text-sm font-medium", children: "Barcode / SKU" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "barcode-scan",
              ref: inputRef,
              value: barcodeInput,
              onChange: (e) => setBarcodeInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") handleLookup();
              },
              placeholder: "Scan or type barcode…",
              className: "h-12 text-lg font-mono",
              autoFocus: true,
              autoComplete: "off"
            }
          ),
          /* @__PURE__ */ jsx(Button, { onClick: handleLookup, className: "h-12 px-5", disabled: !barcodeInput.trim(), children: "Look up" })
        ] })
      ] }),
      notFound && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: "Item not found" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-mono text-xs text-muted-foreground", children: notFound }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "mt-2", onClick: resetForm, children: "Try again" })
      ] }),
      foundItem && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: foundItem.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-mono", children: foundItem.sku })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: resetForm, "aria-label": "Clear item", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex gap-4 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Current stock:" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold font-mono", children: foundItem.currentStock })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Movement Type" }),
            /* @__PURE__ */ jsxs(Select, { value: movementType, onValueChange: (v) => setMovementType(v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: MovementType.Received, children: "Received" }),
                /* @__PURE__ */ jsx(SelectItem, { value: MovementType.Shipped, children: "Shipped" }),
                /* @__PURE__ */ jsx(SelectItem, { value: MovementType.Adjusted, children: "Adjusted" }),
                /* @__PURE__ */ jsx(SelectItem, { value: MovementType.Transferred, children: "Transferred" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Quantity" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: "1",
                value: quantity,
                onChange: (e) => setQuantity(e.target.value),
                placeholder: "Enter quantity",
                className: "mt-1",
                onKeyDown: (e) => {
                  if (e.key === "Enter" && quantity) handleSubmit();
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Notes (optional)" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "Optional notes",
                className: "mt-1",
                rows: 2
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: handleSubmit,
              disabled: !quantity || createMovement.isLoading,
              className: "w-full",
              children: createMovement.isLoading ? "Logging…" : "Log Movement"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
const ROUTE_ACCESS = {
  "/app/dashboard": ["admin", "manager", "requestor"],
  "/app/catalog": ["admin", "manager", "requestor"],
  "/app/cultivo": ["admin", "manager", "requestor"],
  "/app/requests": ["admin", "manager", "requestor"],
  "/app/movements": ["admin", "manager"],
  "/app/suppliers": ["admin", "manager"],
  "/app/purchase-orders": ["admin", "manager", "requestor"],
  "/app/analytics": ["admin", "manager"],
  "/app/ai-insights": ["admin", "manager"],
  "/app/settings": ["admin"]
};
function canAccessRoute(path, role) {
  if (path.startsWith("/app/cultivo/")) {
    return ROUTE_ACCESS["/app/cultivo"].includes(role);
  }
  const allowed = ROUTE_ACCESS[path];
  if (!allowed) return role === "admin";
  return allowed.includes(role);
}
const Command = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = Command$1.displayName;
const CommandInput = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsx(
    Command$1.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = Command$1.Input.displayName;
const CommandList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = Command$1.List.displayName;
const CommandEmpty = React.forwardRef((props, ref) => /* @__PURE__ */ jsx(
  Command$1.Empty,
  {
    ref,
    className: "py-6 text-center text-sm",
    ...props
  }
));
CommandEmpty.displayName = Command$1.Empty.displayName;
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = Command$1.Group.displayName;
const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = Command$1.Separator.displayName;
const CommandItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = Command$1.Item.displayName;
const CommandShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      ),
      ...props
    }
  );
};
CommandShortcut.displayName = "CommandShortcut";
const PAGES = [
  { label: "Dashboard", path: "/app/dashboard", icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-4 w-4" }) },
  { label: "Socios · Pacientes", path: "/app/socios", icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }) },
  { label: "Productos · Stock", path: "/app/catalog", icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) },
  { label: "Movimientos", path: "/app/movements", icon: /* @__PURE__ */ jsx(ArrowRightLeft, { className: "h-4 w-4" }) },
  { label: "Alertas", path: "/app/alertas", icon: /* @__PURE__ */ jsx(BellRing, { className: "h-4 w-4" }) },
  { label: "Usuarios y Roles", path: "/app/usuarios", icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }) },
  { label: "Auditoría", path: "/app/auditoria", icon: /* @__PURE__ */ jsx(FileSearch, { className: "h-4 w-4" }) },
  { label: "Configuración", path: "/app/settings", icon: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }) }
];
const ACTIONS = [
  {
    label: "Nuevo producto",
    icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
    shortcut: "N P",
    action: (nav) => nav({ to: "/app/catalog", search: {} }),
    permission: "create_item"
  },
  {
    label: "Nuevo movimiento",
    icon: /* @__PURE__ */ jsx(ArrowRightLeft, { className: "h-4 w-4" }),
    shortcut: "N M",
    action: (nav) => nav({ to: "/app/movements", search: { item: void 0 } }),
    permission: "log_movement"
  },
  {
    label: "Exportar productos (CSV)",
    icon: /* @__PURE__ */ jsx(FileDown, { className: "h-4 w-4" }),
    action: (nav) => nav({ to: "/app/catalog", search: {} }),
    permission: "export_data"
  }
];
const STATUS_DOT = {
  [ItemStatus.Active]: "bg-emerald-500",
  [ItemStatus.Discontinued]: "bg-muted-foreground",
  [ItemStatus.Archived]: "bg-muted-foreground"
};
function ItemResultRow({ item }) {
  const isLow = item.currentStock > 0 && item.currentStock <= (item.reorderPoint ?? 0);
  const isOut = item.currentStock <= 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "h-2 w-2 shrink-0 rounded-full",
          isOut ? "bg-destructive" : isLow ? "bg-amber-500" : STATUS_DOT[item.status] ?? "bg-emerald-500"
        )
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: item.name }),
    /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-muted-foreground", children: item.sku }),
    /* @__PURE__ */ jsx("span", { className: "ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-xs", children: item.currentStock })
  ] });
}
const NL_KEYWORDS = ["show", "find", "what", "which", "list", "give", "get", "where"];
const STATUS_PATTERNS = [
  [/\b(running low|low stock|below reorder)\b/i, "low_stock"],
  [/\b(out of stock|zero stock|no stock|stockout)\b/i, "out_of_stock"],
  [/\b(active|in stock|available)\b/i, "active"],
  [/\b(discontinued|archived)\b/i, "discontinued"]
];
const MOVEMENT_PATTERNS = [
  [/\breceived\b/i, "received"],
  [/\bshipped\b/i, "shipped"],
  [/\badjusted\b/i, "adjusted"],
  [/\btransferred\b/i, "transferred"]
];
const DATE_PATTERNS = [
  [
    /\blast (7 days|week)\b/i,
    () => ({ from: daysAgo(7), to: /* @__PURE__ */ new Date() })
  ],
  [
    /\blast (30 days|month)\b/i,
    () => ({ from: daysAgo(30), to: /* @__PURE__ */ new Date() })
  ],
  [
    /\blast (90 days|quarter|3 months)\b/i,
    () => ({ from: daysAgo(90), to: /* @__PURE__ */ new Date() })
  ],
  [
    /\btoday\b/i,
    () => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return { from: d, to: /* @__PURE__ */ new Date() };
    }
  ],
  [
    /\byesterday\b/i,
    () => {
      const d = daysAgo(1);
      d.setHours(0, 0, 0, 0);
      const e = daysAgo(1);
      e.setHours(23, 59, 59, 999);
      return { from: d, to: e };
    }
  ]
];
function daysAgo(n) {
  return new Date(Date.now() - n * 864e5);
}
const NOISE = /* @__PURE__ */ new Set([
  "show",
  "me",
  "find",
  "what",
  "which",
  "list",
  "give",
  "get",
  "where",
  "is",
  "are",
  "the",
  "a",
  "an",
  "of",
  "in",
  "from",
  "that",
  "items",
  "products",
  "things",
  "stuff",
  "all",
  "my",
  "have",
  "has",
  "been",
  "with",
  "for",
  "to",
  "and",
  "or"
]);
function parseQuery(query) {
  const filters = {};
  let remaining = query.trim();
  const words = remaining.split(/\s+/);
  const isNL = words.length > 3 || words.some((w) => NL_KEYWORDS.includes(w.toLowerCase()));
  for (const [pattern, status] of STATUS_PATTERNS) {
    if (pattern.test(remaining)) {
      filters.status = status;
      remaining = remaining.replace(pattern, " ");
      break;
    }
  }
  for (const [pattern, type] of MOVEMENT_PATTERNS) {
    if (pattern.test(remaining)) {
      filters.movementType = type;
      remaining = remaining.replace(pattern, " ");
      break;
    }
  }
  for (const [pattern, fn] of DATE_PATTERNS) {
    if (pattern.test(remaining)) {
      filters.dateRange = fn();
      remaining = remaining.replace(pattern, " ");
      break;
    }
  }
  const fromMatch = remaining.match(/\bfrom\s+([A-Z][a-zA-Z\s&]+?)(?:\s+(?:received|shipped|last|in|that|$))/i);
  if (fromMatch) {
    filters.supplier = fromMatch[1].trim();
    remaining = remaining.replace(fromMatch[0], fromMatch[0].replace(fromMatch[1], " "));
  }
  const inMatch = remaining.match(/\bin\s+([A-Za-z][a-zA-Z\s&]+?)(?:\s+(?:from|received|shipped|last|that|$))/i);
  if (inMatch) {
    filters.category = inMatch[1].trim();
    remaining = remaining.replace(inMatch[0], inMatch[0].replace(inMatch[1], " "));
  }
  const searchTerms = remaining.split(/\s+/).map((w) => w.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()).filter((w) => w.length > 1 && !NOISE.has(w));
  return { searchTerms, filters, isNaturalLanguage: isNL };
}
function CommandPalette({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: items } = useItems();
  const { can } = usePermissions();
  const { role } = useRole();
  const { demoStore } = useDemo();
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  const q = query.toLowerCase().trim();
  const parsed = useMemo(() => parseQuery(query), [query]);
  const isNL = parsed.isNaturalLanguage && q.length > 0;
  const nlItems = useMemo(() => {
    if (!isNL) return [];
    let results = [...items];
    if (parsed.filters.status) {
      if (parsed.filters.status === "low_stock") {
        results = results.filter((i) => i.currentStock > 0 && i.currentStock <= i.reorderPoint);
      } else if (parsed.filters.status === "out_of_stock") {
        results = results.filter((i) => i.currentStock <= 0);
      } else if (parsed.filters.status === "active") {
        results = results.filter((i) => i.status === "active" && i.currentStock > 0);
      }
    }
    if (parsed.filters.category && demoStore) {
      const cats = demoStore.getCategories();
      const catName = parsed.filters.category.toLowerCase();
      const matchingCats = cats.filter((c) => c.name.toLowerCase().includes(catName));
      if (matchingCats.length > 0) {
        const catIds = new Set(matchingCats.map((c) => c.id));
        results = results.filter((i) => i.categoryId && catIds.has(i.categoryId));
      }
    }
    if (parsed.filters.supplier && demoStore) {
      const sups = demoStore.getSuppliers();
      const supName = parsed.filters.supplier.toLowerCase();
      const matchingSups = sups.filter((s) => s.name.toLowerCase().includes(supName));
      if (matchingSups.length > 0) {
        const supIds = new Set(matchingSups.map((s) => s.id));
        results = results.filter((i) => i.supplierId && supIds.has(i.supplierId));
      }
    }
    if (parsed.searchTerms.length > 0) {
      results = results.filter(
        (i) => parsed.searchTerms.every(
          (t) => i.name.toLowerCase().includes(t) || i.sku.toLowerCase().includes(t)
        )
      );
    }
    return results.slice(0, 10);
  }, [isNL, items, parsed, demoStore]);
  const matchedItems = useMemo(() => {
    if (isNL || q.length < 1) return [];
    return items.filter(
      (i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.barcode && i.barcode.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [items, q, isNL]);
  const matchedPages = useMemo(() => {
    const accessible = PAGES.filter((p) => canAccessRoute(p.path, role));
    if (!q) return accessible;
    return accessible.filter((p) => p.label.toLowerCase().includes(q));
  }, [q, role]);
  const matchedActions = useMemo(() => {
    const allowed = ACTIONS.filter((a) => !a.permission || can(a.permission));
    if (!q) return allowed;
    return allowed.filter((a) => a.label.toLowerCase().includes(q));
  }, [q, can]);
  const hasResults = matchedItems.length > 0 || nlItems.length > 0 || matchedPages.length > 0 || matchedActions.length > 0;
  const handleSelect = useCallback(
    (value) => {
      onOpenChange(false);
      if (value.startsWith("item:")) {
        const itemId = value.replace("item:", "");
        navigate({ to: "/app/catalog", search: { item: itemId } });
        return;
      }
      if (value.startsWith("page:")) {
        const path = value.replace("page:", "");
        navigate({ to: path });
        return;
      }
      if (value.startsWith("action:")) {
        const label = value.replace("action:", "");
        const action = ACTIONS.find((a) => a.label === label);
        action?.action(navigate);
      }
    },
    [navigate, onOpenChange]
  );
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsx(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsxs(
    Command$1,
    {
      shouldFilter: false,
      className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
      children: [
        /* @__PURE__ */ jsx(
          CommandInput,
          {
            placeholder: "Buscar productos, páginas y acciones…",
            value: query,
            onValueChange: setQuery
          }
        ),
        /* @__PURE__ */ jsxs(CommandList, { children: [
          !hasResults && /* @__PURE__ */ jsx(CommandEmpty, { children: "Sin resultados." }),
          isNL && nlItems.length > 0 && /* @__PURE__ */ jsxs(CommandGroup, { heading: "Resultados", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-2 pb-2 flex flex-wrap gap-1", children: [
              parsed.filters.status && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                "estado: ",
                parsed.filters.status
              ] }),
              parsed.filters.category && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                "categoría: ",
                parsed.filters.category
              ] }),
              parsed.filters.supplier && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                "fuente: ",
                parsed.filters.supplier
              ] }),
              parsed.searchTerms.length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                "términos: ",
                parsed.searchTerms.join(", ")
              ] })
            ] }),
            nlItems.map((item) => /* @__PURE__ */ jsx(
              CommandItem,
              {
                value: `item:${item.id}`,
                onSelect: handleSelect,
                children: /* @__PURE__ */ jsx(ItemResultRow, { item })
              },
              item.id
            ))
          ] }),
          isNL && nlItems.length === 0 && q.length > 0 && /* @__PURE__ */ jsx(CommandEmpty, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { children: "No items match your query." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 justify-center", children: [
              parsed.filters.status && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                "status: ",
                parsed.filters.status
              ] }),
              parsed.filters.category && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                "category: ",
                parsed.filters.category
              ] })
            ] })
          ] }) }),
          matchedItems.length > 0 && /* @__PURE__ */ jsx(CommandGroup, { heading: "Productos", children: matchedItems.map((item) => /* @__PURE__ */ jsx(
            CommandItem,
            {
              value: `item:${item.id}`,
              onSelect: handleSelect,
              children: /* @__PURE__ */ jsx(ItemResultRow, { item })
            },
            item.id
          )) }),
          matchedPages.length > 0 && /* @__PURE__ */ jsx(CommandGroup, { heading: "Páginas", children: matchedPages.map((page) => /* @__PURE__ */ jsxs(
            CommandItem,
            {
              value: `page:${page.path}`,
              onSelect: handleSelect,
              children: [
                page.icon,
                /* @__PURE__ */ jsx("span", { children: page.label })
              ]
            },
            page.path
          )) }),
          matchedActions.length > 0 && /* @__PURE__ */ jsx(CommandGroup, { heading: "Acciones", children: matchedActions.map((action) => /* @__PURE__ */ jsxs(
            CommandItem,
            {
              value: `action:${action.label}`,
              onSelect: handleSelect,
              children: [
                action.icon,
                /* @__PURE__ */ jsx("span", { children: action.label }),
                action.shortcut && /* @__PURE__ */ jsx(CommandShortcut, { children: action.shortcut })
              ]
            },
            action.label
          )) })
        ] })
      ]
    }
  ) }) });
}
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
const ICON_MAP = {
  low_stock: { icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }), color: "text-amber-500" },
  zero_stock: { icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }), color: "text-destructive" },
  po_reminder: { icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }), color: "text-blue-500" },
  po_overdue: { icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }), color: "text-destructive" },
  request_update: { icon: /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4" }), color: "text-primary" },
  system: { icon: /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }), color: "text-muted-foreground" }
};
function getNotificationIcon(type) {
  const entry = ICON_MAP[type] ?? ICON_MAP.system;
  return /* @__PURE__ */ jsx("span", { className: cn("shrink-0", entry.color), children: entry.icon });
}
const TAB_FILTER = {
  all: () => true,
  unread: (n) => !n.isRead,
  stock: (n) => n.type === "low_stock" || n.type === "zero_stock",
  po: (n) => n.type === "po_reminder" || n.type === "po_overdue",
  requests: (n) => n.type === "request_update"
};
function NotificationCenter({ open, onOpenChange, onOpenPrefs }) {
  const [tab, setTab] = useState("all");
  const { data: notifications } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const dismiss = useDismissNotification();
  const navigate = useNavigate();
  const filtered = notifications.filter(TAB_FILTER[tab]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const handleClick = (n) => {
    if (!n.isRead) markAsRead(n.id);
    if (n.link) {
      onOpenChange(false);
      navigate({ to: n.link });
    }
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxs(SheetContent, { side: "right", className: "flex w-full flex-col p-0 sm:w-[400px]", children: [
    /* @__PURE__ */ jsx(SheetHeader, { className: "border-b border-border px-4 py-3 pr-14", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs(SheetTitle, { className: "min-w-0 pt-1 text-base", children: [
        "Notifications",
        unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-destructive px-2 py-0.5 font-mono text-xs text-destructive-foreground", children: unreadCount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [
        unreadCount > 0 && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "h-8 gap-1 px-2 text-xs", onClick: markAllAsRead, children: [
          /* @__PURE__ */ jsx(CheckCheck, { className: "mr-1 h-3.5 w-3.5" }),
          "Mark all"
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 shrink-0", onClick: () => onOpenPrefs?.(), "aria-label": "Notification settings", children: /* @__PURE__ */ jsx(Settings2, { className: "h-4 w-4" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "border-b border-border px-4 py-2", children: /* @__PURE__ */ jsx(Tabs, { value: tab, onValueChange: (v) => setTab(v), children: /* @__PURE__ */ jsxs(TabsList, { className: "h-8 w-full", children: [
      /* @__PURE__ */ jsx(TabsTrigger, { value: "all", className: "text-xs flex-1", children: "All" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "unread", className: "text-xs flex-1", children: "Unread" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "stock", className: "text-xs flex-1", children: "Stock" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "po", className: "text-xs flex-1", children: "PO" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "requests", className: "text-xs flex-1", children: "Requests" })
    ] }) }) }),
    /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1", children: filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Bell, { className: "h-8 w-8" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No notifications" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: filtered.map((n) => /* @__PURE__ */ jsx(
      NotificationItem,
      {
        notification: n,
        onClick: () => handleClick(n),
        onDismiss: () => dismiss(n.id)
      },
      n.id
    )) }) })
  ] }) }) });
}
function NotificationItem({
  notification: n,
  onClick,
  onDismiss
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group relative flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        !n.isRead && "bg-primary/5"
      ),
      onClick,
      role: "button",
      tabIndex: 0,
      onKeyDown: (e) => e.key === "Enter" && onClick(),
      children: [
        !n.isRead && /* @__PURE__ */ jsx("span", { className: "absolute left-1.5 top-5 h-2 w-2 rounded-full bg-primary" }),
        getNotificationIcon(n.type),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium leading-tight", children: n.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground", children: n.message }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "inline-flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full text-muted-foreground opacity-0 transition-all duration-200 hover:rotate-90 hover:scale-105 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100",
            onClick: (e) => {
              e.stopPropagation();
              onDismiss();
            },
            "aria-label": "Dismiss notification",
            children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
          }
        )
      ]
    }
  );
}
const ROLE_BADGE_STYLES = {
  admin: "bg-primary/15 text-primary border-primary/20",
  manager: "bg-secondary/15 text-secondary-foreground border-secondary/20",
  requestor: "bg-muted text-muted-foreground border-border"
};
const ROLE_LABELS = {
  admin: "Administrador",
  manager: "Operador",
  requestor: "Auditor"
};
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const { exitDemoMode } = useDemo();
  const { role } = useRole();
  const navigate = useNavigate();
  const displayName = "Operador demo";
  const handleExit = async () => {
    await navigate({ to: "/" });
    exitDemoMode();
  };
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return /* @__PURE__ */ jsxs("header", { className: "flex h-16 items-center gap-3 border-b border-border bg-card px-4 shadow-sm md:px-8", children: [
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden", onClick: () => setMobileOpen(true), "aria-label": "Open menu", children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxs("button", { "data-tour": "search", type: "button", onClick: () => setPaletteOpen(true), className: "flex h-9 flex-1 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 md:max-w-sm", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 shrink-0" }),
      /* @__PURE__ */ jsx("span", { children: "Buscar…" }),
      /* @__PURE__ */ jsx("kbd", { className: "ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs md:inline-block", children: "⌘K" })
    ] }),
    /* @__PURE__ */ jsx(PermissionGate, { permission: "create_item", children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "outline", className: "shrink-0", "aria-label": "Nuevo producto", onClick: () => navigate({ to: "/app/catalog", search: { newItem: "true" } }), children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsx(NotificationBell, { onClick: () => setNotifOpen(true) }),
    /* @__PURE__ */ jsx(ThemeToggle, { className: "shrink-0" }),
    /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { type: "button", className: "flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 hover:bg-muted transition-colors", "aria-label": "User menu", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted", children: /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("span", { className: "hidden text-sm font-medium md:inline-block", children: displayName }),
        /* @__PURE__ */ jsx(ChevronDown, { className: "hidden h-3.5 w-3.5 text-muted-foreground md:inline-block" })
      ] }) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
        /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex items-center justify-between font-normal text-xs text-muted-foreground", children: [
          displayName,
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `ml-2 text-[10px] font-semibold uppercase ${ROLE_BADGE_STYLES[role]}`, children: ROLE_LABELS[role] })
        ] }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate({ to: "/app/settings" }), children: [
          /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
          "Configuración"
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleExit, children: [
          /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
          "Salir del entorno demo"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: /* @__PURE__ */ jsxs(SheetContent, { side: "left", className: "w-[260px] p-0", children: [
      /* @__PURE__ */ jsx(SheetTitle, { className: "sr-only", children: "Navigation" }),
      /* @__PURE__ */ jsx(Sidebar, { onNavigate: () => setMobileOpen(false) })
    ] }) }),
    /* @__PURE__ */ jsx(QuickEntryMode, { open: quickEntryOpen, onOpenChange: setQuickEntryOpen }),
    /* @__PURE__ */ jsx(CommandPalette, { open: paletteOpen, onOpenChange: setPaletteOpen }),
    /* @__PURE__ */ jsx(NotificationCenter, { open: notifOpen, onOpenChange: setNotifOpen, onOpenPrefs: () => {
      setNotifOpen(false);
      setTimeout(() => setPrefsOpen(true), 300);
    } }),
    /* @__PURE__ */ jsx(NotificationPreferences, { open: prefsOpen, onOpenChange: setPrefsOpen })
  ] });
}
const roles = [
  { value: "admin", label: "Administrador" },
  { value: "manager", label: "Operador" },
  { value: "requestor", label: "Auditor" }
];
function DemoBanner() {
  const { isDemo } = useDemo();
  const { role, setDemoRole } = useRole();
  const [dismissed, setDismissed] = useState(false);
  if (!isDemo || dismissed) return null;
  const currentLabel = roles.find((r) => r.value === role)?.label ?? "Administrador";
  return /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-50 flex h-10 w-full items-center justify-between bg-primary px-3 text-sm font-medium text-primary-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "w-8 shrink-0" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Modo demostración · sesión como" }),
      /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Demo ·" }),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "inline-flex items-center gap-1 rounded-md border border-primary-foreground/25 bg-primary-foreground/15 px-2 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/25",
            children: [
              currentLabel,
              /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 opacity-70" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(DropdownMenuContent, { align: "center", className: "min-w-[120px]", children: roles.map((r) => /* @__PURE__ */ jsx(
          DropdownMenuItem,
          {
            onClick: () => setDemoRole(r.value),
            className: role === r.value ? "font-semibold" : "",
            children: r.label
          },
          r.value
        )) })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-primary-foreground/70", children: "· datos ficticios, se reinician al cerrar sesión" })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setDismissed(true),
        className: "w-8 shrink-0 flex items-center justify-center rounded p-0.5 transition-colors hover:bg-primary-foreground/20",
        "aria-label": "Dismiss demo banner",
        children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
const NAV_ITEMS = [
  { label: "Inicio", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Socios", href: "/app/socios", icon: Users },
  { label: "Productos", href: "/app/catalog", icon: Package },
  { label: "Movimientos", href: "/app/movements", icon: ArrowLeftRight }
];
function BottomNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (href) => location.pathname === href;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("nav", { className: "fixed bottom-0 left-0 right-0 z-40 flex h-14 items-stretch border-t border-border bg-card md:hidden", children: [
      NAV_ITEMS.map((item) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: item.href,
          className: cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors min-h-[44px]",
            isActive(item.href) ? "text-primary font-semibold" : "text-muted-foreground"
          ),
          children: [
            /* @__PURE__ */ jsx(item.icon, { className: "h-5 w-5" }),
            item.label
          ]
        },
        item.href
      )),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setMoreOpen(true),
          className: "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] text-muted-foreground min-h-[44px]",
          children: [
            /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-5 w-5" }),
            "Más"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: moreOpen, onOpenChange: setMoreOpen, children: /* @__PURE__ */ jsxs(SheetContent, { side: "bottom", className: "max-h-[70vh] p-0", children: [
      /* @__PURE__ */ jsx(SheetTitle, { className: "sr-only", children: "Más navegación" }),
      /* @__PURE__ */ jsx(Sidebar, { onNavigate: () => setMoreOpen(false) })
    ] }) })
  ] });
}
const SHORTCUTS = [
  // Navigation: G then …
  { keys: ["g", "d"], label: "Go to Dashboard", action: (n) => n({ to: "/app/dashboard" }), category: "navigate" },
  { keys: ["g", "c"], label: "Go to Catalog", action: (n) => n({ to: "/app/catalog", search: {} }), category: "navigate" },
  { keys: ["g", "m"], label: "Go to Movements", action: (n) => n({ to: "/app/movements", search: { item: void 0 } }), category: "navigate" },
  { keys: ["g", "s"], label: "Go to Suppliers", action: (n) => n({ to: "/app/suppliers" }), category: "navigate" },
  { keys: ["g", "p"], label: "Go to Purchase Orders", action: (n) => n({ to: "/app/purchase-orders", search: {} }), category: "navigate" },
  { keys: ["g", "r"], label: "Go to Requests", action: (n) => n({ to: "/app/requests", search: { request: void 0 } }), category: "navigate" },
  // Create: N then …
  { keys: ["n", "i"], label: "New Item", action: (n) => n({ to: "/app/catalog", search: {} }), permission: "create_item", category: "create" },
  { keys: ["n", "m"], label: "New Movement", action: (n) => n({ to: "/app/movements", search: { item: void 0 } }), permission: "log_movement", category: "create" },
  { keys: ["n", "p"], label: "New Purchase Order", action: (n) => n({ to: "/app/purchase-orders", search: {} }), permission: "create_po", category: "create" },
  { keys: ["n", "r"], label: "New Request", action: (n) => n({ to: "/app/requests", search: { request: void 0 } }), permission: "create_request", category: "create" }
];
const SEQUENCE_TIMEOUT = 500;
function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
}
function useKeyboardShortcuts({ onHelpOpen }) {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const firstKeyRef = useRef(null);
  const timerRef = useRef(null);
  const clearSequence = useCallback(() => {
    firstKeyRef.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isInputFocused()) return;
      const key = e.key.toLowerCase();
      if (key === "?" || e.shiftKey && key === "/") {
        e.preventDefault();
        onHelpOpen();
        clearSequence();
        return;
      }
      if (firstKeyRef.current) {
        const first = firstKeyRef.current;
        clearSequence();
        const match = SHORTCUTS.find(
          (s) => s.keys[0] === first && s.keys[1] === key && (!s.permission || can(s.permission))
        );
        if (match) {
          e.preventDefault();
          match.action(navigate);
        }
        return;
      }
      if (key === "g" || key === "n") {
        firstKeyRef.current = key;
        timerRef.current = setTimeout(clearSequence, SEQUENCE_TIMEOUT);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearSequence();
    };
  }, [navigate, can, onHelpOpen, clearSequence]);
}
function ShortcutsHelpDialog({ open, onOpenChange }) {
  const navShortcuts = SHORTCUTS.filter((s) => s.category === "navigate");
  const createShortcuts = SHORTCUTS.filter((s) => s.category === "create");
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Keyboard Shortcuts" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium text-muted-foreground", children: "Global" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(ShortcutRow, { keys: "⌘ K", label: "Open command palette" }),
          /* @__PURE__ */ jsx(ShortcutRow, { keys: "?", label: "Show this help" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium text-muted-foreground", children: "Navigation" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: navShortcuts.map((s) => /* @__PURE__ */ jsx(
          ShortcutRow,
          {
            keys: `${s.keys[0].toUpperCase()} → ${s.keys[1].toUpperCase()}`,
            label: s.label
          },
          s.keys.join("")
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium text-muted-foreground", children: "Create" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: createShortcuts.map((s) => /* @__PURE__ */ jsx(
          ShortcutRow,
          {
            keys: `${s.keys[0].toUpperCase()} → ${s.keys[1].toUpperCase()}`,
            label: s.label
          },
          s.keys.join("")
        )) })
      ] })
    ] })
  ] }) });
}
function ShortcutRow({ keys, label }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx("kbd", { className: "rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs", children: keys })
  ] });
}
function PageTransition({ children, routeKey }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0 },
      transition: { duration: 0.2, ease: "easeOut" },
      children
    },
    routeKey
  );
}
function AppLayout() {
  const {
    isDemo
  } = useDemo();
  const {
    role
  } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  useKeyboardShortcuts({
    onHelpOpen: () => setHelpOpen(true)
  });
  useEffect(() => {
    if (isDemo && !canAccessRoute(location.pathname, role)) {
      toast.error("You don't have permission to access that page.");
      navigate({
        to: "/app/dashboard"
      });
    }
  }, [location.pathname, role, navigate, isDemo]);
  useEffect(() => {
    if (!isDemo) {
      navigate({
        to: "/"
      });
    }
  }, [isDemo, navigate]);
  if (!isDemo) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsx(DemoBanner, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden w-[260px] shrink-0 border-r border-sidebar-border md:block", children: /* @__PURE__ */ jsx(Sidebar, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsx(Header, {}),
        /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 pb-20 md:p-8 md:pb-8", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(PageTransition, { routeKey: location.pathname, children: /* @__PURE__ */ jsx(Outlet, {}) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, {}),
    /* @__PURE__ */ jsx(ShortcutsHelpDialog, { open: helpOpen, onOpenChange: setHelpOpen })
  ] });
}
export {
  AppLayout as component
};
