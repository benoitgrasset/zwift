import { Box } from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { styles } from "../index.styles";
import { IField } from "../types";
import { getPowerPercentColor } from "../utils/colors";

type Props = {
  fields: IField[];
  ftp: number;
};

const Graph = ({ fields, ftp }: Props) => {
  return (
    <Box {...stylex.props(styles.graph)}>
      {fields
        ? fields.map(({ power, duration }, number) => {
            const powerPerCent = power / ftp;
            const height = powerPerCent * 50;
            const width = (duration / 60) * 6;
            return (
              <Box
                key={number}
                style={{
                  background: getPowerPercentColor(powerPerCent),
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              />
            );
          })
        : "No workout loaded"}
    </Box>
  );
};

export default Graph;
