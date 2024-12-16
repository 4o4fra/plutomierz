import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Home from './home/Home.jsx';
import Graph from './graph/Graph.jsx';
import {WebSocketProvider} from './utils/websocketContext.jsx';
import {StrictMode} from "react";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <WebSocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/graph" element={<Graph/>}/>
                </Routes>
            </BrowserRouter>
        </WebSocketProvider>
    </StrictMode>,
);