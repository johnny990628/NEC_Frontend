import React, { useEffect } from 'react'

import Layout from './Components/Layout/Layout'

import useWebsocket from './Hooks/useWebsocket'
import { useDispatch } from 'react-redux'
import { fetchDepartments4List } from './Redux/Slices/Department4List'
import useErrorHandle from './Hooks/useErrorHandle'
import { useKeycloak } from '@react-keycloak/web'
import Login from './Pages/Login/Login'

const App = () => {
    useWebsocket()
    useErrorHandle()
    const dispatch = useDispatch()
    const { keycloak } = useKeycloak()

    const isLoggedIn = keycloak.authenticated

    useEffect(() => {
        dispatch(fetchDepartments4List())
    }, [])
    return isLoggedIn ? <Layout /> : <Login />
}

export default App
