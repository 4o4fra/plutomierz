import "./Plutomierz.css"
import {useEffect, useState} from "react";

function Plutomierz()
{
    const [plutaValue, setPlutaValue] = useState()

    useEffect(() => {
        setPlutaValue(35)
    }, [plutaValue])

    const parsedPluta = (plutaValue * 2) + "deg"

    return(
        <div>
            <div className={"dial"}>
                <img
                    className={"pointer"}
                    src={"./src/assets/plutomierz/plutomierz_wskazowka.png"}
                    alt="Wskazówka Plutomierza"
                    style={{"--plutaValue": parsedPluta}}
                />
            </div>
            <div>
                Plut na Plutomierzu: {plutaValue}
            </div>
        </div>
    )
}

export default Plutomierz;