export type FinalField = {
  duration: number;
  power: number;
  pace: number;
};

export type IField = {
  duration: string | undefined;
  /** power in Watts */
  power: number;
  /** power in the unit chosen */
  powerToDisplay: number;
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

export type IntervalField = "duration" | "pace" | "power";

export type { Action } from "./actions";
