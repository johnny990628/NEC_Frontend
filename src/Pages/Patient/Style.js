import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '95vh',
        // backgroundColor: theme.palette.background.default,
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '1rem',
        // boxShadow: '6px 6px 10px rgba(0,0,0,0.2)',
        // border: `.5px solid ${theme.palette.border.main}`,
        // padding: '.5rem',

        // height: '100%',
    },
    accordion: {
        backgroundColor: theme.palette.background.default,
        width: '90%', // 設定寬度為auto
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    status: {
        // backgroundColor: theme.palette.status.yet,
        padding: '.5rem',
        // marginLeft: '.8rem',
        borderRadius: '1rem',

        fontSize: '1rem',
        fontWeight: 'bold',
    },
    statusBox: {
        '&.examination': {
            color: theme.palette.status.red_dark,
        },
        '&.wait': {
            color: theme.palette.status.yellow_dark,
        },
        '&.finish': {
            color: theme.palette.status.green_dark,
        },
    },
    radioGroup: {
        position: 'absolute',
        left: 20,
        top: 30,
    },
}))

export default useStyles
