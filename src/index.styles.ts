import * as stylex from "@stylexjs/stylex";

export const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "10px",
  },
  label: {
    margin: "0 5px",
  },
  input: {
    width: "50px",
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
  field: {
    margin: "10px 5px",
    padding: "3px 0",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
  },
});
