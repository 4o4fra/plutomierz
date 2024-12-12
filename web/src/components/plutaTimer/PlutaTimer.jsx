import Clock from "../clock/Clock.jsx";
import "./PlutaTimer.css";
import {useEffect, useState} from "react";

function PlutaTimer() {
    const [hour, sethour] = useState(new Date().getHours());
    const [minute, setMinute] = useState(new Date().getMinutes());
    const [day, setDay] = useState(new Date().getDay());
    const [statusSkrotu, setStatusSkrotu] = useState("");

    const updateSkrotStatus = () => {
        let countdown = (((11 - hour) * 60) + 45 - minute);

        if (day === 6 || day === 0) {
            setStatusSkrotu("Weekend. Do zobaczenia w poniedziałek na skrócie!")
        } else {
            if (countdown <= 660 && countdown > 0) {
                setStatusSkrotu("Panowie, za " + countdown + " minut Skrót Pluty!")
            } else if (countdown <= 0 && countdown > -20) {
                setStatusSkrotu("WSZYSCY NA SKRÓT PLUTY!!!")
            } else if (countdown <= -20) {
                setStatusSkrotu("Widzimy się jutro na Skrócie!")
            }
        }
    }

    useEffect(() => {
        setInterval(() => {
            sethour(new Date().getHours());
            setMinute(new Date().getMinutes());
            setDay(new Date().getDay());
            updateSkrotStatus();
        }, 1000)
    }, [])

    useEffect(() => {
        setDay(new Date().getDay());
        updateSkrotStatus();
    }, [])

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