import React, { useRef, Fragment, useState } from "react";

const _tags = [
  {
    name: "Action",
    color: "red"
  },
  {
    name: "Horror",
    color: "black"
  }
];

const getPercentage = (containerWidth, distanceMoved) => {
  return (distanceMoved / containerWidth) * 100;
};

const TagSection = ({ name, color, width, percent }) => {
  return (
    <div
      className="tag"
      style={{
        ...styles.tag,
        background: color,
        width: width + "%",
        height: "5px" // Use 5px for height
      }}
    >
      {/* <span style={styles.tagText}>{name}</span> */}
      {/* <span style={{ ...styles.tagText, fontSize: 12 }}>{percent.toFixed(1) + "%"}</span> */}
    </div>
  );
};

const TagSlider = ({ data }) => {
  const [widths, setWidths] = useState(data.length > 0 ? data : [50, 50]);
  const [tags] = useState(_tags);
  const TagSliderRef = useRef(null);

  return (
    <div
      ref={TagSliderRef}
      style={{
        width: "100%",
        display: "flex"
      }}
    >
      {tags.map((tag, index) => (
        <TagSection
          width={widths[index]}
          key={index}
          name={tag.name}
          color={tag.color}
          percent={widths[index]}
        />
      ))}
    </div>
  );
};

const styles = {
  tag: {
    padding: 0,
    textAlign: "center",
    position: "relative",
    borderRightWidth: ".1em",
    borderRightStyle: "solid",
    borderRightColor: "white",
    boxSizing: "border-box",
    borderLeftWidth: ".1em",
    borderLeftStyle: "solid",
    borderLeftColor: "white"
  },
  tagText: {
    color: "white",
    fontWeight: 700,
    userSelect: "none",
    display: "block",
    overflow: "hidden",
    fontFamily: "serif",
    fontSize: "small"
  },
  sliderButton: {
    width: "2em",
    height: "1em",
    backgroundColor: "white",
    position: "absolute",
    borderRadius: "2em",
    right: "calc(-1.1em)",
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    margin: "auto",
    zIndex: 10,
    cursor: "ew-resize",
    userSelect: "none"
  }
};

export default TagSlider;