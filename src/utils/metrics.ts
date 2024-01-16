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

export const getTrainingLoad = () => 0;
