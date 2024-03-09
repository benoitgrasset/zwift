import { Button } from "@mui/material";
import * as stylex from "@stylexjs/stylex";
import { MdUpload } from "react-icons/md";
import { styles } from "../index.styles";

type Props = {
  loadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const UploadFile = ({ loadFile }: Props) => {
  return (
    <>
      <input
        accept=".zwo"
        id="button-file"
        type="file"
        hidden
        onChange={loadFile}
      />
      <label htmlFor="button-file">
        <Button
          variant="contained"
          color="primary"
          {...stylex.props(styles.button)}
          startIcon={<MdUpload />}
          component="span"
        >
          Upload
        </Button>
      </label>
    </>
  );
};

export default UploadFile;
