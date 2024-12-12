import "./Livechat.css"
import {useCallback, useEffect, useRef, useState} from "react";
import useWebSocket from "react-use-websocket";

function Livechat() {
    const [messages, setMessages] = useState([]);
    const [scroll, setScroll] = useState(0);
    const [scrollLast, setScrollLast] = useState(1);
    const [inputError, setInputError] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [textError, setTextError] = useState("");
    const [rateError, setRateError] = useState("");

    const usernameRef = useRef(null);
    const messageRef = useRef(null);
    const chatEndRef = useRef();

    const plutaMinLength = 2;
    const plutaMaxLength = 16;
    const textMinLength = 0;
    const textMaxLength = 200;

    const plutaSocket = "wss://api.plutomierz.ovh";
    const {sendMessage, lastMessage} = useWebSocket(plutaSocket)

    useEffect(() => {
        if (lastMessage !== null && JSON.parse(lastMessage.data).type !== 'error') {
            if (JSON.parse(lastMessage.data).messages !== undefined) {
                setMessages((prev) => prev.concat(JSON.parse(lastMessage.data).messages));
            }
            if (JSON.parse(lastMessage.data).message !== undefined) {
                setMessages((prev) => prev.concat(JSON.parse(lastMessage.data).message));
            }
        }

        if (lastMessage !== null && JSON.parse(lastMessage.data).type === 'error') {
            setInputError(true);
            setRateError("Kolego! Nie spam tak!");
        } else {
            setInputError(false);
            setRateError("");
        }
    }, [lastMessage]);

    const handleSendMessage = useCallback(() => {
        if (
            usernameRef.current.value.length <= plutaMinLength ||
            usernameRef.current.value.length >= plutaMaxLength ||
            messageRef.current.value.length <= textMinLength ||
            messageRef.current.value.length >= textMaxLength
        ) {
            setInputError(true);
            if (usernameRef.current.value.length <= plutaMinLength || usernameRef.current.value.length >= plutaMaxLength) {
                setUsernameError(("Nazwa Pluty musi mieć długość od " + plutaMinLength + " do " + plutaMaxLength + " znaków."))
            } else {
                setUsernameError("");
            }
            if (messageRef.current.value.length <= textMinLength || messageRef.current.value.length >= textMaxLength) {
                setTextError(("Wiadomość Plutonowa musi mieć długość od " + textMinLength + " do " + textMaxLength + " znaków."))
            } else {
                setTextError("");
            }
        } else {
            setUsernameError("");
            setTextError("");
            setRateError("");
            setInputError(false);

            sendMessage(JSON.stringify({"username": usernameRef.current.value, "text": messageRef.current.value}))

            messageRef.current.value = "";
        }
    }, []);

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
            <div className="inputContainer">
                <label className="inputLabel" htmlFor="inputText">
                    Wiadomość Plutonowa
                </label>
                <div className="inputBox">
                    <input
                        id="inputText"
                        className="input"
                        type="text"
                        placeholder=""
                        ref={messageRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                    />
                </div>
            </div>
            <div hidden={!inputError}>
                <div className="error">{textError}</div>
            </div>
            <div className="inputContainer">
                <label className="inputLabel" htmlFor="usernameInput">
                    Nazwa Pluty
                </label>
                <div className="inputBox">
                    <input
                        id="usernameInput"
                        className="input"
                        type="text"
                        placeholder=""
                        ref={usernameRef}
                    />
                </div>
            </div>
            <div hidden={!inputError}>
                <div className="error">{usernameError}</div>
            </div>
            <div className={"buttonBox"}>
                <button className={"button"} onClick={handleSendMessage}>
                    <img className={"sendImage"} src={"assets/livechat/send_icon.png"} alt={"send_icon"}/>
                </button>
            </div>
            <div hidden={!inputError}>
                <div className={"error"}>{rateError}</div>
            </div>
        </div>
    )
}

export default Livechat;