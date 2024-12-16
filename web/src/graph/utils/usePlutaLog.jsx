import {useEffect, useRef, useState} from 'react';
import {useWebSocketContext} from '../../utils/websocketContext';

const usePlutaData = (initialDateRange) => {
    const {sendMessage, lastMessage} = useWebSocketContext();
    const [plutaLogs, setPlutaLogs] = useState([]);
    const cache = useRef({});

    const loadData = (dateRange) => {
        console.log(dateRange)
        if (cache.current[dateRange]) {
            console.log(`Reading from cache for date range: ${dateRange}`);
            setPlutaLogs(cache.current[dateRange]);
        } else {
            console.log(`Cache miss for date range: ${dateRange}.`);
            sendMessage(JSON.stringify({type: 'getPlutaLog', dateRangeInMs: dateRange}));
        }
    };

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            console.log('Received message data:', messageData); // Log the received data
            if (messageData.type === 'plutaLog') {

                console.log(`Writing to cache for date range: ${messageData.dateRangeInMs}`);
                cache.current[messageData.dateRangeInMs] = messageData.value; // Cache the data
                setPlutaLogs(messageData.value); // Set new data directly
            } else if (messageData.type === 'error' && messageData.message === 'Rate limit exceeded') {
                setTimeout(() => {
                    console.log('Rate limit exceeded, retrying for date range:', initialDateRange);
                    sendMessage(JSON.stringify({type: 'getPlutaLog', dateRangeInMs: initialDateRange}));
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