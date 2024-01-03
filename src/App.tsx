import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Input,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { MdAdd, MdDownload } from "react-icons/md";
import "./App.css";
import { styles } from "./index.styles";
import { createXMLString, downLoadFile } from "./utils";

const colorsByPower = {
  z1: "#767676", // grey - recovery
  z2: "#01b2cc", // blue - endurance
  z3: "#5bbe5b", // green - tempo
  z4: "#fbcc42", // yellow - threshold
  z5: "#fb6418", // orange - vo2max
  z6: "#ff0000", // red - anaerobic
};

const lightColorsByPower = {
  z1: "#c8c8c8", // grey - recovery
  z2: "#86effe", // blue - endurance
  z3: "#bde5bd", // green - tempo
  z4: "#fdebb3", // yellow - threshold
  z5: "#fdc1a3", // orange - vo2max
  z6: "#ff9999", // red - anaerobic
};

const getPowerPercentColor = (powerPercent: number) => {
  if (powerPercent < 0.6) return colorsByPower.z1;
  if (powerPercent < 0.75) return colorsByPower.z2;
  if (powerPercent < 0.89) return colorsByPower.z3;
  if (powerPercent < 1.04) return colorsByPower.z4;
  if (powerPercent < 1.18) return colorsByPower.z5;
  return colorsByPower.z6;
};

const getPowerPercentLightColor = (powerPercent: number) => {
  if (powerPercent < 0.6) return lightColorsByPower.z1;
  if (powerPercent < 0.75) return lightColorsByPower.z2;
  if (powerPercent < 0.89) return lightColorsByPower.z3;
  if (powerPercent < 1.04) return lightColorsByPower.z4;
  if (powerPercent < 1.18) return lightColorsByPower.z5;
  return lightColorsByPower.z6;
};

export type FinalField = {
  duration: number;
  power: number;
  pace: number;
};

export type Ramp = {
  duration: string;
  pace: number;
  PowerLow: number;
  PowerHigh: number;
  selected: boolean;
};

type PowerUnit = "watts" | "percent";
const powerUnits: PowerUnit[] = ["watts", "percent"];

const localStorageKey = "FTP";

const _ftp = parseInt(localStorage.getItem(localStorageKey) || "316"); // integer
const _duration = "3"; // float
const _power = 180; // integer
const _pace = 80; // integer
const _powerLow = 80; // float
const _powerHigh = 237; // float
const _field = {
  duration: _duration,
  power: _power,
  pace: _pace,
  selected: false,
};

const todayDate = new Date().toLocaleDateString().replaceAll("/", "-");

