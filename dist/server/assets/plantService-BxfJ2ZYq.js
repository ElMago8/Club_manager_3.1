import { p as plants, a as growBeds } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
const API_TO_UI_ORIGIN = {
  seed: "semilla",
  clone: "esqueje",
  internal_mother: "madre",
  external_purchase: "planta",
  other: "planta"
};
const API_TO_UI_STAGE = {
  clone: "vegetativo",
  vegetative: "vegetativo",
  flowering: "floracion",
  harvest: "cosecha",
  drying: "secado",
  curing: "curado",
  released: "liberado",
  discarded: "a_reparar"
};
const UI_TO_API_STAGE = {
  vegetativo: "vegetative",
  floracion: "flowering",
  cosecha: "harvest",
  secado: "drying",
  curado: "curing",
  liberado: "released",
  a_limpiar: "a_limpiar",
  a_reparar: "a_reparar"
};
const API_TO_UI_STATUS = {
  normal: "normal",
  observation: "observacion",
  alert: "alerta",
  discarded: "descartada",
  harvested: "cosechada"
};
const UI_TO_API_STATUS = {
  normal: "normal",
  observacion: "observation",
  alerta: "alert",
  descartada: "discarded",
  cosechada: "harvested"
};
function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function getBedOrThrow(bedId) {
  const bed = growBeds.find((item) => item.id === bedId);
  if (!bed) {
    throw new Error("Camilla de cultivo no encontrada.");
  }
  return bed;
}
function getActivePlantsByBed(bedId) {
  return plants.filter((plant) => plant.bedId === bedId && plant.status !== "descartada");
}
function syncBedCurrentPlants(bedId) {
  const bed = growBeds.find((item) => item.id === bedId);
  if (bed) {
    bed.currentPlants = getActivePlantsByBed(bedId).length;
  }
}
function validateBedCapacity(bedId, addedPlants = 1, ignoredPlantId) {
  const bed = getBedOrThrow(bedId);
  const activePlants = getActivePlantsByBed(bedId).filter((plant) => plant.id !== ignoredPlantId);
  const capacity = Math.min(bed.maxPlants, 100);
  if (bed.maxPlants > 100) {
    throw new Error("La camilla no puede superar las 100 plantas de capacidad.");
  }
  if (activePlants.length + addedPlants > capacity) {
    throw new Error("No hay capacidad disponible en la camilla seleccionada.");
  }
}
function validateUniqueBedPosition(bedId, bedPosition, ignoredPlantId) {
  const duplicatedPosition = plants.some(
    (plant) => plant.bedId === bedId && plant.bedPosition === bedPosition && plant.id !== ignoredPlantId && plant.status !== "descartada"
  );
  if (duplicatedPosition) {
    throw new Error("Ya existe una planta en esa posicion de la camilla.");
  }
}
function getFreePositionsForBed(bedId) {
  const bed = getBedOrThrow(bedId);
  const occupiedPositions = new Set(
    getActivePlantsByBed(bedId).map((plant) => plant.bedPosition)
  );
  return Array.from({ length: Math.min(bed.maxPlants, 100) }, (_, index) => index + 1).filter(
    (position) => !occupiedPositions.has(position)
  );
}
function dateOnly(value) {
  return value ? value.slice(0, 10) : void 0;
}
function mapApiPlant(plant) {
  const origin = plant.origen ?? plant.origin;
  const stage = plant.etapa ?? plant.stage;
  const status = plant.estado ?? plant.status;
  return {
    id: plant.id,
    internalCode: plant.codigoPlanta ?? plant.internalCode ?? "",
    plantName: plant.nombrePlanta ?? void 0,
    roomId: plant.bed?.roomId ?? (plant.camilla?.salaCultivoId ? String(plant.camilla.salaCultivoId) : void 0) ?? (plant.clonador?.salaCultivoId ? String(plant.clonador.salaCultivoId) : "room-sin-asignar"),
    bedId: plant.bedId ?? String(plant.camillaId ?? plant.clonadorId ?? ""),
    bedPosition: plant.bedPosition ?? plant.posicionCamilla ?? plant.posicionClonador ?? 0,
    batchId: plant.batchId ?? (plant.loteCultivoId ? String(plant.loteCultivoId) : void 0),
    geneticsId: plant.geneticsId ?? (plant.geneticaId ? String(plant.geneticaId) : void 0),
    geneticsName: plant.genetics?.name ?? plant.genetica?.nombre,
    motherPlantId: plant.motherPlantId ?? (plant.madreId ? String(plant.madreId) : void 0),
    motherPlantCode: plant.motherPlant?.code ?? plant.madre?.codigoMadre,
    origin: API_TO_UI_ORIGIN[origin] ?? origin,
    stage: API_TO_UI_STAGE[stage] ?? stage,
    status: API_TO_UI_STATUS[status] ?? status,
    sanitaryStatus: plant.sanitaryStatus ?? plant.estadoSanitario ?? void 0,
    startDate: dateOnly(plant.startDate ?? plant.fechaInicio) ?? "",
    stageStartDate: dateOnly(plant.stageStartDate ?? plant.fechaInicioEtapa),
    potCode: plant.potCode ?? plant.macetaCodigo ?? void 0,
    potSizeLiters: plant.potSizeLiters ?? plant.macetaLitros ?? void 0,
    potType: plant.potType ?? plant.tipoMaceta ?? void 0,
    substrate: plant.substrate ?? plant.sustrato ?? void 0,
    notes: plant.notes ?? plant.observaciones ?? void 0
  };
}
function toApiPlantPayload(payload) {
  return {
    codigoPlanta: payload.internalCode,
    nombrePlanta: payload.plantName,
    camillaId: payload.bedId ? Number(payload.bedId) : void 0,
    posicionCamilla: payload.bedPosition,
    loteCultivoId: payload.batchId && /^\d+$/.test(payload.batchId) ? Number(payload.batchId) : void 0,
    geneticaId: payload.geneticsId ? Number(payload.geneticsId) : void 0,
    madreId: payload.motherPlantId ? Number(payload.motherPlantId) : void 0,
    origen: payload.origin,
    etapa: payload.stage,
    estado: payload.status,
    estadoSanitario: payload.sanitaryStatus,
    fechaInicio: payload.startDate,
    fechaInicioEtapa: payload.stageStartDate,
    macetaCodigo: payload.potCode,
    macetaLitros: payload.potSizeLiters,
    tipoMaceta: payload.potType,
    sustrato: payload.substrate,
    observaciones: payload.notes
  };
}
function toApiPlantFilters(filters) {
  return Object.fromEntries(
    Object.entries({
      bedId: filters.bedId,
      clonadorId: filters.clonadorId,
      geneticsId: filters.geneticsId,
      batchId: filters.batchId,
      motherPlantId: filters.motherPlantId,
      stage: filters.stage ? UI_TO_API_STAGE[filters.stage] : void 0,
      status: filters.status ? UI_TO_API_STATUS[filters.status] : void 0
    }).filter(([, value]) => value)
  );
}
async function getPlants(filters = {}) {
  return withMockFallback(
    async () => {
      const query = new URLSearchParams(toApiPlantFilters(filters));
      const apiPlants = await apiRequest(
        `/cultivation/plants${query.size ? `?${query.toString()}` : ""}`
      );
      return apiPlants.map(mapApiPlant).filter((plant) => !filters.roomId || plant.roomId === filters.roomId);
    },
    () => plants.filter((plant) => {
      if (filters.roomId && plant.roomId !== filters.roomId) return false;
      if (filters.bedId && plant.bedId !== filters.bedId) return false;
      if (filters.geneticsId && plant.geneticsId !== filters.geneticsId) return false;
      if (filters.batchId && plant.batchId !== filters.batchId) return false;
      if (filters.motherPlantId && plant.motherPlantId !== filters.motherPlantId) return false;
      if (filters.stage && plant.stage !== filters.stage) return false;
      if (filters.status && plant.status !== filters.status) return false;
      return true;
    })
  );
}
async function getPlantsByBed(bedId) {
  return getPlants({ bedId });
}
async function getPlantById(id) {
  return withMockFallback(
    async () => mapApiPlant(await apiRequest(`/cultivation/plants/${id}`)),
    () => plants.find((plant) => plant.id === id) ?? null
  );
}
async function createPlant(payload) {
  return withMockFallback(
    async () => mapApiPlant(
      await apiRequest("/cultivation/plants", {
        method: "POST",
        body: JSON.stringify(toApiPlantPayload(payload))
      })
    ),
    () => {
      validateBedCapacity(payload.bedId);
      validateUniqueBedPosition(payload.bedId, payload.bedPosition);
      const newPlant = {
        ...payload,
        id: payload.id ?? createMockId("plant")
      };
      plants.push(newPlant);
      syncBedCurrentPlants(newPlant.bedId);
      return newPlant;
    }
  );
}
async function updatePlant(id, payload) {
  const plant = plants.find((item) => item.id === id);
  return withMockFallback(
    async () => mapApiPlant(
      await apiRequest(`/cultivation/plants/${id}`, {
        method: "PUT",
        body: JSON.stringify(toApiPlantPayload(payload))
      })
    ),
    () => {
      if (!plant) {
        throw new Error("Planta no encontrada.");
      }
      const nextBedId = payload.bedId ?? plant.bedId;
      const nextBedPosition = payload.bedPosition ?? plant.bedPosition;
      const previousBedId = plant.bedId;
      validateBedCapacity(nextBedId, 1, plant.id);
      validateUniqueBedPosition(nextBedId, nextBedPosition, plant.id);
      Object.assign(plant, payload);
      syncBedCurrentPlants(previousBedId);
      syncBedCurrentPlants(plant.bedId);
      return plant;
    }
  );
}
async function deletePlant(id) {
  const plant = plants.find((item) => item.id === id);
  return withMockFallback(
    async () => {
      await apiRequest(`/cultivation/plants/${id}`, { method: "DELETE" });
    },
    () => {
      if (!plant) {
        throw new Error("Planta no encontrada.");
      }
      plants.splice(plants.indexOf(plant), 1);
      syncBedCurrentPlants(plant.bedId);
    }
  );
}
async function bulkCreatePlantsForBed(payload) {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/plants/bulk", {
      method: "POST",
      body: JSON.stringify({
        bedId: payload.bedId,
        count: payload.count,
        internalCodePrefix: payload.plant.internalCodePrefix ?? "PLANT",
        batchId: payload.plant.batchId,
        geneticsId: payload.plant.geneticsId,
        motherPlantId: payload.plant.motherPlantId,
        origin: payload.plant.origin,
        stage: payload.plant.stage,
        status: payload.plant.status,
        startDate: payload.plant.startDate,
        stageStartDate: payload.plant.stageStartDate,
        potSizeLiters: payload.plant.potSizeLiters,
        potType: payload.plant.potType,
        substrate: payload.plant.substrate,
        notes: payload.plant.notes
      })
    })).map(mapApiPlant),
    () => {
      if (payload.count < 1) {
        throw new Error("La cantidad de plantas a crear debe ser mayor a 0.");
      }
      if (payload.count > 100) {
        throw new Error("No se pueden crear mas de 100 plantas por camilla.");
      }
      validateBedCapacity(payload.bedId, payload.count);
      const freePositions = getFreePositionsForBed(payload.bedId);
      if (freePositions.length < payload.count) {
        throw new Error("No hay posiciones libres suficientes en la camilla.");
      }
      const createdPlants = freePositions.slice(0, payload.count).map((bedPosition, index) => {
        const sequence = String(index + 1).padStart(2, "0");
        const plant = {
          ...payload.plant,
          id: createMockId("plant"),
          internalCode: `${payload.plant.internalCodePrefix ?? "PL-MOCK"}-${sequence}`,
          bedId: payload.bedId,
          bedPosition
        };
        plants.push(plant);
        return plant;
      });
      syncBedCurrentPlants(payload.bedId);
      return createdPlants;
    }
  );
}
async function bulkCreatePlantsForClonador(payload) {
  return (await apiRequest(`/cultivation/clonadores/${payload.clonadorId}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      count: payload.count,
      internalCodePrefix: payload.internalCodePrefix ?? "ESQ",
      geneticsId: payload.geneticsId ? Number(payload.geneticsId) : void 0,
      motherPlantId: payload.motherPlantId ? Number(payload.motherPlantId) : void 0,
      batchId: payload.batchId ? Number(payload.batchId) : void 0,
      origin: payload.origin ?? "esqueje",
      stage: payload.stage ?? "vegetativo",
      status: payload.status ?? "normal",
      startDate: payload.startDate,
      notes: payload.notes
    })
  })).map(mapApiPlant);
}
async function updatePlantStage(id, payload) {
  return withMockFallback(
    async () => mapApiPlant(
      await apiRequest(`/cultivation/plants/${id}/stage`, {
        method: "PATCH",
        body: JSON.stringify({
          etapa: payload.stage,
          stageStartDate: payload.stageStartDate,
          notes: payload.notes
        })
      })
    ),
    () => updatePlant(id, payload)
  );
}
async function updatePlantStatus(id, payload) {
  return withMockFallback(
    async () => mapApiPlant(
      await apiRequest(`/cultivation/plants/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          estado: payload.status,
          notes: payload.notes
        })
      })
    ),
    () => updatePlant(id, payload)
  );
}
export {
  bulkCreatePlantsForClonador as a,
  bulkCreatePlantsForBed as b,
  createPlant as c,
  deletePlant as d,
  getPlants as e,
  getPlantsByBed as f,
  getPlantById as g,
  updatePlantStage as h,
  updatePlantStatus as i,
  updatePlant as u
};
