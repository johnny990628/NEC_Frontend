import CreateReport from '../Pages/CreateReport/CreateReport'
import Home from '../Pages/Home/Home'
import Patient from '../Pages/Patient/Patient'
import Department from '../Pages/Department/Department'
import Report from '../Pages/Report/Report'
import User from '../Pages/User/User'
import Image from '../Pages/Image/Image'
import {
    HomeOutlined,
    EventAvailableOutlined,
    AccessibleForwardOutlined,
    CreateNewFolderOutlined,
    PersonOutlined,
    AccountBalanceOutlined,
    InsertChartOutlined,
    InsertPhotoOutlined,
    Settings,
} from '@mui/icons-material'
import Statistic from '../Pages/Statistic/Statistic'
import Setting from '../Pages/Setting/Setting'

const routerList = [
    {
        display_name: '首頁',
        name: 'home',
        icon: <HomeOutlined />,
        path: '/',
        Component: Home,
    },
    {
        display_name: '病人',
        name: 'patient',
        icon: <AccessibleForwardOutlined />,
        path: '/patient',
        Component: Patient,
    },
    // {
    //     display_name: '報告',
    //     name: 'createReport',
    //     icon: <EventAvailableOutlined />,
    //     path: '/createReport',
    //     Component: CreateReport,
    //     authority: [4, 3, 2],
    // },
    {
        display_name: '報告',
        name: 'report',
        icon: <CreateNewFolderOutlined />,
        path: '/report',
        Component: Report,
        authority: [2, 3, 4],
    },
    // {
    //     display_name: '用戶',
    //     name: 'user',
    //     icon: <PersonOutlined />,
    //     path: '/user',
    //     Component: User,
    //     authority: [3],
    // },
    // {
    //     display_name: '部門管理',
    //     name: 'department',
    //     icon: <AccountBalanceOutlined />,
    //     path: '/department',
    //     Component: Department,
    //     authority: [3, 1],
    // },
    {
        display_name: '影像',
        name: 'image',
        icon: <InsertPhotoOutlined />,
        path: '/image',
        Component: Image,
        authority: [2, 3, 4],
    },
    {
        display_name: '設定',
        name: 'setting',
        icon: <Settings />,
        path: '/setting',
        Component: Setting,
        authority: [4],
    },
    // {
    //     display_name: '數據中心',
    //     name: 'statistic',
    //     icon: <InsertChartOutlined />,
    //     path: '/statistic',
    //     Component: Statistic,
    //     authority: [4],
    // },
]

export default routerList
