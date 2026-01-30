import React from "react";
import { Box, Chip, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getAuthCookie } from "../auth";

const RejectedStudents = () => {
  const user = getAuthCookie();
  const columns = [
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "phone",
      headerName: "Phone No",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "courseName",
      headerName: "Course Name",
      minWidth: 240,
      renderCell: (params) => (
        <Tooltip title={params?.value}>
          <Box>{params?.value}</Box>
        </Tooltip>
      ),
      resize: true,
    },
    {
      field: "courseFee",
      headerName: "Course Fee (₹)",
      minWidth: 150,
    },
    {
      field: "amountPaid",
      headerName: "Paid (₹)",
      minWidth: 140,
    },
    {
      field: "pendingFee",
      headerName: "Pending (₹)",
      minWidth: 150,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 160,
    },
    {
      field: "status",
      headerName: "Payment Status",
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Completed"
              ? "success"
              : params.value === "Partial"
                ? "warning"
                : "error"
          }
          size="small"
          sx={{ width: "120px" }}
        />
      ),
    },
    {
      field: "studentstatus",
      headerName: "Status",
      minWidth: 160,
      renderCell: () => (
        <Chip
          label={"Rejected"}
          color={"error"}
          size="small"
          sx={{ width: "120px" }}
        />
      ),
    },
  ];

  const [students, setStudents] = useState([]);

  const getActiveStds = () => {
    axios
      .get("https://course-project-wd0v.onrender.com/api/users?status=inactive", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setStudents([]);
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getActiveStds();
  }, [getActiveStds]);

  return (
    <Box height={"65vh"}>
      <DataGrid
        rows={students?.map((ele, i) => ({ ...ele, id: i + 1 }))??[]}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        checkboxSelection={false}
        disableColumnSelector
        hideFooterPagination
        disableColumnSorting
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f4f6f8",
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
};

export default RejectedStudents;
