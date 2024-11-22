import "./Livechat.css"
import {useEffect, useRef, useState} from "react";

function Livechat() {
    var temp = []
    const [messages, setMessages] = useState(["", ""]);
    const [lines, setLines] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [scroll, setScroll] = useState(0);
    const [scrollLast, setScrollLast] = useState(1);
    const [plutaSocketReady, setPlutaSocketReady] = useState(false);
    //const [plutaSocket, setPlutaSocket] = useState(new WebSocket("ws://localhost:3000"));

    const chatEndRef = useRef();

    function handlePlutaSocket() {
        const plutaSocket = new WebSocket("ws://localhost:3000");

        plutaSocket.onopen = (e) => {
            setPlutaSocketReady(true);
        }

        plutaSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.messages !== undefined) {
                console.log("websocket mówi: ", data.messages);
                console.log(" ");
                setMessages(data.messages);
                console.log("z tego co mówił: ", data.messages);
                console.log(" ");

                fetch(messages)
                    .then(r => r.text())
                    .then(text => {
                        const lines = text.split('\n');
                        setLines(lines);
                    })
            }
        };

        plutaSocket.onerror = (e) => {
            console.log(e)
        }

        plutaSocket.onclose = (e) => {
            setPlutaSocketReady(false);
        }

        return () => {
            if (plutaSocketReady) {
                plutaSocket.close();
            }
        };
    }

    useEffect(() => {
        handlePlutaSocket();
    }, [plutaSocketReady]);

    const scrollDown = () => (
        chatEndRef.current?.scrollIntoView({behavior: "instant", block: 'end'})
    )

    const sendMessage = () => {
        const chatMessage = {
            username: username,
            text: message,
        };

        const plutaSocket = new WebSocket("ws://localhost:3000");

        plutaSocket.onopen = (e) => {
            console.log("wysyłam...", chatMessage);
            setPlutaSocketReady(true);
            plutaSocket.send(JSON.stringify(chatMessage));
        }

        plutaSocket.onerror = (e) => {
            console.log(e);
        }

        plutaSocket.onclose = (e) => {
            setPlutaSocketReady(false);
        }

        handlePlutaSocket()

        return () => {
            if (plutaSocketReady) {
                plutaSocket.close();
            }
        };
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
            <div className={"chat"} id={"chat"} >
                {messages.map((m, i) => (
                    <div key={i} className={"message"}>
                        {m.username} {m.text}<br/>
                    </div>
                ))}
                <div ref={chatEndRef}/>
            </div>
            <div className={"inputBox"}>
                <input
                    className={"input"}
                    type={"text"}
                    placeholder={"Podaj wiadomość Plutonową"}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                />
            </div>
            <div className={"inputBox"}>
                <input
                    className={"input"}
                    type={"text"}
                    placeholder={"Podaj nazwę Pluty"}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
            </div>
            <div className={"buttonBox"}>
                <button className={"button"} onClick={sendMessage}>
                    <img className={"sendImage"} src={"./src/assets/livechat/send_icon.png"} alt={"send_icon"}/>
                </button>
            </div>
        </div>
    )
}

export default Livechat;