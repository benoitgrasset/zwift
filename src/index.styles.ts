import * as stylex from "@stylexjs/stylex";

const height = "35px";

export const styles = stylex.create({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "50px",
  },
  label: {
    margin: "0 5px",
    height,
    display: "inline!important",
  },
  input: {
    width: "60px",
    height,
    boxSizing: "border-box",
    textAlign: "center",
  },
  endAdornment: {
    marginLeft: "3px",
    color: "rgba(0, 0, 0, 0.54)",
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
    margin: "10px 3px",
    gap: "10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  params: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "50px",
    marginBottom: "10px",
    position: "relative",
  },
  graph: {
    display: "inline-flex",
    gap: "5px",
    alignItems: "baseline",
    width: "100%",
    overflow: "auto",
  },
  legend: {
    margin: "0 0 10px 0",
  },
  intervalWrapper: {
    position: "relative",
  },
  duplicateButton: {
    right: "-35px",
    top: "-25px",
  },
});
