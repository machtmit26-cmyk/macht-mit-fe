import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Chip, Tooltip, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAuthCookie } from "../auth/index";

const PendingApproval = () => {
  const user = getAuthCookie();
  const [students, setStudents] = useState([]);

  /* ================= FETCH PENDING STUDENTS ================= */
  const getPendingStudents = async () => {
    try {
      const res = await axios.get(
        "https://course-project-wd0v.onrender.com/api/users?status=pending",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (res.status === 200) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getPendingStudents();
  }, []);

  /* ================= APPROVE ================= */
  const approveStudent = async (id) => {
    await axios.put(
      `https://course-project-wd0v.onrender.com/api/users/approve/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    getPendingStudents(); // 🔥 REFRESH GRID
  };

  /* ================= REJECT ================= */
  const rejectStudent = async (id) => {
    await axios.put(
      `https://course-project-wd0v.onrender.com/api/users/reject/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    getPendingStudents(); // 🔥 REFRESH GRID
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      field: "name",
      headerName: "Student Name",
      flex: 1,
      minWidth: 180,
    },
    
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      minWidth: 180,
      valueGetter: (params) => params?.row?.country?.label || "-",
    },
    {
      field: "phone",
      headerName: "Phone No",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
   
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      renderCell: () => (
        <Chip
          label="Pending"
          color="warning"
          size="small"
          sx={{ width: "120px" }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => approveStudent(params.row._id)}
          >
            Approve
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => rejectStudent(params.row._id)}
          >
            Reject
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box height="65vh">
      <DataGrid
        rows={students.map((s) => ({
          ...s,
          id: s._id, // 🔥 IMPORTANT FOR DATAGRID
        }))}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnFilter
        disableColumnSorting
        hideFooterPagination
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

export default PendingApproval;
