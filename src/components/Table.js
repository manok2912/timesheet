import { getDaysInMonth, projects } from '../helpers/helper';
import Cell from './Cell';

function Table({ day, tsdata, setTSData }) {
    return (
    <table>
        <thead>
            <tr>
                <th>Date/Project</th>
                {/* {console.log(projects)} */}
                {projects.map((value, index) => {
                    return <th key={index}>{value.name}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {getDaysInMonth(day.getMonth(), day.getFullYear()).map((date, index) =>
                <tr key={index} className={date.toLocaleString('en', { weekday: 'short'}).toLowerCase()}>
                    <td>{date.toDateString()}</td>
                    {projects.map((value, index) => {
                        return <td key={index}>
                            <Cell date={date} project={value} tsdata={tsdata} setTSData={setTSData}/>
                        </td>
                    })}
                </tr>
            )}
        </tbody>
    </table>
    );
}

export default Table;