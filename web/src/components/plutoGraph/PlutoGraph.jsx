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
import useWebSocket from 'react-use-websocket';
import './PlutoGraph.css';

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

const PlutoGraph = () => {
    const plutaSocket = 'wss://api.plutomierz.ovh';

    const specificDate = true;
    const start = specificDate ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() : null;

    const { sendMessage, lastMessage } = useWebSocket(plutaSocket, {
        onOpen: () => sendMessage(JSON.stringify({ type: 'getPlutaLog', date: start }))
    });

    const [plutaLogs, setPlutaLogs] = useState([]);

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            console.log("Received message:", messageData);
            if (messageData.type === 'plutaLog') {
                setPlutaLogs((prevLogs) => {
                    const existingIds = new Set(prevLogs.map((log) => log.created_at));
                    const newLogs = messageData.value.filter((log) => !existingIds.has(log.created_at));
                    return [...prevLogs, ...newLogs];
                });
            }
        }
    }, [lastMessage]);

    const chartData = {
        labels: plutaLogs.map((entry) => entry.created_at), // Ensure `created_at` exists
        datasets: [
            {
                label: 'Pluta Value',
                data: plutaLogs.map((entry) => ({
                    x: new Date(entry.created_at), // Ensure valid dates
                    y: entry.plutaValue, // Ensure numerical values
                })),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.2,
            },
        ],
    };

    useEffect(() => {
        console.log("Updated plutaLogs:", plutaLogs);
    }, [plutaLogs]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Pluta Over Time',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                        day: 'MMM dd',
                    },
                },
                title: {
                    display: false,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Pluta Value',
                },
            },
        },
    };

    return (<Line data={chartData} options={options} />);
};

export default PlutoGraph;