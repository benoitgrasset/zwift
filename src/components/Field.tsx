import {
  Box,
  Checkbox,
  IconButton,
  Input,
  InputLabel,
  Tooltip,
} from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { useCallback } from "react";
import { MdAdd } from "react-icons/md";
import "../App.css";
import { styles } from "../index.styles";
import { Action, IField, IntervalField, PowerUnit } from "../types";
import {
  getPowerPercentColor,
  getPowerPercentLightColor,
} from "../utils/colors";
import { mapPowerUnitToLabel } from "../utils/dictionary";
import DeleteButton from "./DeleteButton";
import DurationTextField from "./DurationTextField";

type Props = {
  field: IField;
  disabled: boolean;
  index: number;
  powerUnit: PowerUnit;
  dispatch: React.Dispatch<Action>;
  ftp: number;
};

const Field = ({ field, disabled, index, powerUnit, dispatch, ftp }: Props) => {
  const handleTextChange = useCallback(
    (value: number, field: IntervalField, index: number) => {
      dispatch({
        type: "UPDATE_FIELD",
        payload: {
          index,
          value,
          field,
        },
      });
    },
    [dispatch]
  );

  const handleDurationChange = useCallback(
    (value: number) => {
      handleTextChange(value, "duration", index);
    },
    [handleTextChange, index]
  );

  const handleCheckboxChange = (index: number) => {
    dispatch({
      type: "SELECT",
      payload: {
        index,
      },
    });
  };

  const duplicateFields = (index: number) => {
    dispatch({
      type: "DUPLICATE",
      payload: {
        index,
      },
    });
  };

  return (
    <div {...stylex.props(styles.intervalWrapper)}>
      <Box
        {...stylex.props(styles.interval)}
        sx={{
          background: field.selected
            ? getPowerPercentColor(field.power / ftp)
            : getPowerPercentLightColor(field.power / ftp),
        }}
      >
        <Checkbox
          checked={field.selected}
          onChange={() => handleCheckboxChange(index)}
        />
        <span {...stylex.props(styles.field)}>
          <InputLabel
            {...stylex.props(styles.label)}
            htmlFor={`duration-${index}`}
          >
            Duration
          </InputLabel>
          <DurationTextField
            id={`duration-${index}`}
            value={field.duration}
            handleChange={handleDurationChange}
          />
        </span>
        <span {...stylex.props(styles.field)}>
          <InputLabel
            {...stylex.props(styles.label)}
            htmlFor={`power-${index}`}
          >
            Power ({mapPowerUnitToLabel[powerUnit]})
          </InputLabel>
          <Input
            id={`power-${index}`}
            {...stylex.props(styles.input)}
            type="number"
            inputMode="numeric"
            value={field.powerToDisplay}
            onChange={(e) =>
              handleTextChange(parseFloat(e.target.value), "power", index)
            }
            endAdornment={powerUnit === "percent" ? "%" : null}
          />
        </span>
        <span {...stylex.props(styles.field)}>
          <InputLabel {...stylex.props(styles.label)} htmlFor={`pace-${index}`}>
            Pace (RPM)
          </InputLabel>
          <Input
            id={`pace-${index}`}
            {...stylex.props(styles.input)}
            type="number"
            inputMode="numeric"
            value={field.pace}
            onChange={(e) =>
              handleTextChange(parseFloat(e.target.value), "pace", index)
            }
            sx={{
              textAlign: "center",
            }}
          />
        </span>
        <DeleteButton
          tooltip="Delete Field"
          onClick={() => dispatch({ type: "DELETE", payload: { index } })}
        />
      </Box>

      <Tooltip title="Duplicate Field">
        <IconButton
          aria-label="duplicate"
          onClick={() => duplicateFields(index)}
          disabled={disabled}
          {...stylex.props(styles.duplicateButton)}
          style={{
            position: "absolute",
          }}
        >
          <MdAdd />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Field;
