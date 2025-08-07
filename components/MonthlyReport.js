import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import TagSlider from "./TagSlider";
import { normalizeToPercent } from "../helpers/helper";

function getMonthsInYear(year) {
  // Returns array of dayjs objects for each month in the year
  return Array.from({ length: 12 }, (_, i) => dayjs(`${year}-${i + 1}-01`));
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function processMonthlyData(tasks, month) {
  const monthlyStats = {};
  console.log(`Processing month: ${month}`);

  tasks.forEach((task) => {
    if (!task.timeline) {
      console.log(`Skipping ${task.project} - No timeline`);
      return;
    }

    let monthlyHours = 0;
    const monthlyDays = {};
    
    console.log(`\nProcessing ${task.project}:`);
    console.log('Timeline:', task.timeline);

    Object.entries(task.timeline).forEach(([date, hours]) => {
      // Validate date format
      if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.warn(`Invalid date format for ${task.project}: ${date}`);
        return;
      }

      if (date.startsWith(month)) {
        const hourNum = parseFloat(hours) || 0;
        if (isNaN(hourNum)) {
          console.warn(`Invalid hours value for ${task.project} on ${date}: ${hours}`);
          return;
        }

        monthlyHours += hourNum;
        monthlyDays[date] = hourNum;
        
        console.log(`${date}: ${hourNum}hrs (Total: ${monthlyHours})`);
      }
    });

    if (monthlyHours > 0) {
      monthlyStats[task.project] = {
        project: task.project,
        totalHours: parseFloat(monthlyHours.toFixed(2)),
        daysWorked: Object.keys(monthlyDays).length,
        averageHours: parseFloat((monthlyHours / Object.keys(monthlyDays).length).toFixed(2)),
        timeline: monthlyDays,
      };
      
      console.log(`\n${task.project} Summary:`);
      console.log(`- Total Hours: ${monthlyStats[task.project].totalHours}`);
      console.log(`- Days Worked: ${monthlyStats[task.project].daysWorked}`);
      console.log(`- Avg Hours/Day: ${monthlyStats[task.project].averageHours}`);
    }
  });

  return Object.values(monthlyStats);
}

const MonthlyReport = ({ day }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const year = day.year();
  const months = getMonthsInYear(year);
  const [monthlySummary, setMonthlySummary] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/tasks");
        const tasks = await res.json();

        // For each month, process stats
        const summary = months.map((monthDay) => {
          const monthStr = monthDay.format("YYYY-MM");
          const processed = processMonthlyData(tasks, monthStr);
          const totalHours = processed.reduce(
            (sum, p) => sum + p.totalHours,
            0
          );
          const totalDays = new Set();
          processed.forEach((p) =>
            Object.keys(p.timeline).forEach((d) => totalDays.add(d))
          );
          return {
            month: monthDay.format("MMMM"),
            year: monthDay.format("YYYY"),
            totalHours,
            workingDays: totalDays.size,
            avgHours:
              totalDays.size > 0 ? (totalHours / totalDays.size).toFixed(1) : 0,
            activeProjects: processed.length,
            breakdown: processed,
          };
        });
        setMonthlySummary(summary);
        setData(tasks);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [year]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>Loading yearly report...</Typography>
      </Box>
    );
  }

  console.log("Monthly Summary:", monthlySummary);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" component="h2" textAlign="center" mb={4}>
        Yearly Summary: {year}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {monthlySummary.map((month, idx) => (
          <Grid size={{ xs: 12, md: 4, lg: 4 }} key={month.month}>
            <Card
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {month.month} {month.year}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Total Billable Hours: <strong>{month.totalHours}</strong>
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Total Non-Billable Hours: <strong>{160 - month.totalHours}</strong>
                </Typography>
                <Box sx={{ px: 1, py: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    {month.totalHours} / 160 hrs &nbsp; 
                    ({((month.totalHours / 160) * 100).toFixed(1)}%)
                  </Typography>
                  <TagSlider data={normalizeToPercent([month.totalHours, 160 - month.totalHours])}/>
                </Box>
                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                  {month.breakdown.map((project) => (
                    <Chip
                      key={project.project}
                      label={`${project.project}: ${project.totalHours}hrs`}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MonthlyReport;
