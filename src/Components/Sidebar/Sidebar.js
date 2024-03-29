import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { List, ListItem, Box, Drawer, Tooltip, useMediaQuery, Button, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Dehaze, DoubleArrow, Logout } from '@mui/icons-material'

import useStyles from './Style'

import Routers from '../Router.config'
import Authorized from '../PrivateRoute/PrivateRoute'
import { logout } from '../../Redux/Slices/Auth'
import { useKeycloak } from '@react-keycloak/web'
import Avatar, { genConfig } from 'react-nice-avatar'

const Sidebar = () => {
    const classes = useStyles()
    const location = useLocation()
    const dispatch = useDispatch()
    const { keycloak } = useKeycloak()
    const [animation, setAnimation] = useState(false)
    const { isOpen } = useSelector((state) => state.sidebar)
    const { user } = useSelector((state) => state.auth)

    const userRoleList = keycloak.tokenParsed.realm_access.roles

    const authUserName = keycloak.tokenParsed.preferred_username
    const config = genConfig(authUserName)
    const SidebarItem = Routers.filter((router) =>
        router?.authority ? router.authority.some((r) => userRoleList.includes(r)) : true
    )
    const activeItem = SidebarItem.findIndex((item) => item.path === location.pathname)

    return (
        <Drawer variant={'permanent'} classes={{ paper: `${classes.container} ${isOpen || 'close'}` }}>
            {animation ? (
                <img
                    src="./logo_temp.png"
                    className={classes.logo}
                    alt="logo"
                    onMouseLeave={() => setAnimation(false)}
                />
            ) : (
                <img src="./logo.gif" className={classes.logo} alt="logo" onMouseEnter={() => setAnimation(true)} />
            )}

            <List className={classes.list}>
                {SidebarItem.map((item, index) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`${classes.link} ${index === activeItem && 'active'}`}
                    >
                        <ListItem
                            button
                            disableRipple
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Box className={classes.icon}>{item.icon}</Box>
                            <Box className={`${classes.text} ${index === activeItem && 'active'}`}>
                                {item.display_name}
                            </Box>
                        </ListItem>
                    </Link>
                ))}
            </List>

            <Tooltip title={<Box>{authUserName}</Box>} arrow placement="right">
                <Stack className={classes.userInfo}>
                    <Avatar
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                        }}
                        {...config}
                    ></Avatar>
                </Stack>
            </Tooltip>

            <Button className={classes.closeIcon} onClick={() => keycloak.logout()} startIcon={<Logout />}>
                登出
            </Button>
        </Drawer>
    )
}

export default Sidebar
