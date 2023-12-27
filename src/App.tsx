import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import "./App.css";
import { styles } from "./index.styles";

const colorsByPower = {
  z1: "#767676", // grey - recovery
  z2: "#01b2cc", // blue - endurance
  z3: "#5bbe5b", // green - tempo
  z4: "#fbcc42", // yellow - threshold
  z5: "#fb6418", // orange - vo2max
  z6: "#ff0000", // red - anaerobic
};

const getPowerPercentColor = (powerPercent: number) => {
  if (powerPercent < 0.6) return colorsByPower.z1;
  if (powerPercent < 0.75) return colorsByPower.z2;
  if (powerPercent < 0.89) return colorsByPower.z3;
  if (powerPercent < 1.04) return colorsByPower.z4;
  if (powerPercent < 1.18) return colorsByPower.z5;
  return "#FF0000";
};

type Field = {
  duration: number;
  power: number;
  pace: number;
};

const _ftp = 316; // integer
const _duration = "3"; // float
const _power = 180; // integer
const _pace = 80; // integer
const _field = { duration: _duration, power: _power, pace: _pace };

const space = "        ";

const todayDate = new Date().toLocaleDateString().replaceAll("/", "-");

const exportToCSV = (data: string, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

const App = () => {
  const [fields, setFields] = useState([_field]);
  const [finalFields, setFinalFields] = useState<Field[]>();
  const [xmlString, setXmlString] = useState("");
  const [checked, setChecked] = useState(true); // true = watts, false = % ftp
  const [ftp, setFtp] = useState(_ftp);

  const getPower = (power: number) => {
    return checked ? Math.round((power / ftp) * 10) / 10 : power / 100;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const finalFields = fields.map((field) => {
      const duration = parseFloat(field.duration) * 60;
      const pace = field.pace;
      const power = getPower(field.power);
      return {
        ...field,
        power,
        duration,
        pace,
      };
    });
    setFinalFields(finalFields);
    const newXmlString = `
      <workout_file>
        <author/>
        <name>New-Workout-${todayDate}</name>
        <description/>
        <sportType>bike</sportType>
        <durationType>time</durationType>
        <tags/>
        <workout>
        ${finalFields
          .map(({ duration, power, pace }) => {
            return ` <SteadyState Duration="${duration}" Power="${power}" pace="${pace}"/>\n${space}`;
          })
          .join("")}</workout>
      </workout_file>
`;

    exportToCSV(newXmlString, `New-Workout-${todayDate}.zwo`);
    setXmlString(newXmlString);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "duration" | "pace" | "power",
    index: number
  ) => {
    setFields((prevState) => {
      return prevState.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: event.target.value,
          };
        }
        return item;
      });
    });
  };

  const togglePowerUnit = () => {
    setChecked(!checked);
    setFields((prevState) => {
      return prevState.map((item) => {
        return {
          ...item,
          power: 0,
        };
      });
    });
  };

  const handleAddField = () => setFields([...fields, _field]);

  const powerUnit = checked ? "Watts" : "FTP %";

  return (
    <>
      <h1>Zwift ZWO Editor</h1>
      <div {...stylex.props(styles.root)}>
        <form noValidate onSubmit={handleSubmit}>
          <div {...stylex.props(styles.params)}>
            <span>
              <label htmlFor="checkbox" {...stylex.props(styles.label)}>
                {powerUnit}
              </label>
              <input
                id="checkbox"
                type="checkbox"
                {...stylex.props(styles.checkbox)}
                checked={checked}
                onChange={togglePowerUnit}
              />
            </span>
            <span>
              <label htmlFor="ftp" {...stylex.props(styles.label)}>
                FTP (Watts)
              </label>
              <input
                id="ftp"
                type="text"
                {...stylex.props(styles.input)}
                value={ftp}
                onChange={(e) => setFtp(parseInt(e.target.value))}
              />
            </span>
          </div>
          <button
            type="button"
            role="button"
            tabIndex={0}
            {...stylex.props(styles.button)}
            onClick={handleAddField}
          >
            + Add
          </button>
          {fields.map((field, index) => (
            <div {...stylex.props(styles.interval)}>
              <span {...stylex.props(styles.field)}>
                <label
                  {...stylex.props(styles.label)}
                  htmlFor={`duration-${index}`}
                >
                  Duration (min)
                </label>
                <input
                  id={`duration-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  inputMode="decimal"
                  value={field.duration}
                  onChange={(e) => handleChange(e, "duration", index)}
                />
              </span>
              <span {...stylex.props(styles.field)}>
                <label
                  {...stylex.props(styles.label)}
                  htmlFor={`power-${index}`}
                >
                  Power ({powerUnit})
                </label>
                <input
                  id={`power-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  inputMode="numeric"
                  value={field.power}
                  onChange={(e) => handleChange(e, "power", index)}
                />
              </span>
              <span {...stylex.props(styles.field)}>
                <label
                  {...stylex.props(styles.label)}
                  htmlFor={`pace-${index}`}
                >
                  Pace (RPM)
                </label>
                <input
                  id={`pace-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  inputMode="numeric"
                  value={field.pace}
                  onChange={(e) => handleChange(e, "pace", index)}
                />
              </span>
            </div>
          ))}
          <input
            type="submit"
            value="Generate"
            {...stylex.props(styles.submit)}
          />
        </form>
        <div>
          <textarea
            value={xmlString}
            rows={40}
            cols={70}
            {...stylex.props(styles.textArea)}
          />
          <div {...stylex.props(styles.graph)}>
            {finalFields?.map(({ power, duration }, number) => {
              const height = power * 50;
              const width = (duration / 60) * 6;
              return (
                <div
                  key={number}
                  style={{
                    background: getPowerPercentColor(power),
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
