import CreateReport from '../Pages/CreateReport/CreateReport'
import Home from '../Pages/Home/Home'
import Patient from '../Pages/Patient/Patient'
import Department from '../Pages/Department/Department'
import Report from '../Pages/Report/Report'
import User from '../Pages/User/User'
import Image from '../Pages/Image/Image'
import { HomeOutlined, AccessibleForwardOutlined, CreateNewFolderOutlined, PersonOutlined } from '@mui/icons-material'
import Login from '../Pages/Login/Login'

const routerList = [
    {
        display_name: '首頁',
        name: 'home',
        icon: <HomeOutlined />,
        path: '/',
        Component: Home,
        authority: ['admin', 'doctor', 'radiologist'],
    },
    {
        display_name: '病人',
        name: 'patient',
        icon: <AccessibleForwardOutlined />,
        path: '/patient',
        Component: Patient,
        authority: ['admin', 'doctor', 'radiologist'],
    },

    {
        display_name: '報告',
        name: 'report',
        icon: <CreateNewFolderOutlined />,
        path: '/report',
        Component: Report,
        authority: ['admin', 'doctor', 'radiologist'],
    },
    {
        display_name: '用戶',
        name: 'user',
        icon: <PersonOutlined />,
        path: '/user',
        Component: User,
        authority: ['admin'],
    },
]

export default routerList
