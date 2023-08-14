import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    icon: {
        color: theme.palette.primary.main,
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        width: '30rem',
        gap: '1rem',
    },
    icons: {
        color: theme.palette.background.default,
        fontSize: 100,
    },
    iconButton: {
        padding: 60,
    },
}))

export default useStyles
