import React, { useEffect } from 'react'

import Layout from './Components/Layout/Layout'

import useWebsocket from './Hooks/useWebsocket'
import { useDispatch } from 'react-redux'
import { fetchDepartments4List } from './Redux/Slices/Department4List'
import useErrorHandle from './Hooks/useErrorHandle'

const App = () => {
    useWebsocket()
    useErrorHandle()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchDepartments4List())
    }, [])
    return (
        <>
            <Layout />
        </>
    )
}

export default App
