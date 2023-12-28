import {
  Box,
  Button,
  Input,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
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

type PowerUnit = "watts" | "percent";
const powerUnits: PowerUnit[] = ["watts", "percent"];

const localStorageKey = "FTP";

const _ftp = parseInt(localStorage.getItem(localStorageKey) || "316"); // integer
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
  const [powerUnit, setPowerUnit] = useState<PowerUnit>(powerUnits[0]); // watts or percent
  const [ftp, setFtp] = useState(_ftp);

  const getPower = (power: number) => {
    return powerUnit === "watts"
      ? Math.round((power / ftp) * 10) / 10
      : power / 100;
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    setPowerUnit((prevState) => (prevState === "watts" ? "percent" : "watts"));
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

  return (
    <>
      <h1>Zwift ZWO Editor</h1>
      <Box {...stylex.props(styles.root)}>
        <form noValidate onSubmit={handleSubmit}>
          <Box {...stylex.props(styles.params)}>
            <ToggleButtonGroup
              value={powerUnit}
              exclusive
              onChange={togglePowerUnit}
              aria-label="Power unit"
            >
              <ToggleButton value={powerUnits[0]} aria-label="Watts">
                Watts
              </ToggleButton>
              <ToggleButton value={powerUnits[1]} aria-label="FTP %">
                FTP %
              </ToggleButton>
            </ToggleButtonGroup>

            <span>
              <InputLabel htmlFor="ftp" {...stylex.props(styles.label)}>
                FTP (Watts)
              </InputLabel>
              <Input
                id="ftp"
                type="text"
                {...stylex.props(styles.input)}
                value={ftp}
                onChange={(e) => {
                  const value = e.target.value;
                  setFtp(parseInt(value));
                  localStorage.setItem(localStorageKey, value);
                }}
              />
            </span>
          </Box>
          <Button
            type="button"
            role="button"
            variant="contained"
            tabIndex={0}
            {...stylex.props(styles.button)}
            onClick={handleAddField}
          >
            + Add
          </Button>
          {fields.map((field, index) => (
            <Box {...stylex.props(styles.interval)}>
              <span {...stylex.props(styles.field)}>
                <InputLabel
                  {...stylex.props(styles.label)}
                  htmlFor={`duration-${index}`}
                >
                  Duration (min)
                </InputLabel>
                <Input
                  id={`duration-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  inputMode="decimal"
                  value={field.duration}
                  onChange={(e) => handleChange(e, "duration", index)}
                />
              </span>
              <span {...stylex.props(styles.field)}>
                <InputLabel
                  {...stylex.props(styles.label)}
                  htmlFor={`power-${index}`}
                >
                  Power ({powerUnit})
                </InputLabel>
                <Input
                  id={`power-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  inputMode="numeric"
                  value={field.power}
                  onChange={(e) => handleChange(e, "power", index)}
                />
              </span>
              <span {...stylex.props(styles.field)}>
                <InputLabel
                  {...stylex.props(styles.label)}
                  htmlFor={`pace-${index}`}
                >
                  Pace (RPM)
                </InputLabel>
                <Input
                  id={`pace-${index}`}
                  {...stylex.props(styles.input)}
                  type="text"
                  inputMode="numeric"
                  value={field.pace}
                  onChange={(e) => handleChange(e, "pace", index)}
                />
              </span>
            </Box>
          ))}
          <input
            type="submit"
            value="Generate"
            {...stylex.props(styles.submit)}
          />
        </form>
        <Box>
          <textarea
            value={xmlString}
            rows={40}
            cols={70}
            {...stylex.props(styles.textArea)}
          />
          <Box {...stylex.props(styles.graph)}>
            {finalFields?.map(({ power, duration }, number) => {
              const height = power * 50;
              const width = (duration / 60) * 6;
              return (
                <Box
                  key={number}
                  style={{
                    background: getPowerPercentColor(power),
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default App;
