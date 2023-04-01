import React from "react";
import { useRef } from "react";


function ViewData({ day, project, tsdata, setTSData }) {
  //const [value, setValue] = React.useState(0);
  return (
    <>
      <span>{ }</span>
      <InlineEdit value={0} />
    </>
  );
}

const InlineEdit = ({ value }) => {
  const hoursRef = useRef("uuu");

  //const [editingValue, setEditingValue] = React.useState(value);

  const onChange = (event) => hoursRef.current = event.target.value;

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
      type="text"
      aria-label="Field name"
      ref={hoursRef}
      defaultValue={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  );
};

export default ViewData;