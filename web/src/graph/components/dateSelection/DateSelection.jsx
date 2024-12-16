import {useState} from 'react';
import './DateSelection.css';

const DateSelection = ({onDateRangeChange}) => {
    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (e) => {
        const dateRange = parseInt(e.target.value, 10) * 60 * 60 * 1000; // Convert hours to milliseconds
        setSelectedButton(e.target.value);
        onDateRangeChange(dateRange);
    };

    return (
        <div className="panel">
            <button
                value={24}
                className={`dateSelectionButton ${selectedButton === '24' ? 'selected' : ''}`}
                onClick={handleButtonClick}
            >
                1D
            </button>
            <button
                value={48}
                className={`dateSelectionButton ${selectedButton === '48' ? 'selected' : ''}`}
                onClick={handleButtonClick}
            >
                2D
            </button>
            <button
                value={120}
                className={`dateSelectionButton ${selectedButton === '120' ? 'selected' : ''}`}
                onClick={handleButtonClick}
            >
                5D
            </button>
            <button
                value={168}
                className={`dateSelectionButton ${selectedButton === '168' ? 'selected' : ''}`}
                onClick={handleButtonClick}
            >
                7D
            </button>
            <button
                value={720}
                className={`dateSelectionButton ${selectedButton === '720' ? 'selected' : ''}`}
                onClick={handleButtonClick}
            >
                1M
            </button>
            <button
                value={Infinity}
                className={`dateSelectionButton ${selectedButton === 'Infinity' ? 'selected' : ''}`}
                onClick={handleButtonClick}
            >
                MAX
            </button>
            {/* Add more buttons as needed */}
        </div>
    );
};

export default DateSelection;