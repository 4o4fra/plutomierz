import { useState, useEffect } from 'react';
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
import { useWebSocketContext } from '../websocketContext';
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
    const { sendMessage, lastMessage } = useWebSocketContext();

    const specificDate = true; // placeholder for date selection on the page

    // get the data from the last 24 hours
    const start = specificDate ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() : null;
    useEffect(() => {
        sendMessage(JSON.stringify({ type: 'getPlutaLog', date: start }));
    }, []); // Empty dependency array ensures this runs only once

    // store pluta logs
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

    const pointRadius = window.innerWidth <= 800 ? 2 : 5;

    const chartData = {
        labels: plutaLogs.map((entry) => entry.created_at),
        datasets: [
            {
                label: 'Pluta Value',
                data: plutaLogs.map((entry) => ({
                    x: new Date(entry.created_at),
                    y: entry.plutaValue,
                })),
                borderColor: 'gold',
                backgroundColor: 'black',
                tension: 0.2,
                pointRadius: pointRadius,
            },
        ],
    };

    // this should be removed at some point, but i'll stay consistent that as of now we are leaving all comments on the production code
    useEffect(() => {
        console.log("Updated plutaLogs:", plutaLogs);
    }, [plutaLogs]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            // title: {
            //     display: true,
            //     text: 'Pluta Over Time',
            // },
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
                grid: {
                    color: 'black',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Pluta Value',
                },
                grid: {
                    color: 'black',
                },
            },
        },
    };

    return (<Line data={chartData} options={options} className={"plutograph"} />);
};

export default PlutoGraph;