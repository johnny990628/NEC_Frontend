import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    serverName: {},
    body: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: '1rem',
        background: theme.palette.background.default,
        borderRadius: '.2rem',
        boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
    },
}))

export default useStyles
