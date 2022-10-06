import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/styles'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const ProgressProvider = ({ valueStart, valueEnd, children }) => {
    const [value, setValue] = useState(valueStart)
    useEffect(() => {
        setValue(valueEnd)
    }, [valueEnd])

    return children(value)
}

const Progressbar = ({ value, total }) => {
    const theme = useTheme()
    return (
        <ProgressProvider valueStart={0} valueEnd={value}>
            {num => (
                <CircularProgressbar
                    value={(num / total) * 100}
                    text={`${num}人`}
                    styles={buildStyles({
                        rotation: 0.25,
                        strokeLinecap: 'round',
                        textSize: '1.3rem',
                        pathTransitionDuration: 4,
                        pathColor: theme.palette.primary.main,
                        textColor: theme.palette.primary.main,
                        trailColor: theme.palette.primary.light_secondary,
                    })}
                />
            )}
        </ProgressProvider>
    )
}

export default Progressbar
