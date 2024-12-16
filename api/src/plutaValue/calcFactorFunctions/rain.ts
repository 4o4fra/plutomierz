export default function calcRainFactor(rain: number, rainCap: number): number {
   if (rain <= 0) {
        return 1;
    } else if (rain > rainCap) {
        return 0;
    } else {
        return rainCap - rain;
}
}