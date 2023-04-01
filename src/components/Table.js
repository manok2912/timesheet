import { getDaysInMonth, projects } from '../helpers/helper';
import Cell from './Cell';

function Table({ day, tsdata, setTSData }) {
    return (
    <table className='table table-striped table-bordered'>
        <thead>
            <tr>
                <th scope="col">Date/Project</th>
                {/* {console.log(projects)} */}
                {projects.map((value, index) => {
                    return <th scope="col" key={index}>{value.name}</th>
                })}
                <th scope="col" >Total</th>
            </tr>
        </thead>
        <tbody>
            {getDaysInMonth(day.getMonth(), day.getFullYear()).map((date, index) =>
                <tr key={index} className={date.toLocaleString('en', { weekday: 'short'}).toLowerCase()}>
                    {
                        date.getDay() === 0 || date.getDay() === 6 ? 
                        <td colSpan={projects.length+1} class="table-danger" >{date.toDateString()}</td> :
                        <td>{date.toDateString()}</td>
                    }
                    {projects.map((value, index) => {
                        if(date.getDay() === 0 || date.getDay() === 6){
                            return false
                        } else{
                            return <td key={index}>
                            <Cell date={date} project={value} tsdata={tsdata} setTSData={setTSData}/>
                        </td>
                        }
                        
                    })}
                    {console.log(tsdata)}
                    <td>
                        {
                            tsdata && tsdata.reduce(function(total, amount){
                                console.log(amount);
                                if (date.getTime() == amount.date.getTime()){
                                    return total + amount["hours"];
                                }
                            }, [])
                        }
                    </td>
                </tr>
            )}
        </tbody>
    </table>
    );
}

export default Table;