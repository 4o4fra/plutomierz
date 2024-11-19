import "./Livechat.css"
import raw from "./temp.txt"
import {useEffect, useRef, useState} from "react";

function Livechat()
{
    const [lines, setLines] = useState([]);
    const [scroll, setScroll] = useState(0);
    const [scrollLast, setScrollLast] = useState(1);
    const chatEndRef = useRef();

    fetch(raw)
        .then(r => r.text())
        .then(text => {
            const lines = text.split('\n');
            setLines(lines);
        })

    const scrollDown = () => (
        chatEndRef.current?.scrollIntoView({behavior: "instant", block: 'end'})
    )

    const onSubmit = () => {
        console.log("XD");
    }

    const scrollEvent = () => {
        const scrollTop = document.getElementById("chat").scrollTop;
        setScrollLast(scrollTop);
        if (scrollLast > scroll) {
            setScroll(scrollTop)
        }
    }

    useEffect(() => {
        if (scrollLast >= scroll)
        {
            scrollDown();
        }
    }, [chatEndRef, lines.length, scroll, scrollLast]);

    return (
        <div className={"liveChatBox"}>
            <div className={"chat"} id={"chat"} onScroll={scrollEvent}>
                {lines.map((l, i) => (
                    <div key={i} className={"message"}>
                           {l}<br/>
                       </div>
                ))}
                <div ref={chatEndRef}/>
            </div>
            <div className={"inputContainer"}>
                <div className={"inputBox"}>
                    <input className={"input"} type={"text"} placeholder={"Zacznij pisać..."}/>
                </div>
                <div className={"buttonBox"}>
                    <button className={"button"}>
                        <img className={"sendImage"} src={"./src/assets/livechat/send_icon.png"} alt={"send_icon"}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Livechat;