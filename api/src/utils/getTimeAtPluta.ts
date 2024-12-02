import axios from 'axios';

const getTimeAtPluta = async (latitude: number, longitude: number): Promise<Date> => {
    const apiKey = 'RMV68AUPKKLC'; // Replace with your actual API key
    const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.status === 'OK') {
            const timezone = response.data.zoneName;
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const formatter = new Intl.DateTimeFormat('pl-PL', options);
            const parts = formatter.formatToParts(now);

            const year = parseInt(parts.find(part => part.type === 'year')?.value || '0', 10);
            const month = parseInt(parts.find(part => part.type === 'month')?.value || '0', 10) - 1; // Months are 0-indexed in JavaScript Date
            const day = parseInt(parts.find(part => part.type === 'day')?.value || '0', 10);
            const hours = parseInt(parts.find(part => part.type === 'hour')?.value || '0', 10);
            const minutes = parseInt(parts.find(part => part.type === 'minute')?.value || '0', 10);
            const seconds = parseInt(parts.find(part => part.type === 'second')?.value || '0', 10);

            return new Date(year, month, day, hours, minutes, seconds);
        } else {
            return new Date();
        }
    } catch (error) {
        console.error('Error fetching timezone:', error);
        throw error;
    }
};

export default getTimeAtPluta;