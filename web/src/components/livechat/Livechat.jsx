import "./Livechat.css"
import {useEffect, useRef, useState} from "react";

function Livechat() {
    const [messages, setMessages] = useState(["", ""]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [scroll, setScroll] = useState(0);
    const [scrollLast, setScrollLast] = useState(1);
    const [plutaSocketReady, setPlutaSocketReady] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [textError, setTextError] = useState("");
    const [rateError, setRateError] = useState("");

    const plutaMinLength = 4;
    const plutaMaxLength = 16;
    const textMinLength = 0;
    const textMaxLength = 200;

    const chatEndRef = useRef();

    function handlePlutaSocket() {
        //const plutaSocket = new WebSocket("ws://localhost:3000");
        const plutaSocket = new WebSocket("ws://38.242.250.43:3000");

        plutaSocket.onopen = () => {
            setPlutaSocketReady(true);
        }

        plutaSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.messages !== undefined) {
                setMessages(data.messages);
            }
        };

        plutaSocket.onerror = (e) => {
            console.log(e)
        }

        plutaSocket.onclose = () => {
            setPlutaSocketReady(false);
        }

        return () => {
            if (plutaSocketReady) {
                plutaSocket.close();
            }
        };
    }

    useEffect(() => {
        setInterval(() => {
            handlePlutaSocket();
        }, 1000)
    }, []);

    const sendMessage = () => {
        const chatMessage = {
            username: username,
            text: message,
        };

        if (
            chatMessage.username.length <= plutaMinLength ||
            chatMessage.username.length >= plutaMaxLength ||
            chatMessage.text.length <= textMinLength ||
            chatMessage.text.length >= textMaxLength
        ) {
            setInputError(true);

            if (chatMessage.username.length <= plutaMinLength || chatMessage.username.length >= plutaMaxLength) {
                setUsernameError(("Nazwa Pluty musi mieć długość od " + plutaMinLength +  " do " + plutaMaxLength + " znaków."))
            } else {
                setUsernameError("");
            }

            if (chatMessage.text.length <= textMinLength || chatMessage.text.length >= textMaxLength) {
                setTextError(("Wiadomość Plutonowa musi mieć długość od " + textMinLength + " do " + textMaxLength + " znaków."))
            } else {
                setTextError("");
            }
        }
        else {
            //const plutaSocket = new WebSocket("ws://localhost:3000");
            const plutaSocket = new WebSocket("ws://38.242.250.43:3000");
            setUsernameError("");
            setTextError("");
            setRateError("");
            setInputError(false);

            plutaSocket.onopen = () => {
                setPlutaSocketReady(true);
                plutaSocket.send(JSON.stringify(chatMessage));
            }

            plutaSocket.onmessage = (e) => {
                const data = JSON.parse(e.data);

                if (data.type === "error") {
                    setInputError(true);
                    setRateError("Kolego! Nie spam tak!");
                } else {
                    setInputError(false);
                    setRateError("");
                }
            }

            plutaSocket.onerror = (e) => {
                console.log(e);
            }

            plutaSocket.onclose = () => {
                setPlutaSocketReady(false);
            }

            handlePlutaSocket()

            setMessage("")
            document.getElementById("inputText").value = "";

            return () => {
                if (plutaSocketReady) {
                    plutaSocket.close();
                }
            };
        }
    }

    const scrollDown = () => (
        chatEndRef.current?.scrollIntoView({behavior: "instant", block: 'nearest'})
    )

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
    }, [chatEndRef, messages.length, scroll, scrollLast]);

    return (
        <div className={"liveChatBox"}>
            <div className="liveChatHeader">
                PLUTA LIVECHAT
            </div>
            <div className={"chat"} id={"chat"} onScroll={scrollEvent}>
                {messages.map((m, i) => (
                    <div key={i} className={"message"}>
                        <span className={"username"}>{m.username}:</span>
                        <span className={"text"}>{m.text}</span>
                    </div>
                ))}
                <div ref={chatEndRef}/>
            </div>
            <div className={"inputBox"}>
                <input
                    id={"inputText"}
                    className={"input"}
                    type={"text"}
                    placeholder={"Podaj wiadomość Plutonową"}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                />
            </div>
            <div hidden={!inputError}>
                <div className={"error"}>{textError}</div>
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
            <div hidden={!inputError}>
                <div className={"error"}>{usernameError}</div>
            </div>
            <div className={"buttonBox"}>
                <button className={"button"} onClick={sendMessage}>
                    <img className={"sendImage"} src={"./src/assets/livechat/send_icon.png"} alt={"send_icon"}/>
                </button>
            </div>
            <div hidden={!inputError}>
                <div className={"error"}>{rateError}</div>
            </div>
        </div>
    )
}

export default Livechat;