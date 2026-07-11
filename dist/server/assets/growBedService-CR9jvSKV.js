import { a as growBeds } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
const API_TO_UI_STATUS = {
  empty: "vacia",
  active: "activa",
  cleaning: "limpieza",
  maintenance: "mantenimiento",
  out_of_use: "fuera_de_uso"
};
const API_RAW_TO_UI_STATUS = {
  empty: "vacia",
  active: "activa",
  cleaning: "limpieza",
  maintenance: "mantenimiento",
  out_of_use: "fuera_de_uso",
  vacia: "vacia",
  activa: "activa",
  limpieza: "limpieza",
  mantenimiento: "mantenimiento",
  fuera_de_uso: "fuera_de_uso"
};
function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function validateMaxPlants(maxPlants, currentPlants = 0) {
  if (maxPlants < 0) {
    throw new Error("La capacidad maxima no puede ser menor a 0.");
  }
  if (maxPlants > 100) {
    throw new Error("La capacidad maxima no puede ser mayor a 100 plantas.");
  }
  if (maxPlants < currentPlants) {
    throw new Error("La capacidad maxima no puede quedar por debajo de las plantas actuales.");
  }
}
function mapApiGrowBed(bed) {
  return {
    id: String(bed.id),
    name: bed.nombre ?? bed.name ?? "",
    code: bed.codigoCamilla ?? bed.code ?? "",
    tipo: bed.tipo === "clonador" ? "clonador" : "camilla",
    roomId: bed.roomId ?? (bed.salaCultivoId ? String(bed.salaCultivoId) : "room-sin-asignar"),
    status: API_RAW_TO_UI_STATUS[bed.estado ?? bed.status] ?? API_TO_UI_STATUS[bed.status],
    maxPlants: bed.capacidadMaximaPlantas ?? bed.maxPlants,
    currentPlants: bed._count?.plants ?? bed._count?.plantas ?? 0,
    mainBatchId: bed.mainBatchId ?? (bed.lotePrincipalId ? String(bed.lotePrincipalId) : void 0),
    responsibleUserId: bed.responsibleUserId ?? (bed.responsableId ? String(bed.responsableId) : void 0),
    notes: bed.descripcion ?? bed.notes ?? void 0
  };
}
function toApiGrowBedPayload(payload) {
  return {
    nombre: payload.name,
    codigoCamilla: payload.code,
    tipo: payload.tipo,
    salaCultivoId: payload.roomId ? Number(payload.roomId) : void 0,
    estado: payload.status,
    capacidadMaximaPlantas: payload.maxPlants,
    descripcion: payload.notes
  };
}
async function getGrowBeds() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/beds")).map(mapApiGrowBed),
    () => growBeds
  );
}
async function getGrowBedsByRoom(roomId) {
  return withMockFallback(
    async () => (await getGrowBeds()).filter((bed) => bed.roomId === roomId),
    () => growBeds.filter((bed) => bed.roomId === roomId)
  );
}
async function getGrowBedById(id) {
  if (!/^\d+$/.test(id)) {
    return growBeds.find((bed) => bed.id === id) ?? null;
  }
  return withMockFallback(
    async () => mapApiGrowBed(await apiRequest(`/cultivation/beds/${id}`)),
    () => growBeds.find((bed) => bed.id === id) ?? null
  );
}
async function createGrowBed(payload) {
  const currentPlants = payload.currentPlants ?? 0;
  validateMaxPlants(payload.maxPlants, currentPlants);
  return withMockFallback(
    async () => mapApiGrowBed(
      await apiRequest("/cultivation/beds", {
        method: "POST",
        body: JSON.stringify(toApiGrowBedPayload(payload))
      })
    ),
    () => {
      const newBed = {
        ...payload,
        id: payload.id ?? createMockId("bed"),
        currentPlants
      };
      growBeds.push(newBed);
      return newBed;
    }
  );
}
async function updateGrowBed(id, payload) {
  if (payload.maxPlants !== void 0) {
    validateMaxPlants(payload.maxPlants, payload.currentPlants ?? 0);
  }
  return withMockFallback(
    async () => mapApiGrowBed(
      await apiRequest(`/cultivation/beds/${id}`, {
        method: "PUT",
        body: JSON.stringify(toApiGrowBedPayload(payload))
      })
    ),
    () => {
      const bed = growBeds.find((item) => item.id === id);
      if (!bed) {
        throw new Error("Camilla de cultivo no encontrada.");
      }
      const nextMaxPlants = payload.maxPlants ?? bed.maxPlants;
      const nextCurrentPlants = payload.currentPlants ?? bed.currentPlants;
      validateMaxPlants(nextMaxPlants, nextCurrentPlants);
      Object.assign(bed, payload);
      return bed;
    }
  );
}
async function deleteGrowBed(id) {
  return withMockFallback(
    async () => {
      await apiRequest(`/cultivation/beds/${id}`, { method: "DELETE" });
    },
    () => {
      const index = growBeds.findIndex((bed) => bed.id === id);
      if (index === -1) {
        throw new Error("Camilla de cultivo no encontrada.");
      }
      growBeds.splice(index, 1);
    }
  );
}
async function getGrowBedOccupancy(id) {
  return withMockFallback(
    async () => apiRequest(`/cultivation/beds/${id}/occupancy`),
    () => {
      const bed = growBeds.find((item) => item.id === id);
      if (!bed) throw new Error("Camilla de cultivo no encontrada.");
      const occupied = bed.currentPlants;
      const available = Math.max(bed.maxPlants - occupied, 0);
      return {
        bedId: id,
        maxPlants: bed.maxPlants,
        occupied,
        available,
        occupancyPercentage: bed.maxPlants > 0 ? Number((occupied / bed.maxPlants * 100).toFixed(1)) : 0
      };
    }
  );
}
async function updateGrowBedCapacity(id, maxPlants) {
  return withMockFallback(
    async () => mapApiGrowBed(
      await apiRequest(`/cultivation/beds/${id}/capacity`, {
        method: "PATCH",
        body: JSON.stringify({ maxPlants })
      })
    ),
    () => updateGrowBed(id, { maxPlants })
  );
}
function mapApiClonador(c) {
  return {
    id: String(c.id),
    code: c.codigoClonador,
    name: c.nombre,
    tipo: "clonador",
    roomId: String(c.salaCultivoId),
    status: c.estado,
    maxPlants: c.capacidadMaximaEsquejes,
    currentPlants: c._count.esquejes,
    contadorInicioEn: c.contadorInicioEn ?? void 0,
    responsibleUserId: c.responsable ?? void 0,
    notes: c.descripcion ?? void 0
  };
}
async function getClonadores() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/clonadores")).map(mapApiClonador),
    () => growBeds.filter((b) => b.tipo === "clonador")
  );
}
async function getCamillasOnly() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/beds")).map(mapApiGrowBed),
    () => growBeds.filter((b) => b.tipo !== "clonador")
  );
}
async function getClonadorById(id) {
  try {
    return mapApiClonador(await apiRequest(`/cultivation/clonadores/${id}`));
  } catch {
    return null;
  }
}
async function createClonador(payload) {
  return mapApiClonador(
    await apiRequest("/cultivation/clonadores", {
      method: "POST",
      body: JSON.stringify({
        codigoClonador: payload.code,
        salaCultivoId: Number(payload.roomId),
        nombre: payload.name,
        estado: payload.status,
        capacidadMaximaEsquejes: payload.maxPlants,
        responsable: payload.responsibleUserId ?? null,
        descripcion: payload.notes ?? null
      })
    })
  );
}
async function updateClonador(id, payload) {
  return mapApiClonador(
    await apiRequest(`/cultivation/clonadores/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...payload.code !== void 0 && { codigoClonador: payload.code },
        ...payload.roomId !== void 0 && { salaCultivoId: Number(payload.roomId) },
        ...payload.name !== void 0 && { nombre: payload.name },
        ...payload.status !== void 0 && { estado: payload.status },
        ...payload.maxPlants !== void 0 && { capacidadMaximaEsquejes: payload.maxPlants },
        ...payload.responsibleUserId !== void 0 && { responsable: payload.responsibleUserId },
        ...payload.notes !== void 0 && { descripcion: payload.notes }
      })
    })
  );
}
async function deleteClonador(id) {
  await apiRequest(`/cultivation/clonadores/${id}`, { method: "DELETE" });
}
async function getClonadorOccupancy(id) {
  return apiRequest(`/cultivation/clonadores/${id}/occupancy`);
}
async function updateClonadorCapacity(id, capacity) {
  return mapApiClonador(
    await apiRequest(`/cultivation/clonadores/${id}/capacity`, {
      method: "PATCH",
      body: JSON.stringify({ capacity })
    })
  );
}
async function sendToGrowBed(clonadorId, plantIds, targetCamillaId) {
  return apiRequest(`/cultivation/clonadores/${clonadorId}/send-to-camilla`, {
    method: "POST",
    body: JSON.stringify({ plantIds: plantIds.map(Number), targetCamillaId: Number(targetCamillaId) })
  });
}
export {
  createGrowBed as a,
  deleteGrowBed as b,
  createClonador as c,
  deleteClonador as d,
  getClonadorById as e,
  getClonadorOccupancy as f,
  getCamillasOnly as g,
  getClonadores as h,
  getGrowBedById as i,
  getGrowBedOccupancy as j,
  getGrowBeds as k,
  getGrowBedsByRoom as l,
  updateClonadorCapacity as m,
  updateGrowBed as n,
  updateGrowBedCapacity as o,
  sendToGrowBed as s,
  updateClonador as u
};
