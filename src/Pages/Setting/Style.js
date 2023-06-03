import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'relative',
        display: 'flex',
        borderRadius: '1rem',
        height: '100%',
        // boxShadow: '6px 6px 10px rgba(0,0,0,0.2)',
        // border: `.5px solid ${theme.palette.border.main}`,
        paddingBottom: '0rem',
    },
    list: {
        height: '100%',
        width: '13rem',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        marginRight: '.1rem',
    },
    listItem: {
        textDecoration: 'none',
        display: 'flex',
        padding: '1rem',
        borderRadius: '.5rem',
        transition: 'transform .1s ease-out',
        alignItems: 'center',
        '&:hover': {
            transform: 'scale(1.01)',
            cursor: 'pointer',
        },
    },
    icon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.primary.main,
        marginRight: theme.spacing(1),
    },
    text: {
        fontSize: '1rem',
        marginLeft: theme.spacing(1),
    },
    content: {
        width: '100%',
        height: '100%',
        padding: '1rem',
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '1rem',
    },
    header: {
        display: 'flex',
        height: '5%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    body: {
        width: '100%',
        height: '95%',
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '1rem',
    },
}))

export default useStyles
