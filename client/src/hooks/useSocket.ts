import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const IO_URL = process.env.NODE_ENV === 'production'
  ? 'https://cross-clash-git-main-lalitx17s-projects.vercel.app'
  : 'http://localhost:8080';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let socketInstance: Socket;

    const connect = () => {
      socketInstance = io(IO_URL, {
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        setSocket(socketInstance);
        console.log("Connected");
      });

      socketInstance.on('disconnect', (reason) => {
        setSocket(null);
        console.log("Disconnected:", reason);
      });

      socketInstance.on('connect_error', (error) => {
        console.error("Socket.IO connection error:", error);
      });
    };

    connect();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return socket;
};