import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
    container: {
        height: '100%',
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '1rem',
        boxShadow: '6px 6px 10px rgba(0,0,0,0.2)',
        border: `1px solid ${theme.palette.border.main}`,
    },
    status: {
        backgroundColor: theme.palette.status.processing,
        padding: '8px',
        marginRight: '.6rem',
        borderRadius: '1rem',
        '&.processing': {
            backgroundColor: theme.palette.status.yet,
        },
    },
    statusBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'nowrap',
    },
}))

export default useStyles
