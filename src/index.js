import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'

import './Assets/Css/index.css'
import 'react-day-picker/dist/style.css'

import store from './Redux/store'
import { Provider } from 'react-redux'

const whiteTheme = createTheme({
    palette: {
        primary: {
            main: 'rgba(79, 114, 147)',
            light: 'rgba(169, 191, 211 , .2)',
            light_secondary: 'rgba(169, 191, 211 , .5)',
        },
        secondary: {
            main: 'rgba(255,253,254)',
        },
        background: {
            default: 'rgba(217, 227, 238)',
        },
        text: {
            primary: 'rgba(8, 40, 71)',
            secondary: '#7895B2',
        },
        border: {
            main: 'rgba(193, 181, 184 , .5)',
        },
        contrast: {
            main: 'rgba(100, 151, 151,.9)',
            dark: 'rgba(100, 151, 151)',
        },
        status: {
            processing: 'rgba(169, 191, 211,.2)',
            finish: 'rgba(95, 91, 160,.2)',
            yet: 'rgba(100, 151, 151,.2)',
        },
    },
    typography: {
        fontFamily: `'cwTeXYen', sans-serif`,
    },
})

ReactDOM.render(
    <Provider store={store}>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={whiteTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </StyledEngineProvider>
    </Provider>,
    document.getElementById('root')
)
