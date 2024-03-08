import { PowerUnit } from "../types";

export class Converter {
  val: number;
  origin: PowerUnit;
  destination: PowerUnit;
  ftp: number;
  weight: number;

  constructor(ftp: number, weight: number, value: number) {
    this.val = value;
    this.origin = "watts";
    this.destination = "percent";
    this.ftp = ftp;
    this.weight = weight;
  }

  private convertFromWatts(value: number, destination: PowerUnit): number {
    switch (destination) {
      case "watts":
        return value;
      case "percent":
        return (value / this.ftp) * 100;
      case "wattsByKg":
        return value / this.weight;
    }
  }

  private convertFromPercent(value: number, destination: PowerUnit): number {
    switch (destination) {
      case "watts":
        return (value * this.ftp) / 100;
      case "percent":
        return value;
      case "wattsByKg":
        return (value * this.ftp) / (this.weight * 100);
    }
  }

  private convertFromWattsByKg(value: number, destination: PowerUnit): number {
    switch (destination) {
      case "watts":
        return value * this.ftp;
      case "percent":
        return ((value * this.weight) / this.ftp) * 100;
      case "wattsByKg":
        return value;
    }
  }

  private convert(value: number, origin: PowerUnit, destination: PowerUnit) {
    switch (origin) {
      case "watts":
        return this.convertFromWatts(value, destination);
      case "percent":
        return this.convertFromPercent(value, destination);
      case "wattsByKg":
        return this.convertFromWattsByKg(value, destination);
    }
  }

  from(from: PowerUnit): this {
    this.origin = from;

    if (this.origin === null) {
      throw new Error(`Unknown origin unit ${from}`);
    }

    return this;
  }

  to(to: PowerUnit): number {
    if (this.origin === null) {
      throw new Error(".to must be called after .from");
    }

    this.destination = to;

    if (this.destination === null) {
      throw new Error(`Unknown destination unit ${to}`);
    }

    const result = this.convert(this.val, this.origin, this.destination);

    return Math.round(result);
  }
}

export default function (
  ftp: number,
  weight: number
): (value: number) => Converter {
  return (value: number) => new Converter(ftp, weight, value);
}
