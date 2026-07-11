function saturationVaporPressure(tempC) {
  return 0.61078 * Math.exp(17.27 * tempC / (tempC + 237.3));
}
function calculateVPD({
  airTempC,
  relativeHumidity,
  leafTempC,
  defaultLeafOffset = -2.8
}) {
  const actualLeafTemp = leafTempC ?? airTempC + defaultLeafOffset;
  const svpLeaf = saturationVaporPressure(actualLeafTemp);
  const svpAir = saturationVaporPressure(airTempC);
  const actualVaporPressure = svpAir * (relativeHumidity / 100);
  return Number((svpLeaf - actualVaporPressure).toFixed(2));
}
function getVPDStatus(vpd, stage) {
  if (stage === "esqueje" || stage === "vegetativo") {
    if (vpd < 0.8) return "bajo";
    if (vpd <= 1.1) return "optimo";
    if (vpd <= 1.4) return "alto";
    return "critico";
  }
  if (stage === "floracion") {
    if (vpd < 1) return "bajo";
    if (vpd <= 1.6) return "optimo";
    if (vpd <= 1.9) return "alto";
    return "critico";
  }
  if (vpd < 0.8) return "bajo";
  if (vpd <= 1.4) return "optimo";
  if (vpd <= 1.8) return "alto";
  return "critico";
}
function generateVPDTable({
  temperatures = [20, 22, 24, 26, 28, 30],
  humidities = [40, 45, 50, 55, 60, 65, 70, 75, 80],
  leafOffset = 0
}) {
  return temperatures.map((temperature) => ({
    temperature,
    values: humidities.map((humidity) => ({
      humidity,
      vpd: calculateVPD({
        airTempC: temperature,
        relativeHumidity: humidity,
        leafTempC: temperature + leafOffset
      })
    }))
  }));
}
export {
  getVPDStatus as a,
  calculateVPD as c,
  generateVPDTable as g
};
