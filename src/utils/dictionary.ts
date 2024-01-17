import { PowerUnit } from "../types";

export const mapPowerUnitToLabel: { [keys in PowerUnit]: string } = {
  watts: "watts",
  percent: "FTP %",
  wattsByKg: "watts/kg",
};
