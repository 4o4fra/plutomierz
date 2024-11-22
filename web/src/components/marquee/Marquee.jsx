import "./Marquee.css"

function Marquee({images, direction, width, speed, gap, marginTop}) {
    return (
        <div className={"image_board"} style={{
            "--imageQuantity": images.length,
            "--direction": direction === "reverse" ? "reverse" : "normal",
            "--imageWidth": width,
            "--speed": speed,
            "--imageGap": gap,
            "--marginTop": marginTop,
        }}>
            <div className={"image_track"}>
                {images.concat(images).map((image, index) => (
                    <div key={index} className={"image"}>
                        <img src={image} alt={"marquee image"} width={width}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Marquee;