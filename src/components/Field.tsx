import {
  Box,
  Checkbox,
  IconButton,
  Input,
  InputLabel,
  Tooltip,
} from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { MdAdd, MdDelete } from "react-icons/md";
import "../App.css";
import { styles } from "../index.styles";
import { Action, IField, IntervalField, PowerUnit } from "../types";
import {
  getPowerPercentColor,
  getPowerPercentLightColor,
} from "../utils/colors";
import { mapPowerUnitToLabel } from "../utils/dictionary";

type Props = {
  field: IField;
  disabled: boolean;
  index: number;
  powerUnit: PowerUnit;
  dispatch: React.Dispatch<Action>;
  ftp: number;
};

const Field = ({ field, disabled, index, powerUnit, dispatch, ftp }: Props) => {
  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: IntervalField,
    index: number
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      payload: {
        index,
        value: event.target.value,
        field,
      },
    });
  };

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
            Power ({mapPowerUnitToLabel[powerUnit]})
          </InputLabel>
          <Input
            id={`power-${index}`}
            {...stylex.props(styles.input)}
            type="number"
            inputMode="numeric"
            value={field.powerToDisplay}
            onChange={(e) => handleTextChange(e, "power", index)}
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
            onChange={(e) => handleTextChange(e, "pace", index)}
            sx={{
              textAlign: "center",
            }}
          />
        </span>
        <Tooltip title="Delete Field">
          <IconButton
            aria-label="delete"
            onClick={() =>
              dispatch({
                type: "DELETE",
                payload: {
                  index,
                },
              })
            }
          >
            <MdDelete />
          </IconButton>
        </Tooltip>
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
