export default function calcRainFactor(rain: number): number {
   if (rain <= 0) {
        return 1;
    } else if (rain > 1) {
        return 0;
    } else {
        return 1 - rain;
}
}