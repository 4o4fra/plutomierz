import motivationalPlutaJSON from "../../../../android/app/src/main/assets/motivationalPluta.json";
import {useEffect, useState} from "react";
import "./Splash.css"

function Splash() {
    const motivationalPluta = motivationalPlutaJSON;
    const [splashText, setSplashText] = useState("");

    useEffect(() => {
        setSplashText(motivationalPluta[Math.floor(Math.random() * motivationalPluta.length)]);
    })

    return (
        <div>
            <p className={"splash"}>
                {splashText}
            </p>
        </div>
    )
}

export default Splash;