const App = () => {
  const [fields, setFields] = useState([_field]);
  const [warmup, setWarmup] = useState<Ramp>();
  const [cooldown, setCooldown] = useState<Ramp>();
  const [finalFields, setFinalFields] = useState<FinalField[]>();
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
      const power = getPower(field.power);
      return {
        ...field,
        power,
        duration,
      };
    });
    const [finalWarmup, finalCooldown] = [warmup, cooldown].map((ramp) => {
      if (!ramp) return;
      const duration = (parseFloat(ramp.duration) * 60).toString();
      const PowerLow = getPower(ramp.PowerLow);
      const PowerHigh = getPower(ramp.PowerHigh);
      return {
        ...ramp,
        PowerLow,
        PowerHigh,
        duration,
      };
    });
    setFinalFields(finalFields);

    const newXmlString = createXMLString(
      finalFields,
      finalWarmup,
      finalCooldown
    );

    downLoadFile(newXmlString, `New-Workout-${todayDate}.zwo`);
    setXmlString(newXmlString);
  };

  const handleTextChange = (
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

  const handleCheckboxChange = (index: number) => {
    setFields((prevState) => {
      return prevState.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            selected: !item.selected,
          };
        }
        return item;
      });
    });
  };

  const duplicateFields = (index: number) => {
    const selectedFields = fields.filter((field) => field.selected);
    const newFields = [...fields]
      .toSpliced(index + 1, 0, ...selectedFields)
      .map((field) => {
        return {
          ...field,
          selected: false,
        };
      });

    setFields(newFields);
  };

  const handleAddNewField = () => setFields([...fields, _field]);

  const handleAddWarmup = () => {
    const warmup = {
      duration: "5",
      pace: _pace,
      PowerLow: _powerLow,
      PowerHigh: _powerHigh,
      selected: false,
    };
    setWarmup(warmup);
  };

  const handleAddCooldown = () => {
    const cooldown = {
      duration: "5",
      pace: _pace,
      PowerLow: _powerLow,
      PowerHigh: _powerHigh,
      selected: false,
    };
    setCooldown(cooldown);
  };

  return (
    <>
      <h1>Zwift ZWO Editor</h1>
      <Box {...stylex.props(styles.root)}>
        <Box>
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
                type="number"
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

          <Box {...stylex.props(styles.params)}>
            <Button
              type="button"
              role="button"
              variant="contained"
              color="primary"
              {...stylex.props(styles.button)}
              onClick={handleAddNewField}
            >
              + Add
            </Button>
            <Button
              type="button"
              role="button"
              variant="contained"
              color="secondary"
              {...stylex.props(styles.button)}
              onClick={handleAddWarmup}
            >
              + Add Warmup
            </Button>
            <Button
              type="button"
              role="button"
              variant="contained"
              color="secondary"
              {...stylex.props(styles.button)}
              onClick={handleAddCooldown}
            >
              + Add Cooldown
            </Button>
          </Box>

          <form noValidate onSubmit={handleSubmit}>
            {warmup && (
              <Box
                {...stylex.props(styles.interval)}
                sx={{
                  background: colorsByPower.z1,
                }}
              >
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`warmup-duration`}
                  >
                    Duration (min)
                  </InputLabel>
                  <Input
                    id={`warmup-duration`}
                    {...stylex.props(styles.input)}
                    type="text"
                    inputMode="decimal"
                    value={warmup.duration}
                    onChange={(e) =>
                      setWarmup((prevState) => ({
                        ...prevState!,
                        duration: e.target.value,
                      }))
                    }
                  />
                </span>
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`warmup-power-low`}
                  >
                    Power Low ({powerUnit})
                  </InputLabel>
                  <Input
                    id={`warmup-power-low`}
                    {...stylex.props(styles.input)}
                    type="number"
                    inputMode="numeric"
                    value={warmup.PowerLow}
                    onChange={(e) =>
                      setWarmup((prevState) => ({
                        ...prevState!,
                        PowerLow: parseFloat(e.target.value),
                      }))
                    }
                  />
                </span>
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`warmup-power-high`}
                  >
                    Power High ({powerUnit})
                  </InputLabel>
                  <Input
                    id={`warmup-power-high`}
                    {...stylex.props(styles.input)}
                    type="number"
                    inputMode="numeric"
                    value={warmup.PowerHigh}
                    onChange={(e) =>
                      setWarmup((prevState) => ({
                        ...prevState!,
                        PowerLow: parseFloat(e.target.value),
                      }))
                    }
                  />
                </span>
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`warmup-pace`}
                  >
                    Pace (RPM)
                  </InputLabel>
                  <Input
                    id={`warmup-pace`}
                    {...stylex.props(styles.input)}
                    type="number"
                    inputMode="numeric"
                    value={warmup.pace}
                    onChange={(e) =>
                      setWarmup((prevState) => ({
                        ...prevState!,
                        pace: parseFloat(e.target.value),
                      }))
                    }
                    sx={{
                      textAlign: "center",
                    }}
                  />
                </span>
              </Box>
            )}
            {fields.map((field, index) => (
              <Box
                {...stylex.props(styles.interval)}
                sx={{
                  background: field.selected
                    ? getPowerPercentColor(getPower(field.power))
                    : getPowerPercentLightColor(getPower(field.power)),
                }}
              >
                <Checkbox
                  checked={field.selected}
                  onChange={() => handleCheckboxChange(index)}
                  {...stylex.props(styles.checkbox)}
                />
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
                    onChange={(e) => handleTextChange(e, "duration", index)}
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
                    type="number"
                    inputMode="numeric"
                    value={field.power}
                    onChange={(e) => handleTextChange(e, "power", index)}
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
                    type="number"
                    inputMode="numeric"
                    value={field.pace}
                    onChange={(e) => handleTextChange(e, "pace", index)}
                    sx={{
                      textAlign: "center",
                    }}
                  />
                </span>
                <Tooltip title="Duplicate Field">
                  <IconButton
                    aria-label="duplicate"
                    onClick={() => duplicateFields(index)}
                    disabled={!fields.some((field) => field.selected)}
                  >
                    <MdAdd />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
            {cooldown && (
              <Box
                {...stylex.props(styles.interval)}
                sx={{
                  background: colorsByPower.z1,
                }}
              >
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`cooldown-duration`}
                  >
                    Duration (min)
                  </InputLabel>
                  <Input
                    id={`cooldown-duration`}
                    {...stylex.props(styles.input)}
                    type="text"
                    inputMode="decimal"
                    value={cooldown.duration}
                    onChange={(e) =>
                      setCooldown((prevState) => ({
                        ...prevState!,
                        duration: e.target.value,
                      }))
                    }
                  />
                </span>
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`cooldown-power-high`}
                  >
                    Power High ({powerUnit})
                  </InputLabel>
                  <Input
                    id={`cooldown-power-high`}
                    {...stylex.props(styles.input)}
                    type="number"
                    inputMode="numeric"
                    value={cooldown.PowerHigh}
                    onChange={(e) =>
                      setCooldown((prevState) => ({
                        ...prevState!,
                        PowerLow: parseFloat(e.target.value),
                      }))
                    }
                  />
                </span>
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`cooldown-power-low`}
                  >
                    Power Low ({powerUnit})
                  </InputLabel>
                  <Input
                    id={`cooldown-power-low`}
                    {...stylex.props(styles.input)}
                    type="number"
                    inputMode="numeric"
                    value={cooldown.PowerLow}
                    onChange={(e) =>
                      setCooldown((prevState) => ({
                        ...prevState!,
                        PowerLow: parseFloat(e.target.value),
                      }))
                    }
                  />
                </span>
                <span {...stylex.props(styles.field)}>
                  <InputLabel
                    {...stylex.props(styles.label)}
                    htmlFor={`cooldown-pace`}
                  >
                    Pace (RPM)
                  </InputLabel>
                  <Input
                    id={`cooldown-pace`}
                    {...stylex.props(styles.input)}
                    type="number"
                    inputMode="numeric"
                    value={cooldown.pace}
                    onChange={(e) =>
                      setCooldown((prevState) => ({
                        ...prevState!,
                        pace: parseFloat(e.target.value),
                      }))
                    }
                    sx={{
                      textAlign: "center",
                    }}
                  />
                </span>
              </Box>
            )}
            <Button
              type="submit"
              {...stylex.props(styles.submit)}
              variant="contained"
              color="primary"
              startIcon={<MdDownload />}
              sx={{
                marginTop: "25px",
              }}
            >
              Download
            </Button>
          </form>
        </Box>
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
