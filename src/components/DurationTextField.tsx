import { Input, InputProps } from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { styles } from "../index.styles";

interface Props extends InputProps {
  value: number; // secondes
  handleChange: (value: number) => void;
}

const DurationTextField = ({ value, handleChange, ...props }: Props) => {
  const _minutes = value ? Math.floor(value / 60) : 0;
  const _seconds = value ? value % 60 : 0;
  const [minutes, setMinutes] = useState<number>(_minutes);
  const [seconds, setSeconds] = useState<number>(_seconds);

  useEffect(() => {
    const duration = minutes * 60 + seconds;
    handleChange(duration);
  }, [handleChange, minutes, seconds]);

  return (
    <div id="DurationTextField">
      <Input
        type="text"
        inputMode="decimal"
        endAdornment={<span {...stylex.props(styles.endAdornment)}>min</span>}
        {...stylex.props(styles.input)}
        {...props}
        value={minutes}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (val >= 0) {
            setMinutes(val);
          }
        }}
      />
      <Input
        type="text"
        inputMode="decimal"
        endAdornment={<span {...stylex.props(styles.endAdornment)}>sec</span>}
        {...stylex.props(styles.input)}
        {...props}
        value={seconds}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (val >= 0) {
            setSeconds(val);
          }
        }}
      />
    </div>
  );
};

export default DurationTextField;
