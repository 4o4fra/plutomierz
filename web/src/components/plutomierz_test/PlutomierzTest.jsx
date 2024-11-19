import "./PlutomierzTest.css"

function PlutomierzTest({ value, motivationalText }) {
    const isPlutaLevelCritical = value > 100;
    const indicatorAngle = 135 + ((value + 75) / 150) * 270;

    // Obliczenie pozycji wskaźnika
    const radius = 100; // Promień łuku
    const centerX = 150; // Środek SVG
    const centerY = 150;
    const x2 = centerX + radius * Math.cos((indicatorAngle * Math.PI) / 180);
    const y2 = centerY - radius * Math.sin((indicatorAngle * Math.PI) / 180);

    return (
        <div className="box">
            <svg className="canvas" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                {/* Gradientowy łuk */}
                <path
                    d="M 50 150 A 100 100 0 1 1 250 150"
                    stroke="url(#gradient)"
                    strokeWidth="20"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Wskaźnik */}
                <line
                    x1="150"
                    y1="150"
                    x2={x2}
                    y2={y2}
                    stroke="black"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                {/* Kropka na środku */}
                <circle cx="150" cy="150" r="5" fill="black"/>
                {/* Gradient */}
                <defs>
                    <linearGradient id="gradient" gradientTransform="rotate(90)">
                        <stop offset="0%" stopColor="red"/>
                        <stop offset="50%" stopColor="yellow"/>
                        <stop offset="100%" stopColor="green"/>
                    </linearGradient>
                </defs>
            </svg>
            <div className="info">
                <p id="value-text">{value} Plut</p>
                {isPlutaLevelCritical && (
                    <p id="critical-warning" className="critical">
                        POZIOM KRYTYCZNY!
                    </p>
                )}
                {motivationalText && (
                    <p id="motivational-text" className="motivational">
                        {motivationalText}
                    </p>
                )}
            </div>
        </div>
    )
}

export default PlutomierzTest;