import { useState, useCallback } from "react";
import { v as useDemo } from "./router-Rtc38bRC.js";
function generateStockAlerts(store) {
  const prefs = store.getNotificationPrefs();
  const items = store.getItems();
  const existing = store.getNotifications();
  for (const item of items) {
    if (item.status !== "active") continue;
    const isLow = item.currentStock > 0 && item.currentStock <= item.reorderPoint;
    const isOut = item.currentStock <= 0;
    if (!isLow && !isOut) continue;
    const type = isOut ? "zero_stock" : "low_stock";
    if (!prefs[type]) continue;
    const alreadyExists = existing.some(
      (n) => !n.isRead && n.type === type && n.referenceId === item.id
    );
    if (alreadyExists) continue;
    const notification = {
      id: `notif-auto-${type}-${item.id}-${Date.now()}`,
      type,
      title: isOut ? `Out of Stock: ${item.name}` : `Low Stock: ${item.name}`,
      message: isOut ? `${item.name} (${item.sku}) has reached zero stock. Reorder immediately.` : `${item.name} (${item.sku}) stock is at ${item.currentStock} units, below reorder point of ${item.reorderPoint}.`,
      isRead: false,
      link: `/app/catalog?item=${item.id}`,
      referenceId: item.id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    store.addNotification(notification);
  }
}
function useDemoMutation(handler) {
  const { isDemo, demoStore, bumpVersion } = useDemo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const mutate = useCallback(
    (data, opts) => {
      if (!isDemo || !demoStore) {
        opts?.onError?.(new Error("Not in demo mode"));
        return;
      }
      setIsLoading(true);
      try {
        handler(demoStore, data);
        bumpVersion();
        setError(null);
        opts?.onSuccess?.();
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        opts?.onError?.(err);
      } finally {
        setIsLoading(false);
      }
    },
    [isDemo, demoStore, handler, bumpVersion]
  );
  return { mutate, isLoading, error };
}
function useUpdateItem() {
  return useDemoMutation(
    (store, { id, updates }) => store.updateItem(id, updates)
  );
}
function useCreateMovement() {
  return useDemoMutation((store, data) => {
    store.createMovement(data);
    generateStockAlerts(store);
  });
}
function useCreatePurchaseOrder() {
  return useDemoMutation((store, data) => store.createPurchaseOrder(data));
}
function useUpdatePurchaseOrder() {
  return useDemoMutation(
    (store, { id, updates }) => store.updatePurchaseOrder(id, updates)
  );
}
function useDeletePurchaseOrder() {
  return useDemoMutation((store, id) => store.deletePurchaseOrder(id));
}
function useCreateSupplier() {
  return useDemoMutation((store, data) => store.createSupplier(data));
}
function useUpdateSupplier() {
  return useDemoMutation(
    (store, { id, updates }) => store.updateSupplier(id, updates)
  );
}
function useDeleteSupplier() {
  return useDemoMutation((store, id) => store.deleteSupplier(id));
}
function useCreateRequest() {
  return useDemoMutation((store, data) => store.createRequest(data));
}
function useCreateLocation() {
  return useDemoMutation((store, data) => store.createLocation(data));
}
function useUpdateLocation() {
  return useDemoMutation(
    (store, { id, updates }) => store.updateLocation(id, updates)
  );
}
function useDeleteLocation() {
  return useDemoMutation((store, id) => store.deleteLocation(id));
}
export {
  useCreateMovement as a,
  useCreatePurchaseOrder as b,
  useCreateRequest as c,
  useCreateSupplier as d,
  useDeleteLocation as e,
  useDeletePurchaseOrder as f,
  useDeleteSupplier as g,
  useUpdateItem as h,
  useUpdateLocation as i,
  useUpdatePurchaseOrder as j,
  useUpdateSupplier as k,
  useCreateLocation as u
};
