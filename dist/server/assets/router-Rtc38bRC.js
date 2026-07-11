import { createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useCallback, useMemo, createContext, useContext, Component } from "react";
import { subMinutes, subHours, subDays } from "date-fns";
import { Toaster as Toaster$1 } from "sonner";
import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
var MovementType = /* @__PURE__ */ ((MovementType2) => {
  MovementType2["Received"] = "received";
  MovementType2["Shipped"] = "shipped";
  MovementType2["Adjusted"] = "adjusted";
  MovementType2["Transferred"] = "transferred";
  return MovementType2;
})(MovementType || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["Draft"] = "draft";
  OrderStatus2["Submitted"] = "submitted";
  OrderStatus2["Partial"] = "partial";
  OrderStatus2["Received"] = "received";
  OrderStatus2["Cancelled"] = "cancelled";
  return OrderStatus2;
})(OrderStatus || {});
var RequestStatus = /* @__PURE__ */ ((RequestStatus2) => {
  RequestStatus2["Pending"] = "pending";
  RequestStatus2["Approved"] = "approved";
  RequestStatus2["PartiallyFulfilled"] = "partially_fulfilled";
  RequestStatus2["Fulfilled"] = "fulfilled";
  RequestStatus2["Declined"] = "declined";
  RequestStatus2["Cancelled"] = "cancelled";
  return RequestStatus2;
})(RequestStatus || {});
var ItemStatus = /* @__PURE__ */ ((ItemStatus2) => {
  ItemStatus2["Active"] = "active";
  ItemStatus2["Discontinued"] = "discontinued";
  ItemStatus2["Archived"] = "archived";
  return ItemStatus2;
})(ItemStatus || {});
const ts$5 = (daysAgo) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};
const categories = [
  { id: "cat-fl", name: "Flores", description: "Flores secas por variedad y lote", parentId: null, createdAt: ts$5(180), updatedAt: ts$5(180) },
  { id: "cat-ac", name: "Aceites", description: "Aceites elaborados para uso terapéutico", parentId: null, createdAt: ts$5(180), updatedAt: ts$5(180) },
  { id: "cat-ex", name: "Extractos", description: "Extractos y resinas internas", parentId: null, createdAt: ts$5(180), updatedAt: ts$5(180) },
  { id: "cat-in", name: "Insumos", description: "Insumos para cultivo y elaboración", parentId: null, createdAt: ts$5(180), updatedAt: ts$5(180) },
  { id: "cat-ot", name: "Otros", description: "Materiales y elementos auxiliares", parentId: null, createdAt: ts$5(180), updatedAt: ts$5(180) }
];
const suppliers = [
  { id: "sup-01", name: "Cultivo Sala A", contactName: "Responsable cultivo A", email: "cultivo.a@hipnosis-demo.local", phone: "—", address: "Sala A · uso interno", leadTimeDays: 0, rating: 5, isActive: true, notes: "Cultivo propio del club", createdAt: ts$5(180), updatedAt: ts$5(20) },
  { id: "sup-02", name: "Cultivo Sala B", contactName: "Responsable cultivo B", email: "cultivo.b@hipnosis-demo.local", phone: "—", address: "Sala B · uso interno", leadTimeDays: 0, rating: 5, isActive: true, notes: "Cultivo propio del club", createdAt: ts$5(180), updatedAt: ts$5(15) },
  { id: "sup-03", name: "Elaboración interna", contactName: "Responsable elaboración", email: "elaboracion@hipnosis-demo.local", phone: "—", address: "Laboratorio interno", leadTimeDays: 0, rating: 5, isActive: true, notes: "Aceites y extractos elaborados internamente", createdAt: ts$5(180), updatedAt: ts$5(10) },
  { id: "sup-04", name: "Insumos generales", contactName: "Encargado insumos", email: "insumos@hipnosis-demo.local", phone: "—", address: "Depósito de insumos", leadTimeDays: 0, rating: 5, isActive: true, notes: "Material auxiliar y consumibles", createdAt: ts$5(180), updatedAt: ts$5(8) }
];
const locations = [
  { id: "loc-01", name: "Depósito Central", type: "warehouse", parentId: null, description: "Depósito principal del club", address: "Sede interna", isActive: true, createdAt: ts$5(180), updatedAt: ts$5(5) },
  { id: "loc-01-z1", name: "Sala Dispensa", type: "zone", parentId: "loc-01", description: "Zona de dispensa autorizada", address: "", isActive: true, createdAt: ts$5(160), updatedAt: ts$5(5) },
  { id: "loc-01-z2", name: "Zona Aceites y Extractos", type: "zone", parentId: "loc-01", description: "Almacenaje de aceites y extractos", address: "", isActive: true, createdAt: ts$5(160), updatedAt: ts$5(5) },
  { id: "loc-01-z1-a1", name: "Estante Flores", type: "aisle", parentId: "loc-01-z1", description: "Frascos por variedad y lote", address: "", isActive: true, createdAt: ts$5(150), updatedAt: ts$5(5) },
  { id: "loc-01-z1-a2", name: "Estante Aceites", type: "aisle", parentId: "loc-01-z2", description: "Aceites por concentración", address: "", isActive: true, createdAt: ts$5(150), updatedAt: ts$5(5) },
  { id: "loc-01-z2-a1", name: "Estante Insumos", type: "aisle", parentId: "loc-01-z2", description: "Frascos, etiquetas, material", address: "", isActive: true, createdAt: ts$5(150), updatedAt: ts$5(5) },
  { id: "loc-02", name: "Sala Cultivo A", type: "warehouse", parentId: null, description: "Sala de cultivo propio A", address: "Sede interna", isActive: true, createdAt: ts$5(180), updatedAt: ts$5(10) },
  { id: "loc-03", name: "Sala Cultivo B", type: "warehouse", parentId: null, description: "Sala de cultivo propio B", address: "Sede interna", isActive: true, createdAt: ts$5(180), updatedAt: ts$5(20) }
];
const ts$4 = (daysAgo) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};
const product = (idx, name, catId, srcId, locId, unit, stock, reorder, lot) => ({
  id: `prd-${String(idx).padStart(3, "0")}`,
  sku: lot,
  barcode: null,
  name,
  description: `${name} · uso interno del club`,
  categoryId: catId,
  status: ItemStatus.Active,
  unit,
  currentStock: stock,
  reorderPoint: reorder,
  reorderQuantity: reorder * 2,
  costPrice: 0,
  sellingPrice: 0,
  locationId: locId,
  supplierId: srcId,
  imageUrl: null,
  customFields: {},
  createdAt: ts$4(120),
  updatedAt: ts$4(Math.floor(Math.random() * 20))
});
const items = [
  // Flores — 8
  product(1, "Flor · Variedad Hipnosis", "cat-fl", "sup-01", "loc-01-z1-a1", "g", 420, 100, "LOT-FL-2026-001"),
  product(2, "Flor · Variedad Serena", "cat-fl", "sup-01", "loc-01-z1-a1", "g", 85, 100, "LOT-FL-2026-002"),
  product(3, "Flor · Variedad Aurora", "cat-fl", "sup-02", "loc-01-z1-a1", "g", 260, 80, "LOT-FL-2026-003"),
  product(4, "Flor · Variedad Boreal", "cat-fl", "sup-02", "loc-01-z1-a1", "g", 0, 80, "LOT-FL-2026-004"),
  product(5, "Flor · Variedad Lumen", "cat-fl", "sup-01", "loc-01-z1-a1", "g", 175, 60, "LOT-FL-2026-005"),
  product(6, "Flor · Variedad Bruma", "cat-fl", "sup-02", "loc-01-z1-a1", "g", 38, 60, "LOT-FL-2026-006"),
  product(7, "Flor · Variedad Calima", "cat-fl", "sup-01", "loc-01-z1-a1", "g", 310, 90, "LOT-FL-2026-007"),
  product(8, "Flor · Variedad Solsticio", "cat-fl", "sup-02", "loc-01-z1-a1", "g", 0, 60, "LOT-FL-2026-008"),
  // Aceites — 5
  product(9, "Aceite Base 10mg/ml", "cat-ac", "sup-03", "loc-01-z1-a2", "ml", 2400, 800, "LOT-AC-2026-001"),
  product(10, "Aceite Equilibrado 20mg/ml", "cat-ac", "sup-03", "loc-01-z1-a2", "ml", 950, 600, "LOT-AC-2026-002"),
  product(11, "Aceite Nocturno 30mg/ml", "cat-ac", "sup-03", "loc-01-z1-a2", "ml", 420, 500, "LOT-AC-2026-003"),
  product(12, "Aceite Diurno 15mg/ml", "cat-ac", "sup-03", "loc-01-z1-a2", "ml", 1180, 600, "LOT-AC-2026-004"),
  product(13, "Aceite Reserva 40mg/ml", "cat-ac", "sup-03", "loc-01-z1-a2", "ml", 0, 300, "LOT-AC-2026-005"),
  // Extractos — 3
  product(14, "Extracto Resina · Lote 01", "cat-ex", "sup-03", "loc-01-z2", "g", 48, 25, "LOT-EX-2026-001"),
  product(15, "Extracto Resina · Lote 02", "cat-ex", "sup-03", "loc-01-z2", "g", 12, 25, "LOT-EX-2026-002"),
  product(16, "Extracto Hash interno", "cat-ex", "sup-03", "loc-01-z2", "g", 0, 20, "LOT-EX-2026-003"),
  // Insumos — 3
  product(17, "Frascos vidrio 30ml", "cat-in", "sup-04", "loc-01-z2-a1", "u", 540, 150, "LOT-IN-2026-001"),
  product(18, "Etiquetas trazabilidad", "cat-in", "sup-04", "loc-01-z2-a1", "u", 90, 200, "LOT-IN-2026-002"),
  product(19, "Bolsas selladas pequeñas", "cat-in", "sup-04", "loc-01-z2-a1", "u", 320, 200, "LOT-IN-2026-003"),
  // Otros — 1
  product(20, "Material auxiliar de sala", "cat-ot", "sup-04", "loc-01-z2-a1", "u", 65, 30, "LOT-OT-2026-001")
];
const ts$3 = (daysAgo, hour = 10) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const types = [MovementType.Received, MovementType.Shipped, MovementType.Adjusted];
const movementReasons = {
  [MovementType.Received]: ["Cosecha", "Entrada interna", "Reposición desde sala"],
  [MovementType.Shipped]: ["Dispensa autorizada", "Dispensa a socio", "Dispensa programada"],
  [MovementType.Adjusted]: ["Ajuste de inventario", "Merma registrada", "Reconciliación"],
  [MovementType.Transferred]: ["Traslado entre salas"]
};
const operators = ["op.lucia", "op.matias", "op.romina", "admin.club"];
function generateMovements() {
  const movements = [];
  for (let i = 0; i < 80; i++) {
    const daysAgo = Math.floor(i / 80 * 35);
    const hour = 9 + i % 9;
    const itemIdx = i % items.length;
    const type = types[i % 3];
    const baseQty = type === MovementType.Shipped ? -(1 + i % 5) : 5 + i % 25;
    const qty = type === MovementType.Adjusted && i % 2 === 0 ? -Math.abs(baseQty) : baseQty;
    const reasons = movementReasons[type];
    const reason = reasons[i % reasons.length];
    movements.push({
      id: `mov-${String(i + 1).padStart(3, "0")}`,
      itemId: items[itemIdx].id,
      type,
      quantity: qty,
      fromLocationId: type === MovementType.Shipped ? "loc-01-z1" : null,
      toLocationId: type === MovementType.Received ? "loc-01" : null,
      reference: `MOV-${String(2026e3 + i)}`,
      notes: reason,
      performedBy: operators[i % operators.length],
      createdAt: ts$3(daysAgo, hour)
    });
  }
  return movements;
}
function generatePurchaseOrders() {
  const mk = (items2) => items2.reduce((s, i) => s + i.quantityOrdered * i.unitCost, 0);
  const po1 = [
    { id: "poi-01", purchaseOrderId: "po-01", itemId: "prd-017", quantityOrdered: 200, quantityReceived: 0, unitCost: 0 },
    { id: "poi-02", purchaseOrderId: "po-01", itemId: "prd-018", quantityOrdered: 300, quantityReceived: 0, unitCost: 0 }
  ];
  const po2 = [
    { id: "poi-03", purchaseOrderId: "po-02", itemId: "prd-019", quantityOrdered: 250, quantityReceived: 250, unitCost: 0 }
  ];
  return [
    {
      id: "po-01",
      orderNumber: "REP-2026-001",
      supplierId: "sup-04",
      status: OrderStatus.Submitted,
      items: po1,
      totalCost: mk(po1),
      expectedDelivery: ts$3(-3),
      notes: "Reposición interna de insumos",
      createdBy: "admin.club",
      createdAt: ts$3(4),
      updatedAt: ts$3(2)
    },
    {
      id: "po-02",
      orderNumber: "REP-2026-002",
      supplierId: "sup-04",
      status: OrderStatus.Received,
      items: po2,
      totalCost: mk(po2),
      expectedDelivery: ts$3(10),
      notes: "Reposición de bolsas selladas",
      createdBy: "admin.club",
      createdAt: ts$3(15),
      updatedAt: ts$3(9)
    }
  ];
}
function generateRequests() {
  const mkItems = (rid, ids) => ids.map((itemId, i) => ({
    id: `ri-${rid}-${i + 1}`,
    requestId: rid,
    itemId,
    quantity: 5 + i * 2,
    notes: ""
  }));
  return [
    {
      id: "req-01",
      requestNumber: "SOL-2026-001",
      title: "Solicitud interna · insumos para dispensa",
      status: RequestStatus.Pending,
      priority: "normal",
      items: mkItems("req-01", ["prd-017", "prd-018"]),
      requestedBy: "op.lucia",
      approvedBy: null,
      reason: "Reposición de frascos y etiquetas para próxima dispensa",
      createdAt: ts$3(2),
      updatedAt: ts$3(2)
    },
    {
      id: "req-02",
      requestNumber: "SOL-2026-002",
      title: "Solicitud interna · traslado desde Sala Cultivo",
      status: RequestStatus.Approved,
      priority: "normal",
      items: mkItems("req-02", ["prd-001", "prd-005"]),
      requestedBy: "op.matias",
      approvedBy: "admin.club",
      reason: "Traslado de flores curadas a depósito",
      createdAt: ts$3(6),
      updatedAt: ts$3(4)
    }
  ];
}
function generateNotifications() {
  const now = /* @__PURE__ */ new Date();
  return [
    {
      id: "notif-001",
      type: "zero_stock",
      title: "Sin stock: Flor · Variedad Boreal",
      message: "Lote LOT-FL-2026-004 quedó en 0 g. Programar reposición desde Sala Cultivo.",
      isRead: false,
      link: "/app/catalog?item=prd-004",
      referenceId: "prd-004",
      createdAt: subMinutes(now, 25).toISOString()
    },
    {
      id: "notif-002",
      type: "low_stock",
      title: "Stock bajo: Flor · Variedad Serena",
      message: "Lote LOT-FL-2026-002 está en 85 g, por debajo del mínimo (100 g).",
      isRead: false,
      link: "/app/catalog?item=prd-002",
      referenceId: "prd-002",
      createdAt: subHours(now, 2).toISOString()
    },
    {
      id: "notif-003",
      type: "low_stock",
      title: "Stock bajo: Aceite Nocturno 30mg/ml",
      message: "Lote LOT-AC-2026-003 está en 420 ml, por debajo del mínimo (500 ml).",
      isRead: false,
      link: "/app/catalog?item=prd-011",
      referenceId: "prd-011",
      createdAt: subHours(now, 6).toISOString()
    },
    {
      id: "notif-004",
      type: "low_stock",
      title: "Stock bajo: Extracto Resina · Lote 02",
      message: "Lote LOT-EX-2026-002 está en 12 g, por debajo del mínimo (25 g).",
      isRead: true,
      link: "/app/catalog?item=prd-015",
      referenceId: "prd-015",
      createdAt: subDays(now, 1).toISOString()
    },
    {
      id: "notif-005",
      type: "system",
      title: "Credencial próxima a vencer",
      message: "La credencial HC-0014 vence en menos de 15 días. Revisar documentación del socio.",
      isRead: true,
      link: "/app/socios",
      referenceId: "mem-014",
      createdAt: subDays(now, 2).toISOString()
    },
    {
      id: "notif-006",
      type: "low_stock",
      title: "Stock bajo: Etiquetas trazabilidad",
      message: "Lote LOT-IN-2026-002 está en 90 u, por debajo del mínimo (200 u).",
      isRead: false,
      link: "/app/catalog?item=prd-018",
      referenceId: "prd-018",
      createdAt: subHours(now, 4).toISOString()
    },
    {
      id: "notif-007",
      type: "system",
      title: "Bienvenido a Cannabis Club Manager",
      message: "Tu entorno administrativo está listo. Revisá el dashboard para comenzar.",
      isRead: true,
      link: "/app/dashboard",
      referenceId: null,
      createdAt: subDays(now, 5).toISOString()
    }
  ];
}
const ts$2 = (daysAgo) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};
const tsFuture = (daysAhead) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
};
const firstNames = [
  "Lucía",
  "Mateo",
  "Sofía",
  "Bruno",
  "Camila",
  "Joaquín",
  "Renata",
  "Tomás",
  "Valentina",
  "Ignacio",
  "Martina",
  "Lautaro",
  "Julieta",
  "Facundo",
  "Catalina",
  "Nicolás",
  "Florencia",
  "Agustín",
  "Paula",
  "Ramiro",
  "Antonia",
  "Federico",
  "Micaela",
  "Gonzalo",
  "Delfina",
  "Emilio",
  "Rocío",
  "Iván",
  "Ariana",
  "Diego",
  "Brenda",
  "Lucas",
  "Carla",
  "Hernán"
];
const lastNames = [
  "Aguirre",
  "Benítez",
  "Cabrera",
  "Domínguez",
  "Escudero",
  "Funes",
  "Gómez",
  "Herrera",
  "Iriarte",
  "Juárez",
  "Krause",
  "Linares",
  "Molina",
  "Navarro",
  "Ortega",
  "Paz",
  "Quiroga",
  "Ramírez",
  "Suárez",
  "Torres",
  "Ulloa",
  "Vargas",
  "Wagner",
  "Ximénez",
  "Yáñez",
  "Zelaya",
  "Báez",
  "Castro",
  "Delgado",
  "Estévez",
  "Falcón",
  "Gallardo",
  "Heredia",
  "Ibarra"
];
const statuses = ["active", "active", "active", "active", "active", "pending", "suspended", "inactive"];
const notesPool = [
  "",
  "Renovación de credencial en proceso.",
  "Documentación médica revisada por auditoría.",
  "Cupo ajustado por indicación del responsable.",
  "Socio activo desde el inicio del club.",
  ""
];
function generateMembers() {
  const members = [];
  for (let i = 0; i < 36; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i * 3 % lastNames.length];
    const status = statuses[i % statuses.length];
    const monthlyQuota = [30, 40, 50, 60, 80][i % 5];
    const usage = status === "active" ? Math.floor(monthlyQuota * (i % 10 / 10)) : 0;
    const credentialCode = `HC-${String(i + 1).padStart(4, "0")}`;
    const dni = `${2e7 + i * 137493}`.slice(0, 8);
    members.push({
      id: `mem-${String(i + 1).padStart(3, "0")}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      dni,
      credentialCode,
      status,
      monthlyQuotaGrams: monthlyQuota,
      currentMonthUsageGrams: usage,
      registrationDate: ts$2(30 + i * 9),
      reprocannExpirationDate: tsFuture(i * 23 % 240 - 30),
      medicalDocumentExpirationDate: tsFuture(i * 17 % 200 - 20),
      phone: `+54 9 11 ${String(4e3 + i * 11).slice(0, 4)}-${String(1e3 + i * 37).slice(0, 4)}`,
      email: `socio${String(i + 1).padStart(3, "0")}@hipnosis-demo.local`,
      notes: notesPool[i % notesPool.length]
    });
  }
  return members;
}
const ts$1 = (daysAgo, hour = 10, min = 0) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};
const templates = [
  { action: "Inicio de sesión", module: "Sistema", entityType: "Sesión", entityName: "admin.club", detail: "Acceso desde panel interno.", level: "informativo", role: "Administrador", user: "admin.club" },
  { action: "Registro de dispensa", module: "Movimientos", entityType: "Movimiento", entityName: "MOV-2026001", detail: "Dispensa autorizada a socio HC-0007.", level: "informativo", role: "Operador", user: "op.lucia" },
  { action: "Registro de cosecha", module: "Movimientos", entityType: "Movimiento", entityName: "MOV-2026014", detail: "Entrada de 320 g desde Sala Cultivo A.", level: "informativo", role: "Operador", user: "op.matias" },
  { action: "Ajuste de stock", module: "Productos", entityType: "Producto", entityName: "LOT-FL-2026-002", detail: "Ajuste de -8 g registrado tras reconciliación.", level: "medio", role: "Operador", user: "op.romina" },
  { action: "Merma registrada", module: "Movimientos", entityType: "Movimiento", entityName: "MOV-2026032", detail: "Merma de 4 g en Lote LOT-FL-2026-006.", level: "medio", role: "Operador", user: "op.lucia" },
  { action: "Alta de socio", module: "Socios", entityType: "Socio", entityName: "HC-0033", detail: "Nuevo socio dado de alta con cupo de 40 g.", level: "informativo", role: "Administrador", user: "admin.club" },
  { action: "Suspensión de socio", module: "Socios", entityType: "Socio", entityName: "HC-0009", detail: "Socio suspendido por documentación vencida.", level: "critico", role: "Administrador", user: "admin.club" },
  { action: "Actualización de cupo", module: "Socios", entityType: "Socio", entityName: "HC-0012", detail: "Cupo mensual ajustado de 40 g a 60 g.", level: "medio", role: "Administrador", user: "admin.club" },
  { action: "Resolución de alerta", module: "Alertas", entityType: "Alerta", entityName: "Stock bajo · Aceite Nocturno", detail: "Alerta marcada como resuelta tras reposición.", level: "informativo", role: "Operador", user: "op.matias" },
  { action: "Consulta de auditoría", module: "Auditoría", entityType: "Reporte", entityName: "Reporte mensual", detail: "Exportación de bitácora del mes.", level: "informativo", role: "Auditor", user: "audit.club" },
  { action: "Cambio de configuración", module: "Configuración", entityType: "Parámetro", entityName: "Mínimo por defecto", detail: "Stock mínimo por defecto actualizado.", level: "medio", role: "Administrador", user: "admin.club" },
  { action: "Alta de usuario", module: "Usuarios", entityType: "Usuario", entityName: "op.romina", detail: "Nuevo operador habilitado.", level: "medio", role: "Administrador", user: "admin.club" }
];
function generateAudit() {
  const entries = [];
  for (let i = 0; i < 40; i++) {
    const t = templates[i % templates.length];
    const daysAgo = Math.floor(i / 40 * 28);
    const hour = 9 + i % 9;
    const min = i * 7 % 60;
    entries.push({
      id: `aud-${String(i + 1).padStart(3, "0")}`,
      timestamp: ts$1(daysAgo, hour, min),
      user: t.user,
      role: t.role,
      action: t.action,
      module: t.module,
      entityType: t.entityType,
      entityName: t.entityName,
      detail: t.detail,
      level: t.level
    });
  }
  return entries;
}
const ts = (daysAgo, hour = 10) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
function generateAppUsers() {
  return [
    { id: "usr-01", name: "Admin Club", email: "admin.club@hipnosis-demo.local", role: "Administrador", status: "active", lastAccessAt: ts(0, 9) },
    { id: "usr-02", name: "Lucía Operadora", email: "op.lucia@hipnosis-demo.local", role: "Operador", status: "active", lastAccessAt: ts(0, 11) },
    { id: "usr-03", name: "Matías Operador", email: "op.matias@hipnosis-demo.local", role: "Operador", status: "active", lastAccessAt: ts(1, 14) },
    { id: "usr-04", name: "Romina Operadora", email: "op.romina@hipnosis-demo.local", role: "Operador", status: "active", lastAccessAt: ts(2, 16) },
    { id: "usr-05", name: "Auditoría Club", email: "audit.club@hipnosis-demo.local", role: "Auditor", status: "active", lastAccessAt: ts(3, 10) },
    { id: "usr-06", name: "Operador Suplente", email: "op.suplente@hipnosis-demo.local", role: "Operador", status: "inactive", lastAccessAt: ts(45, 12) }
  ];
}
const DEFAULT_NOTIFICATION_PREFS = {
  low_stock: true,
  zero_stock: true,
  po_reminder: true,
  po_overdue: true,
  request_update: true
};
function generateSeedData() {
  return {
    categories: [...categories],
    items: items.map((i) => ({ ...i })),
    suppliers: [...suppliers],
    locations: [...locations],
    movements: generateMovements(),
    purchaseOrders: generatePurchaseOrders(),
    requests: generateRequests(),
    notifications: generateNotifications(),
    notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
    members: generateMembers(),
    audit: generateAudit(),
    appUsers: generateAppUsers()
  };
}
const SEED_USERS = [
  { id: "user-01", name: "Admin Club", email: "admin.club@hipnosis-demo.local", role: "admin", status: "active", joinedAt: new Date(Date.now() - 180 * 864e5).toISOString() },
  { id: "user-02", name: "Lucía Operadora", email: "op.lucia@hipnosis-demo.local", role: "manager", status: "active", joinedAt: new Date(Date.now() - 120 * 864e5).toISOString() },
  { id: "user-03", name: "Matías Operador", email: "op.matias@hipnosis-demo.local", role: "manager", status: "active", joinedAt: new Date(Date.now() - 90 * 864e5).toISOString() },
  { id: "user-04", name: "Romina Operadora", email: "op.romina@hipnosis-demo.local", role: "manager", status: "active", joinedAt: new Date(Date.now() - 60 * 864e5).toISOString() },
  { id: "user-05", name: "Auditoría Club", email: "audit.club@hipnosis-demo.local", role: "requestor", status: "active", joinedAt: new Date(Date.now() - 45 * 864e5).toISOString() }
];
class DemoStore {
  data;
  version = 0;
  users = SEED_USERS.map((u) => ({ ...u }));
  constructor() {
    this.data = generateSeedData();
  }
  getVersion() {
    return this.version;
  }
  reset() {
    this.data = generateSeedData();
    this.users = SEED_USERS.map((u) => ({ ...u }));
    this.version++;
  }
  // ─── Users ─────────────────────────────────────────────
  getUsers() {
    return [...this.users];
  }
  addUser(user) {
    this.users.push(user);
    this.version++;
  }
  updateUser(id, updates) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.version++;
    }
  }
  getAdminCount() {
    return this.users.filter((u) => u.role === "admin" && u.status === "active").length;
  }
  // ─── Categories ────────────────────────────────────────
  getCategories() {
    return this.data.categories;
  }
  createCategory(category) {
    this.data.categories.push(category);
    this.version++;
    return category;
  }
  updateCategory(id, updates) {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return void 0;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.version++;
    return this.data.categories[idx];
  }
  deleteCategory(id) {
    const len = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    for (const item of this.data.items) {
      if (item.categoryId === id) item.categoryId = null;
    }
    if (this.data.categories.length < len) {
      this.version++;
      return true;
    }
    return false;
  }
  // ─── Settings (reorder defaults) ──────────────────────
  reorderDefaults = { reorderPoint: 10, leadTimeDays: 7, safetyMultiplier: 1.5, orderQuantity: 25 };
  getReorderDefaults() {
    return { ...this.reorderDefaults };
  }
  setReorderDefaults(defaults) {
    this.reorderDefaults = { ...defaults };
    this.version++;
  }
  // ─── Custom Field Definitions ─────────────────────────
  customFieldDefs = [];
  getCustomFieldDefs() {
    return [...this.customFieldDefs];
  }
  addCustomFieldDef(def) {
    this.customFieldDefs.push(def);
    this.version++;
  }
  updateCustomFieldDef(id, updates) {
    const idx = this.customFieldDefs.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.customFieldDefs[idx] = { ...this.customFieldDefs[idx], ...updates };
      this.version++;
    }
  }
  deleteCustomFieldDef(id) {
    this.customFieldDefs = this.customFieldDefs.filter((d) => d.id !== id);
    this.version++;
  }
  reorderCustomFieldDefs(ids) {
    const map = new Map(this.customFieldDefs.map((d) => [d.id, d]));
    this.customFieldDefs = ids.map((id) => map.get(id)).filter(Boolean);
    this.version++;
  }
  // ─── Items ─────────────────────────────────────────────
  getItems(filters) {
    let result = this.data.items;
    if (filters?.categoryId) result = result.filter((i) => i.categoryId === filters.categoryId);
    if (filters?.supplierId) result = result.filter((i) => i.supplierId === filters.supplierId);
    if (filters?.locationId) result = result.filter((i) => i.locationId === filters.locationId);
    if (filters?.status) result = result.filter((i) => i.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    return result;
  }
  getItemById(id) {
    return this.data.items.find((i) => i.id === id);
  }
  createItem(item) {
    this.data.items.push(item);
    this.version++;
    return item;
  }
  updateItem(id, updates) {
    const idx = this.data.items.findIndex((i) => i.id === id);
    if (idx === -1) return void 0;
    this.data.items[idx] = { ...this.data.items[idx], ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.version++;
    return this.data.items[idx];
  }
  deleteItem(id) {
    const len = this.data.items.length;
    this.data.items = this.data.items.filter((i) => i.id !== id);
    if (this.data.items.length < len) {
      this.version++;
      return true;
    }
    return false;
  }
  getStockSummary() {
    const items2 = this.data.items;
    return {
      total: items2.length,
      inStock: items2.filter((i) => i.currentStock > i.reorderPoint).length,
      lowStock: items2.filter((i) => i.currentStock > 0 && i.currentStock <= i.reorderPoint).length,
      outOfStock: items2.filter((i) => i.currentStock === 0).length
    };
  }
  // ─── Movements ─────────────────────────────────────────
  getMovements() {
    return this.data.movements;
  }
  getRecentMovements(limit) {
    return [...this.data.movements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
  }
  createMovement(movement) {
    this.data.movements.push(movement);
    const item = this.data.items.find((i) => i.id === movement.itemId);
    if (item) {
      if (movement.type === MovementType.Received) {
        item.currentStock += Math.abs(movement.quantity);
      } else if (movement.type === MovementType.Shipped) {
        item.currentStock = Math.max(0, item.currentStock - Math.abs(movement.quantity));
      } else if (movement.type === MovementType.Adjusted) {
        item.currentStock = Math.max(0, item.currentStock + movement.quantity);
      } else if (movement.type === MovementType.Transferred) {
        if (movement.toLocationId) {
          item.locationId = movement.toLocationId;
        }
      }
    }
    this.version++;
    return movement;
  }
  // ─── Suppliers ─────────────────────────────────────────
  getSuppliers() {
    return this.data.suppliers;
  }
  getSupplierById(id) {
    return this.data.suppliers.find((s) => s.id === id);
  }
  createSupplier(supplier) {
    this.data.suppliers.push(supplier);
    this.version++;
    return supplier;
  }
  updateSupplier(id, updates) {
    const idx = this.data.suppliers.findIndex((s) => s.id === id);
    if (idx === -1) return void 0;
    this.data.suppliers[idx] = { ...this.data.suppliers[idx], ...updates };
    this.version++;
    return this.data.suppliers[idx];
  }
  deleteSupplier(id) {
    const len = this.data.suppliers.length;
    this.data.suppliers = this.data.suppliers.filter((s) => s.id !== id);
    if (this.data.suppliers.length < len) {
      this.version++;
      return true;
    }
    return false;
  }
  // ─── Locations ─────────────────────────────────────────
  getLocations() {
    return this.data.locations;
  }
  getLocationById(id) {
    return this.data.locations.find((l) => l.id === id);
  }
  createLocation(location) {
    this.data.locations.push(location);
    this.version++;
    return location;
  }
  updateLocation(id, updates) {
    const idx = this.data.locations.findIndex((l) => l.id === id);
    if (idx === -1) return void 0;
    this.data.locations[idx] = { ...this.data.locations[idx], ...updates };
    this.version++;
    return this.data.locations[idx];
  }
  deleteLocation(id) {
    const len = this.data.locations.length;
    this.data.locations = this.data.locations.filter((l) => l.id !== id);
    if (this.data.locations.length < len) {
      this.version++;
      return true;
    }
    return false;
  }
  // ─── Purchase Orders ───────────────────────────────────
  getPurchaseOrders() {
    return this.data.purchaseOrders;
  }
  getPurchaseOrderById(id) {
    return this.data.purchaseOrders.find((po) => po.id === id);
  }
  createPurchaseOrder(po) {
    this.data.purchaseOrders.push(po);
    this.version++;
    return po;
  }
  updatePurchaseOrder(id, updates) {
    const idx = this.data.purchaseOrders.findIndex((po) => po.id === id);
    if (idx === -1) return void 0;
    this.data.purchaseOrders[idx] = { ...this.data.purchaseOrders[idx], ...updates };
    this.version++;
    return this.data.purchaseOrders[idx];
  }
  deletePurchaseOrder(id) {
    const idx = this.data.purchaseOrders.findIndex((po) => po.id === id);
    if (idx === -1) return false;
    this.data.purchaseOrders.splice(idx, 1);
    this.version++;
    return true;
  }
  // ─── Requests ──────────────────────────────────────────
  getRequests() {
    return this.data.requests;
  }
  getRequestById(id) {
    return this.data.requests.find((r) => r.id === id);
  }
  createRequest(request) {
    this.data.requests.push(request);
    this.version++;
    return request;
  }
  updateRequest(id, updates) {
    const idx = this.data.requests.findIndex((r) => r.id === id);
    if (idx === -1) return void 0;
    this.data.requests[idx] = { ...this.data.requests[idx], ...updates };
    this.version++;
    return this.data.requests[idx];
  }
  // ─── Notifications ────────────────────────────────────
  getNotifications() {
    return [...this.data.notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  getUnreadCount() {
    return this.data.notifications.filter((n) => !n.isRead).length;
  }
  markAsRead(id) {
    const n = this.data.notifications.find((n2) => n2.id === id);
    if (n) {
      n.isRead = true;
      this.version++;
    }
  }
  markAllAsRead() {
    this.data.notifications.forEach((n) => {
      n.isRead = true;
    });
    this.version++;
  }
  dismissNotification(id) {
    this.data.notifications = this.data.notifications.filter((n) => n.id !== id);
    this.version++;
  }
  addNotification(notification) {
    this.data.notifications.push(notification);
    this.version++;
  }
  // ─── Notification Preferences ─────────────────────────
  getNotificationPrefs() {
    return this.data.notificationPrefs;
  }
  setNotificationPrefs(prefs) {
    this.data.notificationPrefs = { ...prefs };
    this.version++;
  }
  // ─── Cannabis Club Manager · Socios ───────────────────
  getMembers() {
    return [...this.data.members];
  }
  getMemberById(id) {
    return this.data.members.find((m) => m.id === id);
  }
  createMember(member) {
    this.data.members.push(member);
    this.version++;
    return member;
  }
  updateMember(id, updates) {
    const idx = this.data.members.findIndex((m) => m.id === id);
    if (idx === -1) return void 0;
    this.data.members[idx] = { ...this.data.members[idx], ...updates };
    this.version++;
    return this.data.members[idx];
  }
  deleteMember(id) {
    const len = this.data.members.length;
    this.data.members = this.data.members.filter((m) => m.id !== id);
    if (this.data.members.length < len) {
      this.version++;
      return true;
    }
    return false;
  }
  // ─── Cannabis Club Manager · Auditoría ────────────────
  getAuditEntries() {
    return [...this.data.audit].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  addAuditEntry(entry) {
    this.data.audit.push(entry);
    this.version++;
  }
  // ─── Cannabis Club Manager · Usuarios del sistema ─────
  getAppUsers() {
    return [...this.data.appUsers];
  }
  addAppUser(user) {
    this.data.appUsers.push(user);
    this.version++;
  }
  updateAppUser(id, updates) {
    const idx = this.data.appUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.appUsers[idx] = { ...this.data.appUsers[idx], ...updates };
      this.version++;
    }
  }
  deleteAppUser(id) {
    this.data.appUsers = this.data.appUsers.filter((u) => u.id !== id);
    this.version++;
  }
}
const DemoContext = createContext(null);
function DemoProvider({ children }) {
  const [store, setStore] = useState(null);
  const [version, setVersion] = useState(0);
  const enterDemoMode = useCallback(() => {
    const s = new DemoStore();
    setStore(s);
    setVersion(0);
  }, []);
  const exitDemoMode = useCallback(() => {
    setStore(null);
    setVersion(0);
  }, []);
  const resetDemoData = useCallback(() => {
    if (store) {
      store.reset();
      setVersion((v) => v + 1);
    }
  }, [store]);
  const bumpVersion = useCallback(() => setVersion((v) => v + 1), []);
  const value = useMemo(
    () => ({
      isDemo: store !== null,
      demoStore: store,
      enterDemoMode,
      exitDemoMode,
      resetDemoData,
      bumpVersion,
      version
    }),
    [store, enterDemoMode, exitDemoMode, resetDemoData, bumpVersion, version]
  );
  return /* @__PURE__ */ jsx(DemoContext.Provider, { value, children });
}
function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within a <DemoProvider>. Wrap your app in <DemoProvider>.");
  }
  return ctx;
}
const ROLE_PERMISSIONS = {
  admin: {
    canManageItems: true,
    canLogMovements: true,
    canManagePOs: true,
    canManageSuppliers: true,
    canApproveRequests: true,
    canViewAnalytics: true,
    canAccessSettings: true,
    canManageUsers: true
  },
  manager: {
    canManageItems: true,
    canLogMovements: true,
    canManagePOs: true,
    canManageSuppliers: true,
    canApproveRequests: true,
    canViewAnalytics: true,
    canAccessSettings: false,
    canManageUsers: false
  },
  requestor: {
    canManageItems: false,
    canLogMovements: false,
    canManagePOs: false,
    canManageSuppliers: false,
    canApproveRequests: false,
    canViewAnalytics: false,
    canAccessSettings: false,
    canManageUsers: false
  }
};
function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role];
}
const RoleContext = createContext(null);
function RoleProvider({ children }) {
  const { isDemo } = useDemo();
  const [demoRole, setDemoRole] = useState("admin");
  const role = isDemo ? demoRole : "requestor";
  const value = useMemo(() => {
    const permissions = getPermissionsForRole(role);
    return {
      role,
      permissions,
      isAdmin: role === "admin",
      isManager: role === "manager",
      isRequestor: role === "requestor",
      setDemoRole
    };
  }, [role]);
  return /* @__PURE__ */ jsx(RoleContext.Provider, { value, children });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-card shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-xs",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  handleReload = () => {
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      const isDev = false;
      return /* @__PURE__ */ jsx(Card, { className: this.props.fallbackClassName, children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-10 px-4 text-center", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-10 w-10 text-destructive/70 mb-3", strokeWidth: 1.5 }),
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-foreground", children: "Something went wrong" }),
        isDev,
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "An unexpected error occurred in this section." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "default", onClick: this.handleReset, children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }),
            "Try Again"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: this.handleReload, children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5" }),
            "Reload Page"
          ] })
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
const appCss = "/assets/styles-CL8pb4DY.css";
const Route$G = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "noindex, nofollow" },
      { title: "Cannabis Club Manager" },
      {
        name: "description",
        content: "Sistema administrativo interno para clubes cannábicos registrados. Gestión de socios, stock, movimientos, alertas y auditoría."
      },
      { property: "og:title", content: "Cannabis Club Manager" },
      {
        property: "og:description",
        content: "Plataforma privada de gestión operativa para clubes cannábicos registrados."
      },
      { property: "og:type", content: "website" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsx(DemoProvider, { children: /* @__PURE__ */ jsxs(RoleProvider, { children: [
    /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Toaster, { position: "bottom-right", richColors: true })
  ] }) });
}
const $$splitComponentImporter$F = () => import("./app-C0H2tuCM.js");
const Route$F = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./index-COmit2Z3.js");
const Route$E = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$E, "component"),
  head: () => ({
    meta: [{
      title: "Cannabis Club Manager · Acceso"
    }, {
      name: "description",
      content: "Acceso al panel administrativo interno. Uso exclusivo de personal autorizado del club."
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  })
});
const $$splitComponentImporter$D = () => import("./app.index-D-7PdYTd.js");
const Route$D = createFileRoute("/app/")({
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./app.usuarios-uQYOVNTs.js");
const Route$C = createFileRoute("/app/usuarios")({
  head: () => ({
    meta: [{
      title: "Usuarios y Roles · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./app.suppliers-DO0VXzaj.js");
const Route$B = createFileRoute("/app/suppliers")({
  component: lazyRouteComponent($$splitComponentImporter$B, "component"),
  head: () => ({
    meta: [{
      title: "Suppliers — Cannabis Club Manager"
    }]
  }),
  validateSearch: (search) => ({
    supplier: typeof search.supplier === "string" ? search.supplier : void 0
  })
});
const $$splitComponentImporter$A = () => import("./app.socios-Bn_N2KEd.js");
const Route$A = createFileRoute("/app/socios")({
  head: () => ({
    meta: [{
      title: "Socios · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./app.settings-Dzvvhp_U.js");
const Route$z = createFileRoute("/app/settings")({
  component: lazyRouteComponent($$splitComponentImporter$z, "component"),
  head: () => ({
    meta: [{
      title: "Configuración · Cannabis Club Manager"
    }]
  })
});
const $$splitComponentImporter$y = () => import("./app.requests-CiC3tPiu.js");
const Route$y = createFileRoute("/app/requests")({
  component: lazyRouteComponent($$splitComponentImporter$y, "component"),
  head: () => ({
    meta: [{
      title: "Requests — Cannabis Club Manager"
    }]
  }),
  validateSearch: (search) => ({
    request: search.request || void 0
  })
});
const $$splitComponentImporter$x = () => import("./app.purchase-orders-Ba6CYYc7.js");
const Route$x = createFileRoute("/app/purchase-orders")({
  component: lazyRouteComponent($$splitComponentImporter$x, "component"),
  head: () => ({
    meta: [{
      title: "Purchase Orders — Cannabis Club Manager"
    }]
  }),
  validateSearch: (search) => ({
    po: typeof search.po === "string" ? search.po : void 0
  })
});
const $$splitComponentImporter$w = () => import("./app.movements-C0gwcxft.js");
const Route$w = createFileRoute("/app/movements")({
  component: lazyRouteComponent($$splitComponentImporter$w, "component"),
  head: () => ({
    meta: [{
      title: "Movimientos · Cannabis Club Manager"
    }]
  }),
  validateSearch: (search) => ({
    item: typeof search.item === "string" ? search.item : void 0
  })
});
const $$splitComponentImporter$v = () => import("./app.locations-DDVmMKNn.js");
const Route$v = createFileRoute("/app/locations")({
  component: lazyRouteComponent($$splitComponentImporter$v, "component"),
  head: () => ({
    meta: [{
      title: "Locations — Cannabis Club Manager"
    }]
  })
});
const $$splitComponentImporter$u = () => import("./app.help-CYUWsSia.js");
const Route$u = createFileRoute("/app/help")({
  component: lazyRouteComponent($$splitComponentImporter$u, "component"),
  head: () => ({
    meta: [{
      title: "Help Center — Cannabis Club Manager"
    }]
  })
});
const $$splitComponentImporter$t = () => import("./app.facturacion-C4zAd8yf.js");
const Route$t = createFileRoute("/app/facturacion")({
  head: () => ({
    meta: [{
      title: "Facturacion ARCA - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./app.dashboard-eX2T6kZY.js");
const Route$s = createFileRoute("/app/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component"),
  head: () => ({
    meta: [{
      title: "Dashboard · Cannabis Club Manager"
    }]
  })
});
const $$splitComponentImporter$r = () => import("./app.cultivo-DuflxSoa.js");
const Route$r = createFileRoute("/app/cultivo")({
  head: () => ({
    meta: [{
      title: "Cultivo · Cannabis Club Manager"
    }, {
      name: "description",
      content: "Trazabilidad y seguimiento de cultivo interno."
    }]
  }),
  validateSearch: (search) => {
    const section = search.section;
    if (section === "resumen" || section === "trazabilidad" || section === "lotes" || section === "rendimientos" || section === "inventario") {
      return {
        section
      };
    }
    return {};
  },
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./app.catalog-BcYhRMC8.js");
const Route$q = createFileRoute("/app/catalog")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component"),
  head: () => ({
    meta: [{
      title: "Productos · Stock · Cannabis Club Manager"
    }]
  })
});
const $$splitComponentImporter$p = () => import("./app.auditoria-j_J2zadV.js");
const Route$p = createFileRoute("/app/auditoria")({
  head: () => ({
    meta: [{
      title: "Auditoría · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./app.analytics-4LFvuJyJ.js");
const Route$o = createFileRoute("/app/analytics")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component"),
  head: () => ({
    meta: [{
      title: "Analytics — Cannabis Club Manager"
    }]
  })
});
const $$splitComponentImporter$n = () => import("./app.alertas-BdiiWATN.js");
const Route$n = createFileRoute("/app/alertas")({
  head: () => ({
    meta: [{
      title: "Alertas · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./app.ai-insights-BjdOKf5K.js");
const Route$m = createFileRoute("/app/ai-insights")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component"),
  head: () => ({
    meta: [{
      title: "Insights — Cannabis Club Manager"
    }]
  })
});
const $$splitComponentImporter$l = () => import("./app.cultivo.vpd-B-LxzQ7R.js");
const Route$l = createFileRoute("/app/cultivo/vpd")({
  head: () => ({
    meta: [{
      title: "Tabla VPD · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./app.cultivo.salas-BaYc7bIX.js");
const Route$k = createFileRoute("/app/cultivo/salas")({
  head: () => ({
    meta: [{
      title: "Salas de cultivo · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./app.cultivo.resumen-BTU5dmpx.js");
const Route$j = createFileRoute("/app/cultivo/resumen")({
  beforeLoad: () => {
    throw redirect({
      to: "/app/cultivo",
      search: {
        section: "resumen"
      }
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./app.cultivo.plantas-BPiMcjoz.js");
const Route$i = createFileRoute("/app/cultivo/plantas")({
  head: () => ({
    meta: [{
      title: "Plantas · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./app.cultivo.mediciones-C8GJR-xS.js");
const Route$h = createFileRoute("/app/cultivo/mediciones")({
  head: () => ({
    meta: [{
      title: "Mediciones PH / PPM - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./app.cultivo.madres-7CJ7-MtY.js");
const Route$g = createFileRoute("/app/cultivo/madres")({
  head: () => ({
    meta: [{
      title: "Plantas madre · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./app.cultivo.geneticas-D5xJ9vVY.js");
const Route$f = createFileRoute("/app/cultivo/geneticas")({
  head: () => ({
    meta: [{
      title: "Geneticas - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./app.cultivo.cosechas-4hkOgO-_.js");
const Route$e = createFileRoute("/app/cultivo/cosechas")({
  head: () => ({
    meta: [{
      title: "Cosechas · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./app.cultivo.clonador-sfktTSPi.js");
const Route$d = createFileRoute("/app/cultivo/clonador")({
  head: () => ({
    meta: [{
      title: "Clonadores · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./app.cultivo.camillas-DCDA2EnP.js");
const Route$c = createFileRoute("/app/cultivo/camillas")({
  head: () => ({
    meta: [{
      title: "Camillas · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.cultivo.calendario-8o51rh73.js");
const Route$b = createFileRoute("/app/cultivo/calendario")({
  head: () => ({
    meta: [{
      title: "Calendario operativo · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./app.cultivo.ambiente-DgqQhsNb.js");
const Route$a = createFileRoute("/app/cultivo/ambiente")({
  head: () => ({
    meta: [{
      title: "Parametros ambientales · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.cultivo.salas.nueva-aDNJtQUN.js");
const Route$9 = createFileRoute("/app/cultivo/salas/nueva")({
  validateSearch: (search) => ({
    edit: search.edit != null ? String(search.edit) : void 0
  }),
  head: () => ({
    meta: [{
      title: "Nueva sala - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./app.cultivo.salas._id-DP4oJulw.js");
const Route$8 = createFileRoute("/app/cultivo/salas/$id")({
  head: () => ({
    meta: [{
      title: "Detalle de sala · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.cultivo.plantas.nueva-kaTAh8M1.js");
const Route$7 = createFileRoute("/app/cultivo/plantas/nueva")({
  validateSearch: (search) => ({
    edit: search.edit != null ? String(search.edit) : void 0
  }),
  head: () => ({
    meta: [{
      title: "Nueva planta - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.cultivo.geneticas.nueva-7Jp0Qfay.js");
const Route$6 = createFileRoute("/app/cultivo/geneticas/nueva")({
  head: () => ({
    meta: [{
      title: "Nueva genética - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.cultivo.geneticas._id-DiI-71ug.js");
const Route$5 = createFileRoute("/app/cultivo/geneticas/$id")({
  head: () => ({
    meta: [{
      title: "Genetica - Cannabis Club Manager"
    }]
  }),
  validateSearch: (search) => ({
    mode: search.mode === "edit" ? "edit" : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./app.cultivo.cosechas.nueva-CCigvYLZ.js");
const Route$4 = createFileRoute("/app/cultivo/cosechas/nueva")({
  head: () => ({
    meta: [{
      title: "Nueva cosecha - Cannabis Club Manager"
    }]
  }),
  validateSearch: (search) => ({
    edit: typeof search.edit === "string" ? search.edit : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./app.cultivo.clonador.nueva-_wk93jHw.js");
const Route$3 = createFileRoute("/app/cultivo/clonador/nueva")({
  validateSearch: (search) => ({
    edit: search.edit != null ? String(search.edit) : void 0
  }),
  head: () => ({
    meta: [{
      title: "Nuevo clonador - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./app.cultivo.clonador._id-By_J4HgG.js");
const Route$2 = createFileRoute("/app/cultivo/clonador/$id")({
  head: () => ({
    meta: [{
      title: "Detalle de clonador · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./app.cultivo.camillas.nueva-Bs38p6yt.js");
const Route$1 = createFileRoute("/app/cultivo/camillas/nueva")({
  validateSearch: (search) => ({
    edit: search.edit != null ? String(search.edit) : void 0
  }),
  head: () => ({
    meta: [{
      title: "Nueva camilla - Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.cultivo.camillas._id-wYGGXYcM.js");
const Route = createFileRoute("/app/cultivo/camillas/$id")({
  head: () => ({
    meta: [{
      title: "Detalle de camilla · Cannabis Club Manager"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AppRoute = Route$F.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$G
});
const IndexRoute = Route$E.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$G
});
const AppIndexRoute = Route$D.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const AppUsuariosRoute = Route$C.update({
  id: "/usuarios",
  path: "/usuarios",
  getParentRoute: () => AppRoute
});
const AppSuppliersRoute = Route$B.update({
  id: "/suppliers",
  path: "/suppliers",
  getParentRoute: () => AppRoute
});
const AppSociosRoute = Route$A.update({
  id: "/socios",
  path: "/socios",
  getParentRoute: () => AppRoute
});
const AppSettingsRoute = Route$z.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppRequestsRoute = Route$y.update({
  id: "/requests",
  path: "/requests",
  getParentRoute: () => AppRoute
});
const AppPurchaseOrdersRoute = Route$x.update({
  id: "/purchase-orders",
  path: "/purchase-orders",
  getParentRoute: () => AppRoute
});
const AppMovementsRoute = Route$w.update({
  id: "/movements",
  path: "/movements",
  getParentRoute: () => AppRoute
});
const AppLocationsRoute = Route$v.update({
  id: "/locations",
  path: "/locations",
  getParentRoute: () => AppRoute
});
const AppHelpRoute = Route$u.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => AppRoute
});
const AppFacturacionRoute = Route$t.update({
  id: "/facturacion",
  path: "/facturacion",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$s.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AppCultivoRoute = Route$r.update({
  id: "/cultivo",
  path: "/cultivo",
  getParentRoute: () => AppRoute
});
const AppCatalogRoute = Route$q.update({
  id: "/catalog",
  path: "/catalog",
  getParentRoute: () => AppRoute
});
const AppAuditoriaRoute = Route$p.update({
  id: "/auditoria",
  path: "/auditoria",
  getParentRoute: () => AppRoute
});
const AppAnalyticsRoute = Route$o.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AppRoute
});
const AppAlertasRoute = Route$n.update({
  id: "/alertas",
  path: "/alertas",
  getParentRoute: () => AppRoute
});
const AppAiInsightsRoute = Route$m.update({
  id: "/ai-insights",
  path: "/ai-insights",
  getParentRoute: () => AppRoute
});
const AppCultivoVpdRoute = Route$l.update({
  id: "/vpd",
  path: "/vpd",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoSalasRoute = Route$k.update({
  id: "/salas",
  path: "/salas",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoResumenRoute = Route$j.update({
  id: "/resumen",
  path: "/resumen",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoPlantasRoute = Route$i.update({
  id: "/plantas",
  path: "/plantas",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoMedicionesRoute = Route$h.update({
  id: "/mediciones",
  path: "/mediciones",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoMadresRoute = Route$g.update({
  id: "/madres",
  path: "/madres",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoGeneticasRoute = Route$f.update({
  id: "/geneticas",
  path: "/geneticas",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoCosechasRoute = Route$e.update({
  id: "/cosechas",
  path: "/cosechas",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoClonadorRoute = Route$d.update({
  id: "/clonador",
  path: "/clonador",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoCamillasRoute = Route$c.update({
  id: "/camillas",
  path: "/camillas",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoCalendarioRoute = Route$b.update({
  id: "/calendario",
  path: "/calendario",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoAmbienteRoute = Route$a.update({
  id: "/ambiente",
  path: "/ambiente",
  getParentRoute: () => AppCultivoRoute
});
const AppCultivoSalasNuevaRoute = Route$9.update({
  id: "/nueva",
  path: "/nueva",
  getParentRoute: () => AppCultivoSalasRoute
});
const AppCultivoSalasIdRoute = Route$8.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AppCultivoSalasRoute
});
const AppCultivoPlantasNuevaRoute = Route$7.update({
  id: "/nueva",
  path: "/nueva",
  getParentRoute: () => AppCultivoPlantasRoute
});
const AppCultivoGeneticasNuevaRoute = Route$6.update({
  id: "/nueva",
  path: "/nueva",
  getParentRoute: () => AppCultivoGeneticasRoute
});
const AppCultivoGeneticasIdRoute = Route$5.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AppCultivoGeneticasRoute
});
const AppCultivoCosechasNuevaRoute = Route$4.update({
  id: "/nueva",
  path: "/nueva",
  getParentRoute: () => AppCultivoCosechasRoute
});
const AppCultivoClonadorNuevaRoute = Route$3.update({
  id: "/nueva",
  path: "/nueva",
  getParentRoute: () => AppCultivoClonadorRoute
});
const AppCultivoClonadorIdRoute = Route$2.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AppCultivoClonadorRoute
});
const AppCultivoCamillasNuevaRoute = Route$1.update({
  id: "/nueva",
  path: "/nueva",
  getParentRoute: () => AppCultivoCamillasRoute
});
const AppCultivoCamillasIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AppCultivoCamillasRoute
});
const AppCultivoCamillasRouteChildren = {
  AppCultivoCamillasIdRoute,
  AppCultivoCamillasNuevaRoute
};
const AppCultivoCamillasRouteWithChildren = AppCultivoCamillasRoute._addFileChildren(AppCultivoCamillasRouteChildren);
const AppCultivoClonadorRouteChildren = {
  AppCultivoClonadorIdRoute,
  AppCultivoClonadorNuevaRoute
};
const AppCultivoClonadorRouteWithChildren = AppCultivoClonadorRoute._addFileChildren(AppCultivoClonadorRouteChildren);
const AppCultivoCosechasRouteChildren = {
  AppCultivoCosechasNuevaRoute
};
const AppCultivoCosechasRouteWithChildren = AppCultivoCosechasRoute._addFileChildren(AppCultivoCosechasRouteChildren);
const AppCultivoGeneticasRouteChildren = {
  AppCultivoGeneticasIdRoute,
  AppCultivoGeneticasNuevaRoute
};
const AppCultivoGeneticasRouteWithChildren = AppCultivoGeneticasRoute._addFileChildren(AppCultivoGeneticasRouteChildren);
const AppCultivoPlantasRouteChildren = {
  AppCultivoPlantasNuevaRoute
};
const AppCultivoPlantasRouteWithChildren = AppCultivoPlantasRoute._addFileChildren(AppCultivoPlantasRouteChildren);
const AppCultivoSalasRouteChildren = {
  AppCultivoSalasIdRoute,
  AppCultivoSalasNuevaRoute
};
const AppCultivoSalasRouteWithChildren = AppCultivoSalasRoute._addFileChildren(
  AppCultivoSalasRouteChildren
);
const AppCultivoRouteChildren = {
  AppCultivoAmbienteRoute,
  AppCultivoCalendarioRoute,
  AppCultivoCamillasRoute: AppCultivoCamillasRouteWithChildren,
  AppCultivoClonadorRoute: AppCultivoClonadorRouteWithChildren,
  AppCultivoCosechasRoute: AppCultivoCosechasRouteWithChildren,
  AppCultivoGeneticasRoute: AppCultivoGeneticasRouteWithChildren,
  AppCultivoMadresRoute,
  AppCultivoMedicionesRoute,
  AppCultivoPlantasRoute: AppCultivoPlantasRouteWithChildren,
  AppCultivoResumenRoute,
  AppCultivoSalasRoute: AppCultivoSalasRouteWithChildren,
  AppCultivoVpdRoute
};
const AppCultivoRouteWithChildren = AppCultivoRoute._addFileChildren(
  AppCultivoRouteChildren
);
const AppRouteChildren = {
  AppAiInsightsRoute,
  AppAlertasRoute,
  AppAnalyticsRoute,
  AppAuditoriaRoute,
  AppCatalogRoute,
  AppCultivoRoute: AppCultivoRouteWithChildren,
  AppDashboardRoute,
  AppFacturacionRoute,
  AppHelpRoute,
  AppLocationsRoute,
  AppMovementsRoute,
  AppPurchaseOrdersRoute,
  AppRequestsRoute,
  AppSettingsRoute,
  AppSociosRoute,
  AppSuppliersRoute,
  AppUsuariosRoute,
  AppIndexRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren
};
const routeTree = Route$G._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Card as C,
  ErrorBoundary as E,
  ItemStatus as I,
  MovementType as M,
  OrderStatus as O,
  RequestStatus as R,
  CardContent as a,
  CardDescription as b,
  CardHeader as c,
  CardTitle as d,
  RoleContext as e,
  Route$B as f,
  Route$y as g,
  Route$x as h,
  Route$w as i,
  Route$r as j,
  Route$9 as k,
  Route$8 as l,
  Route$7 as m,
  Route$5 as n,
  Route$3 as o,
  Route$2 as p,
  Route$1 as q,
  Route as r,
  buttonVariants as s,
  cn as t,
  router as u,
  useDemo as v
};
