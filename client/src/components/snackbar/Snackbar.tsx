import { Snackbar, Alert } from "@mui/material";
import React from "react";
import { SnackbarAlertProps } from "src/types/snackbar";

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({ message, severity, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
