import * as stylex from "@stylexjs/stylex";

const height = "35px";

export const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "50px",
  },
  label: {
    margin: "0 5px",
    height,
    display: "inline!important",
  },
  input: {
    width: "55px",
    height,
    boxSizing: "border-box",
  },
  submit: {
    height: "35px",
  },
  button: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#747bff",
    },
  },
  interval: {
    margin: "10px 0",
    gap: "10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: "5px",
    minHeight: "42px",
  },
  field: {
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
  },
  textArea: {
    maxHeight: "550px",
    resize: "none",
    boxSizing: "border-box",
    padding: "5px",
  },
  checkbox: {},
  params: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "50px",
    marginBottom: "10px",
  },
  graph: {
    display: "flex",
    gap: "10px",
    alignItems: "baseline",
  },
});
