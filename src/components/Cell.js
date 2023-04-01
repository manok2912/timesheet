import React from "react";
import { useRef } from "react";

function Cell({ date, project, tsdata, setTSData }) {
    return (

        <>
            {/* {console.log(tsdata)} */}
            {/* <span>{0}</span> */}
            <InlineEdit value={0} date={date} project={project} tsdata={tsdata} setTSData={setTSData} />
        </>
    );
}

const InlineEdit = ({ value, date, project, tsdata, setTSData }) => {
    const hoursRef = useRef("00");

    // console.log(value);
    // console.log(date);
    // console.log(project);
    // console.log(tsdata);

    const toFindDuplicates = (arry) => arry.filter((item, index) => arry.indexOf(item) !== index)

    const onChange = (event) => {
        hoursRef.current = event.target.value;
        console.log(hoursRef);
        if (hoursRef.current && hoursRef.current != '0') {
            const data = {
                hours: hoursRef.current,
                date,
                project: project.key
            }
            console.log(data);

            setTSData((tsdata) => {

                console.log(tsdata);

                const duplicates = tsdata = tsdata.some((element, index) => {
                    console.log(element);
                    return tsdata.indexOf(element) !== index
                })



                return [...tsdata, data]
            });
        }
    }

    const onKeyDown = (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.target.blur();
        }
    };

    const onBlur = (event) => {
        if (event.target.value.trim() === "") {
            hoursRef.current = value;
        } else {
            hoursRef.current = event.target.value;
        }
    };

    return (
        <input
            type="number"
            min="0"
            max="24"
            step="1"
            name="hours"
            id="hours"
            aria-label="Hours name"
            ref={hoursRef}
            defaultValue={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
        />
    );
};

export default Cell;