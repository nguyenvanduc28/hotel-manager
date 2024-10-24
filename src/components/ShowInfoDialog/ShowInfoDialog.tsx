import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Button from "../Button/Button";

interface ShowInfoDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ShowInfoDialog: React.FC<ShowInfoDialogProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{fontSize: "2rem"}}>{title}</DialogTitle>
      <DialogContent style={{fontSize: "1.6rem"}}>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} content="Đóng"/>
      </DialogActions>
    </Dialog>
  );
};

export default ShowInfoDialog;
