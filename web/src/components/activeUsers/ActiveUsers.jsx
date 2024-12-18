import React, {useEffect, useState} from 'react';
import {useWebSocketContext} from '../../utils/websocketContext.jsx';
import './activeUsers.css';

const ActiveUsers = () => {
    const {sendMessage, lastMessage} = useWebSocketContext();

    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            if (data.type === 'activeUsers') {
                setUserCount(data.count);
            }
        }
    }, [lastMessage]);

    return (
        <div className="activeUsers">
            <img src='/assets/activeUsers/account.png' alt="active users"/>
            <div className={"activeUsersCountBox"}>
                <span className="activeUsersCount">{userCount}</span>
            </div>
        </div>
    );
}

export default ActiveUsers;