import "./Home.css"
import Background from "../components/background/Background.jsx";
import Marquee from "../components/marquee/Marquee.jsx";
import Livechat from "../components/livechat/Livechat.jsx";
import Plutomierz from "../components/plutomierz/Plutomierz.jsx";
import Clock from "../components/clock/Clock.jsx";
import Title from "../components/title/Title.jsx";
import DayComment from "../components/dayComment/DayComment.jsx";
import Splash from "../components/splash/Splash.jsx";
import PlutaTimer from "../components/plutaTimer/PlutaTimer.jsx";
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

            {/*<Background/>*/}

            {/*<div className={"titleContainer"}>*/}
            {/*    <Splash/>*/}
            {/*    <Title/>*/}
            {/*    <DayComment/>*/}
            {/*    <Clock/>*/}
            {/*</div>*/}

            {/*/!*<div className={"divContainer"}>*!/*/}

            {/*/!*</div>*!/*/}


            {/*<div className={"divContainer"}>*/}
            {/*    <div className={"divColumn"} style={{"--width": "30%", textAlign: "center"}}>*/}
            {/*        <div className={"sideVideo"}>*/}
            {/*            <iframe*/}
            {/*                width={"400px"}*/}
            {/*                height={"225px"}*/}
            {/*                src={"https://www.youtube.com/embed/OUiV7umwMUs"}*/}
            {/*            >*/}
            {/*            </iframe>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={"divColumn"} style={{"--width": "40%", textAlign: "center"}}>*/}
            {/*        <Plutomierz/>*/}
            {/*    </div>*/}
            {/*    <div className={"divColumn"} style={{"--width": "30%"}}>*/}
            {/*        <Livechat/>*/}
            {/*    </div>*/}
            {/*</div>*/}


            {/*<div className={"headerContainer"}>*/}
            {/*    <div>*/}
            {/*        <p className={"sponsorsHeader"}>*/}
            {/*            SPONSORZY PLUTONOWI:*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*/!*SPONSORS*!/*/}
            {/*<div className={"sponsorsContainer"}>*/}
            {/*    <Marquee*/}
            {/*        className={"sponsorsBackground"}*/}
            {/*        images={[*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_1.png",*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_2.png",*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_3.png",*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_4.png",*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_1.png",*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_2.png",*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_3.png",*/}
            {/*            "assets/sponsors/backgrounds/sponsors_bg_4.png",*/}
            {/*        ]}*/}
            {/*        direction={"forwards"}*/}
            {/*        width={"400px"}*/}
            {/*        speed={"15s"}*/}
            {/*        gap={"-1px"}*/}
            {/*    />*/}
            {/*    <Marquee*/}
            {/*        images={sponsorLogos}*/}
            {/*        direction={"reverse"}*/}
            {/*        width={"300px"}*/}
            {/*        speed={"35s"}*/}
            {/*        gap={"100px"}*/}
            {/*        marginTop={"-350px"}*/}
            {/*    />*/}
            {/*</div>*/}
        </div>
    )
}

export default Home;