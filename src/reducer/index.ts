/* eslint-disable no-case-declarations */
import { State } from "../App";
import { Action } from "../types";
import converter from "../utils/convert";

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  const { powerUnit, weight, ftp } = state;

  const powerConverter = converter(ftp, weight);

  switch (type) {
    case "ADD":
      return {
        ...state,
        fields: [...state.fields, payload.field],
      };
    case "DELETE":
      return {
        ...state,
        fields: state.fields.filter((_, index) => index !== payload.index),
      };
    case "UPDATE_FIELD":
      return {
        ...state,
        fields: state.fields.map((item, i) => {
          if (i === payload.index) {
            if (payload.field === "power") {
              const value = parseFloat(payload.value);
              return {
                ...item,
                power: powerConverter(value).from(powerUnit).to("percent"),
                powerToDisplay: value,
              };
            }
            return {
              ...item,
              [payload.field]: payload.value,
            };
          }
          return item;
        }),
      };
    case "SELECT_ALL":
      return {
        ...state,
        fields: state.fields.map((field) => ({
          ...field,
          selected: !payload.checked,
        })),
      };
    case "SELECT":
      return {
        ...state,
        fields: state.fields.map((field, index) => ({
          ...field,
          selected: index === payload.index ? !field.selected : field.selected,
        })),
      };
    case "DUPLICATE":
      const selectedFields = state.fields
        .filter((field) => field.selected)
        .map((field) => {
          return {
            ...field,
            selected: false,
          };
        });
      return {
        ...state,
        fields: [...state.fields].toSpliced(
          payload.index + 1,
          0,
          ...selectedFields
        ),
      };
    case "TOGGLE_POWER_UNIT":
      const orign = powerUnit;
      const destination = payload.unit;
      return {
        ...state,
        powerUnit: payload.unit,
        fields: state.fields.map((field) => {
          return {
            ...field,
            powerToDisplay: powerConverter(field.powerToDisplay)
              .from(orign)
              .to(destination),
          };
        }),
      };
    case "SET_WEIGHT":
      return {
        ...state,
        weight: payload.weight,
      };
    case "SET_FTP":
      return {
        ...state,
        ftp: payload.ftp,
      };
    case "LOAD_FILE":
      return {
        ...state,
        fields: payload.fields,
      };

    default:
      throw new Error("Invalid action type");
  }
};
