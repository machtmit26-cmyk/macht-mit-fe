import { Box, Chip, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getAuthCookie } from "../auth";

const GetActiveStudents = () => {
  const user = getAuthCookie();
  const columns = [
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "registeredOn",
      headerName: "Registered On",
      minWidth: 160,
      renderCell: (params) => {
        const date = params.row?.createdAt;

        if (!date) {
          return <span>-</span>;
        }

        const parsed = new Date(date);

        return isNaN(parsed.getTime()) ? (
          <span>-</span>
        ) : (
          parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        );
      },
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
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params?.value}>
          <Box>{params?.value}</Box>
        </Tooltip>
      ),
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
          size="small"
          sx={{
            width: "120px",
            fontWeight: 600,
            textTransform: "capitalize",

            ...(params.value === "Completed" && {
              backgroundColor: "#E6F4EA",
              color: "#1E7E34",
              border: "1px solid #B7E4C7",
            }),

            ...(params.value === "Partial" && {
              backgroundColor: "#FFF4E5",
              color: "#B76E00",
              border: "1px solid #FFD8A8",
            }),
            ...(params.value !== "Completed" &&
              params.value !== "Partial" && {
                backgroundColor: "#FDECEA",
                color: "#B71C1C",
                border: "1px solid #F5C6CB",
              }),
          }}
        />
      ),
    },
    {
      field: "studentstatus",
      headerName: "Status",
      minWidth: 160,
      renderCell: () => (
        <Chip
          label={"Active"}
          size="small"
          sx={{ width: "120px", backgroundColor: "#1E7E34", color: "#ffffff" }}
        />
      ),
    },
  ];

  const [students, setStudents] = useState([]);

  const getActiveStds = () => {
    axios
      .get("https://course-project-wd0v.onrender.com/api/users?status=active", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          setStudents(res?.data);
        }
      })
      .catch((err) => {});
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getActiveStds();
  }, []);

  return (
    <Box height={"65vh"}>
      <DataGrid
        rows={students?.map((ele, i) => ({ ...ele, id: i + 1 }))}
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

export default GetActiveStudents;
