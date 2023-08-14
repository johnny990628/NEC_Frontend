import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import routerList from './Router.config'

const Router = () => {
    return (
        <Routes>
            {routerList.map(({ path, authority, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
        </Routes>
    )
}

export default Router
