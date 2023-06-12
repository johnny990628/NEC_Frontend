import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    serverName: {},
    body: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '1rem',
        background: theme.palette.background.default,
        borderRadius: '.2rem',
        boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
    },
    pacsOpenSwitch: {
        width: '5%',
    },
    pacsServerName: {
        width: '15%',
    },
    pacsURL: {
        width: '70%',
    },
    pacsEvent: {
        width: '15%',
        display: 'flex',
        justifyContent: 'space-around',
    },
    createPacsServer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.background.default,

        // justifyContent: 'center',
        marginBottom: '1rem',
    },
}))

export default useStyles
