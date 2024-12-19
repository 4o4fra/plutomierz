import "./Main.css"
import Splash from "../../components/splash/Splash.jsx";
import Plutomierz from "../../components/plutomierz/Plutomierz.jsx";
import PlutaTimer from "../../components/plutaTimer/PlutaTimer.jsx";
import Background from "../../components/background/Background.jsx";
import Sponsors from "../sponsors/Sponsors.jsx";
import Livechat from "../../components/livechat/Livechat.jsx";
import ActiveUsers from "../../components/activeUsers/ActiveUsers.jsx";
import Footer from "../footer/Footer.jsx";

function Main() {

    return (
        <div className={"main"}>
            <Background/>

            <ActiveUsers/>

            <div className={"splashContainer"}>
                <Splash/>
            </div>

            <div className={"plutaContainer"}>
                <Plutomierz/>
            </div>

            <div className={"timerContainer"}>
                <PlutaTimer/>
            </div>

            <div className={"sponsorsContainer"}>
                <Sponsors/>
            </div>

            <div className={"footerContainer"}>
                <Footer/>
            </div>
        </div>
    )
}

export default Main