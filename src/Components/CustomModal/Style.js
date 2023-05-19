import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        background: '#FFFFFF',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
}))

export default useStyles
