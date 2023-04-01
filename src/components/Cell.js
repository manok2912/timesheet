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
                hours: Number(hoursRef.current),
                date,
                project: project.key
            }
            // console.log(data);

            setTSData((tsdata) => {

                // console.log(tsdata);

                var ts = [...tsdata];

                const duplicates = (ts) = ts.filter((element, index) => {
                    // console.log(element);
                    // console.log(date.getTime());
                    // console.log(element.date.getTime());
                    // console.log(element.date.getTime() == date.getTime());

                    // console.log(project.key)
                    // console.log(element.project)


                    return element.date.getTime() !== date.getTime() || project.key !== element.project;
                })

                // console.log(duplicates);

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
            max="24"
            step="1"
            name="hours"
            id="hours"
            aria-label="Hours name"
            class="form-control"
            ref={hoursRef}
            defaultValue={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
        />
    );
};

export default Cell;