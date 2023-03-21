import React, { Fragment, useRef, useState, useEffect } from 'react'

import useStyles from './Style'
import './print.css'
import REPORTCOLS from '../../Assets/Json/ReportCols.json'
import REPORTCOLS2 from '../../Assets/Json/ReportCols2.json'

import { useSelector } from 'react-redux'
import { Announcement } from '@mui/icons-material'
import Main from '../CustomReport/Component/component/Main'
import Chest from './component/Chest'
import DataShows from '../CustomReport/Component/component/DataShows'

export const ReportFormForPDF = React.forwardRef((_, ref) => {
  return (
    <div style={{ width: '100%' }} ref={ref}>
      <FormHeader />
      <PatientForm />
      <ReportFormHtml />
      <FormFooter />
    </div>
  )
})

const ReportFormHtml = () => {
  const classes = useStyles()
  const report = useSelector((state) => state.reportForm.edit)
  const [cancerArr, setCancerArr] = useState([])
  useEffect(() => {
    if (report) {
      setCancerArr(report)
    }
  }, [report])

  return (
    <table className={classes.table} style={{ width: '90%', margin: 'auto' }}>
      <tbody>
        {[...REPORTCOLS, ...REPORTCOLS2].map((list, i) => (
          <>
            {i === 1 && (
              <tr>
                <td colSpan="4" className={classes.table} style={{ textAlign: 'center', height: '2rem' }}>
                  <b>檢查適應症</b>
                </td>
              </tr>
            )}
            {list.name === 'RADARMARK' && (
              <tr>
                <td colSpan="4" className={classes.table} style={{ textAlign: 'center', height: '2rem' }}>
                  <b>{list.label}</b>
                </td>
              </tr>
            )}
            <FormSection
              key={list.name}
              list={list}
              checked={cancerArr?.some((c) => c.name === list.name)}
              options={cancerArr?.find((c) => c.name === list.name)?.value}
              text={cancerArr?.find((c) => c.name === list.name)?.value}
            />
          </>
        ))}
      </tbody>
    </table>
  )
}

const FormSection = ({ list, checked, options, text }) => {
  const classes = useStyles()
  return list.section === 'Indication' ? (
    <tr>
      <td colSpan="4">
        {(list.type === 'radio' || list.type === 'select') && (
          <>
            <input type="checkbox" checked={checked} readOnly />
            <b>{list.label}</b>
            <>
              {list.options.map((option) => {
                return (
                  <>
                    <input type="radio" value={option.value} checked={options?.includes(option.value)} readOnly />
                    {option.label}
                  </>
                )
              })}
            </>
          </>
        )}
        {list.type === 'checkbox' && (
          <>
            <input type="checkbox" checked={checked} readOnly />
            <b>{list.label}</b>
          </>
        )}
        {list.type === 'text' && (
          <>
            <input type="checkbox" checked={checked} readOnly />
            <b>{list.label} :</b> {text}
          </>
        )}
      </td>
    </tr>
  ) : (
    <tr className={`${classes.table} ${classes.printBreak}`}>
      {(list.type === 'redio' || list.type === 'select') && (
        <>
          <td>
            <input type="checkbox" checked={checked} readOnly />
            <b>{list.label}</b>
          </td>

          <td className={classes.table}>
            {list?.options?.map((option) => (
              <div>
                <input type="radio" value={option.value} checked={options?.includes(option.value)} readOnly />
                {option.label}
              </div>
            ))}
          </td>
        </>
      )}
      {list.type === 'text' && (
        <>
          <td style={{ width: '10%', height: '3rem' }} className={classes.table}>
            <b>{list.label}</b>
          </td>
          <td style={{ width: '10%' }} className={classes.table}>
            {text}
          </td>
        </>
      )}
      {list.type === 'modal' && (
        <>
          {text && (
            <td colSpan="4" className={classes.table} style={{ height: '2rem' }}>
              <div style={{ display: 'flex' }}>
                {['R', 'L'].map((side) => {
                  return (
                    <div
                      style={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <DataShows azimut={JSON.parse(text)} side={side} />
                      <Chest azimut={JSON.parse(text)} side={side} />
                    </div>
                  )
                })}
              </div>
            </td>
          )}
        </>
      )}
    </tr>
  )
}

const PatientForm = () => {
  const classes = useStyles()

  const {
    row: { patient },
  } = useSelector((state) => state.dialog.report)

  return (
    <table className={classes.table} style={{ width: '90%', margin: 'auto' }}>
      <tr>
        <td className={classes.table}>
          <b>姓名</b>
        </td>
        {patient ? (
          <td className={classes.table}>{patient?.name}</td>
        ) : (
          <td className={classes.table}>&emsp;&emsp;&emsp;</td>
        )}
        <td className={classes.table}>
          <b>性別</b>
        </td>
        <td className={classes.table}>
          <input type="checkbox" checked={patient?.gender === 'm'} readOnly />男
          <input type="checkbox" checked={patient?.gender === 'f'} readOnly />女
        </td>
        <td className={classes.table}>
          <b>出生年月日</b>
        </td>
        {patient ? (
          <td className={classes.table}>{new Date(patient?.birth).toLocaleDateString()}</td>
        ) : (
          <td className={classes.table}>&emsp;&emsp;&emsp;</td>
        )}
      </tr>
      <tr>
        <td className={classes.table}>
          <b>電話</b>
        </td>
        <td className={classes.table} colSpan="5">
          {patient?.phone}
        </td>
      </tr>
      <tr>
        <td className={classes.table}>
          <b>部門單位</b>
        </td>
        <td className={classes.table} colSpan="2">
          {patient?.department}
        </td>
        <td className={classes.table}>
          <b>身份證字號</b>
        </td>
        <td className={classes.table} colSpan="2">
          {patient?.id}
        </td>
      </tr>
    </table>
  )
}

const FormHeader = () => {
  const {
    row: { createdAt },
  } = useSelector((state) => state.dialog.report)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <b style={{ fontSize: '1.5rem' }}>乳房超音波檢查報告單</b>
      <hr></hr>
      <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
        <div>檢查日期 : {new Date(createdAt).toLocaleDateString()}</div>
        <div>報告列印時間 : {new Date().toLocaleString()}</div>
      </div>
    </div>
  )
}
const FormFooter = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ fontSize: '1.2rem' }}>~感謝您參與本次檢驗活動，祝您健康~ 肝病諮詢專線 : 0800-000-583</p>
    </div>
  )
}

export default ReportFormHtml
