import { IconButton, Tooltip } from "@mui/material";
import { MdDelete } from "react-icons/md";

type Props = {
  tooltip: string;
  onClick: () => void;
};

const DeleteButton = ({ tooltip, onClick }: Props) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton aria-label="delete" onClick={onClick}>
        <MdDelete />
      </IconButton>
    </Tooltip>
  );
};

export default DeleteButton;
