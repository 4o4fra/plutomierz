import "./Livechat.css"
import {useEffect, useRef, useState} from "react";

function Livechat() {
    const [messages, setMessages] = useState(["", ""]);
    const [lines, setLines] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [scroll, setScroll] = useState(0);
    const [scrollLast, setScrollLast] = useState(1);
    const chatEndRef = useRef();
    const messageRef = useRef();
    const usernameRef = useRef();

    useEffect(() => {
        const plutaSocket = new WebSocket("ws://localhost:3000");

        plutaSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.messages !== undefined) {
                setMessages(data.messages);
            }
        };

        return () => {
            plutaSocket.close();
        };
    }, []);

    useEffect(() => {
        fetch(messages)
            .then(r => r.text())
            .then(text => {
                const lines = text.split('\n');
                setLines(lines);
            })
    })

    const scrollDown = () => (
        chatEndRef.current?.scrollIntoView({behavior: "instant", block: 'end'})
    )

    const onSubmit = () => {
        console.log(message, username)
        //plutaSocket.send(JSON.stringify(message));
    }

    const scrollEvent = () => {
        const scrollTop = document.getElementById("chat").scrollTop;
        setScrollLast(scrollTop);
        if (scrollLast > scroll) {
            setScroll(scrollTop)
        }
    }

    useEffect(() => {
        if (scrollLast >= scroll) {
            scrollDown();
        }
    }, [chatEndRef, lines.length, scroll, scrollLast]);

    return (
        <div className={"liveChatBox"}>
            <div className="liveChatHeader">
                PLUTA LIVECHAT
            </div>
            <div className={"chat"} id={"chat"} onScroll={scrollEvent}>
                {lines.map((l, i) => (
                    <div key={i} className={"message"}>
                        {l}<br/>
                    </div>
                ))}
                <div ref={chatEndRef}/>
            </div>
            {/*<div className={"inputContainer"}>*/}
            {/*    <div className={"inputBox"}>*/}
            {/*        <input className={"input"} type={"text"} placeholder={"Zacznij pisać..."}/>*/}
            {/*    </div>*/}
            {/*    <div className={"buttonBox"}>*/}
            {/*        <button className={"button"}>*/}
            {/*            <img className={"sendImage"} src={"./src/assets/livechat/send_icon.png"} alt={"send_icon"}/>*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={"inputBox"}>
                <input
                    className={"input"}
                    type={"text"}
                    placeholder={"Wpisz wiadomość..."}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                />
            </div>
            <div className={"inputBox"}>
                <input
                    className={"input"}
                    type={"text"}
                    placeholder={"Podpisz się!"}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
            </div>
            <div className={"buttonBox"}>
                <button className={"button"} onClick={onSubmit}>
                    <img className={"sendImage"} src={"./src/assets/livechat/send_icon.png"} alt={"send_icon"}/>
                </button>
            </div>
        </div>
    )
}

export default Livechat;