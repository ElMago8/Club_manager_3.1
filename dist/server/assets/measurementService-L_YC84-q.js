import { c as cultivationMeasurements } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
const STATUS_WEIGHT = {
  normal: 0,
  observation: 1,
  alert: 2,
  critical: 3
};
function classifyPh(value, normalMin, normalMax, obsMin, obsMax, alertMin, alertMax) {
  if (value === void 0) return "normal";
  if (value >= normalMin && value <= normalMax) return "normal";
  if (value >= obsMin && value <= obsMax) return "observation";
  if (value >= alertMin && value <= alertMax) return "alert";
  return "critical";
}
function classifyPpm(value, normalMax, observationMax, alertMax) {
  if (value === void 0) return "normal";
  if (value >= 300 && value <= normalMax) return "normal";
  if (value <= observationMax) return "observation";
  if (value <= alertMax) return "alert";
  return "critical";
}
function getLocalMeasurementStatus(measurement) {
  const statuses = [
    classifyPh(measurement.liquidPH, 5.5, 6.8, 5.2, 7.2, 4.8, 7.6),
    classifyPh(measurement.substratePH, 5.8, 7, 5.5, 7.3, 5, 7.8),
    classifyPpm(measurement.liquidPPM, 1400, 1800, 2200),
    classifyPpm(measurement.substratePPM, 1600, 2e3, 2500)
  ];
  return statuses.reduce((worst, status) => STATUS_WEIGHT[status] > STATUS_WEIGHT[worst] ? status : worst, "normal");
}
function mapApiMedicion(item) {
  const date = new Date(item.fecha).toISOString().slice(0, 10);
  const status = ["normal", "observation", "alert", "critical"].includes(item.estado) ? item.estado : "normal";
  const relatedModule = item.madreId != null ? "mother" : item.plantaId != null ? "plant" : item.camillaId != null ? "bed" : "general";
  return {
    id: String(item.id),
    measurementType: item.tipo ?? "mixed",
    date,
    time: item.hora,
    roomId: String(item.salaCultivoId),
    bedId: item.camillaId != null ? String(item.camillaId) : void 0,
    clonadorId: item.clonadorId != null ? String(item.clonadorId) : void 0,
    plantId: item.plantaId != null ? String(item.plantaId) : void 0,
    motherPlantId: item.madreId != null ? String(item.madreId) : void 0,
    relatedModule,
    liquidPH: item.phLiquido ?? void 0,
    liquidPPM: item.ppmLiquido ?? void 0,
    substratePH: item.phSustrato ?? void 0,
    substratePPM: item.ppmSustrato ?? void 0,
    runoffPH: item.phDrenaje ?? void 0,
    runoffPPM: item.ppmDrenaje ?? void 0,
    measurementMethod: item.metodo ?? void 0,
    responsibleName: item.responsable ?? void 0,
    notes: item.observaciones ?? void 0,
    status
  };
}
function toApiPayload(payload) {
  const estado = payload.status ?? getLocalMeasurementStatus(payload);
  return {
    fecha: payload.date,
    hora: payload.time,
    tipo: payload.measurementType,
    salaCultivoId: Number(payload.roomId),
    camillaId: payload.bedId ? Number(payload.bedId) : void 0,
    plantaId: payload.plantId ? Number(payload.plantId) : void 0,
    madreId: payload.motherPlantId ? Number(payload.motherPlantId) : void 0,
    phLiquido: payload.liquidPH,
    ppmLiquido: payload.liquidPPM,
    phSustrato: payload.substratePH,
    ppmSustrato: payload.substratePPM,
    phDrenaje: payload.runoffPH,
    ppmDrenaje: payload.runoffPPM,
    estado,
    metodo: payload.measurementMethod,
    responsable: payload.responsibleName,
    observaciones: payload.notes
  };
}
function buildQueryParams(filters) {
  const params = new URLSearchParams();
  if (filters.roomId) params.set("salaCultivoId", filters.roomId);
  if (filters.bedId) params.set("camillaId", filters.bedId);
  if (filters.clonadorId) params.set("clonadorId", filters.clonadorId);
  if (filters.plantId) params.set("plantaId", filters.plantId);
  if (filters.motherPlantId) params.set("madreId", filters.motherPlantId);
  if (filters.status) params.set("estado", filters.status);
  if (filters.measurementType) params.set("tipo", filters.measurementType);
  if (filters.dateFrom) params.set("fechaDesde", filters.dateFrom);
  if (filters.dateTo) params.set("fechaHasta", filters.dateTo);
  return params.toString();
}
function filterMockMeasurements(filters) {
  return cultivationMeasurements.filter((item) => {
    if (filters.roomId && item.roomId !== filters.roomId) return false;
    if (filters.bedId && item.bedId !== filters.bedId) return false;
    if (filters.plantId && item.plantId !== filters.plantId) return false;
    if (filters.motherPlantId && item.motherPlantId !== filters.motherPlantId) return false;
    if (filters.batchId && item.batchId !== filters.batchId) return false;
    if (filters.measurementType && item.measurementType !== filters.measurementType) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.relatedModule && item.relatedModule !== filters.relatedModule) return false;
    if (filters.dateFrom && item.date < filters.dateFrom) return false;
    if (filters.dateTo && item.date > filters.dateTo) return false;
    return true;
  }).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
}
function average(values) {
  const cleanValues = values.filter((value) => typeof value === "number");
  if (!cleanValues.length) return null;
  return Number((cleanValues.reduce((total, value) => total + value, 0) / cleanValues.length).toFixed(2));
}
function mockSummary(filters) {
  const measurements = filterMockMeasurements(filters);
  return {
    latestMeasurements: measurements.slice(0, 6),
    outOfRangeMeasurements: measurements.filter((item) => item.status === "alert" || item.status === "critical").slice(0, 10),
    averageLiquidPH: average(measurements.map((item) => item.liquidPH)),
    averageSubstratePH: average(measurements.map((item) => item.substratePH)),
    averageLiquidPPM: average(measurements.map((item) => item.liquidPPM)),
    averageSubstratePPM: average(measurements.map((item) => item.substratePPM)),
    alertsCount: measurements.filter((item) => item.status === "alert").length,
    criticalCount: measurements.filter((item) => item.status === "critical").length
  };
}
async function getMeasurements(filters = {}) {
  const qs = buildQueryParams(filters);
  return withMockFallback(
    async () => (await apiRequest(`/cultivation/measurements${qs ? `?${qs}` : ""}`)).map(mapApiMedicion),
    () => filterMockMeasurements(filters)
  );
}
async function getMeasurementSummary(filters = {}) {
  return withMockFallback(
    async () => {
      const measurements = (await apiRequest("/cultivation/measurements")).map(mapApiMedicion);
      const filtered = filters.roomId ? measurements.filter((item) => item.roomId === filters.roomId) : measurements;
      return {
        latestMeasurements: filtered.slice(0, 6),
        outOfRangeMeasurements: filtered.filter((item) => item.status === "alert" || item.status === "critical").slice(0, 10),
        averageLiquidPH: average(filtered.map((item) => item.liquidPH)),
        averageSubstratePH: average(filtered.map((item) => item.substratePH)),
        averageLiquidPPM: average(filtered.map((item) => item.liquidPPM)),
        averageSubstratePPM: average(filtered.map((item) => item.substratePPM)),
        alertsCount: filtered.filter((item) => item.status === "alert").length,
        criticalCount: filtered.filter((item) => item.status === "critical").length
      };
    },
    () => mockSummary(filters)
  );
}
async function createMeasurement(payload) {
  return withMockFallback(
    async () => mapApiMedicion(
      await apiRequest("/cultivation/measurements", {
        method: "POST",
        body: JSON.stringify(toApiPayload(payload))
      })
    ),
    () => {
      const measurement = {
        ...payload,
        id: `measurement-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        status: getLocalMeasurementStatus(payload)
      };
      cultivationMeasurements.unshift(measurement);
      return measurement;
    }
  );
}
export {
  getMeasurementSummary as a,
  getMeasurements as b,
  createMeasurement as c,
  getLocalMeasurementStatus as g
};
