const rainCap = 0.5; // 0.5 mm is enough rain

export default function calcRainFactor(rain: number): number {
   if (rain <= 0) {
        return 1;
    } else if (rain > rainCap) {
        return 0;
    } else {
        return rainCap - rain;
}
}