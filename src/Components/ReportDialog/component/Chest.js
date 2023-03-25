import React, { useRef, useState, useEffect } from 'react'
import Line from '../../CustomReport/Component/component/Line'
const Chest = ({ azimut, side }) => {
    //胸部最大直徑mm
    const ChestMaxSize = 200

    const divStyle = {
        position: 'relative',
        width: '80%',
        paddingTop: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
        borderRadius: '50%',
    }

    return (
        <div style={divStyle}>
            {[1, 2, 3, 4, 5, 6].map((item) => {
                return (
                    <div
                        style={{
                            position: 'absolute',
                            border: '1px solid black',
                            width: '100%',
                            top: '50%',
                            transform: `rotate(${item * 30}deg)`,
                        }}
                    />
                )
            })}
            {console.log(azimut)}
            {azimut[side].map((item, index) => {
                return (
                    <div
                        style={{
                            position: 'absolute',
                            border: '1px solid black',
                            width: (item.Size / ChestMaxSize) * 100 + '%',
                            height: (item.Size / ChestMaxSize) * 100 + '%',
                            top: (item.Azimut.y / ChestMaxSize) * 100 + '%',
                            left: (item.Azimut.x / ChestMaxSize) * 100 + '%',
                            borderRadius: '50%',
                            backgroundColor: '#a8a8a8',
                        }}
                    >
                        <font style={{ color: '#000', fontSize: '24px' }}>{index}</font>
                    </div>
                )
            })}
        </div>
    )
}

export default Chest
