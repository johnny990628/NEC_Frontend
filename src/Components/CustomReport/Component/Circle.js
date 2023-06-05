import { Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'
import './Style.css'

const Circle = ({ maxSize = 200, pos, side, focused }) => {
    const { CHESTMAXRADIUS } = useSelector((state) => state.breast)

    const lines = Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30
        const x = maxSize + Math.sin((angle * Math.PI) / 180) * maxSize
        const y = maxSize - Math.cos((angle * Math.PI) / 180) * maxSize
        return { x, y }
    })

    const fillColor = (index) => (focused.side === side && focused.index === index ? 'yellow' : 'red')
    return (
        <svg width={maxSize * 2} height={maxSize * 2}>
            <circle cx={maxSize} cy={maxSize} r={maxSize} fill="#efefef" />

            {lines.map(({ x, y }, i) => (
                <line key={i} x1={maxSize} y1={maxSize} x2={x} y2={y} stroke="black" strokeWidth="0.5" />
            ))}

            {pos.map(({ id, clock, distance, size }, index) => {
                const angle = (clock * 360) / 12 + 180
                const radians = (angle * Math.PI) / 180
                const x = maxSize - Math.sin(radians) * distance * (maxSize / CHESTMAXRADIUS)
                const y = maxSize + Math.cos(radians) * distance * (maxSize / CHESTMAXRADIUS)
                return (
                    <Tooltip key={id} title={`${side}${index + 1}`}>
                        <circle cx={x} cy={y} r={size * (maxSize / 5)} fill={fillColor(index)} />
                        {/* <text
                                    font-size="12"
                                    x={x}
                                    y={y}
                                    text-anchor="middle"
                                    dominant-baseline="middle"
                                    fill="black"
                                >
                                    {side + (index + 1).toString()}
                                </text> */}
                    </Tooltip>
                )
            })}
        </svg>
    )
}

export default Circle
