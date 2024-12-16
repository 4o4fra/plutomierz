import Clock from "../clock/Clock.jsx";
import "./PlutaTimer.css";
import {useEffect, useState} from "react";

function PlutaTimer() {
    const [hour, setHour] = useState(new Date().getHours());
    const [minute, setMinute] = useState(new Date().getMinutes());
    const [day, setDay] = useState(new Date().getDay());
    const [statusSkrotu, setStatusSkrotu] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setHour(now.getHours());
            setMinute(now.getMinutes());
            setDay(now.getDay());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const countdown = ((11 - hour) * 60) + 45 - minute;

        if (day === 6 || day === 0) {
            setStatusSkrotu("Weekend. Do zobaczenia w poniedziałek na skrócie!");
        } else if (countdown <= 660 && countdown > 0) {
            setStatusSkrotu("Panowie, za " + countdown + " minut Skrót Pluty!");
        } else if (countdown <= 0 && countdown > -20) {
            setStatusSkrotu("WSZYSCY NA SKRÓT PLUTY!!!");
        } else if (countdown <= -20) {
            setStatusSkrotu("Widzimy się jutro na Skrócie!");
        }
    }, [hour, minute, day]);

    return (
        <div className={"container"}>
            <div className={"time"}>
                <Clock/>
            </div>
            <div className={"countdown"}>
                {statusSkrotu}
            </div>
        </div>
    )
}

export default PlutaTimer;