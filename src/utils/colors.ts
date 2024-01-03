export const colorsByPower = {
  z1: "#767676", // grey - recovery
  z2: "#01b2cc", // blue - endurance
  z3: "#5bbe5b", // green - tempo
  z4: "#fbcc42", // yellow - threshold
  z5: "#fb6418", // orange - vo2max
  z6: "#ff0000", // red - anaerobic
};

export const lightColorsByPower = {
  z1: "#c8c8c8", // grey - recovery
  z2: "#86effe", // blue - endurance
  z3: "#bde5bd", // green - tempo
  z4: "#fdebb3", // yellow - threshold
  z5: "#fdc1a3", // orange - vo2max
  z6: "#ff9999", // red - anaerobic
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
