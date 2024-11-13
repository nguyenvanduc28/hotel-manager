import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from "@mui/material";
import Button from "../Button/Button";

interface ShowInfoDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  backdropStyle?: React.CSSProperties;

}

const ShowInfoDialog: React.FC<ShowInfoDialogProps> = ({
  open,
  onClose,
  title,
  children,
  backdropStyle,
  ...rest
}) => {
  return (
    <Dialog
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgb(0 0 0 / 0.3)'
        }
      }}
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { style: backdropStyle } }}
      {...rest}
    >
      <DialogTitle style={{ fontSize: "2rem" }}>{title}</DialogTitle>
      <DialogContent style={{ fontSize: "1.6rem" }}>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} content="Đóng" />
      </DialogActions>
    </Dialog>
  );
};

export default ShowInfoDialog;
