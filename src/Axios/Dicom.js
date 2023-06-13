import Request from './APIConfig'

export const apiGetDicom = (params) => Request.get('/dicom', { params })
export const apiDownloadDCM = ({ studyUID, pacsID }) =>
    Request.get('/dicom/downloadDCM?studyUID=' + studyUID + '&pacsID=' + pacsID, { responseType: 'arraybuffer' })
