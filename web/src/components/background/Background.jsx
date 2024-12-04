import "./Background.css"

function Background() {
    const date = new Date();
    const videoStartTime = (date.getMinutes() * 60 + date.getSeconds()) % 240;

    return (
        <video autoPlay muted loop className={"backgroundVideo"}>
            <source src={"assets/background/background_video.mp4#t=" + videoStartTime} type="video/mp4"/>
        </video>
    )
}

export default Background;