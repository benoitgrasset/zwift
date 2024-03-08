import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { MdAdd, MdArrowDropDown } from "react-icons/md";
import { styles } from "../index.styles";

const options = ["Add", "Add Warmup", "Add Cooldown"];

type Props = {
  addNewField: () => void;
  addNewWarmup: () => void;
  addNewCooldown: () => void;
};

const ActionSelector = ({
  addNewField,
  addNewCooldown,
  addNewWarmup,
}: Props) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleClick = () => {
    switch (selectedIndex) {
      case 0:
        addNewField();
        break;
      case 1:
        addNewWarmup();
        break;
      case 2:
        addNewCooldown();
        break;
    }
  };

  return (
    <>
      <ButtonGroup variant="contained" ref={anchorRef}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          {...stylex.props(styles.button)}
          onClick={handleClick}
          startIcon={<MdAdd />}
        >
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <MdArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default ActionSelector;
