import {useEffect, useState} from 'react';
import {useWebSocketContext} from '../../utils/websocketContext';

const usePlutaData = (initialDateRange) => {
    const {sendMessage, lastMessage} = useWebSocketContext();
    const [plutaLogs, setPlutaLogs] = useState([]);

    const loadData = (dateRange) => {
        const start = new Date(Date.now() - dateRange).toISOString();
        console.log('Loading data for date range:', start);
        sendMessage(JSON.stringify({type: 'getPlutaLog', date: start}));
    };

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            console.log('Received message data:', messageData); // Log the received data
            if (messageData.type === 'plutaLog') {
                setPlutaLogs(messageData.value); // Set new data directly
            } else if (messageData.type === 'error' && messageData.message === 'Rate limit exceeded') {
                setTimeout(() => {
                    const start = new Date(Date.now() - initialDateRange).toISOString();
                    console.log('Rate limit exceeded, retrying for date range:', start);
                    sendMessage(JSON.stringify({type: 'getPlutaLog', date: start}));
                }, 5000);
            }
        }
    }, [lastMessage, sendMessage, initialDateRange]);

    useEffect(() => {
        loadData(initialDateRange);
    }, [initialDateRange]);

    return {plutaLogs, loadData};
};

export default usePlutaData;