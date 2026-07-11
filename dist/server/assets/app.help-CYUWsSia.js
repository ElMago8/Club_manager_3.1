import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useMemo } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { I as Input } from "./input-1VDOyvkz.js";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { t as cn } from "./router-Rtc38bRC.js";
import "@tanstack/react-router";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const FAQ_DATA = [
  {
    title: "Getting Started",
    items: [
      { question: "What is Cannabis Club Manager?", answer: "Cannabis Club Manager is an inventory management system that helps you track stock levels, manage suppliers, create purchase orders, and gain insights through analytics." },
      { question: "How do I enter demo mode?", answer: "Click 'Try Demo' on the landing page. Demo mode pre-loads sample data so you can explore all features without creating an account." },
      { question: "How do I navigate the app?", answer: "Use the sidebar (desktop) or bottom navigation bar (mobile) to switch between sections. Press CMD+K to open the command palette for quick search." },
      { question: "Can I reset demo data?", answer: "Yes! Go to Settings → System and click 'Reset Demo Data' to restore all sample data to its original state." },
      { question: "What roles are available?", answer: "Three roles: Admin (full access), Manager (can manage inventory and POs), and Requestor (can browse catalog and submit requests)." }
    ]
  },
  {
    title: "Inventory Management",
    items: [
      { question: "How do I add a new item?", answer: "Go to Catalog and click '+ New Item'. Fill in the name, SKU, category, and stock details. The SKU must be unique." },
      { question: "What do the stock status colors mean?", answer: "Green (In Stock): quantity above reorder point. Amber (Low Stock): quantity at or below reorder point. Red (Out of Stock): zero quantity." },
      { question: "How do I log a stock movement?", answer: "Go to Movements and click 'Log Movement'. Select the type (Received, Shipped, Adjusted, or Transferred), choose the item, and enter the quantity." },
      { question: "What is a reorder point?", answer: "The minimum quantity threshold that triggers a low-stock alert. When stock drops to or below this level, the item appears in 'Needs Attention'." },
      { question: "How do I bulk update items?", answer: "In the Catalog, select multiple items using checkboxes, then use the bulk action bar to update category, archive, or delete selected items." }
    ]
  },
  {
    title: "Purchase Orders",
    items: [
      { question: "How do I create a purchase order?", answer: "Go to Purchase Orders and click 'Create PO'. Select a supplier, add line items with quantities and costs, then submit." },
      { question: "What are PO statuses?", answer: "Draft (not yet sent), Submitted (sent to supplier), Partially Received (some items received), Fully Received (all items received), Cancelled." },
      { question: "How do I receive a shipment?", answer: "Open a submitted PO and click 'Receive Shipment'. Enter the quantities received for each line item. Stock is automatically updated." },
      { question: "Can I print a purchase order?", answer: "Yes, open the PO detail view and click the print icon. This generates a printable view with all order details." }
    ]
  },
  {
    title: "Reports & Analytics",
    items: [
      { question: "What reports are available?", answer: "Stock Overview (by category and status), Movement Trends (over time), Turnover Analysis, Supplier Performance scorecards, and Cost breakdowns." },
      { question: "Can I export data?", answer: "Yes, use the 'Export CSV' button on the Analytics page or the export button on data tables to download your data." },
      { question: "What are AI Insights?", answer: "AI-powered features including reorder suggestions based on demand patterns, anomaly detection for unusual movements, and natural language search." }
    ]
  },
  {
    title: "Account & Settings",
    items: [
      { question: "How do I manage users?", answer: "Admins can go to Settings → Users to invite new users, change roles, and deactivate accounts." },
      { question: "How do I change categories?", answer: "Go to Settings → Categories to add, rename, or delete categories. Items in a deleted category become uncategorized." },
      { question: "Where are notification preferences?", answer: "Click the bell icon in the header, then the gear icon to customize which notifications you receive." }
    ]
  }
];
function HelpPage() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return FAQ_DATA;
    return FAQ_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q))
    })).filter((cat) => cat.items.length > 0);
  }, [search]);
  const totalResults = filtered.reduce((sum, cat) => sum + cat.items.length, 0);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[800px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(HelpCircle, { className: "h-7 w-7 text-primary shrink-0" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Help Center" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Find answers to common questions about Cannabis Club Manager." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx(Input, { placeholder: "Search questions…", className: "h-10 pl-9", value: search, onChange: (e) => setSearch(e.target.value) })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-16 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
      'No matching questions for "',
      search,
      '"'
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      filtered.map((category) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: category.title }),
        /* @__PURE__ */ jsx(Accordion, { type: "multiple", className: "rounded-lg border border-border bg-card", children: category.items.map((item, i) => /* @__PURE__ */ jsxs(AccordionItem, { value: `${category.title}-${i}`, className: "border-border", children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { className: "px-4 py-3 text-sm font-medium text-foreground hover:no-underline", children: item.question }),
          /* @__PURE__ */ jsx(AccordionContent, { className: "px-4 pb-4 text-sm text-muted-foreground leading-relaxed", children: item.answer })
        ] }, i)) })
      ] }, category.title)),
      search && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
        totalResults,
        " result",
        totalResults !== 1 ? "s" : "",
        " found"
      ] })
    ] })
  ] });
}
export {
  HelpPage as component
};
