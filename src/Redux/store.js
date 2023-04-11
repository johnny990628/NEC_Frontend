import { configureStore } from '@reduxjs/toolkit'
import patientsReducer from './Slices/Patient'
import reportFormReducer from './Slices/ReportForm'
import breastReducer from './Slices/Breast'
import sidebarReducer from './Slices/Sidebar'
import dialogReducer from './Slices/Dialog'
import errorReducer from './Slices/Error'
import authReducer from './Slices/Auth'
import reportReducer from './Slices/Report'
import scheduleReducer from './Slices/Schedule'
import departmentReducer from './Slices/Department'
import userReducer from './Slices/User'
import dashboardReducer from './Slices/Dashboard'
import statisticReducer from './Slices/Statistic'
import dicomReducer from './Slices/Dicom'
import department4ListReducer from './Slices/Department4List'

export default configureStore({
    reducer: {
        patients: patientsReducer,
        reportForm: reportFormReducer,
        breast: breastReducer,
        sidebar: sidebarReducer,
        dialog: dialogReducer,
        error: errorReducer,
        auth: authReducer,
        report: reportReducer,
        schedule: scheduleReducer,
        department: departmentReducer,
        user: userReducer,
        dashboard: dashboardReducer,
        statistic: statisticReducer,
        dicom: dicomReducer,
        department4List: department4ListReducer,
    },
})
