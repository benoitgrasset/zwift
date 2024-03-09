import { Box, Input, InputLabel } from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { styles } from "../index.styles";
import { Action, PowerUnit, Ramp } from "../types";
import { colorsByPower } from "../utils/colors";
import { mapPowerUnitToLabel } from "../utils/dictionary";
import DeleteButton from "./DeleteButton";

type Props = {
  dispatch: React.Dispatch<Action>;
  warmup: Ramp;
  setWarmup: (value: React.SetStateAction<Ramp>) => void;
  powerUnit: PowerUnit;
};

const Warmup = ({ dispatch, warmup, setWarmup, powerUnit }: Props) => {
  return (
    <Box
      {...stylex.props(styles.interval)}
      sx={{
        background: colorsByPower.warmup,
      }}
    >
      <span {...stylex.props(styles.field)}>
        <InputLabel {...stylex.props(styles.label)} htmlFor={`warmup-duration`}>
          Duration
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
              duration: parseFloat(e.target.value),
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
        <InputLabel {...stylex.props(styles.label)} htmlFor={`warmup-pace`}>
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
      <DeleteButton
        tooltip="Delete Warmup"
        onClick={() => dispatch({ type: "DELETE_WARMUP", payload: undefined })}
      />
    </Box>
  );
};

export default Warmup;
