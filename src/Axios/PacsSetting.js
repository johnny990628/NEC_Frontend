import Request from './APIConfig'
export const apiGetPacsSetting = () => Request.get(`/pacsSetting`)
export const apiCreatePacsSetting = (data) => Request.post(`/pacsSetting`, data)
export const apiUpdatePacsSetting = (id, data) => Request.patch(`/pacsSetting/${id}`, data)
export const apiDeletePacsSetting = (id) => Request.delete(`/pacsSetting/${id}`)
export const apiGetPacsSettingById = (id) => Request.get(`/pacsSetting/${id}`)
