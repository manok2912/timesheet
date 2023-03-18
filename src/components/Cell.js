import ViewData from "./ViewData";
import EditData from "./EditData";

function Cell({day, project, edit}) {
    return (
        <>
        {edit ? <EditData day={day} project={project}/> : <ViewData day={day} project={project}/>}    
        </>
    );
}


export default Cell;