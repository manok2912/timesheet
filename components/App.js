'use client';

import { useState } from 'react';
import '../styles/App.css'
import dayjs from "dayjs";
import Tabs from './Tabs';


function App() {
  const [day, setDay] = useState(dayjs());

  const shiftWeek = (direction) => {
    const delta = direction === "next" ? 7 : direction === "previous" ? -7 : 0;
    setDay(prev => prev.add(delta, "day"));
  };
  // Handler for week change from dropdown
  const handleWeekChange = (event) => {
    setDay(dayjs(event.target.value));
  };

  return (
    <div className="App container my-5">
      <h1 className="text-center mb-4">Timesheet App</h1>
      <Tabs day={day} shiftWeek={shiftWeek} handleWeekChange={handleWeekChange}/>
    </div>
  );
}

export default App;
