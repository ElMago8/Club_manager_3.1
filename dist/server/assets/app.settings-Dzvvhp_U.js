import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { toast } from "sonner";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-Dt8gr3JP.js";
import { C as Card, c as CardHeader, d as CardTitle, a as CardContent, B as Button } from "./router-Rtc38bRC.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Switch } from "./switch-CE8zHCZK.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import "@radix-ui/react-tabs";
import "@tanstack/react-router";
import "date-fns";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-select";
function SettingsPage() {
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1000px] space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground", children: "Configuración" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Parámetros visuales del club. Esta pantalla es demostrativa: los cambios no se persisten ni se sincronizan con backend." })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "club", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "w-full justify-start overflow-x-auto", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "club", children: "Datos del club" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "preferences", children: "Preferencias" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "security", children: "Seguridad futura" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "integrations", children: "Integraciones futuras" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx(TabsContent, { value: "club", children: /* @__PURE__ */ jsx(ClubSection, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "preferences", children: /* @__PURE__ */ jsx(PreferencesSection, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "security", children: /* @__PURE__ */ jsx(SecuritySection, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "integrations", children: /* @__PURE__ */ jsx(IntegrationsSection, {}) })
      ] })
    ] })
  ] });
}
function ClubSection() {
  const [form, setForm] = useState({
    name: "Hipnosis Cannabis Club",
    email: "contacto@hipnosis-demo.local",
    phone: "+54 11 5555 0100",
    address: "Av. Ficticia 1234, CABA · Argentina",
    admin: "Admin Club"
  });
  const upd = (k, v) => setForm((p) => ({
    ...p,
    [k]: v
  }));
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Datos del club" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Field, { label: "Nombre del club", children: /* @__PURE__ */ jsx(Input, { value: form.name, onChange: (e) => upd("name", e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Email de contacto", children: /* @__PURE__ */ jsx(Input, { type: "email", value: form.email, onChange: (e) => upd("email", e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Teléfono", children: /* @__PURE__ */ jsx(Input, { value: form.phone, onChange: (e) => upd("phone", e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Responsable administrativo", children: /* @__PURE__ */ jsx(Input, { value: form.admin, onChange: (e) => upd("admin", e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Dirección", className: "md:col-span-2", children: /* @__PURE__ */ jsx(Input, { value: form.address, onChange: (e) => upd("address", e.target.value) }) }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => toast.success("Datos guardados (demo, sin persistencia)."), children: "Guardar cambios" }) })
    ] })
  ] });
}
function PreferencesSection() {
  const [form, setForm] = useState({
    displayName: "Cannabis Club Manager",
    theme: "system",
    minStock: 10,
    alertDays: 7
  });
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Preferencias" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Field, { label: "Nombre visible del sistema", children: /* @__PURE__ */ jsx(Input, { value: form.displayName, onChange: (e) => setForm({
        ...form,
        displayName: e.target.value
      }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Tema visual", children: /* @__PURE__ */ jsxs(Select, { value: form.theme, onValueChange: (v) => setForm({
        ...form,
        theme: v
      }), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "system", children: "Automático (sistema)" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "light", children: "Claro" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "dark", children: "Oscuro" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Stock mínimo global", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 0, value: form.minStock, onChange: (e) => setForm({
        ...form,
        minStock: Number(e.target.value)
      }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Días de anticipación para alertas", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 1, value: form.alertDays, onChange: (e) => setForm({
        ...form,
        alertDays: Number(e.target.value)
      }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Unidad principal", children: /* @__PURE__ */ jsxs(Select, { value: "g", disabled: true, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectItem, { value: "g", children: "Gramos (g)" }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => toast.success("Preferencias guardadas (demo)."), children: "Guardar preferencias" }) })
    ] })
  ] });
}
function SecuritySection() {
  const items = [{
    title: "Autenticación en dos pasos (2FA)",
    desc: "Verificación adicional al iniciar sesión."
  }, {
    title: "Bloqueo por inactividad",
    desc: "Cerrar sesión automáticamente tras período sin uso."
  }, {
    title: "Exportaciones con contraseña",
    desc: "Proteger archivos exportados con clave."
  }, {
    title: "Backups cifrados",
    desc: "Resguardos periódicos cifrados de la información del club."
  }];
  return /* @__PURE__ */ jsx(FutureCard, { title: "Seguridad futura", items });
}
function IntegrationsSection() {
  const items = [{
    title: "ARCA / AFIP",
    desc: "Vinculación con organismos fiscales para registros formales."
  }, {
    title: "Backup externo",
    desc: "Resguardo automático a almacenamiento externo."
  }, {
    title: "Sincronización",
    desc: "Sincronización entre sedes o dispositivos."
  }, {
    title: "App de escritorio",
    desc: "Cliente nativo para Windows / macOS / Linux."
  }];
  return /* @__PURE__ */ jsx(FutureCard, { title: "Integraciones futuras", items });
}
function FutureCard({
  title,
  items
}) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
      title,
      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] bg-muted text-muted-foreground", children: "Disponible con backend" })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "divide-y divide-border", children: items.map((it) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: it.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: it.desc })
      ] }),
      /* @__PURE__ */ jsx(Switch, { checked: false, disabled: true, "aria-label": it.title })
    ] }, it.title)) })
  ] });
}
function Field({
  label,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: `space-y-1.5 ${className ?? ""}`, children: [
    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: label }),
    children
  ] });
}
export {
  SettingsPage as component
};
