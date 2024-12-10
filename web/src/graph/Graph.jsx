import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './Graph.css';
import PlutoGraph from '../components/plutoGraph/PlutoGraph.jsx';
import useWebSocket from 'react-use-websocket';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

const Graph = () => {
    const plutaSocket = 'ws://localhost:3000';
    const { sendMessage, lastMessage } = useWebSocket(plutaSocket);
    const [plutaLogs, setPlutaLogs] = useState([]);

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            if (messageData.type === 'plutaLog') {
                setPlutaLogs((prevLogs) => [...prevLogs, messageData]);
            }
        }
    }, [lastMessage]);

    return (
        <div>
            <h1>Wykres Pluty</h1>
            <p>This is the Wykres subpage.</p>
            <PlutoGraph data={plutaLogs[0].value} />
        </div>
    );
};

export default Graph;