import { createContext } from 'react'
import { io, Socket } from 'socket.io-client'

export const token='valid-token' // Replace with a real token from your auth system


export const socket = io(import.meta.env.VITE_API_BASE_URL,{
    auth: { token }, // Send token in handshake
})
export const WebSocketContext=createContext<Socket>(socket)

export const WebSocketProvider= WebSocketContext.Provider