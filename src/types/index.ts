export type FinalField = {
  duration: number;
  power: number;
  pace: number;
};

export type IField = {
  duration: string;
  power: number;
  pace: number;
  selected: boolean;
};

export type Ramp = {
  duration: string;
  pace: number;
  PowerLow: number;
  PowerHigh: number;
  selected: boolean;
};

export type PowerUnit = "watts" | "percent" | "wattsByKg";
