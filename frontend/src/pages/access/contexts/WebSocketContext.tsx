import { createContext } from 'react'
import { io, Socket } from 'socket.io-client'
export const socket = io(import.meta.env.VITE_BACKEND_URL)

export const WebSocketContext=createContext<Socket>(socket)

export const WebSocketProvider= WebSocketContext.Provider