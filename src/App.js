import { useState } from 'react';
import './App.css';
import { compareAsc, format } from 'date-fns'
import { listMonth } from './helpers/helper';
import { getDaysInMonth } from './helpers/helper';

function App() {
  const listMonthLenght = listMonth.length;
  const [day, setDay] = useState(new Date())

  console.log();
  const handleMonthClickPrev = () => {
    var prevDay = new Date(day);
    prevDay.setMonth(day.getMonth() - 1);
    setDay(prevDay);
    //setMonth(((month === 0) && listMonthLenght - 1) || month - 1);
  };
  const handleMonthClickNext = () => {
    var nextDay = new Date(day);
    nextDay.setMonth(day.getMonth() + 1);
    setDay(nextDay);
    //setMonth((month + 1) % listMonthLenght);
  };
  return (
    <div className="App">
      <button onClick={handleMonthClickPrev}>prev</button>
      <h1>{`${listMonth[day.getMonth()]} ${day.getFullYear()}`}</h1>
      <button onClick={handleMonthClickNext}>next</button>
      <div>
        {getDaysInMonth(day.getMonth(), day.getFullYear()).map((date) =>
          <p>{date.toDateString()}</p>
        )}
      </div>
    </div>
  );
}

export default App;
