import Request from './APIConfig'
export const apiGetSchdules = (params) => Request.get('/schedule', { params })
export const apiAddSchedule = (body) => Request.post('/schedule', body)
export const apiRemoveSchedule = (id) => Request.delete(`/schedule/${id}`)
export const apiDeleteScheduleAndBloodAndReport = (patientID) => Request.delete('/schedule', { data: { patientID } })
export const apiUpdateScheduleStatus = (body) => Request.patch('/schedule', body)
