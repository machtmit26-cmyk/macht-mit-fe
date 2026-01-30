import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const PRIMARY_COLOR = "#20b2a6"; 

const LogoutDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "10px",
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        Logout
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ color: "#555" }}>
          Are you sure you want to logout?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            width: "100px",
            textTransform: "none",
            borderColor: "#cfcfcf",
            color: "#555",
            "&:hover": {
              borderColor: "#bdbdbd",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          No
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            width: "100px",
            textTransform: "none",
            backgroundColor: PRIMARY_COLOR,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#179e93",
            },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
