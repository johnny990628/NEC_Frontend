import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import routerList from './Router.config'
import Authorized from './Authorized/Authorized'
import { PageTransition } from '@steveeeie/react-page-transition'

const Router = () => {
    const location = useLocation()
    const { user } = useSelector((state) => state.auth)
    useEffect(() => {}, [location.pathname])

    return (
        <Routes>
            {routerList.map(({ path, authority, Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <Authorized authority={authority} currentRole={user.role} noMatch={<></>}>
                            <PageTransition
                                preset="slides"
                                enterAnimation="rotateSlideIn"
                                exitAnimation="rotateSlideOut"
                                transitionKey={location.pathname}
                            >
                                <Component />
                            </PageTransition>
                        </Authorized>
                    }
                />
            ))}
        </Routes>
    )
}

export default Router
