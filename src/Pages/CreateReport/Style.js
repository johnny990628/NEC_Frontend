import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    stepLabel: {
        fontSize: '1.5rem',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    tableContainer: {
        padding: '2rem',
        width: '100%',
        height: '98%',
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '1rem',
        // boxShadow: '6px 6px 10px rgba(0,0,0,0.2)',
        // border: `1px solid ${theme.palette.border.main}`,
    },
    status: {
        backgroundColor: theme.palette.status.processing,
        border: `1px solid ${theme.palette.status.processing_dark}`,
        color: theme.palette.status.processing_dark,
        padding: '6px 10px',
        borderRadius: '1rem',
        // width: '90%',
        '&.yet': {
            backgroundColor: theme.palette.status.yet,
            border: `1px solid ${theme.palette.status.yet_dark}`,
            color: theme.palette.status.yet_dark,
        },
    },
    statusBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'nowrap',
    },
    button: {
        fontSize: '1rem',
        margin: '1rem',
    },
}))

export default useStyles
