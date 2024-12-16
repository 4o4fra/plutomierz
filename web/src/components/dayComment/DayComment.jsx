import {useEffect, useState} from "react";
import "./DayComment.css"

function DayComment() {
    const [dayComment, setDayComment] = useState(0);
    const [day, setDay] = useState(new Date().getDay());
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
            setDay(new Date().getDay());
            setDayComment(day)
        }, 1000)
    }, [])

    useEffect(() => {
        setDay(new Date().getDay());
        setDayComment(day)
    }, [])

    return (
        <div>
            <div className={"day"}>
                Dzisiaj {week[day]}. {dayComments[dayComment]}
            </div>
        </div>
    )
}

export default DayComment;