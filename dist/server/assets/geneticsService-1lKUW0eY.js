import { g as genetics } from "./cultivationMockData-B9eg4-Ml.js";
import { w as withMockFallback, a as apiRequest } from "./cultivationApi-DWB3k4sN.js";
function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function createGeneticsCode(name) {
  const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 24) || "GENETICA";
  return `GEN-${slug}-${Date.now().toString(36).toUpperCase()}`;
}
function normalizeType(type) {
  if (type === "feminized") return "feminizada";
  if (type === "automatic") return "automatica";
  if (type === "clone") return "esqueje";
  if (type === "unknown") return "desconocida";
  if (type === "regular" || type === "feminizada" || type === "automatica" || type === "esqueje" || type === "desconocida") {
    return type;
  }
  return "desconocida";
}
function dominantProfileFromPercentages(indica, sativa) {
  if (typeof indica !== "number" || typeof sativa !== "number") return "desconocida";
  if (indica === sativa) return "hibrida";
  return indica > sativa ? "indica" : "sativa";
}
function optionalString(value) {
  if (value === void 0) return void 0;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function mapApiGenetics(item) {
  const indicaPercent = item.indicaPorcentaje ?? void 0;
  const sativaPercent = item.sativaPorcentaje ?? void 0;
  return {
    id: String(item.id),
    name: item.nombre ?? item.name ?? "",
    breeder: item.breeder ?? void 0,
    origin: ["madre", "semilla", "esqueje"].includes(item.origen ?? "") ? item.origen : void 0,
    type: normalizeType(item.tipo ?? item.type),
    dominantProfile: dominantProfileFromPercentages(indicaPercent, sativaPercent),
    cannabinoidProfile: item.perfilCannabionoide ?? void 0,
    thcPercent: item.thcEstimado ?? void 0,
    cbdPercent: item.cbdEstimado ?? void 0,
    floweringTimeDays: item.tiempoFloracionDias ?? void 0,
    sativaPercent,
    indicaPercent,
    taste: item.sabor ?? void 0,
    effect: item.efecto ?? void 0,
    aroma: item.aroma ?? void 0,
    description: item.descripcion ?? void 0,
    notes: item.observaciones ?? item.notes ?? void 0
  };
}
function toApiGeneticsPayload(payload) {
  const isCreatePayload = "assignToBed" in payload;
  const trimmedName = payload.name?.trim();
  return {
    codigoGenetica: isCreatePayload && trimmedName ? createGeneticsCode(trimmedName) : void 0,
    nombre: trimmedName,
    breeder: optionalString(payload.breeder),
    origen: optionalString(payload.origin),
    tipo: payload.type,
    perfilCannabionoide: payload.cannabinoidProfile ?? null,
    thcEstimado: payload.thcPercent,
    cbdEstimado: payload.cbdPercent,
    tiempoFloracionDias: payload.floweringTimeDays,
    sativaPorcentaje: payload.sativaPercent,
    indicaPorcentaje: payload.indicaPercent,
    sabor: optionalString(payload.taste),
    efecto: optionalString(payload.effect),
    aroma: optionalString(payload.aroma),
    descripcion: optionalString(payload.description),
    observaciones: optionalString(payload.notes)
  };
}
async function getGenetics() {
  return withMockFallback(
    async () => (await apiRequest("/cultivation/genetics")).map(mapApiGenetics),
    () => genetics
  );
}
async function getGeneticsById(id) {
  if (!/^\d+$/.test(id)) {
    const item = genetics.find((genetic) => genetic.id === id);
    if (!item) throw new Error("Genetica no encontrada.");
    return item;
  }
  return withMockFallback(
    async () => mapApiGenetics(await apiRequest(`/cultivation/genetics/${id}`)),
    () => {
      const item = genetics.find((genetic) => genetic.id === id);
      if (!item) throw new Error("Genetica no encontrada.");
      return item;
    }
  );
}
async function createGenetics(payload) {
  return withMockFallback(
    async () => mapApiGenetics(
      await apiRequest("/cultivation/genetics", {
        method: "POST",
        body: JSON.stringify(toApiGeneticsPayload(payload))
      })
    ),
    () => {
      const newGenetics = {
        ...payload,
        id: payload.id ?? createMockId("gen")
      };
      genetics.push(newGenetics);
      return newGenetics;
    }
  );
}
async function updateGenetics(id, payload) {
  const item = genetics.find((genetic) => genetic.id === id);
  return withMockFallback(
    async () => mapApiGenetics(
      await apiRequest(`/cultivation/genetics/${id}`, {
        method: "PUT",
        body: JSON.stringify(toApiGeneticsPayload(payload))
      })
    ),
    () => {
      if (!item) {
        throw new Error("Genetica no encontrada.");
      }
      Object.assign(item, payload);
      return item;
    }
  );
}
async function deleteGenetics(id) {
  return withMockFallback(
    async () => {
      await apiRequest(`/cultivation/genetics/${id}`, { method: "DELETE" });
    },
    () => {
      const index = genetics.findIndex((genetic) => genetic.id === id);
      if (index === -1) {
        throw new Error("Genetica no encontrada.");
      }
      genetics.splice(index, 1);
    }
  );
}
export {
  getGeneticsById as a,
  createGenetics as c,
  deleteGenetics as d,
  getGenetics as g,
  updateGenetics as u
};
