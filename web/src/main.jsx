import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './home/Home.jsx';
import Graph from './graph/Graph.jsx'; // Import the new subpage component

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wykres" element={<Graph/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);