import { Snackbar, Alert } from "@mui/material";

const AppToast = ({
  open,
  setOpen,
  message,
  severity = "info",
  duration = 3000,
  position = { vertical: "top", horizontal: "right" },
}) => {
  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={position}
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppToast;
