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
            main: 'rgb(253, 253, 253)',
            // main: 'rgba(240, 240, 240)',
        },
        background: {
            // default: 'rgb(254, 254, 254)',
            default: 'rgb(252, 252, 254)',
        },
        text: {
            primary: 'rgba(8, 40, 71)',
            secondary: '#7895B2',
            gray: '#6c747f',
        },
        border: {
            main: 'rgba(193, 181, 184 , .3)',
        },
        contrast: {
            main: 'rgba(100, 151, 151,.9)',
            dark: 'rgba(100, 151, 151)',
        },
        status: {
            processing: 'rgba(169, 191, 211,.1)',
            processing_dark: 'rgb(110, 127, 183)',
            finish: 'rgba(95, 91, 160,.1)',
            finish_dark: 'rgba(95, 91, 160)',
            yet: 'rgba(109, 173, 173,.1)',
            yet_dark: 'rgba(109, 173, 173)',
            call: 'rgba(95, 91, 160,.1)',
            call_dark: 'rgba(95, 91, 160)',
        },
        red: {
            primary: 'rgb(224, 71, 84)',
            main: 'rgb(224, 71, 84)',
        },
        box: {
            primary: 'rgba(255,255,255)',
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
