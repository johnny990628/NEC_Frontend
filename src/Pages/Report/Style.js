import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        borderRadius: '1rem',
        // boxShadow: '6px 6px 10px rgba(0,0,0,0.2)',
        // border: `.5px solid ${theme.palette.border.main}`,
        padding: '.5rem',

        height: '100%',
    },
    status: {
        backgroundColor: theme.palette.status.purple,
        border: `1px solid ${theme.palette.status.purple_dark}`,
        color: theme.palette.status.purple_dark,
        padding: '.5rem 1rem',
        marginRight: '.6rem',
        borderRadius: '1rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        '&.examination': {
            backgroundColor: theme.palette.status.red,
            border: `1px solid ${theme.palette.status.red_dark}`,
            color: theme.palette.status.red_dark,
        },
        '&.finish': {
            backgroundColor: theme.palette.status.green,
            border: `1px solid ${theme.palette.status.green_dark}`,
            color: theme.palette.status.green_dark,
        },
        '&.waitFinish': {
            backgroundColor: theme.palette.status.yellow,
            border: `1px solid ${theme.palette.status.yellow_dark}`,
            color: theme.palette.status.yellow_dark,
        },
    },
    statusBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'nowrap',
    },
    procedureStatus: {
        padding: '.5rem 1rem',
        borderRadius: '1rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        '&.green': {
            backgroundColor: theme.palette.status.green,
            border: `1px solid ${theme.palette.status.green_dark}`,
            color: theme.palette.status.green_dark,
        },
        '&.purple': {
            backgroundColor: theme.palette.status.purple,
            border: `1px solid ${theme.palette.status.purple_dark}`,
            color: theme.palette.status.purple_dark,
        },
    },
}))

export default useStyles
