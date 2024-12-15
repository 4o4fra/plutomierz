import "./Home.css";
import Livechat from "../components/livechat/Livechat.jsx";
import Clock from "../components/clock/Clock.jsx";
import DayComment from "../components/dayComment/DayComment.jsx";
import Main from "../pages/main/Main.jsx";

function Home() {
    return (
        <div>
            <div className={"menu"}>
                <div className={"menuNav"}>

                </div>

                <div className={"menuComment"}>
                    <DayComment/>
                </div>

                <div className={"menuClock"}>
                    <Clock/>
                </div>
            </div>

            <div className={"divContainer"}>
                <div className={"main"}>
                    <Main/>
                </div>

                <div className={"chat"}>
                    <Livechat/>
                </div>
            </div>
        </div>
    )
}

export default Home;