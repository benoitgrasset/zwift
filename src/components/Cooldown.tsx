import { Box, Input, InputLabel } from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { styles } from "../index.styles";
import { Action, PowerUnit, Ramp } from "../types";
import { colorsByPower } from "../utils/colors";
import { mapPowerUnitToLabel } from "../utils/dictionary";
import DeleteButton from "./DeleteButton";

type Props = {
  dispatch: React.Dispatch<Action>;
  cooldown: Ramp;
  setCooldown: (value: React.SetStateAction<Ramp>) => void;
  powerUnit: PowerUnit;
};

const Cooldown = ({ dispatch, cooldown, setCooldown, powerUnit }: Props) => {
  return (
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
          Duration
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
              duration: parseFloat(e.target.value),
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
        <InputLabel {...stylex.props(styles.label)} htmlFor={`cooldown-pace`}>
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
      <DeleteButton
        onClick={() =>
          dispatch({ type: "DELETE_COOLDOWN", payload: undefined })
        }
        tooltip="Delete Cooldown"
      />
    </Box>
  );
};

export default Cooldown;
