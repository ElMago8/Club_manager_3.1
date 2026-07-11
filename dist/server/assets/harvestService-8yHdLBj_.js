import { h as harvests } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
function mapApiHarvest(item) {
  return {
    id: String(item.id),
    code: item.codigoCosecha ?? item.code ?? "",
    batchId: item.loteCultivoId ? String(item.loteCultivoId) : item.batchId ?? "",
    batchCode: item.loteCultivo?.codigoLote,
    geneticsName: item.loteCultivo?.genetica?.nombre,
    roomId: item.salaCultivoId ? String(item.salaCultivoId) : void 0,
    roomName: item.salaCultivo?.nombre ?? item.loteCultivo?.salaCultivo?.nombre,
    harvestDate: (item.fechaCosecha ?? item.harvestDate ?? "").slice(0, 10),
    wetWeightGrams: item.pesoHumedoGramos ?? item.wetWeightGrams ?? void 0,
    dryWeightGrams: item.pesoSecoGramos ?? item.dryWeightGrams ?? void 0,
    shrinkageGrams: item.pesoMermaGramos ?? item.shrinkageGrams ?? void 0,
    cultivationType: item.salaCultivo?.entornoCultivo ?? item.loteCultivo?.salaCultivo?.entornoCultivo ?? void 0,
    growMedium: item.salaCultivo?.tipoCultivo ?? item.loteCultivo?.salaCultivo?.tipoCultivo ?? void 0,
    status: item.estado ?? item.status ?? "registrada",
    secadoInicioEn: item.secadoInicioEn ?? void 0,
    curadoInicioEn: item.curadoInicioEn ?? void 0,
    notes: item.observaciones ?? item.notes ?? void 0
  };
}
function toApiPayload(payload) {
  return {
    codigoCosecha: payload.code,
    loteCultivoId: payload.batchId ? Number(payload.batchId) : void 0,
    salaCultivoId: payload.roomId ? Number(payload.roomId) : null,
    estado: payload.status,
    fechaCosecha: payload.harvestDate,
    pesoHumedoGramos: payload.wetWeightGrams ?? null,
    pesoSecoGramos: payload.dryWeightGrams ?? null,
    pesoMermaGramos: payload.shrinkageGrams ?? null,
    secadoInicioEn: payload.secadoInicioEn ?? void 0,
    curadoInicioEn: payload.curadoInicioEn ?? void 0,
    observaciones: payload.notes?.trim() || null
  };
}
function createMockId() {
  return `harvest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
async function getHarvests() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/harvests")).map(mapApiHarvest),
    () => harvests
  );
}
async function getHarvestById(id) {
  if (!/^\d+$/.test(id)) {
    return harvests.find((h) => h.id === id) ?? null;
  }
  return withMockFallback(
    async () => mapApiHarvest(await apiRequest(`/cultivation/harvests/${id}`)),
    () => harvests.find((h) => h.id === id) ?? null
  );
}
async function createHarvest(payload) {
  return withMockFallback(
    async () => mapApiHarvest(
      await apiRequest("/cultivation/harvests", {
        method: "POST",
        body: JSON.stringify(toApiPayload(payload))
      })
    ),
    () => {
      const newHarvest = { ...payload, id: payload.id ?? createMockId() };
      harvests.push(newHarvest);
      return newHarvest;
    }
  );
}
async function updateHarvest(id, payload) {
  return withMockFallback(
    async () => mapApiHarvest(
      await apiRequest(`/cultivation/harvests/${id}`, {
        method: "PUT",
        body: JSON.stringify(toApiPayload(payload))
      })
    ),
    () => {
      const idx = harvests.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error("Cosecha no encontrada.");
      Object.assign(harvests[idx], payload);
      return harvests[idx];
    }
  );
}
async function deleteHarvest(id) {
  return withMockFallback(
    async () => {
      await apiRequest(`/cultivation/harvests/${id}`, { method: "DELETE" });
    },
    () => {
      const idx = harvests.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error("Cosecha no encontrada.");
      harvests.splice(idx, 1);
    }
  );
}
export {
  getHarvests as a,
  createHarvest as c,
  deleteHarvest as d,
  getHarvestById as g,
  updateHarvest as u
};
