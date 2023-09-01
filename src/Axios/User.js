import Request from './APIConfig'

export const apiGetUsers = (params) => Request.get('/user', { params })
export const apiUpdateUser = (userId, data) => Request.patch(`/user/${userId}`, data)
export const apiDeleteUser = (userID) => Request.delete(`/user/${userID}`)
