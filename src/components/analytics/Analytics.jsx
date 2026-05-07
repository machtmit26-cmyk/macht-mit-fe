import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getAuthCookie } from "../auth";
import axios from "axios";


/* ================= UTILS ================= */
const getSummary = (data) =>
  data.reduce(
    (acc, cur) => {
      acc.students += cur.students;
      acc.collected += cur.paid;
      acc.pending += cur.pending;
      acc.courses.add(cur.course);
      return acc;
    },
    { students: 0, collected: 0, pending: 0, courses: new Set() },
  );

const getCollectionStatus = (percent) => {
  if (percent > 75) return { label: "Good", color: "#2e7d32", bg: "#e8f5e9" };
  if (percent > 50)
    return { label: "Average", color: "#ed6c02", bg: "#fff3e0" };
  if (percent > 35)
    return { label: "Critical", color: "#d32f2f", bg: "#fdecea" };
  return { label: "Alert", color: "#b71c1c", bg: "#fbe9e7" };
};

/* ================= SCROLL REVEAL ================= */
const useReveal = () => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShow(true),
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, show];
};

export default function Analytics() {
  const today = new Date();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);
  const user = getAuthCookie();

  const getAnalytics = () => {
    axios
      .get("https://course-project-wd0v.onrender.com/api/users/course-report", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        console.log("res",res?.data);
        
        if (res?.status === 200) {
          setData(res?.data);
        }
      })
      .catch((err) => {});
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getAnalytics();
  }, []);
  console.log("data", data);
  
  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      const d = new Date(item.date);
      if (!year) return d <= today;
      if (year && !month) return d.getFullYear() === Number(year);
      return (
        d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month)
      );
    });
  }, [year, month , data]);

  /* ================= COURSE-WISE AGGREGATION (FIX) ================= */
  const courseWiseData = useMemo(() => {
    const map = {};
    filteredData.forEach((d) => {
      if (!map[d.course]) {
        map[d.course] = {
          course: d.course,
          students: 0,
          paid: 0,
          pending: 0,
        };
      }
      map[d.course].students += d.students;
      map[d.course].paid += d.paid;
      map[d.course].pending += d.pending;
    });
    return Object.values(map);
  }, [filteredData]);

  /* ================= SUMMARY & INSIGHTS ================= */
  const summary = useMemo(() => getSummary(courseWiseData), [courseWiseData]);

  const arpu = summary.students
    ? Math.round(summary.collected / summary.students)
    : 0;

  const topCourse = useMemo(() => {
    return [...courseWiseData].sort((a, b) => b.students - a.students)[0];
  }, [courseWiseData]);

  const collectionPercent =
    summary.collected + summary.pending > 0
      ? Math.round(
          (summary.collected / (summary.collected + summary.pending)) * 100,
        )
      : 0;

  const collectionStatus = getCollectionStatus(collectionPercent);

  /* ================= ANIMATION ================= */
  const [kpiRef, kpiShow] = useReveal();
  const [insightRef, insightShow] = useReveal();
  const [courseRef, courseShow] = useReveal();

  const reveal = (show, delay = 0) => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(30px)",
    transition: `all 0.6s ease ${delay}ms`,
  });

  return (
    <Box
      p={{ xs: 2, sm: 3 }}
      sx={{ backgroundColor: "#f5f7fb", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Dashboard
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Updated as of {today.toLocaleDateString("en-IN")}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ maxWidth: 360 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                label="Year"
                onChange={(e) => {
                  setYear(e.target.value);
                  setMonth("");
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2026">2026</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" disabled={!year}>
              <InputLabel>Month</InputLabel>
              <Select
                value={month}
                label="Month"
                onChange={(e) => setMonth(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} mt={2} ref={kpiRef} sx={reveal(kpiShow)}>
        {[
          {
            title: "Total Students",
            value: summary.students,
            icon: <PeopleIcon />,
            color: "#1976d2",
          },
          {
            title: "Revenue Collected",
            value: `₹ ${summary.collected.toLocaleString("en-IN")}`,
            icon: <CurrencyRupeeIcon />,
            color: "#2e7d32",
          },
          {
            title: "Pending Amount",
            value: `₹ ${summary.pending.toLocaleString("en-IN")}`,
            icon: <PendingActionsIcon />,
            color: "#ed6c02",
          },
          {
            title: "Active Courses",
            value: courseWiseData.length,
            icon: <SchoolIcon />,
            color: "#6a1b9a",
          },
          {
            title: "Avg Revenue / Student",
            value: `₹ ${arpu}`,
            icon: <TrendingUpIcon />,
            color: "#455a64",
          },
        ].map((k, i) => (
          <Grid item xs={12} sm={6} md={2.4} key={i}>
            <Card sx={{ background: k.color, color: "#fff", borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2}>
                  {k.icon}
                  <Box>
                    <Typography fontSize={13}>{k.title}</Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {k.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* INSIGHTS */}
      <Grid
        container
        spacing={3}
        mt={3}
        ref={insightRef}
        sx={reveal(insightShow, 100)}
      >
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography fontSize={13} color="text.secondary">
              🏆 Top Performing Course
            </Typography>
            <Typography fontSize={20} fontWeight={700}>
              {topCourse?.course || "-"}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              {topCourse?.students || 0} students
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontSize={13} color="text.secondary">
                💰 Overall Collection
              </Typography>
              <Chip
                label={collectionStatus.label}
                size="small"
                sx={{
                  backgroundColor: collectionStatus.bg,
                  color: collectionStatus.color,
                }}
              />
            </Stack>
            <Typography
              fontSize={28}
              fontWeight={800}
              sx={{ color: collectionStatus.color }}
            >
              {collectionPercent}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={collectionPercent}
              sx={{
                height: 10,
                borderRadius: 8,
                backgroundColor: "#e8f0fe",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 8,
                  background: `linear-gradient(90deg, ${collectionStatus.color}, #42a5f5)`,
                },
              }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* COURSE-WISE CARDS */}
      <Box
        ref={courseRef}
        mt={4}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 3,
          ...reveal(courseShow, 150),
        }}
      >
        {courseWiseData.map((c, i) => {
          const total = c.paid + c.pending;
          const progress = total > 0 ? Math.round((c.paid / total) * 100) : 0;
          const status = getCollectionStatus(progress);

          return (
            <Card key={i} sx={{ p: 2.2, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700}>{c.course}</Typography>
                <Chip
                  size="small"
                  label={`${progress}%`}
                  sx={{ backgroundColor: status.bg, color: status.color }}
                />
              </Stack>

              <Typography fontSize={13} color="text.secondary" mt={0.5}>
                👥 {c.students} students
              </Typography>

              <Box mt={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontSize={12}>Collected</Typography>
                  <Typography fontWeight={600} color="#2e7d32">
                    ₹ {c.paid.toLocaleString("en-IN")}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontSize={12}>Pending</Typography>
                  <Typography fontWeight={600} color="#ed6c02">
                    ₹ {c.pending.toLocaleString("en-IN")}
                  </Typography>
                </Stack>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mt: 1.5,
                  height: 8,
                  borderRadius: 6,
                  backgroundColor: "#e8f0fe",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${status.color}, #42a5f5)`,
                  },
                }}
              />
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
