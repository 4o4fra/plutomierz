import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Marquee from "./components/marquee/Marquee.jsx";
import Plutomierz from "./components/plutomierz/Plutomierz.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <div className={"divContainer"}>
          <div className={"divColumn"}>
              xd
          </div>
          <div className={"divColumn"}>
              <Plutomierz/>
          </div>
          <div className={"divColumn"}>
              xd
          </div>
      </div>

      {/*SPONSORS*/}
      <>
          <Marquee
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
              gap={"0px"}
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
                  "./src/assets/sponsors/logos/sponsors_logo_1.svg",
                  "./src/assets/sponsors/logos/sponsors_logo_2.png",
                  "./src/assets/sponsors/logos/sponsors_logo_3.png",
                  "./src/assets/sponsors/logos/sponsors_logo_4.png",
                  "./src/assets/sponsors/logos/sponsors_logo_5.png",
                  "./src/assets/sponsors/logos/sponsors_logo_6.png",
                  "./src/assets/sponsors/logos/sponsors_logo_7.png",
              ]}
              direction={"reverse"}
              width={"300px"}
              speed={"35s"}
              gap={"100px"}
              marginTop={"-350px"}
          />
      </>
  </StrictMode>,
)
