import "./Home.css";
import Livechat from "../components/livechat/Livechat.jsx";
import Clock from "../components/clock/Clock.jsx";
import DayComment from "../components/dayComment/DayComment.jsx";
import {NavLink} from "react-router-dom";
import Sponsors from "../pages/sponsors/Sponsors.jsx";

function Home({Subpage}) {
    return (
        <div>
            <div className={"menu"}>
                <div className={"menuNav"}>
                    <NavLink to={"/"} className={"navLink"}>
                        PLUTOMIERZ
                    </NavLink>
                    <NavLink to={"/graph"} className={"navLink"}>
                        PLUTOGRAF
                    </NavLink>
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
                <div className={"subpageContainer"}>
                    <Subpage/>
                </div>

                <div className={"chatContainerHome"}>
                    <Livechat/>
                </div>

                <div className={"sponsorsContainerHome"}>
                    <Sponsors/>
                </div>
            </div>
        </div>
    )
}

export default Home;