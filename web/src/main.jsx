import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Marquee from "./components/marquee/Marquee.jsx";
import Plutomierz from "./components/plutomierz/Plutomierz.jsx";
import Background from "./components/background/Background.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Background />

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
      <div className={"sponsorsContainer"}>
          <h1 className={"sponsorsHeader"}>
              SPONSORZY PLUTONOWI:
          </h1>
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
              ]}
              direction={"reverse"}
              width={"300px"}
              speed={"35s"}
              gap={"100px"}
              marginTop={"-350px"}
          />
      </div>
  </StrictMode>,
)
