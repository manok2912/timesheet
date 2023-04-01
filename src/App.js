import { useState } from 'react';
import './App.css';
// import { compareAsc, format } from 'date-fns'
import { listMonth } from './helpers/helper';
import Table from './components/Table';

function App() {
  const [day, setDay] = useState(new Date())
  const [edit, setEdit] = useState(false)
  const [tsdata, setTSData] = useState([])


  const handleMonthToggle = (step) => {
    setDay((day) => {
      var current = new Date(day);
      current.setMonth(day.getMonth() + step);
      return current
    });
  }

  const handleSubmit = () => {
    console.log("test");
  }

  return (
    <div className="App">

      <button onClick={() => handleMonthToggle(-1)}>prev</button>
      <h1>{`${listMonth[day.getMonth()]} ${day.getFullYear()}`}</h1>
      <button onClick={() => handleMonthToggle(+1)}>next</button>
      <button onClick={() => handleSubmit()}>Save</button>
      <div className='table-area'>
        <Table day={day} tsdata={tsdata} setTSData={setTSData}/>
      </div>
    </div>
  );
}

export default App;
