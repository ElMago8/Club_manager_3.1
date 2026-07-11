import { e as environmentalLogs } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
import { c as calculateVPD, a as getVPDStatus } from "./vpdCalculator-CDiK96pa.js";
const API_TO_UI_VPD_STATUS = {
  low: "bajo",
  optimal: "optimo",
  high: "alto",
  critical: "critico"
};
const UI_TO_API_VPD_STATUS = {
  bajo: "low",
  optimo: "optimal",
  alto: "high",
  critico: "critical"
};
function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function buildVPDResult(payload) {
  const calculatedVPD = calculateVPD({
    airTempC: payload.airTempC,
    relativeHumidity: payload.relativeHumidity,
    leafTempC: payload.leafTempC,
    defaultLeafOffset: -2.8
  });
  return {
    calculatedVPD,
    vpdStatus: getVPDStatus(calculatedVPD, payload.stage)
  };
}
function dateOnly(value) {
  return value.slice(0, 10);
}
function mapApiEnvironmentalLog(log) {
  return {
    id: log.id,
    roomId: log.bed?.roomId ?? "room-sin-asignar",
    bedId: log.bedId ?? void 0,
    batchId: log.batchId ?? void 0,
    date: dateOnly(log.date),
    time: log.time,
    airTempC: log.airTempC,
    relativeHumidity: log.relativeHumidity,
    leafTempC: log.leafTempC ?? void 0,
    co2ppm: log.co2ppm ?? void 0,
    calculatedVPD: log.calculatedVPD ?? void 0,
    vpdStatus: log.vpdStatus ? API_TO_UI_VPD_STATUS[log.vpdStatus] : void 0,
    recordedByUserId: "backend",
    notes: log.notes ?? void 0
  };
}
function toApiEnvironmentalFilters(filters) {
  return Object.fromEntries(
    Object.entries({
      bedId: filters.bedId,
      batchId: filters.batchId,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      vpdStatus: filters.vpdStatus ? UI_TO_API_VPD_STATUS[filters.vpdStatus] : void 0
    }).filter(([, value]) => value)
  );
}
async function getEnvironmentalLogs(filters = {}) {
  return withMockFallback(
    async () => {
      const query = new URLSearchParams(toApiEnvironmentalFilters(filters));
      const logs = await apiRequest(
        `/cultivation/environmental-logs${query.size ? `?${query.toString()}` : ""}`
      );
      return logs.map(mapApiEnvironmentalLog).filter((log) => !filters.roomId || log.roomId === filters.roomId);
    },
    () => environmentalLogs.filter((log) => {
      if (filters.roomId && log.roomId !== filters.roomId) return false;
      if (filters.bedId && log.bedId !== filters.bedId) return false;
      if (filters.batchId && log.batchId !== filters.batchId) return false;
      if (filters.dateFrom && log.date < filters.dateFrom) return false;
      if (filters.dateTo && log.date > filters.dateTo) return false;
      if (filters.vpdStatus && log.vpdStatus !== filters.vpdStatus) return false;
      return true;
    })
  );
}
async function createEnvironmentalLog(payload) {
  return withMockFallback(
    async () => mapApiEnvironmentalLog(
      await apiRequest("/cultivation/environmental-logs", {
        method: "POST",
        body: JSON.stringify({
          roomId: payload.roomId,
          bedId: payload.bedId,
          batchId: payload.batchId,
          date: payload.date,
          time: payload.time,
          airTempC: payload.airTempC,
          relativeHumidity: payload.relativeHumidity,
          leafTempC: payload.leafTempC,
          co2ppm: payload.co2ppm,
          stage: payload.stage,
          notes: payload.notes
        })
      })
    ),
    () => {
      const { stage, ...logPayload } = payload;
      const { calculatedVPD, vpdStatus } = buildVPDResult({
        airTempC: logPayload.airTempC,
        relativeHumidity: logPayload.relativeHumidity,
        leafTempC: logPayload.leafTempC,
        stage
      });
      const newLog = {
        ...logPayload,
        id: logPayload.id ?? createMockId("env-log"),
        calculatedVPD,
        vpdStatus
      };
      environmentalLogs.push(newLog);
      return newLog;
    }
  );
}
async function calculateVPDPreview(payload) {
  return withMockFallback(
    async () => {
      const preview = await apiRequest("/cultivation/vpd/preview", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      return {
        calculatedVPD: preview.calculatedVPD,
        vpdStatus: API_TO_UI_VPD_STATUS[preview.vpdStatus]
      };
    },
    () => buildVPDResult(payload)
  );
}
export {
  createEnvironmentalLog as a,
  calculateVPDPreview as c,
  getEnvironmentalLogs as g
};
