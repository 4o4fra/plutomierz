import {useEffect, useRef, useState} from 'react';
import {useWebSocketContext} from '../../utils/websocketContext';

const usePlutaData = (initialDateRange) => {
    const {sendMessage, lastMessage} = useWebSocketContext();
    const [plutaLogs, setPlutaLogs] = useState([]);
    const cache = useRef({});
    const messageQueue = useRef([]);
    const isRateLimited = useRef(false);

    const processQueue = () => {
        if (messageQueue.current.length > 0 && !isRateLimited.current) {
            const message = messageQueue.current.shift();
            sendMessage(message);
        }
    };

    const loadData = (dateRange) => {
        if (cache.current[dateRange]) {
            setPlutaLogs(cache.current[dateRange]);
        } else {
            const message = JSON.stringify({type: 'getPlutaLog', dateRangeInMs: dateRange});
            messageQueue.current = [message]; // Clear the queue and add the new message
            if (!isRateLimited.current) {
                processQueue();
            }
        }
    };

    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            if (messageData.type === 'plutaLog') {
                cache.current[messageData.dateRangeInMs] = messageData.value;
                setPlutaLogs(messageData.value);
                processQueue();
            } else if (messageData.type === 'error' && messageData.message === 'Rate limit exceeded') {
                isRateLimited.current = true;
                setTimeout(() => {
                    isRateLimited.current = false;
                    processQueue();
                }, 5000);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        loadData(initialDateRange);
    }, [initialDateRange]);

    return {plutaLogs, loadData};
};

export default usePlutaData;