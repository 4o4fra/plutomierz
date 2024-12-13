import React, { createContext, useContext } from 'react';
import useWebSocket from "react-use-websocket";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const plutaSocket = "wss://api.plutomierz.ovh";
    const { sendMessage, lastMessage } = useWebSocket(plutaSocket);

    return (
        <WebSocketContext.Provider value={{ sendMessage, lastMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
