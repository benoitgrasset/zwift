import {
  Box,
  Checkbox,
  IconButton,
  Input,
  InputLabel,
  Tooltip,
} from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { MdAdd } from "react-icons/md";
import "../App.css";
import { styles } from "../index.styles";
import { IField, PowerUnit } from "../types";
import {
  getPowerPercentColor,
  getPowerPercentLightColor,
} from "../utils/colors";
import { mapPowerUnitToLabel } from "../utils/dictionary";

type Props = {
  field: IField;
  fields: Array<IField>;
  getPower: (power: number) => number;
  index: number;
  powerUnit: PowerUnit;
  setFields: React.Dispatch<React.SetStateAction<IField[]>>;
};

const Field = ({
  field,
  fields,
  getPower,
  index,
  powerUnit,
  setFields,
}: Props) => {
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
    const selectedFields = fields
      .filter((field) => field.selected)
      .map((field) => {
        return {
          ...field,
          selected: false,
        };
      });
    const newFields = [...fields].toSpliced(index + 1, 0, ...selectedFields);

    setFields(newFields);
  };

  return (
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
        <InputLabel {...stylex.props(styles.label)} htmlFor={`power-${index}`}>
          Power ({mapPowerUnitToLabel[powerUnit]})
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
  );
};

export default Field;
