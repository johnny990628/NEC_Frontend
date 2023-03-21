import React from "react";

const Mark = ({
    index,
    side,
    azimut,
    pxToMM,
    setOnEditMark,
    ClockRef,
    EditModalOpen,
}) => {
    const circleStyle = {
        border: "1px solid black",
        position: "absolute",
        borderRadius: "50%",
        backgroundColor: "red",
        top:
            azimut.Azimut.y * pxToMM -
            (azimut.Size * pxToMM) / 2 +
            ClockRef.current.offsetTop +
            "px",
        left:
            azimut.Azimut.x * pxToMM -
            (azimut.Size * pxToMM) / 2 +
            ClockRef.current.offsetLeft +
            "px",
        width: azimut.Size * pxToMM + "px",
        height: azimut.Size * pxToMM + "px",
    };
    const handClick = (event) => {
        EditModalOpen();
        setOnEditMark({ side: side, index: index });
    };
    return (
        <div id="circle" style={circleStyle} onClick={handClick}>
            <font style={{ fontSize: "5px" }}>{index}</font>
        </div>
    );
};

export default Mark;
