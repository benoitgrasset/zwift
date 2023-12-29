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
    display: "block",
    width: "100%",
    height: "35px",
    marginTop: "10px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: 500,
    fontFamily: "inherit",
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
    justifyContent: "center",
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
