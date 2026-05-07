import {
  Box,
  Chip,
  Tooltip,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { getAuthCookie } from "../auth";
import dayjs from "dayjs";

const GetActiveStudents = () => {
  const user = getAuthCookie();

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const getActiveStds = () => {
    axios
      .get("https://course-project-wd0v.onrender.com/api/users?status=active", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setStudents(res.data);
        }
      });
  };

  useEffect(() => {
    getActiveStds();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;

    return students.filter((student) =>
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  const highlightText = (text) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <Box
          key={index}
          component="span"
          sx={{
            backgroundColor: "#fff3cd",
            fontWeight: 700,
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          {part}
        </Box>
      ) : (
        part
      ),
    );
  };

  const handleApprove = () => {
    console.log("Approved:", selectedRow);
    setOpenApprove(false);
  };

  const handleReject = () => {
    console.log("Rejected:", selectedRow, rejectReason);
    setOpenReject(false);
    setRejectReason("");
  };

  const columns = [
    {
      field: "id",
      headerName: "Sl No",
      width: 80,
    },
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""} arrow>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {highlightText(params?.value || "")}
          </Box>
        </Tooltip>
      ),
    },

    {
      field: "enrolledDate",
      headerName: "Enrolled Date",
      minWidth: 160,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""} arrow>
          <Box>
            {params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "--"}
          </Box>
        </Tooltip>
      ),
    },

    {
      field: "country",
      headerName: "Country",
      minWidth: 140,
    },

    {
      field: "phone",
      headerName: "Phone",
      minWidth: 140,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""} arrow>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params?.value || "--"}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "courseName",
      headerName: "Course",
      minWidth: 180,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""} arrow>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params?.value || "--"}
          </Box>
        </Tooltip>
      ),
    },

    {
      field: "courseFee",
      headerName: "Fee ₹",
      minWidth: 120,
    },

    {
      field: "amountPaid",
      headerName: "Paid ₹",
      minWidth: 120,
    },

    {
      field: "transactionId",
      headerName: "Transaction ID",
      minWidth: 180,
      renderCell: (params) => (
        <Tooltip title={params?.value || ""} arrow>
          <Box
            sx={{
              fontFamily: "monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params?.value || "--"}
          </Box>
        </Tooltip>
      ),
    },

    {
      field: "paymentMethod",
      headerName: "Method",
      minWidth: 130,
      renderCell: (params) => (
        <Box sx={{ textTransform: "capitalize" }}>{params?.value}</Box>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 180,
      renderCell: (params) => {
        const status = params.value;

        const getStatusStyles = () => {
          switch (status) {
            case "Payment Verified and Approved":
              return {
                backgroundColor: "#E6F4EA",
                color: "#1E7E34",
                border: "1px solid #B7E4C7",
              };

            case "Awaiting Admin Approval":
              return {
                backgroundColor: "#FFF4E5",
                color: "#B76E00",
                border: "1px solid #FFD8A8",
              };

            case "Rejected":
              return {
                backgroundColor: "#FDECEA",
                color: "#B71C1C",
                border: "1px solid #F5C6CB",
              };

            default:
              return {
                backgroundColor: "#FDECEA",
                color: "#B71C1C",
                border: "1px solid #F5C6CB",
              };
          }
        };

        return (
          <Chip
            label={status}
            size="small"
            sx={{
              minWidth: "150px",
              fontWeight: 600,
              borderRadius: "6px",
              ...getStatusStyles(),
            }}
          />
        );
      },
    },

    {
      field: "studentlearningStatus",
      headerName: "Student Learning Status",
      minWidth: 170,
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 280,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            startIcon={<CheckCircleOutlineIcon />}
            variant="contained"
            sx={{
              background: "#1E7E34",
              "&:hover": { background: "#166528" },
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => {
              setSelectedRow(params.row);
              setOpenApprove(true);
            }}
          >
            Approve
          </Button>

          <Button
            startIcon={<CancelOutlinedIcon />}
            variant="outlined"
            color="error"
            sx={{ textTransform: "none", fontWeight: 600 }}
            onClick={() => {
              setSelectedRow(params.row);
              setOpenReject(true);
            }}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box mb={2} width={350}>
        <TextField
          fullWidth
          size="small"
          type="search"
          placeholder="Search student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* GRID */}

      <Box height="65vh" width={"100%"}>
        <DataGrid
          rows={filteredStudents.map((ele, i) => ({
            ...ele,
            id: i + 1,
          }))}
          columns={columns}
          hideFooterPagination
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              background: "#f4f6f8",
              fontWeight: 700,
            },
          }}
        />
      </Box>

      <Dialog
        open={openApprove}
        onClose={() => setOpenApprove(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            width: 400,
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <Box
            sx={{
              background: "#E6F4EA",
              width: 70,
              height: 70,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              mb: 2,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#1E7E34" }} />
          </Box>

          <Typography fontSize={22} fontWeight={700} mb={1}>
            Approve Student
          </Typography>

          <Typography color="text.secondary">
            Are you sure you want to approve
          </Typography>

          <Typography fontWeight={700} mt={1}>
            {selectedRow?.studentName}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpenApprove(false)}
            variant="outlined"
            sx={{ width: 120 }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleApprove}
            variant="contained"
            sx={{
              width: 120,
              background: "#1E7E34",
              "&:hover": { background: "#166528" },
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReject}
        onClose={() => setOpenReject(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "32px 32px 24px 32px",
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", padding: 0 }}>
          {/* ICON */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#FDECEA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              marginBottom: "20px",
            }}
          >
            <WarningAmberRoundedIcon
              sx={{
                fontSize: 40,
                color: "#B71C1C",
              }}
            />
          </Box>

          {/* TITLE */}
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#2d2d2d",
              marginBottom: "8px",
            }}
          >
            Reject Student
          </Typography>

          {/* SUBTEXT */}
          <Typography
            sx={{
              fontSize: "16px",
              color: "#6b6b6b",
              marginBottom: "6px",
            }}
          >
            Provide rejection reason for
          </Typography>

          {/* STUDENT NAME */}
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#2d2d2d",
              marginBottom: "24px",
            }}
          >
            {selectedRow?.studentName}
          </Typography>

          {/* INPUT */}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{
              marginBottom: "28px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </DialogContent>

        {/* BUTTONS */}
        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: 0,
            marginTop: "4px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setOpenReject(false)}
            sx={{
              width: "48%",
              height: "44px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!rejectReason}
            onClick={handleReject}
            sx={{
              width: "48%",
              height: "44px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              backgroundColor: "#B71C1C",
              "&:hover": {
                backgroundColor: "#8f1717",
              },
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GetActiveStudents;
