import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Box, Button, Checkbox, Input, InputLabel } from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useReducer, useState } from "react";
import { MdDownload, MdPreview } from "react-icons/md";
import "./App.css";
import ActionSelector from "./components/ActionSelector";
import Cooldown from "./components/Cooldown";
import { Draggable } from "./components/Draggable";
import { Droppable } from "./components/Droppable";
import Field from "./components/Field";
import Graph from "./components/Graph";
import Legend from "./components/Legend";
import UnitsSelector from "./components/UnitsSelector";
import UploadFile from "./components/UploadFile";
import Warmup from "./components/Warmup";
import { styles } from "./index.styles";
import { reducer } from "./reducer";
import { IField, PowerUnit, Ramp } from "./types";
import { createXMLString, downLoadFile, parseXMLFile } from "./utils";
import converter from "./utils/convert";
import { getTrainingLoad } from "./utils/metrics";

const localStorageKeyFTP = "FTP";
const localStorageKeyWeight = "weight";
const localStorageKeyPowerUnit = "powerUnit";

const _ftp = parseInt(localStorage.getItem(localStorageKeyFTP) || "316");
const _weight = parseInt(localStorage.getItem(localStorageKeyWeight) || "80");
const _duration = 60;
const _power = 180;
const _pace = 80;
const _powerLow = 80;
const _powerHigh = 237;

const _field: IField = {
  duration: _duration,
  power: _power,
  powerToDisplay: _power,
  pace: _pace,
  selected: false,
};
const _warmup: Ramp = {
  duration: 60,
  pace: _pace,
  PowerLow: _powerLow,
  PowerHigh: _powerHigh,
  selected: false,
};
const _cooldown: Ramp = {
  duration: 60,
  pace: _pace,
  PowerLow: _powerLow,
  PowerHigh: _powerHigh,
  selected: false,
};

export type State = {
  weight: number;
  ftp: number;
  powerUnit: PowerUnit;
  fields: IField[];
  warmup?: Ramp;
  cooldown?: Ramp;
};

const initialState: State = {
  weight: _weight,
  ftp: _ftp,
  powerUnit: "watts",
  fields: [_field],
  warmup: _warmup,
  cooldown: _cooldown,
};

const todayDate = new Date().toLocaleDateString().replaceAll("/", "-");

