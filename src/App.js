import { useState } from 'react';
import './App.css';
// import { compareAsc, format } from 'date-fns'
import { listMonth } from './helpers/helper';
import Table from './components/Table';
import Modal from './components/Modal';

function App() {
  const [day, setDay] = useState(new Date())
  const [tsdata, setTSData] = useState([])

  const handleMonthToggle = (step) => {
    setDay((day) => {
      var current = new Date(day);
      current.setMonth(day.getMonth() + step);
      return current
    });
  }

  const handleMonthToggleName = (step) => {
    var current = new Date(day);
    current.setMonth(day.getMonth() + step);
    return ` ${listMonth[current.getMonth()]} ${current.getFullYear()} `
  };

  const handleSubmit = () => {
    console.log("test");
  }

  return (
    <div className="App container my-5">
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
            {<Modal day={day}/>}
            <h1>{`${listMonth[day.getMonth()]} ${day.getFullYear()}`}</h1>
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
        <Table day={day} tsdata={tsdata} setTSData={setTSData} />
      </div>
    </div>
  );
}

export default App;
