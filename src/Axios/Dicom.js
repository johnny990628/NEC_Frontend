import Request from './APIConfig'

export const apiGetDicom = (params) => Request.get('/dicom', { params })
export const apiDownloadDCM = (studyUID) => Request.get('/dicom/downloadDCM/' + studyUID, { responseType: 'stream' })