const getDurationFromFile = (duration: number): number => {
  return duration / 60;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [warmup, setWarmup] = useState<Ramp>(_warmup);
  const [cooldown, setCooldown] = useState<Ramp>(_cooldown);
  const [xmlString, setXmlString] = useState("");
  const [isDropped, setIsDropped] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  };

  const { fields, powerUnit, weight, ftp } = state;

  const powerConverter = converter(ftp, weight);

  const getPowerFromFile = (power: number) => {
    return powerConverter(power).from("percent").to(powerUnit);
  };

  const getPowerFromOrigin = (power: number) => {
    return powerConverter(power).from("watts").to(powerUnit);
  };

  const getPowerToFile = (power: number) => {
    return powerConverter(power).from(powerUnit).to("percent");
  };

  useEffect(() => {
    const newFields = fields.map((field) => {
      return {
        ...field,
        powerToDisplay: powerConverter(field.power).from("watts").to(powerUnit),
      };
    });

    dispatch({ type: "LOAD_FILE", payload: { fields: newFields } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [powerUnit, weight, ftp]);

  const getXMLString = () => {
    const newFinalFields = fields.map((field) => {
      return {
        ...field,
        power: getPowerToFile(field.powerToDisplay),
        duration: field.duration,
      };
    });
    const [finalWarmup, finalCooldown] = [warmup, cooldown].map((ramp) => {
      if (!ramp) return;
      return {
        ...ramp,
        PowerLow: getPowerToFile(ramp.PowerLow),
        PowerHigh: getPowerToFile(ramp.PowerHigh),
        duration: ramp.duration,
      };
    });

    const newXmlString = createXMLString(
      newFinalFields,
      finalWarmup,
      finalCooldown
    );

    return newXmlString;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newXmlString = getXMLString();
    downLoadFile(newXmlString, `New-Workout-${todayDate}.zwo`);
    setXmlString(newXmlString);
  };

  const handlePreview = () => {
    const newXmlString = getXMLString();
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
        const newFields = intervals.map((interval) => ({
          ...interval,
          power: interval.power,
          powerToDisplay: getPowerFromFile(interval.power),
          duration: getDurationFromFile(interval.duration),
        }));
        dispatch({ type: "LOAD_FILE", payload: { fields: newFields } });
        cooldown &&
          setCooldown({
            ...cooldown,
            PowerLow: getPowerFromFile(cooldown.PowerLow),
            PowerHigh: getPowerFromFile(cooldown.PowerHigh),
            duration: getDurationFromFile(cooldown.duration),
          });
        warmup &&
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
      dispatch({ type: "TOGGLE_POWER_UNIT", payload: { unit: value } });
      localStorage.setItem(localStorageKeyPowerUnit, value);
    }
  };

  const addNewField = () =>
    dispatch({
      type: "ADD",
      payload: {
        field: {
          ..._field,
          powerToDisplay: getPowerFromOrigin(_field.powerToDisplay),
        },
      },
    });

  const addNewWarmup = () =>
    dispatch({ type: "ADD_RAMP", payload: { warmup: { ..._warmup } } });

  const addNewCooldown = () =>
    dispatch({ type: "ADD_RAMP", payload: { cooldown: { ..._cooldown } } });

  const nbFields = fields.length;
  const nbSelectedFields = fields.filter((field) => field.selected).length;
  const indeterminate = nbSelectedFields > 0 && nbSelectedFields < nbFields;
  const checked = nbSelectedFields === nbFields;

  const duration =
    fields.reduce((acc, field) => {
      return acc + field.duration;
    }, 0) +
    (warmup?.duration || 0) +
    (cooldown?.duration || 0);

  const trainingLoad = fields.reduce((acc, field) => {
    const power = (field.power * ftp) / 100;
    return acc + getTrainingLoad(power, field.duration, ftp);
  }, 0);

  const handleCheckSelectAll = () => {
    dispatch({ type: "SELECT_ALL", payload: { checked } });
  };

  return (
    <>
      <h1>Zwift ZWO Editor</h1>
      <Box {...stylex.props(styles.root)}>
        <Box>
          <Legend ftp={ftp} {...stylex.props(styles.legend)} />
          <Box {...stylex.props(styles.params)}>
            <UnitsSelector
              powerUnit={powerUnit}
              togglePowerUnit={togglePowerUnit}
            />
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
                    dispatch({
                      type: "SET_FTP",
                      payload: { ftp: parseInt(value) },
                    });
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
                    dispatch({
                      type: "SET_WEIGHT",
                      payload: { weight: parseInt(value) },
                    });
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
            <ActionSelector
              addNewField={addNewField}
              addNewCooldown={addNewCooldown}
              addNewWarmup={addNewWarmup}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              {...stylex.props(styles.button)}
              onClick={handlePreview}
              startIcon={<MdPreview />}
            >
              Preview
            </Button>
            <UploadFile loadFile={loadFile} />
          </Box>

          <DndContext onDragEnd={handleDragEnd}>
            <Droppable>
              <form noValidate onSubmit={handleSubmit}>
                {warmup && (
                  <Warmup
                    dispatch={dispatch}
                    powerUnit={powerUnit}
                    setWarmup={setWarmup}
                    warmup={warmup}
                  />
                )}
                {fields.map((field, index) => (
                  <Draggable key={index} index={index}>
                    <Field
                      index={index}
                      field={field}
                      powerUnit={powerUnit}
                      dispatch={dispatch}
                      disabled={!fields.some((field) => field.selected)}
                      ftp={ftp}
                    />
                  </Draggable>
                ))}
                {!isDropped ? "Drag me" : null}
                {cooldown && (
                  <Cooldown
                    cooldown={cooldown}
                    dispatch={dispatch}
                    powerUnit={powerUnit}
                    setCooldown={setCooldown}
                  />
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
            </Droppable>
          </DndContext>
        </Box>
        <Box
          sx={{
            width: "100%",
            overflow: "auto",
          }}
        >
          <textarea
            value={xmlString}
            rows={40}
            cols={70}
            {...stylex.props(styles.textArea)}
          />
          <Graph fields={fields} ftp={ftp} />
        </Box>
      </Box>
    </>
  );
};

export default App;
