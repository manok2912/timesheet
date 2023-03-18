import { getDaysInMonth, projects } from '../helpers/helper';
import Cell from './Cell';

function Table({ day, edit }) {
    return (
    <table>
        <thead>
            <tr>
                <th>Date/Project</th>
                {console.log(projects)}
                {projects.map((value, index) => {
                    return <th key={index}>{value.name}</th>
                })}
            </tr>
        </thead>
        <tbody>
            {getDaysInMonth(day.getMonth(), day.getFullYear()).map((date, index) =>
                <tr key={index}>
                    <td>{date.toDateString()}</td>
                    {projects.map((value, index) => {
                        return <td key={index}>
                            <Cell day={date} project={value} edit={edit}/>
                        </td>
                    })}
                </tr>
            )}
        </tbody>
    </table>
    );
}

export default Table;