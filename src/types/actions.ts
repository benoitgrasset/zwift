import { IField, IntervalField, PowerUnit, Ramp } from ".";

type AddAction = {
  type: "ADD";
  payload: {
    field: IField;
  };
};

type AddRampAction = {
  type: "ADD_RAMP";
  payload: {
    warmup?: Ramp;
    cooldown?: Ramp;
  };
};

type DeleteAction = {
  type: "DELETE";
  payload: {
    index: number;
  };
};

type DeleteWarmupAction = {
  type: "DELETE_WARMUP";
  payload: undefined;
};

type DeleteCooldownAction = {
  type: "DELETE_COOLDOWN";
  payload: undefined;
};

type UpdateAction = {
  type: "UPDATE_FIELD";
  payload: {
    index: number;
    field: IntervalField;
    value: string;
  };
};

type LoadFileAction = {
  type: "LOAD_FILE";
  payload: {
    fields: IField[];
  };
};

type SelectAllAction = {
  type: "SELECT_ALL";
  payload: {
    checked: boolean;
  };
};

type SelectAction = {
  type: "SELECT";
  payload: {
    index: number;
  };
};

type DuplicateAction = {
  type: "DUPLICATE";
  payload: {
    index: number;
  };
};

type TogglePowerUnitAction = {
  type: "TOGGLE_POWER_UNIT";
  payload: {
    unit: PowerUnit;
  };
};

type UpdateWeightAction = {
  type: "SET_WEIGHT";
  payload: {
    weight: number;
  };
};

type UpdateFtpAction = {
  type: "SET_FTP";
  payload: {
    ftp: number;
  };
};

export type Action =
  | AddAction
  | DeleteAction
  | UpdateAction
  | SelectAllAction
  | SelectAction
  | LoadFileAction
  | TogglePowerUnitAction
  | UpdateWeightAction
  | UpdateFtpAction
  | AddRampAction
  | DuplicateAction
  | DeleteWarmupAction
  | DeleteCooldownAction;
