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
                    <marquee scrollAmount={15}>
                        <DayComment/>
                    </marquee>

                </div>

                <div className={"menuClock"}>
                    <Clock/>
                </div>
            </div>

            <div className={"divContainer"}>
                <Main/>

                <div className={"chatContainerHome"}>
                    <Livechat/>
                </div>
            </div>
        </div>
    )
}

export default Home;