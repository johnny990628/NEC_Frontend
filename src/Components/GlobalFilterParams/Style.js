import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    button: {
        width: '100%',
        fontSize: '1.1rem',
        top: '50%',
        transform: 'translate(0, -50%)',
    },
    TextField: {
        width: '100%',
    },
    TextFieldDate: {
        width: '100%',
    },
}))

export default useStyles
