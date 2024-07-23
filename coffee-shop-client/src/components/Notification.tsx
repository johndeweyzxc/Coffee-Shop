import { useState } from "react";
import React from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AlertAttribute {
  isOpen: boolean;
  severity: string;
  message: string;
}
export default function Notification() {
  const [alertAttr, setAlertAttr] = useState<AlertAttribute>({
    isOpen: false,
    severity: "error",
    message: "An error has been occurred",
  });

  const handleOpenAlert = (severity: string, message: string) => {
    setAlertAttr({
      isOpen: true,
      severity: severity,
      message: message,
    });
  };
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertAttr({
      ...alertAttr,
      isOpen: false,
    });
  };

  let alertComponent: JSX.Element = <div></div>;

  if (alertAttr.severity === "warning") {
    alertComponent = (
      <Alert
        onClose={handleCloseAlert}
        severity="warning"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {alertAttr.message}
      </Alert>
    );
  } else if (alertAttr.severity === "error") {
    alertComponent = (
      <Alert
        onClose={handleCloseAlert}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {alertAttr.message}
      </Alert>
    );
  } else if (alertAttr.severity === "success") {
    alertComponent = (
      <Alert
        onClose={handleCloseAlert}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {alertAttr.message}
      </Alert>
    );
  }

  return {
    SnackBar: (
      <Snackbar
        open={alertAttr.isOpen}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        action={
          <React.Fragment>
            <IconButton
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseAlert}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        {alertComponent}
      </Snackbar>
    ),
    HandleOpenAlert: handleOpenAlert,
  };
}
