"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io as ClientIO } from "socket.io-client"

type SocketContextType = {
  socket: any | null
  isConnect: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnect: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SOCKET_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    )
    socketInstance.on("connect", () => {
      setIsConnected(true)
    })
    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnect: isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
