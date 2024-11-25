import "./Home.css"
import Background from "../components/background/Background.jsx";
import Marquee from "../components/marquee/Marquee.jsx";
import Livechat from "../components/livechat/Livechat.jsx";
import Plutomierz from "../components/plutomierz/Plutomierz.jsx";
import Clock from "../components/clock/Clock.jsx";
import Title from "../components/title/Title.jsx";

function Home()
{
    return(
        <div>
            <Background/>

            <div className={"titleContainer"}>
                <Title/>
                <Clock/>
            </div>

            {/*<div className={"divContainer"}>*/}

            {/*</div>*/}


            <div className={"divContainer"}>
                <div className={"divColumn"} style={{"--width": "30%", textAlign: "center"}}>
                    <div className={"sideVideo"}>
                        <iframe
                            width={"400px"}
                            height={"225px"}
                            src={"https://www.youtube.com/embed/OUiV7umwMUs"}
                        >
                        </iframe>
                    </div>
                </div>
                <div className={"divColumn"} style={{"--width": "40%", textAlign: "center"}}>
                    <Plutomierz/>
                </div>
                <div className={"divColumn"} style={{"--width": "30%"}}>
                    <Livechat/>
                </div>
            </div>


            <div className={"headerContainer"}>
                <div>
                    <p className={"sponsorsHeader"}>
                        SPONSORZY PLUTONOWI:
                    </p>
                </div>
            </div>

            {/*SPONSORS*/}
            <div className={"sponsorsContainer"}>
                <Marquee
                    className={"sponsorsBackground"}
                    images={[
                        "./src/assets/sponsors/backgrounds/sponsors_bg_1.png",
                        "./src/assets/sponsors/backgrounds/sponsors_bg_2.png",
                        "./src/assets/sponsors/backgrounds/sponsors_bg_3.png",
                        "./src/assets/sponsors/backgrounds/sponsors_bg_4.png",
                        "./src/assets/sponsors/backgrounds/sponsors_bg_1.png",
                        "./src/assets/sponsors/backgrounds/sponsors_bg_2.png",
                        "./src/assets/sponsors/backgrounds/sponsors_bg_3.png",
                        "./src/assets/sponsors/backgrounds/sponsors_bg_4.png",
                    ]}
                    direction={"forwards"}
                    width={"400px"}
                    speed={"15s"}
                    gap={"-1px"}
                />
                <Marquee
                    images={[
                        "./src/assets/sponsors/logos/sponsors_logo_1.svg",
                        "./src/assets/sponsors/logos/sponsors_logo_2.png",
                        "./src/assets/sponsors/logos/sponsors_logo_3.png",
                        "./src/assets/sponsors/logos/sponsors_logo_4.png",
                        "./src/assets/sponsors/logos/sponsors_logo_5.png",
                        "./src/assets/sponsors/logos/sponsors_logo_6.png",
                        "./src/assets/sponsors/logos/sponsors_logo_7.png",
                        "./src/assets/sponsors/logos/sponsors_logo_8.png",
                        "./src/assets/sponsors/logos/sponsors_logo_9.png",
                        "./src/assets/sponsors/logos/sponsors_logo_10.png",
                        "./src/assets/sponsors/logos/sponsors_logo_11.png",
                        "./src/assets/sponsors/logos/sponsors_logo_12.png",
                    ]}
                    direction={"reverse"}
                    width={"300px"}
                    speed={"35s"}
                    gap={"100px"}
                    marginTop={"-350px"}
                />
            </div>
        </div>
    )
}

export default Home;