import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    TextField: {
        width: '100%',
        marginBottom: '20px',
    },
    eventButtonBox: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    Button: {
        width: '100px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginLeft: '1rem',
    },
}))

export default useStyles
