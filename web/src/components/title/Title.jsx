import "./Title.css"
import motivationalPlutaJSON from "../../../../android/app/src/main/assets/motivationalPluta.json"
import {useEffect, useState} from "react";

function Title() {
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
            <p className={"title"}>
                STRONA PLUTONOWA
            </p>
        </div>
    )
}

export default Title;