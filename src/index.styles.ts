import * as stylex from "@stylexjs/stylex";

export const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  label: {
    margin: "0 5px",
  },
  input: {
    width: "50px",
  },
  button: {
    display: "block",
    width: "100%",
    height: "30px",
    marginTop: "10px",
  },
});
