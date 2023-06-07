import { PersonOutlined, CheckCircleOutline, InsertPhotoOutlined } from '@mui/icons-material'
import User from '../User/User.js'
import PacsSetting from '../PacsSetting/PacsSetting.js'
import Image from '../Image/Image.js'

export const settingRouters = [
    {
        id: 1,
        name: 'PACS 設定',
        icon: InsertPhotoOutlined,
        body: <PacsSetting />,
    },
    {
        id: 2,
        name: '用戶設定',
        icon: PersonOutlined,
        body: <User />,
    },
]
