import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import routerList from './Router.config'
import { useKeycloak } from '@react-keycloak/web'
import NotFound from '../Pages/NotFound/NotFound'

const Router = () => {
    const { keycloak } = useKeycloak()
    const userRoleList = keycloak.tokenParsed.realm_access.roles

    return (
        <Routes>
            {routerList
                .filter(({ authority }) => authority.some((a) => userRoleList.includes(a)))
                .map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Router
