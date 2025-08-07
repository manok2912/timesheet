import { useState } from 'react';
import './App.css';
// import { compareAsc, format } from 'date-fns'
import { listMonth } from '../helpers/helper';
import Table from './components/Table';
import Modal from './components/Modal';
import MaterialTable from './components/MaterialTable';
import Tabs from '../components/Tabs';
import dayjs from "dayjs";
import React from 'react';

function App() {
  const [day, setDay] = useState(dayjs())
  const [tsdata, setTSData] = useState([])

  const handleMonthToggle = (step) => {
    setDay((day) => {
      var current = new Date(day);
      // current.setMonth(day.getMonth() + step);
      return current
    });
  }

  const handleMonthToggleName = (step) => {
    var current = new Date(day);
    // current.setMonth(day.getMonth() + step);
    // return ` ${listMonth[current.getMonth()]} ${current.getFullYear()} `
  };

  const handleSubmit = () => {
    console.log("test");
  }

  const shiftWeek = (direction) => {
    const delta = direction === "next" ? 7 : direction === "previous" ? -7 : 0;
    setDay(prev => prev.add(delta, "day"));
  };

  // Debug font-family
  const [computedFont, setComputedFont] = useState('');
  const testRef = React.useRef();
  React.useEffect(() => {
    if (testRef.current) {
      setComputedFont(window.getComputedStyle(testRef.current).fontFamily);
    }
  }, []);

  return (
    <div className="App container my-5">
      <div ref={testRef} style={{fontSize: 20, marginBottom: 16, border: '1px dashed #ccc', padding: 8}}>
        Test font: The quick brown fox jumps over the lazy dog.<br/>
        <span style={{fontSize: 14, color: '#888'}}>Computed font-family: {computedFont}</span>
      </div>
      <Tabs day={day} shiftWeek={shiftWeek} />
      <MaterialTable day={day}/>


      {/* {console.log(tsdata)} */}
      <div className="container text-center my-3">
        <div className="row align-items-center">
          <div className="col">
            <button className="btn btn-dark" onClick={() => handleMonthToggle(-1)}>
            <i className="bi bi-arrow-bar-left"></i>
              {handleMonthToggleName(-1)}
            </button>
          </div>
          <div className="col">
            {/* {<Modal day={day}/>} */}
            {/* <h1>{`${listMonth[day.getMonth()]} ${day.getFullYear()}`}</h1> */}
            <button className="btn btn-dark" onClick={() => handleSubmit()}>
              {"Save "}
              <i className="bi bi-calendar-plus-fill"></i>
            </button>
          </div>
          <div className="col">
            <button className="btn btn-dark" onClick={() => handleMonthToggle(+1)}>
              {handleMonthToggleName(+1)}
              <i className="bi bi-arrow-bar-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div className='table-area'>
        {/* <Table day={day} tsdata={tsdata} setTSData={setTSData} /> */}
      </div>
    </div>
  );
}

export default App;
