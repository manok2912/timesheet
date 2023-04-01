import { useRef } from "react";

function EditData({day, project}) {
    const hoursRef = useRef()

    const updatehrs = () => {
        console.log(hoursRef.current.value);
    }
    return (
        <>
            <input type="number" min="0" max="24" step="1" ref={hoursRef} onChange={updatehrs} name="hours" id="hours"/>
        </>
    );
}


export default EditData;