import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './home/Home.jsx';
import Graph from './graph/Graph.jsx'; // Import the new subpage component

const mockData = [
    { timestamp: '2024-12-10T10:00:00', value: 20 },
    { timestamp: '2024-12-10T10:10:00', value: 25 },
    { timestamp: '2024-12-10T10:20:00', value: 22 },
    { timestamp: '2024-12-10T10:30:00', value: 27 },
    { timestamp: '2024-12-10T10:30:00', value: 27 },
    { timestamp: '2024-12-10T10:31:00', value: 20 },
];

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wykres" element={<Graph data={mockData}/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);