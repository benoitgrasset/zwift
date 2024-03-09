import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { PowerUnit } from "../types";
import { mapPowerUnitToLabel } from "../utils/dictionary";

const powerUnits: PowerUnit[] = ["watts", "percent", "wattsByKg"];

type Props = {
  powerUnit: PowerUnit;
  togglePowerUnit: (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: PowerUnit
  ) => void;
};

const UnitsSelector = ({ powerUnit, togglePowerUnit }: Props) => {
  return (
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
      <ToggleButton value={powerUnits[2]} aria-label="FTP/kg">
        {mapPowerUnitToLabel[powerUnits[2]]}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default UnitsSelector;
