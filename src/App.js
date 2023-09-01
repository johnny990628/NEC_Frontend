import React, { useEffect } from 'react'

import Layout from './Components/Layout/Layout'

import useWebsocket from './Hooks/useWebsocket'
import { useDispatch } from 'react-redux'
import { fetchDepartments4List } from './Redux/Slices/Department4List'
import useErrorHandle from './Hooks/useErrorHandle'
import { useKeycloak } from '@react-keycloak/web'
import Login from './Pages/Login/Login'
import { fetchRole } from './Redux/Slices/Role'

const App = () => {
    useWebsocket()
    useErrorHandle()
    const dispatch = useDispatch()
    const { keycloak, initialized } = useKeycloak()

    const isLoggedIn = keycloak.authenticated

    useEffect(() => {
        if (keycloak && initialized) {
            keycloak.onTokenExpired = () => keycloak.updateToken(600)
        }
        return () => {
            if (keycloak) keycloak.onTokenExpired = () => {}
        }
    }, [initialized, keycloak])

    useEffect(() => {
        dispatch(fetchDepartments4List())
        dispatch(fetchRole())
    }, [])

    return isLoggedIn ? <Layout /> : <Login />
}

export default App
