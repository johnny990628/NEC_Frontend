import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { departmentTrigger } from '../Redux/Slices/Department'
import { fetchDepartments4List } from '../Redux/Slices/Department4List'
import { patientTrigger } from '../Redux/Slices/Patient'
import { reportTrigger } from '../Redux/Slices/Report'
import { userTrigger } from '../Redux/Slices/User'
import { fetchSchedule, scheduleTrigger } from './../Redux/Slices/Schedule'

function WebSocketComponent() {
    const ws = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        connectWebsocket()
        return () => {
            if (ws.current) ws.current.close()
        }
    }, [])

    const connectWebsocket = () => {
        ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_SERVER__URL)

        ws.current.onopen = () => {
            console.log('WebSocket connected')
        }

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            handleMessage(message)
        }

        ws.current.onclose = (event) => {
            console.log(`WebSocket disconnected with code ${event.code}`)
            // Reconnect after 5 seconds
            setTimeout(connectWebsocket, 3000)
        }
    }

    const handleMessage = (message) => {
        const { fullDocument, operationType, collection } = message

        switch (collection) {
            case 'patients':
                dispatch(patientTrigger())
                break
            case 'schedules':
                dispatch(patientTrigger())
                dispatch(scheduleTrigger())
                break
            case 'departments':
                dispatch(departmentTrigger())
                dispatch(fetchDepartments4List())
                break
            case 'reports':
                dispatch(reportTrigger())
                dispatch(scheduleTrigger())
                break
        }
    }
}

export default WebSocketComponent
