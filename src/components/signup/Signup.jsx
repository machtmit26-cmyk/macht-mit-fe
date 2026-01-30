"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import { countriesList } from "./countris";
import AppToast from "../toast/AppToast";

const generateCaptchaText = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const SignupPage = () => {
  const canvasRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    country: null,
    dialCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    console.log(key, value);

    setForm({ ...form, [key]: value });
  };
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "26px Arial";
    ctx.fillStyle = "#000";

    [...text].forEach((char, i) => {
      const x = 20 + i * 25;
      const y = 35 + Math.random() * 5;
      const angle = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "#999";
      ctx.stroke();
    }
  };

  const refreshCaptcha = () => {
    const text = generateCaptchaText();
    setCaptchaText(text);
    setCaptchaInput("");
    drawCaptcha(text);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.email ||
      !form.country ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (captchaInput.toUpperCase() !== captchaText) {
      setError("Captcha does not match");
      refreshCaptcha();
      return;
    }

    setError("");
    try {
      axios
        .post("https://course-project-wd0v.onrender.com/api/users/register", form)
        .then((res) => {
          if (res?.status === 201) {
            setToast({
              open: true,
              message:
                " Your account has been created successfully. Please log in to continue.",
              severity: "success",
            });
            setTimeout(() => {
              window.location.href = "/courses";
            }, 1000);
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
          setToast({
              open: true,
              message:
                "Something went wrong!. please try again",
              severity: "success",
            });
        });
    } catch (error) {
      console.log(error);
    }

    console.log("Signup Payload:", form);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f4f6f8"
    >
      <Paper elevation={2} sx={{ width: 380, p: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Create Account
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          margin="dense"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <TextField
          fullWidth
          label="Email"
          margin="dense"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <Autocomplete
          options={countriesList}
          value={form.country}
          isOptionEqualToValue={(option, value) => option.code === value?.code}
          getOptionLabel={(option) => option?.label || ""}
          onChange={(_, selected) => {
            setForm((prev) => ({
              ...prev,
              country: selected,
              dialCode: selected?.dial || "",
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Country" margin="dense" fullWidth />
          )}
        />

        <TextField
          fullWidth
          label="Phone Number"
          margin="dense"
          value={form.phone}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {form.dialCode || "ISD"}
              </InputAdornment>
            ),
          }}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="dense"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="dense"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
        />

        {/* CAPTCHA IMAGE */}
        <Box mt={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <canvas
              ref={canvasRef}
              width={180}
              height={50}
              style={{ border: "1px solid #ccc", borderRadius: 4 }}
            />
            <IconButton onClick={refreshCaptcha}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Type the word above"
            margin="dense"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
        </Box>

        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, textTransform: "none", fontWeight: 600 }}
          onClick={handleSubmit}
        >
          Sign Up
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

export default SignupPage;
