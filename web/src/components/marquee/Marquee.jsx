import "/src/components/marquee/Marquee.css"

function Marquee({images, direction, width, speed, gap, marginTop})
{
    console.log(images.length)

    return(
        <div>
            <div className={"image_board"} style={{
                "--imageQuantity": images.length,
                "--direction": direction,
                "--imageWidth": width,
                "--speed": speed,
                "--imageGap": gap,
                "--marginTop": marginTop,
            }}>
                <div className={"image_track"}>
                    {images.map((image, index) => (
                        <div key={index} className={"image"} style={{"--imageIndex": index + 1}}>
                            <img src={image} alt={"marquee image"} width={width} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Marquee;