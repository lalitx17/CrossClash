import {useEffect, useState} from 'react';

const WS_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://cross-clash.vercel.app' 
  : 'ws://localhost:8080';

  
export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
  
    useEffect(() => {
      let ws: WebSocket;
  
      const connect = () => {
        ws = new WebSocket(WS_URL);
  
        ws.onopen = () => {
          setSocket(ws);
          console.log("Connected");
        };
  
        ws.onclose = () => {
          setSocket(null);
          setTimeout(connect, 5000); // Attempt to reconnect after 5 seconds
        };
  
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          ws.close();
        };
      };
  
      connect();
  
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }, []);
  
    return socket;
  };
  