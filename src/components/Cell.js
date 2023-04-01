import React from "react";
import { useRef } from "react";

function Cell({ date, project, tsdata, setTSData }) {
    return (
        <>
            <InlineEdit value={0} date={date} project={project} tsdata={tsdata} setTSData={setTSData} />
        </>
    );
}

const InlineEdit = ({ value, date, project, tsdata, setTSData }) => {
    const hoursRef = useRef("00");
    const onChange = (event) => {
        hoursRef.current = event.target.value;
        console.log(hoursRef);
        if (hoursRef.current) {
            const data = {
                hours: Number(hoursRef.current),
                date,
                project: project.key
            }
            setTSData((tsdata) => {
                var ts = [...tsdata];
                const duplicates = (ts) = ts.filter((element, index) => {
                    return element.date.getTime() !== date.getTime() || project.key !== element.project;
                })
                return [...duplicates, data]
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
            max="8"
            step="1"
            name="hours"
            id="hours"
            aria-label="Hours name"
            className="form-control"
            ref={hoursRef}
            defaultValue={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
        />
    );
};

export default Cell;