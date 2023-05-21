import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '1rem',
        height: '100%',
        // boxShadow: '6px 6px 10px rgba(0,0,0,0.2)',
        // border: `.5px solid ${theme.palette.border.main}`,
        paddingBottom: '0rem',

        // height: '100%',
    },
    accordion: {
        backgroundColor: theme.palette.background.default,
        width: '90%',
    },
    formWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formHeader: {
        fontSize: '3rem',
    },
}))

export default useStyles
