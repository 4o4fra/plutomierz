import "./Livechat.css"

function Livechat()
{
    return (
        <div className={"liveChatBox"}>
            <div className={"chat"}>

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