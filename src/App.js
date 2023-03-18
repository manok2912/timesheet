import { useState } from 'react';
import './App.css';
import { compareAsc, format } from 'date-fns'
import { listMonth, getDaysInMonth, projects } from './helpers/helper';
import Table from './components/Table';

function App() {
  const [day, setDay] = useState(new Date())
  const [edit, setEdit] = useState(false)

  const handleMonthClickPrev = () => {
    var prevDay = new Date(day);
    prevDay.setMonth(day.getMonth() - 1);
    setDay(prevDay);
  };

  const handleMonthClickNext = () => {
    var nextDay = new Date(day);
    nextDay.setMonth(day.getMonth() + 1);
    setDay(nextDay);
  };
  return (
    <div className="App">

      <button onClick={handleMonthClickPrev}>prev</button>
      <h1>{`${listMonth[day.getMonth()]} ${day.getFullYear()}`}</h1>
      <button onClick={handleMonthClickNext}>next</button>
      <button onClick={() => setEdit(!edit)}>Edit</button>
      <button onClick={""}>Save</button>
      <div className='table-area'>
        <Table day={day} edit={edit}/>
      </div>
    </div>
  );
}

export default App;
