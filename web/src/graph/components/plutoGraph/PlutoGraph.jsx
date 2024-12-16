import {Line} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './PlutoGraph.css';
import DateSelection from '../dateSelection/DateSelection.jsx';
import usePlutaData from '../../utils/usePlutaLog.jsx';

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
    const {plutaLogs, loadData} = usePlutaData(24 * 60 * 60 * 1000);

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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
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
        animation: {
            duration: 1000, // Duration of the animation in milliseconds
            easing: 'easeInOutQuad', // Easing function for the animation
        },
    };

    return (
        <div>
            <Line data={chartData} options={options} className={"plutograph"}/>
            <DateSelection onDateRangeChange={loadData}/>
        </div>
    );
};

export default PlutoGraph;