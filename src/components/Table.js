import { getDaysInMonth, projects } from '../helpers/helper';
import Cell from './Cell';

function Table({ day, tsdata, setTSData }) {
    const getCellTotal = (currDate) => {
        console.log(currDate);
        console.log(tsdata);
        var ts = [...tsdata];
        const currDateValues = (ts) = ts.filter((element, index) => {
            return element.date.getTime() === currDate.getTime();
        })
        console.log(currDateValues);
        const sumValue = currDateValues.reduce(function (total, amount) {
            return Number(total) + Number(amount["hours"]);
        }, []);
        console.log(sumValue);
        return sumValue;
    };
    const getTotal = () => {
        var ts = [...tsdata];
        const sumValue = ts.reduce(function (total, amount) {
            return Number(total) + Number(amount["hours"]);
        }, []);
        return sumValue;
    };

    return (
        <table className='table table-striped table-bordered'>
            {console.log(tsdata)}
            <thead>
                <tr>
                    <th scope="col">Date/Project</th>
                    {projects.map((value, index) => {
                        return <th scope="col" key={index}>{value.name}</th>
                    })}
                    <th scope="col" >Total - {getTotal()}</th>
                </tr>
            </thead>
            <tbody>
                {getDaysInMonth(day.getMonth(), day.getFullYear()).map((date, index) =>
                    <tr key={index} className={date.toLocaleString('en', { weekday: 'short' }).toLowerCase()}>
                        {
                            date.getDay() === 0 || date.getDay() === 6 ?
                                <td colSpan={projects.length + 1} className="table-danger" >{date.toDateString()}</td> :
                                <td>{date.toDateString()}</td>
                        }
                        {projects.map((value, index) => {
                            if (date.getDay() === 0 || date.getDay() === 6) {
                                return false
                            } else {
                                return <td key={index}>
                                    <Cell date={date} project={value} tsdata={tsdata} setTSData={setTSData} />
                                </td>
                            }
                        })}
                        {
                            date.getDay() === 0 || date.getDay() === 6 ?
                                <td></td> :
                                <td>{
                                    getCellTotal(date) > 8 ? <>
                                        {getCellTotal(date)} <span className="badge text-bg-danger">8 hours is max</span>
                                    </> : getCellTotal(date)
                                }</td>
                        }
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default Table;