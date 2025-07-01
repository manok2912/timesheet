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
import { getWeekRangeFromDate, getDatesInCurrentWeek } from "../helpers/helper";

export default function Tabs({ day, shiftWeek }) {
  console.log("propd day", day);
  const [value, setValue] = React.useState("2");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const g = getWeekRangeFromDate(day.toISOString());
  const datesInWeek = getDatesInCurrentWeek(day.toISOString());

  const nextWeek = getWeekRangeFromDate(day.add(7, "day").toISOString());
  const prevWeek = getWeekRangeFromDate(day.subtract(7, "day").toISOString());

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
          >
            <Tab label="Months" value="1" />
            <Tab label="Weeks" value="2" />
            <Tab label="Projects" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Months</TabPanel>
        <TabPanel value="2">
          <Grid container spacing={2}>
            <Grid size={3}>
              <Button variant="contained" size="small" onClick={() => shiftWeek("previous")}>
                {nextWeek.label}
              </Button>
            </Grid>
            <Grid size={6}>
              <div className="container text-center my-3">
                <h1>{g.label}</h1>
                <p>Start: {g.start}</p>
                <p>End: {g.end}</p>
              </div>
            </Grid>
            <Grid size={3}>
              <Button variant="contained" size="small" onClick={() => shiftWeek("next")}>
              {prevWeek.label}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value="3">Projects</TabPanel>
      </TabContext>
    </Box>
  );
}
