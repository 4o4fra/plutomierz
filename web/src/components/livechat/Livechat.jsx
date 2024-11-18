import "./Livechat.css"

function Livechat()
{
    return (
        <div className={"liveChatBox"}>
            <div className={"chat"}>

            </div>
            <div className={"inputBox"}>
                <input className={"input"} type={"text"} placeholder={"Zacznij pisać..."}/>
            </div>
        </div>
    )
}

export default Livechat;