import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        // borderRadius: '0 2rem 2rem 0',
        zIndex: 1000,
        width: 'var(--sidebar-open-width)',
        height: '100vh',
        transition: 'width .4s ease-in',
        '&.close': {
            width: 'var(--sidebar-close-width)',
        },
        // boxShadow: '6px 6px 10px rgba(0,0,0,0.1)',
    },
    list: {
        height: '80vh',
        backgroundColor: theme.palette.secondary.main,

        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    link: {
        textDecoration: 'none',
        margin: theme.spacing(0.75),
        borderRadius: '1rem',
        transition: 'transform .4s ease-out',
        '&.active': {
            backgroundColor: theme.palette.primary.light,
        },
        '&:hover': {
            transform: 'scale(1.03)',
        },
    },
    text: {
        color: theme.palette.text.gray,
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        '&.active': {
            color: theme.palette.text.primary,
        },
    },
    logo: {
        height: '5rem',
        margin: '1rem',
        marginBottom: 0,
    },
    icon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.primary.main,
    },
    openIcon: {
        padding: '3rem 1.5rem',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.main,
        '&:hover': {
            cursor: 'pointer',
        },
    },
    closeIcon: {
        position: 'absolute',
        height: '5vh',
        bottom: 20,
        left: 20,
        color: theme.palette.primary.main,
        '&:hover': {
            cursor: 'pointer',
        },
    },
}))

export default useStyles
