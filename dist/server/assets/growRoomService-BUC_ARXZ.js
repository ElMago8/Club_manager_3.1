import { d as growRooms } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
const defaultTechnicalConfig = {
  lightingType: "led",
  installedPowerWatts: 0,
  irrigationSystem: "manual",
  hasAirConditioning: false,
  hasDehumidifier: false,
  installedSensors: []
};
function mapApiGrowRoom(room) {
  const installedSensors = room.sensores ? room.sensores.split(",").map((sensor) => sensor.trim().toLowerCase()).filter(Boolean) : [];
  return {
    id: String(room.id),
    code: room.codigoSala,
    name: room.nombre,
    type: room.tipo,
    status: room.estado,
    technicalConfig: {
      ...defaultTechnicalConfig,
      installedPowerWatts: room.potenciaWatts ?? 0,
      irrigationSystem: room.tipoRiego ?? "manual",
      hasAirConditioning: room.tieneAireAcondicionado ?? false,
      hasDehumidifier: room.tieneDeshumidificador ?? false,
      installedSensors
    },
    cultivationType: room.entornoCultivo ?? void 0,
    growMedium: room.tipoCultivo ?? void 0,
    notes: room.descripcion ?? void 0
  };
}
function toApiGrowRoomPayload(payload) {
  return {
    codigoSala: payload.code,
    nombre: payload.name,
    tipo: payload.type,
    estado: payload.status,
    potenciaWatts: payload.installedPowerWatts,
    tipoRiego: payload.irrigationSystem,
    tieneAireAcondicionado: payload.hasAirConditioning,
    tieneDeshumidificador: payload.hasDehumidifier,
    sensores: payload.installedSensors.map((sensor) => sensor.trim()).filter(Boolean).join(",") || void 0,
    descripcion: payload.notes || void 0,
    entornoCultivo: payload.cultivationType || void 0,
    tipoCultivo: payload.growMedium || void 0
  };
}
async function getGrowRooms() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/rooms")).map(mapApiGrowRoom),
    () => growRooms
  );
}
async function getGrowRoomById(id) {
  if (!/^\d+$/.test(id)) {
    return growRooms.find((room) => room.id === id) ?? null;
  }
  return withMockFallback(
    async () => mapApiGrowRoom(await apiRequest(`/cultivation/rooms/${id}`)),
    () => growRooms.find((room) => room.id === id) ?? null
  );
}
async function createGrowRoom(payload) {
  return withMockFallback(
    async () => mapApiGrowRoom(
      await apiRequest("/cultivation/rooms", {
        method: "POST",
        body: JSON.stringify(toApiGrowRoomPayload(payload))
      })
    ),
    () => {
      const newRoom = {
        id: `room-${Date.now()}`,
        code: payload.code,
        name: payload.name,
        type: payload.type,
        status: payload.status,
        technicalConfig: {
          ...defaultTechnicalConfig,
          installedPowerWatts: payload.installedPowerWatts,
          irrigationSystem: payload.irrigationSystem,
          hasAirConditioning: payload.hasAirConditioning,
          hasDehumidifier: payload.hasDehumidifier,
          installedSensors: payload.installedSensors
        },
        notes: payload.notes
      };
      growRooms.push(newRoom);
      return newRoom;
    }
  );
}
async function updateGrowRoom(id, payload) {
  return withMockFallback(
    async () => mapApiGrowRoom(
      await apiRequest(`/cultivation/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify(toApiGrowRoomPayload({
          code: payload.code ?? "",
          name: payload.name ?? "",
          type: payload.type ?? "vegetativo",
          status: payload.status ?? "activa",
          installedPowerWatts: payload.installedPowerWatts ?? 0,
          irrigationSystem: payload.irrigationSystem ?? "manual",
          hasAirConditioning: payload.hasAirConditioning ?? false,
          hasDehumidifier: payload.hasDehumidifier ?? false,
          installedSensors: payload.installedSensors ?? [],
          cultivationType: payload.cultivationType,
          growMedium: payload.growMedium,
          notes: payload.notes
        }))
      })
    ),
    () => {
      const room = growRooms.find((item) => item.id === id);
      if (!room) throw new Error("Sala de cultivo no encontrada.");
      if (payload.code !== void 0) room.code = payload.code;
      if (payload.name !== void 0) room.name = payload.name;
      if (payload.type !== void 0) room.type = payload.type;
      if (payload.status !== void 0) room.status = payload.status;
      if (payload.notes !== void 0) room.notes = payload.notes;
      room.technicalConfig = {
        ...room.technicalConfig,
        installedPowerWatts: payload.installedPowerWatts ?? room.technicalConfig.installedPowerWatts,
        irrigationSystem: payload.irrigationSystem ?? room.technicalConfig.irrigationSystem,
        hasAirConditioning: payload.hasAirConditioning ?? room.technicalConfig.hasAirConditioning,
        hasDehumidifier: payload.hasDehumidifier ?? room.technicalConfig.hasDehumidifier,
        installedSensors: payload.installedSensors ?? room.technicalConfig.installedSensors
      };
      return room;
    }
  );
}
async function deleteGrowRoom(id) {
  return withMockFallback(
    async () => {
      await apiRequest(`/cultivation/rooms/${id}`, { method: "DELETE" });
    },
    () => {
      const index = growRooms.findIndex((room) => room.id === id);
      if (index === -1) {
        throw new Error("Sala de cultivo no encontrada.");
      }
      growRooms.splice(index, 1);
    }
  );
}
async function updateGrowRoomTechnicalConfig(id, payload) {
  return withMockFallback(
    async () => mapApiGrowRoom(
      await apiRequest(`/cultivation/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          potenciaWatts: payload.installedPowerWatts,
          tipoRiego: payload.irrigationSystem,
          tieneAireAcondicionado: payload.hasAirConditioning,
          tieneDeshumidificador: payload.hasDehumidifier,
          sensores: payload.installedSensors?.map((sensor) => sensor.trim()).filter(Boolean).join(","),
          descripcion: payload.notes
        })
      })
    ),
    () => {
      const room = growRooms.find((item) => item.id === id);
      if (!room) {
        throw new Error("Sala de cultivo no encontrada.");
      }
      room.technicalConfig = {
        ...room.technicalConfig,
        ...payload
      };
      return room;
    }
  );
}
export {
  getGrowRooms as a,
  updateGrowRoomTechnicalConfig as b,
  createGrowRoom as c,
  deleteGrowRoom as d,
  getGrowRoomById as g,
  updateGrowRoom as u
};
