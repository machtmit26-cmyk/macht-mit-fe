"use client";
import { useContext, useState } from "react";
import Footer from "../common/footer/Footer";
import axios from "axios";

import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setAuthCookie } from "../auth";
import AppToast from "../toast/AppToast";
import { AuthContext } from "../auth/authcontext";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#20b2a6";
const PAGE_BG = "#f2f2f2";

const LoginPage1 = () => {
  const { setUserDetails } = useContext(AuthContext);
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }
    setError("");
    try {
      axios
        .post("https://course-project-wd0v.onrender.com/api/users/login", {
          email,
          password,
        })
        .then((res) => {
          if (res?.status === 200) {
            setAuthCookie(res?.data);
            setUserDetails(res?.data);
            history("/courses");
          }
        })
        .catch((err) => {
          setToast({
            open: true,
            message:
              err?.response?.data?.message ||
              "Something went wrong! please try again.",
            severity: "error",
          });
        });
    } catch (error) {}
  };

  return (
    <Box
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={PAGE_BG}
    >
      <Paper
        elevation={2}
        sx={{
          width: 360,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={0.5}>
          Login
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Please sign in to continue
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: PRIMARY_COLOR,
            },
          }}
          autoComplete="off"
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: PRIMARY_COLOR,
            },
            "&::-ms-reveal, &::-ms-clear": {
              display: "none",
            },
          }}
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: PRIMARY_COLOR,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
            "&.MuiButtonBase-root": {
              height: "50px",
            },
            "&:hover": {
              backgroundColor: "#179e93",
            },
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
      <AppToast
        open={toast.open}
        setOpen={(open) => setToast({ ...toast, open })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

function LoginPage() {
  return <LoginPage1 />;
}

export default LoginPage;
