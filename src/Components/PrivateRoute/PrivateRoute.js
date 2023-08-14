import { useKeycloak } from '@react-keycloak/web'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Login from '../../Pages/Login/Login'

const PrivateRoute = ({ children }) => {
    const { keycloak } = useKeycloak()

    const isLoggedIn = keycloak.authenticated
    console.log(keycloak)

    return isLoggedIn ? children : null
}

export default PrivateRoute
