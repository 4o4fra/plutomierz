import {useEffect, useState} from "react";
import "./Clock.css"

function Clock() {
    const [day, setDay] = useState(new Date().getDay());
    const [hour, setHour] = useState(new Date().getHours());
    const [minute, setMinute] = useState(new Date().getMinutes());
    const [parsedMinute, setParsedMinute] = useState(new Date().getMinutes().toString());
    const [dayComment, setDayComment] = useState(0);
    const week = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]
    const dayComments = [
        "Dzień Boży.",
        "Do szkółki a na długiej skórtem!",
        "UWAGA! Wysoka szansa na guarda!",
        "Środa dzień loda.",
        "Mały piątek PDW.",
        "Piątek weekendu początek!",
        "O kuźwa!"
    ]

    useEffect(() => {
        setInterval(() => {
            updateTime();
        }, 1000)
    }, [])

    function updateTime() {
        setDay(new Date().getDay());
        setHour(new Date().getHours());
        setMinute(new Date().getMinutes());
    }

    if (minute < 10) {
        setParsedMinute("0" + minute.toString());
    }

    useEffect(() => {
        setDayComment(day)
    }, []);

    return(
        <div>
            <div className={"day"}>
                Dzisiaj {week[day]}. {dayComments[dayComment]}
            </div>
            <div className={"time"}>
                {hour}:{parsedMinute}
            </div>
        </div>
    )
}

export default Clock;