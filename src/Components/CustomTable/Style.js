import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '97vh',
        padding: '1rem',
        paddingTop: '0px',
        paddingBottom: '0px',
    },
    headerFont: {
        color: theme.palette.text.gray,
    },
    tableHeader: {
        fontSize: '1.1rem',

        backgroundColor: theme.palette.secondary.main,
        borderBottom: `1px solid ${theme.palette.primary.light}`,
        [theme.breakpoints.down('lg')]: {
            fontSize: '1rem',
        },
    },
    tableBody: {
        // backgroundColor: theme.palette.secondary.main,
    },
    tableCell: {
        border: 0,
        fontSize: '1.1rem',
    },
    tableRow: {
        // backgroundColor: theme.palette.secondary.main,
        // borderRadius: '5rem',
    },
    tableHeaderTotal: {
        marginRight: '2rem',
        fontSize: '1.1rem',
    },
    tableFooter: {
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        paddingInline: '1rem',
        height: '10%',
    },
    tableFooterItem: {
        marginRight: '1rem',
    },
    scrollbar: {
        backgroundColor: theme.palette.primary.light,
    },
    clearButton: {
        backgroundColor: theme.palette.contrast.main,
    },
}))

export default useStyles
