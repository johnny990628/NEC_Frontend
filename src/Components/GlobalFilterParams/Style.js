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
    customHoverFocus: {
        top: '50%',
        transform: 'translate(0, -50%)',
        backgroundColor: 'rgb(122,220,180)',
        '&:hover, &.Mui-focusVisible': { backgroundColor: 'rgb(0,208,130)' },
    },
}))

export default useStyles
