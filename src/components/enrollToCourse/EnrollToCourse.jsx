"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Grid,
  useMediaQuery,
  IconButton,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import qrCode from "../assets/qr.jpeg";
import cashImg from "../assets/cash.png";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthCookie } from "../auth";
import AppToast from "../toast/AppToast";

const PRIMARY_COLOR = "#20b2a6";
const MATERIAL_COST = 500;

const EnRollToCourse = () => {
  const location = useLocation();
  const history = useNavigate();
  const user = getAuthCookie();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { courseName, fullPrice } = location?.state || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const courseOptions = [
    {
      name: "German A1 – Beginner",
      price: 15000,
    },
    {
      name: "German A2 – Elementary",
      price: 18000,
    },
    {
      name: "German B1 – Intermediate Level",
      price: 31000,
    },
    {
      name: "German B2 – Intermediate Level",
      price: 36000,
    },
    {
      name: "German A1 + A2 Combo",
      price: 32000,
    },
    {
      name: "German A1 + A2 + B1 Combo",
      price: 66000,
    },
  ];

  const defaultCourse =
    courseOptions.find((c) => c.name === courseName) || null;

  const [selectedCourse, setSelectedCourse] = useState(defaultCourse);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const baseCoursePrice = useMemo(() => {
    if (selectedCourse?.price) return selectedCourse.price;
    if (!fullPrice) return 0;
    return Number(fullPrice.toString().replace(/[^\d]/g, ""));
  }, [selectedCourse, fullPrice]);

  const [form, setForm] = useState({
    paymentType: "full",
    paymentMode: "upi",
    physicalCopy: "no",
    amountPaid: "",
    transactionId: "",
    referenceNumber: "",
    gstNo: "",
    executiveName: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const finalCoursePrice = useMemo(() => {
    return form.physicalCopy === "yes"
      ? baseCoursePrice + MATERIAL_COST
      : baseCoursePrice;
  }, [baseCoursePrice, form.physicalCopy]);

  useEffect(() => {
    const paid = Number(form.amountPaid || 0);

    if (!form.paymentType || !paid) return;

    if (
      form.paymentType === "partial" &&
      paid >= finalCoursePrice &&
      finalCoursePrice > 0
    ) {
      setForm((prev) => ({ ...prev, paymentType: "full" }));
    }

    if (form.paymentType === "full" && paid < finalCoursePrice) {
      setForm((prev) => ({ ...prev, paymentType: "partial" }));
    }
  }, [form.amountPaid, form.paymentType, finalCoursePrice]);

  const balanceAmount = useMemo(() => {
    const paid = Number(form.amountPaid || 0);

    if (form.paymentType !== "partial") return 0;

    return Math.max(finalCoursePrice - paid, 0);
  }, [form.paymentType, form.amountPaid, finalCoursePrice]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);

    setToast({
      open: true,
      message: "Copied successfully",
      severity: "success",
    });
  };

  const handleSubmit = async () => {
    if (
      !form.paymentType ||
      !form.paymentMode ||
      !form.amountPaid ||
      !form.executiveName
    ) {
      setToast({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    if (
      form.paymentType === "full" &&
      Number(form.amountPaid) < finalCoursePrice
    ) {
      setToast({
        open: true,
        message: "Full payment requires complete course fee",
        severity: "error",
      });
      return;
    }

    const payload = {
      email: user?.email ?? "",
      course: {
        courseName: selectedCourse?.name || courseName,
        coursePrice: finalCoursePrice,
        paymentType: form.paymentType,
        paymentMode: form.paymentMode,
        physicalCopy: form.physicalCopy === "yes",
        amountPaid: Number(form.amountPaid),
        balanceAmount,
        transactionId: form.transactionId,
        referenceNumber: form.referenceNumber,
        gstNo: form.gstNo,
        executiveName: form.executiveName,
        enrolledDate: new Date().toISOString().split("T")[0],
      },
    };

    axios
      .put(
        "https://course-project-wd0v.onrender.com/api/users/assign-course",
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )
      .then((res) => {
        if (res?.status === 200)
          setToast({
            open: true,
            message: "Course Added Successfully!",
            severity: "success",
          });

        setTimeout(() => {
          history("/");
        }, 500);
      })
      .catch((err) => {
        setToast({
          open: true,
          message: err?.response?.data?.message || "Something went wrong",
          severity: "error",
        });
      });
  };

  const PaymentPanel = () => (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: "#fafafa",
        border: "1px solid #eee",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography fontWeight={600} mb={3}>
        Payment Mode{" "}
        {form.paymentMode.toUpperCase() === "BANK"
          ? "BANK TRANSFER"
          : form.paymentMode.toUpperCase()}
      </Typography>

      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {form.paymentMode === "upi" && (
          <Box textAlign="center">
            <img
              src={qrCode}
              width={400}
              height={400}
              style={{ objectFit: "contain" }}
              alt="qrcode"
            />
          </Box>
        )}

        {form.paymentMode === "bank" && (
          <Box width="100%">
            <Box display="flex" alignItems="center" mb={3}>
              <AccountBalanceIcon
                sx={{ fontSize: 32, color: "#1976d2", mr: 1 }}
              />
              <Typography fontWeight={600} fontSize={18}>
                Bank Transfer Details
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: "#f4f8ff",
                border: "1px solid #e3edff",
              }}
            >
              <Typography fontSize={13} color="text.secondary" mb={0.5}>
                Account Number
              </Typography>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={600} fontSize={16}>
                  5042 5001 2066 0801
                </Typography>

                <IconButton
                  onClick={() => copyToClipboard("5042500120660801")}
                  size="small"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f4f8ff",
                border: "1px solid #e3edff",
              }}
            >
              <Typography fontSize={13} color="text.secondary" mb={0.5}>
                IFSC Code
              </Typography>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={600} fontSize={16}>
                  KARB0000504
                </Typography>

                <IconButton
                  onClick={() => copyToClipboard("KARB0000504")}
                  size="small"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </Box>
        )}

        {form.paymentMode === "cash" && (
          <Box textAlign="center">
            <Box component="img" src={cashImg} sx={{ width: 260 }} />
          </Box>
        )}
      </Box>
    </Paper>
  );

  return (
    <Box bgcolor="#f4f6f8" py={6} px={2}>
      <Grid container spacing={4} maxWidth="1100px" mx="auto">
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Course Fee Payment
            </Typography>

            <Grid container spacing={2}>
              <Tooltip title={selectedCourse?.name}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={courseOptions}
                    value={selectedCourse}
                    onChange={(e, value) => setSelectedCourse(value)}
                    getOptionLabel={(option) => option?.name || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Course Name" fullWidth />
                    )}
                  />
                </Grid>
              </Tooltip>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Course Fee"
                  value={`₹ ${finalCoursePrice}`}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Payment Type *"
                  name="paymentType"
                  value={form.paymentType}
                  onChange={handleChange}
                  disabled
                >
                  <MenuItem value="full">Full Payment</MenuItem>
                  <MenuItem value="partial">Partial Payment</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Mode of Payment *"
                  name="paymentMode"
                  value={form.paymentMode}
                  onChange={handleChange}
                >
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </TextField>
              </Grid>

              {isMobile && (
                <Grid item xs={12}>
                  <PaymentPanel />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Physical Course Material"
                  name="physicalCopy"
                  value={form.physicalCopy}
                  onChange={handleChange}
                >
                  <MenuItem value="yes">Yes (+₹500)</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount Paid *"
                  name="amountPaid"
                  type="number"
                  value={form.amountPaid}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Balance Amount"
                  value={`₹ ${balanceAmount}`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Transaction ID"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  disabled={form.paymentMode === "cash"}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Executive Name *"
                  name="executiveName"
                  value={form.executiveName}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: PRIMARY_COLOR,
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Paper>
        </Grid>

        {!isMobile && (
          <Grid item xs={12} md={6}>
            <PaymentPanel />
          </Grid>
        )}
      </Grid>

      <AppToast
        open={toast.open}
        setOpen={(open) => setToast({ ...toast, open })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default EnRollToCourse;
