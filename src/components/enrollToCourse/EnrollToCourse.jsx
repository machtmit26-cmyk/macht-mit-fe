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
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getAuthCookie } from "../auth";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#20b2a6";
const MATERIAL_COST = 175;

const EnRollToCourse = () => {
  const location = useLocation();
  const user = getAuthCookie();
  const history=useNavigate()
  const { courseName, fullPrice } = location?.state || {};
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const baseCoursePrice = useMemo(() => {
    if (!fullPrice) return 0;
    return Number(fullPrice.toString().replace(/[^\d]/g, ""));
  }, [fullPrice]);
  const [form, setForm] = useState({
    paymentType: "",
    paymentMode: "",
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

    if (form.paymentType === "full" && paid > 0 && paid < finalCoursePrice) {
      setForm((prev) => ({ ...prev, paymentType: "partial" }));
    }
  }, [form.amountPaid, form.paymentType, finalCoursePrice]);

  const balanceAmount = useMemo(() => {
    const paid = Number(form.amountPaid || 0);
    if (form.paymentType !== "partial") return 0;
    return Math.max(finalCoursePrice - paid, 0);
  }, [form.paymentType, form.amountPaid, finalCoursePrice]);

  const handleSubmit = async() => {
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
        courseName,
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
      },
    };
    axios
      .put("https://course-project-wd0v.onrender.com/api/users/assigncourse", payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200)
          setToast({
            open: true,
            message: "Course Added Succesfully !",
            severity: "success",
          });
        setTimeout(() => {
         history("/")
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

  return (
    <Box bgcolor="#f4f6f8" py={4}>
      <Paper sx={{ maxWidth: 600, mx: "auto", p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Course Fee Payment
        </Typography>

        <TextField
          fullWidth
          label="Course Name"
          value={courseName || ""}
          margin="dense"
          InputProps={{ readOnly: true }}
        />

        <TextField
          fullWidth
          label="Total Course Fee"
          value={`₹ ${finalCoursePrice}`}
          margin="dense"
          InputProps={{ readOnly: true }}
        />

        <Typography variant="body2" color="text.secondary" mt={2}>
          Partial payment requires a minimum of 60%. Full payment clears the
          balance immediately.
        </Typography>

        <TextField
          select
          fullWidth
          label="Payment Type *"
          name="paymentType"
          value={form.paymentType}
          onChange={handleChange}
          margin="dense"
        >
          <MenuItem value="full">Full Payment</MenuItem>
          <MenuItem value="partial">Partial Payment</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Mode of Payment *"
          name="paymentMode"
          value={form.paymentMode}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              paymentMode: e.target.value,
              referenceNumber:
                e?.target?.value === "cash" ? "0000-0000-0000" : "",
              transactionId:
                e?.target?.value === "cash" ? "0000-0000-0000" : "",
            }));
          }}
          margin="dense"
        >
          <MenuItem value="upi">UPI / Google Pay / PhonePe</MenuItem>
          <MenuItem value="bank">Bank Transfer</MenuItem>
          <MenuItem value="cash">Cash</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Physical Course Material"
          name="physicalCopy"
          value={form.physicalCopy}
          onChange={handleChange}
          margin="dense"
        >
          <MenuItem value="yes">Yes (+₹500)</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Amount Paid *"
          name="amountPaid"
          type="number"
          value={form.amountPaid}
          onChange={(e) => {
            const sanitizedVal =
              parseFloat(e.target?.value) > Number(finalCoursePrice)
                ? Number(finalCoursePrice)
                : e.target.value;
            setForm((prevForm) => ({ ...prevForm, amountPaid: sanitizedVal }));
          }}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Balance Amount"
          value={`₹ ${balanceAmount}`}
          margin="dense"
          InputProps={{ readOnly: true }}
          sx={{
            opacity: 0.7,
          }}
        />
        <TextField
          fullWidth
          label="Transaction ID (0000 for cash)"
          name="transactionId"
          value={form.transactionId}
          onChange={handleChange}
          margin="dense"
          disabled={form?.paymentMode === "cash"}
        />

        <TextField
          fullWidth
          label="Payment Reference Number (0000 for cash)"
          name="referenceNumber"
          value={form.referenceNumber}
          onChange={handleChange}
          margin="dense"
          disabled={form?.paymentMode === "cash"}
        />

        <TextField
          fullWidth
          label="Executive Name *"
          name="executiveName"
          value={form.executiveName}
          onChange={handleChange}
          margin="dense"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: PRIMARY_COLOR,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#179e93" },
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnRollToCourse;
