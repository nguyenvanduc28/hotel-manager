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
  isEditButton?: boolean;
  onClickEditButton?: () => void;
  editButtonText?: string;

}

const ShowInfoDialog: React.FC<ShowInfoDialogProps> = ({
  open,
  onClose,
  title,
  children,
  backdropStyle,
  isEditButton,
  onClickEditButton,
  editButtonText,
  ...rest
}) => {
  return (
    <Dialog
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgb(0 0 0 / 0.3)',
        },
        '& .MuiDialog-paper': {
          maxWidth: "650px"
        }
      }}
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { style: backdropStyle } }}
      {...rest}
    >
      <DialogTitle style={{ fontSize: "2rem" }}>{title}</DialogTitle>
      <DialogContent sx={{ 
        fontSize: "1.6rem",
        maxHeight: "80vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px"
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "4px"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px"
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555"
        }
      }}>{children}</DialogContent>
      <DialogActions>
        {isEditButton && <Button onClick={onClickEditButton} content={editButtonText || "Sửa"} />}
        <Button onClick={onClose} content="Đóng" />
      </DialogActions>
    </Dialog>
  );
};

export default ShowInfoDialog;
