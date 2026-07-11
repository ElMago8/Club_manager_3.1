import { m as motherPlants, p as plants } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
const API_TO_UI_STATUS = {
  active: "activa",
  observation: "observacion",
  discarded: "descartada",
  archived: "archivada",
  activa: "activa",
  observacion: "observacion",
  descartada: "descartada",
  archivada: "archivada"
};
function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function countPlantsFromMotherPlant(motherPlantId) {
  return plants.filter((plant) => plant.motherPlantId === motherPlantId).length;
}
function withPlantCount(motherPlant) {
  return {
    ...motherPlant,
    derivedPlantsCount: countPlantsFromMotherPlant(motherPlant.id)
  };
}
function dateOnly(value) {
  return value.slice(0, 10);
}
function mapApiMotherPlant(motherPlant) {
  const status = motherPlant.estado ?? motherPlant.status;
  return {
    id: String(motherPlant.id),
    code: motherPlant.codigoMadre ?? motherPlant.code ?? "",
    name: motherPlant.nombreMadre ?? motherPlant.name ?? void 0,
    geneticsId: motherPlant.geneticsId ?? (motherPlant.geneticaId ? String(motherPlant.geneticaId) : ""),
    geneticsName: motherPlant.genetica?.nombre ?? motherPlant.genetics?.nombre ?? motherPlant.genetics?.name ?? "Genetica pendiente",
    roomId: motherPlant.roomId ?? (motherPlant.salaCultivoId ? String(motherPlant.salaCultivoId) : void 0),
    bedId: motherPlant.bedId ?? (motherPlant.camillaId ? String(motherPlant.camillaId) : void 0),
    status: API_TO_UI_STATUS[status],
    sanitaryStatus: motherPlant.estadoSanitario ?? motherPlant.sanitaryStatus ?? "bueno",
    startDate: dateOnly(motherPlant.fechaInicio ?? motherPlant.startDate ?? ""),
    lastCutDate: motherPlant.fechaUltimoCorte || motherPlant.lastCutDate ? dateOnly(motherPlant.fechaUltimoCorte ?? motherPlant.lastCutDate ?? "") : void 0,
    availableClones: motherPlant.cantidadEsquejesDisponibles ?? motherPlant.availableClones ?? 0,
    origin: motherPlant.origen ?? motherPlant.origin ?? void 0,
    notes: motherPlant.observaciones ?? motherPlant.notes ?? void 0,
    derivedPlantsCount: motherPlant._count?.plants ?? motherPlant._count?.plantas ?? 0
  };
}
function optionalString(value) {
  if (value === void 0) return void 0;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function toApiMotherPlantPayload(payload) {
  return {
    codigoMadre: payload.code,
    nombreMadre: optionalString(payload.name),
    geneticaId: payload.geneticsId ? Number(payload.geneticsId) : void 0,
    salaCultivoId: payload.roomId ? Number(payload.roomId) : void 0,
    camillaId: payload.bedId ? Number(payload.bedId) : void 0,
    estado: payload.status,
    estadoSanitario: payload.sanitaryStatus,
    fechaInicio: payload.startDate,
    fechaUltimoCorte: payload.lastCutDate || void 0,
    cantidadEsquejesDisponibles: payload.availableClones,
    origen: optionalString(payload.origin),
    observaciones: optionalString(payload.notes)
  };
}
async function getMotherPlants() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/mothers")).map(mapApiMotherPlant),
    () => motherPlants.map(withPlantCount)
  );
}
async function createMotherPlant(payload) {
  return withMockFallback(
    async () => mapApiMotherPlant(
      await apiRequest("/cultivation/mothers", {
        method: "POST",
        body: JSON.stringify(toApiMotherPlantPayload(payload))
      })
    ),
    () => {
      const newMotherPlant = {
        ...payload,
        id: payload.id ?? createMockId("mother")
      };
      motherPlants.push(newMotherPlant);
      return withPlantCount(newMotherPlant);
    }
  );
}
async function updateMotherPlant(id, payload) {
  const motherPlant = motherPlants.find((item) => item.id === id);
  return withMockFallback(
    async () => mapApiMotherPlant(
      await apiRequest(`/cultivation/mothers/${id}`, {
        method: "PUT",
        body: JSON.stringify(toApiMotherPlantPayload(payload))
      })
    ),
    () => {
      if (!motherPlant) {
        throw new Error("Planta madre no encontrada.");
      }
      Object.assign(motherPlant, payload);
      return withPlantCount(motherPlant);
    }
  );
}
async function deleteMotherPlant(id) {
  return withMockFallback(
    async () => {
      await apiRequest(`/cultivation/mothers/${id}`, { method: "DELETE" });
    },
    () => {
      const index = motherPlants.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error("Planta madre no encontrada.");
      }
      const linkedPlants = countPlantsFromMotherPlant(id);
      if (linkedPlants > 0) {
        throw new Error(
          `No se puede eliminar la madre porque tiene ${linkedPlants} planta${linkedPlants === 1 ? "" : "s"} asociada${linkedPlants === 1 ? "" : "s"}. Para conservar la trazabilidad, archivala o descartala, o reasigna esas plantas antes.`
        );
      }
      motherPlants.splice(index, 1);
    }
  );
}
export {
  createMotherPlant as c,
  deleteMotherPlant as d,
  getMotherPlants as g,
  updateMotherPlant as u
};
