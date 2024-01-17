import {
  Box,
  Button,
  Checkbox,
  Input,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { MdAdd, MdDownload, MdUpload } from "react-icons/md";
import "./App.css";
import Field from "./components/Field";
import Legend from "./components/Legend";
import { styles } from "./index.styles";
import { FinalField, PowerUnit, Ramp } from "./types";
import { createXMLString, downLoadFile, parseXMLFile } from "./utils";
import { colorsByPower, getPowerPercentColor } from "./utils/colors";
import { mapPowerUnitToLabel } from "./utils/dictionary";
import { roundNumber } from "./utils/maths";
import { getTrainingLoad } from "./utils/metrics";

const powerUnits: PowerUnit[] = ["watts", "percent", "wattsByKg"];

const localStorageKeyFTP = "FTP";
const localStorageKeyWeight = "weight";

const _ftp = parseInt(localStorage.getItem(localStorageKeyFTP) || "316"); // integer
const _weight = parseInt(localStorage.getItem(localStorageKeyWeight) || "80"); // integer
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
const _warmup = {
  duration: "5",
  pace: _pace,
  PowerLow: _powerLow,
  PowerHigh: _powerHigh,
  selected: false,
};
const _cooldown = {
  duration: "5",
  pace: _pace,
  PowerLow: _powerLow,
  PowerHigh: _powerHigh,
  selected: false,
};

const todayDate = new Date().toLocaleDateString().replaceAll("/", "-");

/**
 *
 * @param duration string in minutes
 * @returns number in seconds
 */
const getDuration = (duration: string) => {
  return parseFloat(duration) * 60;
};

const getDurationFromFile = (duration: string) => {
  return (Number(duration) / 60).toFixed(1);
};

const App = () => {
  const [fields, setFields] = useState([_field]);
  const [warmup, setWarmup] = useState<Ramp>(_warmup);
  const [cooldown, setCooldown] = useState<Ramp>(_cooldown);
  const [finalFields, setFinalFields] = useState<FinalField[]>();
  const [xmlString, setXmlString] = useState("");
  const [powerUnit, setPowerUnit] = useState<PowerUnit>("watts"); // watts or percent
  const [ftp, setFtp] = useState(_ftp);
  const [weight, setWeight] = useState(_weight);

  /**
   *
   * @param power number
   * @returns number in percent or watts
   */
  const getPower = (power: number) => {
    return powerUnit === "watts" ? roundNumber(power / ftp) : power / 100;
  };

  const getPowerFromFile = (power: number) => {
    return powerUnit === "watts" ? power * ftp : power * 100;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const finalFields = fields.map((field) => {
      const duration = getDuration(field.duration);
      const power = getPower(field.power);
      return {
        ...field,
        power,
        duration,
      };
    });
    const [finalWarmup, finalCooldown] = [warmup, cooldown].map((ramp) => {
      if (!ramp) return;
      const duration = getDuration(ramp.duration).toString();
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

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      throw new Error("No file selected");
    }
    const reader = new FileReader();

    reader.onload = (e) => {
      const xmlString = e.target?.result as string;
      const result = parseXMLFile(xmlString);
      if (result) {
        const { intervals, cooldown, warmup } = result;
        setFields(
          intervals.map((interval) => ({
            ...interval,
            power: getPowerFromFile(interval.power),
            duration: getDurationFromFile(interval.duration),
          }))
        );
        setCooldown({
          ...cooldown,
          PowerLow: getPowerFromFile(cooldown.PowerLow),
          PowerHigh: getPowerFromFile(cooldown.PowerHigh),
          duration: getDurationFromFile(cooldown.duration),
        });
        setWarmup({
          ...warmup,
          PowerLow: getPowerFromFile(warmup.PowerLow),
          PowerHigh: getPowerFromFile(warmup.PowerHigh),
          duration: getDurationFromFile(warmup.duration),
        });
      }
    };
    reader.readAsText(file);
  };

  const togglePowerUnit = (
    _event: React.MouseEvent<HTMLElement>,
    value: PowerUnit | null
  ) => {
    if (value !== null) {
      setPowerUnit(value);
    }
    setFields((prevState) => {
      return prevState.map((item) => {
        return {
          ...item,
          power:
            powerUnit === "watts"
              ? roundNumber((item.power / ftp) * 100)
              : roundNumber((item.power * ftp) / 100),
        };
      });
    });
  };

  const addNewField = () => setFields([...fields, _field]);

  const nbFields = fields.length;
  const nbSelectedFields = fields.filter((field) => field.selected).length;
  const indeterminate = nbSelectedFields > 0 && nbSelectedFields < nbFields;
  const checked = nbSelectedFields === nbFields;

  const duration =
    fields.reduce((acc, field) => {
      return acc + parseFloat(field.duration);
    }, 0) +
    parseFloat(warmup?.duration || "0") +
    parseFloat(cooldown?.duration || "0");

  const trainingLoad = fields.reduce((acc, field) => {
    const power = (field.power * ftp) / 100;
    return acc + getTrainingLoad(power, parseFloat(field.duration), ftp);
  }, 0);

  const handleCheckSelectAll = () => {
    const newFields = fields.map((field) => {
      return {
        ...field,
        selected: !checked,
      };
    });
    setFields(newFields);
  };

  return (
    <>
      <h1>Zwift ZWO Editor</h1>
      <Box {...stylex.props(styles.root)}>
        <Box>
          <Legend {...stylex.props(styles.legend)} />
          <Box {...stylex.props(styles.params)}>
            <ToggleButtonGroup
              value={powerUnit}
              exclusive
              onChange={togglePowerUnit}
              aria-label="Power unit"
            >
              <ToggleButton value={powerUnits[0]} aria-label="Watts">
                {mapPowerUnitToLabel[powerUnits[0]]}
              </ToggleButton>
              <ToggleButton value={powerUnits[1]} aria-label="FTP %">
                {mapPowerUnitToLabel[powerUnits[1]]}
              </ToggleButton>
              <ToggleButton value={powerUnits[2]} aria-label="FTP/kg" disabled>
                {mapPowerUnitToLabel[powerUnits[2]]}
              </ToggleButton>
            </ToggleButtonGroup>

            <Box gap={2} display="flex">
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
                    localStorage.setItem(localStorageKeyFTP, value);
                  }}
                />
              </span>
              <span>
                <InputLabel htmlFor="weight" {...stylex.props(styles.label)}>
                  Weight (kg)
                </InputLabel>
                <Input
                  id="weight"
                  type="number"
                  {...stylex.props(styles.input)}
                  value={weight}
                  onChange={(e) => {
                    const value = e.target.value;
                    setWeight(parseInt(value));
                    localStorage.setItem(localStorageKeyWeight, value);
                  }}
                />
              </span>
            </Box>
          </Box>

          <Box {...stylex.props(styles.interval)}>
            <span>
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={handleCheckSelectAll}
                id="select-all"
              />
              <InputLabel htmlFor="select-all" {...stylex.props(styles.label)}>
                Select All
              </InputLabel>
            </span>
            <Button
              type="button"
              variant="contained"
              color="primary"
              {...stylex.props(styles.button)}
              onClick={addNewField}
              startIcon={<MdAdd />}
            >
              Add
            </Button>
            <input
              accept=".zwo"
              id="button-file"
              type="file"
              hidden
              onChange={loadFile}
            />
            <label htmlFor="button-file">
              <Button
                variant="contained"
                color="primary"
                {...stylex.props(styles.button)}
                startIcon={<MdUpload />}
                component="span"
              >
                Upload
              </Button>
            </label>
          </Box>

          <form noValidate onSubmit={handleSubmit}>
            {warmup && (
              <Box
                {...stylex.props(styles.interval)}
                sx={{
                  background: colorsByPower.warmup,
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
                    Power Low ({mapPowerUnitToLabel[powerUnit]})
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
                    Power High ({mapPowerUnitToLabel[powerUnit]})
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
              <Field
                key={index}
                index={index}
                field={field}
                powerUnit={powerUnit}
                setFields={setFields}
                fields={fields}
                getPower={getPower}
              />
            ))}
            {cooldown && (
              <Box
                {...stylex.props(styles.interval)}
                sx={{
                  background: colorsByPower.cooldown,
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
                    Power High ({mapPowerUnitToLabel[powerUnit]})
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
                    Power Low ({mapPowerUnitToLabel[powerUnit]})
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
            <Box display="flex" gap={2} justifyContent="center">
              <span>Total Duration: {duration.toFixed(1)} min</span>
              <span>Training Load: {trainingLoad.toFixed(1)}</span>
            </Box>
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
