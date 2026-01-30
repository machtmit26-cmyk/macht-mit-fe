import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import GetActiveStudents from "./GetActiveStudents";
import PendingApproval from "./PendingApproval";
import RejectedStudents from "./RejectedStudents";

const StudentTabs = () => {
  const [value, setValue] = useState(0);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        width: "98%",
        margin: "auto",
        mt: 2,
        borderRadius: "12px",
        mb:2
      }}
    >
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        sx={{
          px: 2,
          minHeight: 48,
          borderBottom: "1px solid #e5e5e5",
          "& .MuiTabs-indicator": {
            backgroundColor: "#18b3a4",
            height: 3,
          },

          "& .MuiTab-root": {
            textTransform: "none",
            minHeight: 48,
            fontSize: "14px",
            fontWeight: 500,
            color: "#6b6b6b",
            gap: "6px",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#18b3a4",
            },
            "&.Mui-focusVisible": {
              backgroundColor: "transparent",
            },
          },
          "& .Mui-selected": {
            color: "#18b3a4",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <Tab
          icon={<PeopleAltOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="Active Students"
        />
        <Tab
          icon={<CancelOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="Rejected"
        />
        <Tab
          icon={<HourglassEmptyOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="New / Pending Approval"
        />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {value === 0 && <GetActiveStudents />}
        {value === 1 && <RejectedStudents />}
        {value === 2 && <PendingApproval />}
      </Box>
    </Box>
  );
};

export default StudentTabs;
