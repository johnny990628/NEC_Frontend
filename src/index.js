import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'

import './Assets/Css/index.css'
import 'react-day-picker/dist/style.css'

import store from './Redux/store'
import { Provider } from 'react-redux'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './Utils/Keycloak.js'

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
            red: 'rgba(226, 116, 111,.1)',
            red_dark: 'rgba(226, 116, 111)',
            purple: 'rgba(95, 91, 160,.1)',
            purple_dark: 'rgba(95, 91, 160)',
            green: 'rgba(109, 173, 173,.1)',
            green_dark: 'rgba(109, 173, 173)',
            yellow: 'rgba(242, 190, 34,.1)',
            yellow_dark: 'rgba(242, 190, 34)',
        },
        green: {
            main: '#95DBC3',
        },
        yellow: {
            main: 'rgba(255, 204, 20)',
        },
        red: {
            main: 'rgba(226, 116, 111)',
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
    <ReactKeycloakProvider
        authClient={keycloak}
        onTokens={({ token }) => {
            localStorage.setItem('accessToken', token)
        }}
        // initOptions={{
        //     onLoad: 'login-required',
        // }}
    >
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={whiteTheme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    </ReactKeycloakProvider>,
    document.getElementById('root')
)
