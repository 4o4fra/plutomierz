import "./Home.css"
import Background from "../components/background/Background.jsx";
import Plutomierz from "../components/plutomierz/Plutomierz.jsx";
import Marquee from "../components/marquee/Marquee.jsx";
import Livechat from "../components/livechat/Livechat.jsx";
import PlutomierzTest from "../components/plutomierz_test/PlutomierzTest.jsx";

function Home()
{
    return(
        <div>
            <Background />

            <div className={"title"}>
                <h1>
                    STRONA PLUTONOWA
                </h1>
            </div>

            <div className={"divContainer"}>
                <div className={"divColumn"} style={{"--width": "30vw", textAlign: "center"}}>
                    <div className={"sideVideo"}>
                        <iframe
                            width={"400px"}
                            height={"225px"}
                            src={"https://www.youtube.com/embed/OUiV7umwMUs"}
                        >
                        </iframe>
                    </div>
                </div>
                <div className={"divColumn"} style={{"--width": "40vw", textAlign: "center"}}>
                    <PlutomierzTest value={152} motivationalText={"xd"}/>
                </div>
                <div className={"divColumn"} style={{"--width": "30vw"}}>
                    <Livechat/>
                </div>
            </div>

            {/*SPONSORS*/}
            <div className={"sponsorsContainer"}>
                <h1 className={"sponsorsHeader"}>
                    SPONSORZY PLUTONOWI:
                </h1>
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