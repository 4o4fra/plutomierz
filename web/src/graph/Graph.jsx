import './Graph.css'
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
    const plutaSocket = 'wss://api.plutomierz.ovh';

    const specificDate = true;
    const start = specificDate ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() : null;

    console.log(start)

    const { sendMessage, lastMessage } = useWebSocket(plutaSocket, {
        onOpen: () => sendMessage(JSON.stringify({ type: 'getPlutaLog', date: start }))
    });

    const [plutaLogs, setPlutaLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (lastMessage !== null) {
                const messageData = JSON.parse(lastMessage.data);
                if (messageData.type === 'plutaLog') {
                    setPlutaLogs((prevLogs) => [...prevLogs, messageData]);
                }
            }
        };
        fetchData();
    }, [lastMessage]);

    return (
        <div class={"graph"}>
            <h1>Wykres Pluty</h1>
            <PlutoGraph data={plutaLogs.length > 0 ? plutaLogs[0].value : []} />
        </div>
    );
};

export default Graph;