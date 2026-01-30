import { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoutDialog from "./LogoutModal";
import { getAuthCookie, removeAuthCookie } from "../../auth";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const user = getAuthCookie()

  return (
    <>
      <Box display="flex" alignItems="center">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#ffffff",
            color: "#20b2a6",
            fontWeight: 600,
          }}
        >
          {user.name.charAt(0)}
        </Avatar>

        <Typography sx={{ ml: 1, color: "#fff", fontWeight: 500 }}>
          {user.name}
        </Typography>

        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: "#fff" }}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "8px",
            minWidth: 260,
          },
        }}
        disableScrollLock={true}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box px={2} py={1}>
          <Typography fontWeight={600}>{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={() => console.log("Go to My Courses")}>
          <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
          My Courses
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenLogoutModal(true);
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
      <LogoutDialog
        open={openLogoutModal}
        onClose={() => {
          setAnchorEl(null);
          setOpenLogoutModal(false);
        }}
        onConfirm={() => {
          removeAuthCookie();
          window.location.href="/login"
        }}
      />
    </>
  );
};

export default UserMenu;
