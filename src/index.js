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
        },
        background: {
            main: 'rgb(243, 243, 243)',
            secondary: 'rgb(233,233,233)',
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
            processing: 'rgba(224, 71, 84,.1)',
            processing_dark: 'rgba(224, 71, 84)',
            finish: 'rgba(95, 91, 160,.1)',
            finish_dark: 'rgba(95, 91, 160)',
            yet: 'rgba(109, 173, 173,.1)',
            yet_dark: 'rgba(109, 173, 173)',
            call: 'rgba(255, 204, 20,.1)',
            call_dark: 'rgba(255, 204, 20)',
        },
        green: {
            main: '#95DBC3',
        },
        yellow: {
            main: 'rgba(255, 204, 20)',
        },
        red: {
            main: 'rgb(224, 71, 84)',
        },
        gray: {
            main: '#9E9EA7',
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
