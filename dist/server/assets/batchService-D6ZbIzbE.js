import { b as batches } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
function emptyToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function toApiBatchPayload(payload) {
  return {
    codigoLote: payload.code.trim(),
    geneticaId: Number(payload.geneticsId),
    salaCultivoId: Number(payload.roomId),
    estado: payload.status,
    fechaInicio: payload.startDate,
    fechaInicioFloracion: emptyToUndefined(payload.floweringStartDate),
    fechaEstimadaCosecha: emptyToUndefined(payload.estimatedHarvestDate),
    fechaCosechaReal: emptyToUndefined(payload.realHarvestDate),
    observaciones: emptyToUndefined(payload.notes)
  };
}
function mapApiBatch(item) {
  return {
    id: String(item.id),
    code: item.codigoLote ?? item.code ?? "",
    geneticsId: item.geneticaId ? String(item.geneticaId) : item.geneticsId ?? "",
    geneticsName: item.genetica?.nombre,
    roomId: item.salaCultivoId ? String(item.salaCultivoId) : item.roomId ?? "",
    roomName: item.salaCultivo?.nombre,
    status: item.estado ?? item.status ?? "activo",
    startDate: (item.fechaInicio ?? item.startDate ?? "").slice(0, 10),
    floweringStartDate: (item.fechaInicioFloracion ?? item.floweringStartDate ?? void 0)?.slice(0, 10),
    estimatedHarvestDate: (item.fechaEstimadaCosecha ?? item.estimatedHarvestDate ?? void 0)?.slice(0, 10),
    realHarvestDate: (item.fechaCosechaReal ?? item.realHarvestDate ?? void 0)?.slice(0, 10),
    notes: item.observaciones ?? item.notes ?? void 0
  };
}
async function getBatches() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/batches")).map(mapApiBatch),
    () => batches
  );
}
async function createBatch(payload) {
  return mapApiBatch(
    await apiRequest("/cultivation/batches", {
      method: "POST",
      body: JSON.stringify(toApiBatchPayload(payload))
    })
  );
}
async function updateBatch(id, payload) {
  return mapApiBatch(
    await apiRequest(`/cultivation/batches/${id}`, {
      method: "PUT",
      body: JSON.stringify(toApiBatchPayload(payload))
    })
  );
}
export {
  createBatch as c,
  getBatches as g,
  updateBatch as u
};
