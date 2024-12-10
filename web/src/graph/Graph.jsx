import React from 'react';
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

const Graph = ({ data }) => {
    const chartData = {
        labels: data.map((entry) => entry.timestamp), // Use timestamps as labels
        datasets: [
            {
                label: 'Pluta Value',
                data: data.map((entry) => ({
                    x: new Date(entry.timestamp), // Use Date object for proper spacing
                    y: entry.value,
                })),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

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
                type: 'time', // Enable time-based scaling
                time: {
                    unit: 'minute', // Adjust to desired time unit (e.g., minute, hour)
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

    return (
        <div>
            <h1>Wykres Pluty</h1>
            <p>This is the Wykres subpage.</p>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default Graph;
