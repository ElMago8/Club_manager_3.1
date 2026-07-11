import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { v as useDemo } from "./router-Rtc38bRC.js";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { t as tickerLogo, T as ThemeToggle } from "./ThemeToggle-2jtcJdtG.js";
import "react";
import "date-fns";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
function AccessPage() {
  const {
    enterDemoMode
  } = useDemo();
  const navigate = useNavigate();
  const handleEnterDemo = () => {
    enterDemoMode();
    navigate({
      to: "/app/dashboard"
    });
  };
  return /* @__PURE__ */ jsxs("main", { className: "relative min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-muted)_0%,_var(--color-background)_55%)]" }),
    /* @__PURE__ */ jsxs("header", { className: "mx-auto flex max-w-5xl items-center justify-between px-5 py-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("img", { src: tickerLogo, alt: "", "aria-hidden": "true", className: "h-[52px] w-[52px] shrink-0 object-contain" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "Cannabis Club Manager" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "hidden text-[11px] font-medium uppercase tracking-widest text-muted-foreground sm:inline", children: "Sistema interno" }),
        /* @__PURE__ */ jsx(ThemeToggle, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto flex max-w-md flex-col items-stretch px-5 pt-8 pb-16 sm:pt-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3" }),
          "Acceso restringido"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight sm:text-2xl", children: "Panel administrativo del club" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: "Gestión interna de socios, stock, movimientos, alertas y auditoría. Uso exclusivo del personal autorizado." }),
        /* @__PURE__ */ jsx("div", { className: "my-6 h-px bg-border" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "usuario", className: "block text-xs font-medium text-muted-foreground", children: "Usuario operativo" }),
          /* @__PURE__ */ jsx("input", { id: "usuario", type: "text", disabled: true, placeholder: "No disponible en demostración", className: "h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground placeholder:text-muted-foreground/70" }),
          /* @__PURE__ */ jsx("label", { htmlFor: "clave", className: "block text-xs font-medium text-muted-foreground", children: "Clave interna" }),
          /* @__PURE__ */ jsx("input", { id: "clave", type: "password", disabled: true, placeholder: "••••••••", className: "h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground placeholder:text-muted-foreground/70" })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleEnterDemo, className: "mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110", children: [
          "Ingresar al entorno de demostración",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-[11px] leading-relaxed text-muted-foreground", children: "Esta versión opera con datos ficticios. No procesa información real de socios ni de stock. La autenticación, auditoría persistente y la integración con organismos de control se incorporan en etapas posteriores." })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-[11px] text-muted-foreground", children: [
        "v0.1 · entorno de pruebas internas · ",
        (/* @__PURE__ */ new Date()).getFullYear()
      ] })
    ] })
  ] });
}
export {
  AccessPage as component
};
