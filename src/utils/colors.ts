export const colorsByPower = {
  z1: "#909090", // grey - recovery
  z2: "#01b2cc", // blue - endurance
  z3: "#5bbe5b", // green - tempo
  z4: "#fbcc42", // yellow - threshold
  z5: "#fb6418", // orange - vo2max
  z6: "#ff0000", // red - anaerobic
  warmup: "linear-gradient(to right, #909090, #01b2cc, #5bbe5b, #fbcc42)",
  cooldown: "linear-gradient(to left, #909090, #01b2cc, #5bbe5b, #fbcc42)",
};

export const lightColorsByPower = {
  z1: "#c8c8c8", // grey - recovery
  z2: "#86effe", // blue - endurance
  z3: "#bde5bd", // green - tempo
  z4: "#fdebb3", // yellow - threshold
  z5: "#fdc1a3", // orange - vo2max
  z6: "#ff9999", // red - anaerobic
};

export const labelsByPower = {
  z1: "Z1 - Recovery",
  z2: "Z2 - Endurance",
  z3: "Z3 - Tempo",
  z4: "Z4 - Threshold",
  z5: "Z5 - VO2Max",
  z6: "Z6 - Anaerobic",
};

export const percentsByPower = {
  z1: "-60%",
  z2: "60-75%",
  z3: "76-89%",
  z4: "89-104%",
  z5: "105-118%",
  z6: "+118%",
};

export const getPowerPercentColor = (powerPercent: number) => {
  if (powerPercent < 0.6) return colorsByPower.z1;
  if (powerPercent < 0.75) return colorsByPower.z2;
  if (powerPercent < 0.89) return colorsByPower.z3;
  if (powerPercent < 1.04) return colorsByPower.z4;
  if (powerPercent < 1.18) return colorsByPower.z5;
  return colorsByPower.z6;
};

export const getPowerPercentLightColor = (powerPercent: number) => {
  if (powerPercent < 0.6) return lightColorsByPower.z1;
  if (powerPercent < 0.75) return lightColorsByPower.z2;
  if (powerPercent < 0.89) return lightColorsByPower.z3;
  if (powerPercent < 1.04) return lightColorsByPower.z4;
  if (powerPercent < 1.18) return lightColorsByPower.z5;
  return lightColorsByPower.z6;
};
