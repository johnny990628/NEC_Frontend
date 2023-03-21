import React, { useEffect } from "react";
import { Box, Typography, Modal, Slider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    calculatevHour,
    calcAngleDegrees,
    PythagoreanTheorem,
} from "../js/calculate";
const MarkEdit = ({
    open,
    azimut,
    setAzimut,
    onEditMark,
    setOnEditMark,
    EditModalClose,
}) => {
    const EditModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const handleDelete = () => {
        let tempAzimut = azimut;
        tempAzimut[onEditMark.side].splice(onEditMark.index, 1);
        setOnEditMark({ side: "L", index: 0 });
        setAzimut(tempAzimut);
        EditModalClose();
    };

    return (
        <Modal
            open={open}
            onClose={EditModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={EditModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {onEditMark.side}-{onEditMark.index}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {azimut[onEditMark.side].length > 0 ? (
                        <>
                            {calculatevHour(
                                calcAngleDegrees(
                                    azimut[onEditMark.side][onEditMark.index]
                                        .Azimut.x,
                                    azimut[onEditMark.side][onEditMark.index]
                                        .Azimut.y
                                )
                            ) + "點鐘方向，距離圓心"}
                            {PythagoreanTheorem(
                                Math.abs(
                                    azimut[onEditMark.side][onEditMark.index]
                                        .Azimut.x /
                                        10 -
                                        10
                                ),
                                Math.abs(
                                    azimut[onEditMark.side][onEditMark.index]
                                        .Azimut.y /
                                        10 -
                                        10
                                )
                            ).toFixed(2) + "公分，大小為"}
                            {azimut[onEditMark.side][onEditMark.index].Size +
                                "mm"}
                        </>
                    ) : null}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Slider
                        aria-label="Temperature"
                        value={
                            azimut[onEditMark.side].length > 0
                                ? azimut[onEditMark.side][onEditMark.index].Size
                                : 0
                        }
                        onChange={(event, value) => {
                            var tempArray = azimut[onEditMark.side];
                            tempArray[onEditMark.index].Size = value;
                            setAzimut((azimut) => ({
                                ...azimut,
                                [onEditMark.side]: [...tempArray],
                            }));
                        }}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        style={{ width: "80%" }}
                        min={0}
                        max={100}
                    />
                </Typography>
                <IconButton
                    variant="outlined"
                    color="error"
                    style={{
                        right: "10px",
                        bottom: "10px",
                        position: "fixed",
                    }}
                    onClick={handleDelete}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Modal>
    );
};

export default MarkEdit;
