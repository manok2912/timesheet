import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { getWeekRangeFromDate, getDatesInCurrentWeek, getWeekOptions } from "../helpers/helper";
import MonthlyReport from "./MonthlyReport";
import MaterialTable from "./MaterialTable";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Tabs({ day, shiftWeek, onDayChange, handleWeekChange }) {
  console.log("propd day", day);
  const [value, setValue] = React.useState("2");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMonthChange = (newMonth) => {
    if (onDayChange) {
      onDayChange(newMonth);
    }
  };

  const g = getWeekRangeFromDate(day.toISOString());
  const datesInWeek = getDatesInCurrentWeek(day.toISOString());

  const nextWeek = getWeekRangeFromDate(day.add(7, "day").toISOString());
  const prevWeek = getWeekRangeFromDate(day.subtract(7, "day").toISOString());

  const weekOptions = getWeekOptions(day);


  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="timesheet tabs" centered>
            <Tab label="Monthly Report" value="1" />
            <Tab label="Weekly Timesheet" value="2" />
            <Tab label="Projects" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <MonthlyReport day={day} onMonthChange={handleMonthChange} />
        </TabPanel>
        <TabPanel value="2">
          <Grid container spacing={2}>
            <Grid size={3}>
              <Button
                variant="contained"
                size="small"
                onClick={() => shiftWeek("previous")}
              >
                {prevWeek.label}
              </Button>
            </Grid>
            <Grid size={6}>
              <div className="container text-center my-3">
                <div style={{ marginBottom: 16 }}>
                  <Select
                    value={day.startOf("week").toISOString()}
                    onChange={handleWeekChange}
                    size="small"
                  >
                    {weekOptions.map((week) => (
                      <MenuItem
                        key={week.toISOString()}
                        value={week.toISOString()}
                      >
                        {getWeekRangeFromDate(week.toISOString()).label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <h1>{g.label}</h1>
              </div>
            </Grid>
            <Grid size={3}>
              <Button
                variant="contained"
                size="small"
                onClick={() => shiftWeek("next")}
              >
                {nextWeek.label}
              </Button>
            </Grid>
          </Grid>
          <MaterialTable day={day} datesInWeek={datesInWeek} />
        </TabPanel>
        <TabPanel value="3">
          <Box sx={{ p: 2 }}>
            <h3>Project Management</h3>
            <p>Project management features coming soon...</p>
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
