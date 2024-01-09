import { colorsByPower, labelsByPower, percentsByPower } from "../utils/colors";

type Props = {
  className?: string;
};

const Legend = ({ className }: Props) => {
  const nbZones = Object.values(labelsByPower).length;
  return (
    <div className={className}>
      <h2>Legend</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${nbZones}, 1fr)`,
          gridTemplateRows: "repeat(2, 1fr)",
          gridColumnGap: "0px",
          gridRowGap: "0px",
          alignItems: "center",
        }}
      >
        {Object.values(labelsByPower).map((label, index) => (
          <div
            key={index}
            style={{
              background: "lightgrey",
              padding: "0.5em",
              textAlign: "center",
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
              padding: "0.5em",
              textAlign: "center",
            }}
          >
            {percent}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
