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
    listContainer: {
        backgroundColor: theme.palette.secondary.main,
        padding: '1rem ',
        borderRadius: '1rem',
    },
    reportContainer: {
        backgroundColor: theme.palette.secondary.main,
        padding: '1rem',
        marginLeft: '1rem',
        borderRadius: '1rem',
        height: '90vh',
        width: '100%',
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
        backgroundColor: theme.palette.status.finish,
        border: `1px solid ${theme.palette.status.finish_dark}`,
        color: theme.palette.status.finish_dark,
        padding: '.3rem .5rem',
        borderRadius: '1rem',
        fontSize: '.5rem',
        // width: '50%',
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
    number: {
        fontSize: '1.6rem',
    },
    statusButton: {
        display: 'flex',
        flexDirection: 'column',
    },
}))

export default useStyles
