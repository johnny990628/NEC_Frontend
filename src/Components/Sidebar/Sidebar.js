import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { List, ListItem, Box, Drawer, Tooltip, useMediaQuery, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Dehaze, DoubleArrow, Logout } from '@mui/icons-material'

import useStyles from './Style'

import SidebarItem from '../Router.config'
import { openSidebar, closeSidebar } from '../../Redux/Slices/Sidebar'
import Authorized from './../Authorized/Authorized'
import { logout } from '../../Redux/Slices/Auth'

const Sidebar = () => {
    const classes = useStyles()
    const location = useLocation()
    const dispatch = useDispatch()
    const [animation, setAnimation] = useState(false)
    const { isOpen } = useSelector((state) => state.sidebar)
    const { user } = useSelector((state) => state.auth)
    const theme = useTheme()
    const tab = useMediaQuery(theme.breakpoints.down('lg'))
    const firstRender = useRef(true)
    const activeItem = SidebarItem.findIndex((item) => item.path === location.pathname)

    // useEffect(() => {
    //     if (firstRender.current) {
    //         firstRender.current = false
    //         return
    //     }
    //     tab ? dispatch(closeSidebar()) : dispatch(openSidebar())
    // }, [tab])

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
                    <Authorized
                        key={item.display_name}
                        currentRole={user.role}
                        authority={item.authority}
                        noMatch={<></>}
                    >
                        <Link to={item.path} className={`${classes.link} ${index === activeItem && 'active'}`}>
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
                    </Authorized>
                ))}
            </List>

            <Button className={classes.closeIcon} onClick={() => dispatch(logout())} startIcon={<Logout />}>
                登出
            </Button>
        </Drawer>
    )
}

export default Sidebar
