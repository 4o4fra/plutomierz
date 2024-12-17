import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Home from './home/Home.jsx';
import Graph from './graph/Graph.jsx';
import {WebSocketProvider} from './utils/websocketContext.jsx';
import {StrictMode} from "react";
import Main from "./pages/main/Main.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <WebSocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home Subpage={Main}/>}/>
                    <Route path="/graph" element={<Home Subpage={Graph}/>}/>
                </Routes>
            </BrowserRouter>
        </WebSocketProvider>
    </StrictMode>,
);