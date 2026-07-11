import { useMemo } from "react";
import { v as useDemo } from "./router-Rtc38bRC.js";
function useItems(filters) {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) return { data: demoStore.getItems(filters), isLoading: false, error: null };
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version, filters?.categoryId, filters?.supplierId, filters?.status, filters?.search, filters?.locationId]);
}
function useCategories() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) return { data: demoStore.getCategories(), isLoading: false, error: null };
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version]);
}
function useSuppliers() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) return { data: [...demoStore.getSuppliers()], isLoading: false, error: null };
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version]);
}
function useLocations() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) return { data: demoStore.getLocations(), isLoading: false, error: null };
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version]);
}
function useMovements(limit) {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) {
      const data = demoStore.getMovements();
      return { data, isLoading: false, error: null };
    }
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version, limit]);
}
function usePurchaseOrders() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) return { data: [...demoStore.getPurchaseOrders()], isLoading: false, error: null };
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version]);
}
function useRequests() {
  const { isDemo, demoStore, version } = useDemo();
  return useMemo(() => {
    if (isDemo && demoStore) return { data: [...demoStore.getRequests()], isLoading: false, error: null };
    return { data: [], isLoading: false, error: null };
  }, [isDemo, demoStore, version]);
}
export {
  useItems as a,
  useLocations as b,
  useMovements as c,
  usePurchaseOrders as d,
  useRequests as e,
  useSuppliers as f,
  useCategories as u
};
