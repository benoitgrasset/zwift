import { CSSProperties } from "react";
import { colorsByPower, labelsByPower, percentsByPower } from "../utils/colors";
import { roundNumber } from "../utils/maths";

type Props = {
  ftp: number;
  className?: string;
};

const style: CSSProperties = {
  padding: "0.5em",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Legend = ({ className, ftp }: Props) => {
  const nbZones = Object.values(labelsByPower).length;
  return (
    <div className={className}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${nbZones}, 1fr)`,
          gridTemplateRows: "repeat(3, 1fr)",
          gridColumnGap: "0px",
          gridRowGap: "0px",
        }}
      >
        {Object.values(labelsByPower).map((label, index) => (
          <div
            key={index}
            style={{
              background: "lightgrey",
              ...style,
            }}
          >
            {label}
          </div>
        ))}
        {Object.values(percentsByPower).map((percent, index) => (
          <div
            key={index}
            style={{
              background: Object.values(colorsByPower)[index],
              ...style,
            }}
          >
            {percent}
          </div>
        ))}
        {Object.values(percentsByPower).map((percent, index) => {
          const min = roundNumber(
            (parseFloat(percent.split("-")[0]) / 100) * ftp
          );
          const max = roundNumber(
            (parseFloat(percent.split("-")[1]) / 100) * ftp
          );
          return (
            <div
              key={index}
              style={{
                background: Object.values(colorsByPower)[index],
                ...style,
              }}
            >
              {min ? `${min}W` : ""}
              {min && max ? "-" : ""}
              {max ? `${max}W` : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;
