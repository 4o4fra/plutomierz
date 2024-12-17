import {useEffect, useState} from "react";
import "./Clock.css"

function Clock() {
    const [hour, setHour] = useState(new Date().getHours());
    const [minute, setMinute] = useState(new Date().getMinutes());

    useEffect(() => {
        setInterval(() => {
            setHour(new Date().getHours());
            setMinute(new Date().getMinutes());
        }, 1000)
    }, [])

    return(
        <div>
            {hour}:{minute < 10 ? "0" + minute : minute}
        </div>
    )
}

export default Clock;