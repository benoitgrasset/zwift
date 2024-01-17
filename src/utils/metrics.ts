import { roundNumber } from "./maths";

type Activity = {
  watts: number;
  duration: number;
  sufferScore: number;
};

/**
 *
 * @param activity
 * @returns Training Stress Score (TSS)
 */
export const getTSS = (activity: Activity) => {
  const { sufferScore, duration } = activity;
  if (!sufferScore) return null;
  return roundNumber((sufferScore * duration) / (60 * 60 * 100));
};

export const getIntensityFactor = (activity: Activity, FTP: number) => {
  const { watts } = activity;
  if (!FTP || !watts) return null;
  return roundNumber(watts / FTP);
};

export const getIntensityFactorByDuration = (power: number, FTP: number) => {
  return power / FTP;
};

export const getTrainingLoad = (
  power: number,
  duration: number,
  FTP: number
) => {
  const intensityFactor = getIntensityFactorByDuration(power, FTP);
  return ((duration * power * intensityFactor) / (FTP * 3600)) * 100;
};
