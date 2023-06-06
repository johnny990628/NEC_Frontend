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
    Item: {
        marginTop: '1rem',
        width: '100%',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: '2.5rem',
    },
    HeaderTitle: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    headerValue: {
        fontSize: '1rem',
        color: theme.palette.text.secondary,
        marginLeft: '1rem',
    },
}))

export default useStyles
