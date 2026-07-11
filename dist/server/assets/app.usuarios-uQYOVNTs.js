import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, Minus } from "lucide-react";
import { u as useSortable, S as SortHead } from "./sort-head-mVg8fF94.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-B7cQkZzv.js";
import { B as Badge } from "./badge-CmGeK_0C.js";
import { B as Button, C as Card, c as CardHeader, d as CardTitle, a as CardContent } from "./router-Rtc38bRC.js";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, c as DialogFooter } from "./dialog-D_bA4dyy.js";
import { I as Input } from "./input-1VDOyvkz.js";
import { L as Label } from "./label-CoCKMbcU.js";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./select-jdEJVAJK.js";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-DqzdP08c.js";
import "./alert-dialog-CV3L0vss.js";
import "@radix-ui/react-alert-dialog";
import "class-variance-authority";
import "@tanstack/react-router";
import "date-fns";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const API_BASE = "http://localhost:4000/api";
function slugToAppRole(slug) {
  if (slug === "administrador") return "Administrador";
  if (slug === "operador") return "Operador";
  return "Auditor";
}
function mapApiUser(u) {
  const firstRole = u.roles[0];
  return {
    id: String(u.id),
    name: `${u.nombre}${u.apellido ? " " + u.apellido : ""}`,
    email: u.email ?? u.username,
    role: firstRole ? slugToAppRole(firstRole.slug) : "Auditor",
    status: u.estado === "activo" ? "active" : u.estado === "pendiente" ? "pending" : "inactive",
    lastAccessAt: u.ultimoLoginEn ?? u.creadoEn
  };
}
async function getAppUsers() {
  const res = await fetch(`${API_BASE}/users`, { signal: AbortSignal.timeout(3e3) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.map(mapApiUser);
}
async function createUser(payload) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return mapApiUser(await res.json());
}
async function updateUser(id, payload) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return mapApiUser(await res.json());
}
async function deactivateUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return mapApiUser(await res.json());
}
const ROLE_BADGE = {
  Administrador: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Operador: "bg-blue-100 text-blue-800 border-blue-200",
  Auditor: "bg-amber-100 text-amber-800 border-amber-200"
};
const MODULES = ["Dashboard", "Socios", "Productos / Stock", "Movimientos", "Alertas", "Usuarios", "Auditoría", "Configuración"];
const PERMS = ["Ver", "Crear", "Editar", "Exportar"];
function buildMatrix() {
  const all = (v) => Object.fromEntries(PERMS.map((p) => [p, v]));
  const admin = Object.fromEntries(MODULES.map((m) => [m, all(true)]));
  const operador = Object.fromEntries(MODULES.map((m) => {
    const restricted = m === "Usuarios" || m === "Auditoría" || m === "Configuración";
    return [m, {
      Ver: !restricted || m === "Auditoría",
      Crear: !restricted && m !== "Dashboard",
      Editar: !restricted && m !== "Dashboard",
      Exportar: !restricted
    }];
  }));
  const auditor = Object.fromEntries(MODULES.map((m) => [m, {
    Ver: true,
    Crear: false,
    Editar: false,
    Exportar: true
  }]));
  return {
    Administrador: admin,
    Operador: operador,
    Auditor: auditor
  };
}
const MATRIX = buildMatrix();
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}
const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "Operador",
  status: "active"
};
function appRoleToSlug(role) {
  if (role === "Administrador") return "administrador";
  if (role === "Operador") return "operador";
  return "auditor";
}
function appStatusToApi(status) {
  if (status === "active") return "activo";
  if (status === "pending") return "pendiente";
  return "inactivo";
}
function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return {
    nombre: parts[0] ?? "",
    apellido: ""
  };
  return {
    nombre: parts.slice(0, -1).join(" "),
    apellido: parts.at(-1) ?? ""
  };
}
function makeUserCode() {
  return `USR-${Date.now().toString().slice(-8)}`;
}
function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const {
    sorted,
    col: sCol,
    dir: sDir,
    toggle: sort
  } = useSortable(users);
  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === "active");
    return {
      activos: active.length,
      admins: active.filter((u) => u.role === "Administrador").length,
      operadores: active.filter((u) => u.role === "Operador").length,
      auditores: active.filter((u) => u.role === "Auditor").length,
      inactivos: users.filter((u) => u.status !== "active").length
    };
  }, [users]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  async function loadUsers() {
    setLoading(true);
    setLoadError(null);
    try {
      setUsers(await getAppUsers());
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudieron cargar usuarios.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void loadUsers();
  }, []);
  function openNew() {
    setForm(EMPTY_FORM);
    setNewOpen(true);
  }
  function openEdit(user) {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status
    });
    setEditTarget(user);
  }
  async function handleSaveNew() {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8) {
      toast.error("Completa nombre, email y una contrasena de al menos 8 caracteres.");
      return;
    }
    setSaving(true);
    try {
      const {
        nombre,
        apellido
      } = splitFullName(form.name);
      const saved = await createUser({
        codigoUsuario: makeUserCode(),
        username: form.email.trim(),
        nombre,
        apellido,
        email: form.email.trim(),
        password: form.password,
        estado: appStatusToApi(form.status),
        roleSlugs: [appRoleToSlug(form.role)]
      });
      setUsers((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      setNewOpen(false);
      setForm(EMPTY_FORM);
      toast.success("Usuario creado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el usuario.");
    } finally {
      setSaving(false);
    }
  }
  async function handleSaveEdit() {
    if (!editTarget || !form.name.trim() || !form.email.trim()) return;
    if (form.password && form.password.length < 8) {
      toast.error("La contrasena debe tener al menos 8 caracteres.");
      return;
    }
    setSaving(true);
    try {
      const {
        nombre,
        apellido
      } = splitFullName(form.name);
      const saved = await updateUser(Number(editTarget.id), {
        nombre,
        apellido,
        email: form.email.trim(),
        password: form.password || void 0,
        estado: appStatusToApi(form.status),
        roleSlugs: [appRoleToSlug(form.role)]
      });
      setUsers((current) => current.map((item) => item.id === saved.id ? saved : item));
      setEditTarget(null);
      setForm(EMPTY_FORM);
      toast.success("Usuario actualizado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el usuario.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const saved = await deactivateUser(Number(deleteTarget.id));
      setUsers((current) => current.map((item) => item.id === saved.id ? saved : item));
      setDeleteTarget(null);
      toast.success("Usuario desactivado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo desactivar el usuario.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1400px] space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Usuarios y Roles" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Gestión visual de usuarios internos y niveles de acceso." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: "gap-2", onClick: openNew, children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Nuevo usuario"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-5", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Usuarios activos", value: stats.activos }),
      /* @__PURE__ */ jsx(StatCard, { label: "Administradores", value: stats.admins }),
      /* @__PURE__ */ jsx(StatCard, { label: "Operadores", value: stats.operadores }),
      /* @__PURE__ */ jsx(StatCard, { label: "Auditores", value: stats.auditores }),
      /* @__PURE__ */ jsx(StatCard, { label: "Inactivos", value: stats.inactivos })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Equipo interno" }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        loadError ? /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: [
          "No se pudo conectar con usuarios reales: ",
          loadError
        ] }) : null,
        /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(SortHead, { label: "Nombre", sortKey: "name", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Email", sortKey: "email", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Rol", sortKey: "role", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Estado", sortKey: "status", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(SortHead, { label: "Último acceso", sortKey: "lastAccessAt", col: sCol, dir: sDir, onSort: sort }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsxs(TableBody, { children: [
            sorted.map((u) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: u.name }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: u.email }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: ROLE_BADGE[u.role], children: u.role }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: u.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground", children: u.status === "active" ? "Activo" : u.status === "pending" ? "Pendiente" : "Inactivo" }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: fmtDate(u.lastAccessAt) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(u), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "text-destructive hover:text-destructive", onClick: () => setDeleteTarget(u), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, u.id)),
            users.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "text-center text-muted-foreground py-8", children: loading ? "Cargando usuarios..." : "Sin usuarios cargados." }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Matriz de permisos por rol" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Vista resumida de permisos base cargados para roles internos." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: Object.keys(MATRIX).map((role) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: ROLE_BADGE[role], children: role }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-[220px]", children: "Módulo" }),
            PERMS.map((p) => /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: p }, p))
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: MODULES.map((m) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: m }),
            PERMS.map((p) => /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: MATRIX[role][m][p] ? /* @__PURE__ */ jsx(Check, { className: "mx-auto h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ jsx(Minus, { className: "mx-auto h-4 w-4 text-muted-foreground/40" }) }, p))
          ] }, m)) })
        ] }) })
      ] }, role)) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: newOpen, onOpenChange: (open) => {
      if (!saving) setNewOpen(open);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Nuevo usuario" }) }),
      /* @__PURE__ */ jsx(UserForm, { form, onChange: setForm }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setNewOpen(false), disabled: saving, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSaveNew, disabled: saving || !form.name.trim() || !form.email.trim() || form.password.length < 8, children: saving ? "Guardando…" : "Guardar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(editTarget), onOpenChange: (open) => {
      if (!saving && !open) setEditTarget(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Editar usuario" }) }),
      /* @__PURE__ */ jsx(UserForm, { form, onChange: setForm, isEditing: true }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setEditTarget(null), disabled: saving, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSaveEdit, disabled: saving || !form.name.trim() || !form.email.trim(), children: saving ? "Guardando…" : "Guardar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(DeleteConfirmDialog, { open: Boolean(deleteTarget), entityLabel: "usuario", itemName: deleteTarget?.name, onOpenChange: (open) => !open && setDeleteTarget(null), onConfirm: handleDelete })
  ] });
}
function UserForm({
  form,
  onChange,
  isEditing = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { children: "Nombre" }),
      /* @__PURE__ */ jsx(Input, { value: form.name, onChange: (e) => onChange({
        ...form,
        name: e.target.value
      }), placeholder: "Nombre completo" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { children: "Email" }),
      /* @__PURE__ */ jsx(Input, { type: "email", value: form.email, onChange: (e) => onChange({
        ...form,
        email: e.target.value
      }), placeholder: "usuario@ejemplo.com" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { children: isEditing ? "Nueva contrasena" : "Contrasena" }),
      /* @__PURE__ */ jsx(Input, { type: "password", value: form.password, onChange: (e) => onChange({
        ...form,
        password: e.target.value
      }), placeholder: isEditing ? "Opcional, minimo 8 caracteres" : "Minimo 8 caracteres" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { children: "Rol" }),
      /* @__PURE__ */ jsxs(Select, { value: form.role, onValueChange: (v) => onChange({
        ...form,
        role: v
      }), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "Administrador", children: "Administrador" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "Operador", children: "Operador" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "Auditor", children: "Auditor" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { children: "Estado" }),
      /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (v) => onChange({
        ...form,
        status: v
      }), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Activo" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pendiente" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: "Inactivo" })
        ] })
      ] })
    ] })
  ] });
}
function StatCard({
  label,
  value
}) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 font-mono text-2xl font-semibold", children: value })
  ] }) });
}
export {
  UsuariosPage as component
};
