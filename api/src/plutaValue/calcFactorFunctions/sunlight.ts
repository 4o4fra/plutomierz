export default function calcSunlightFactor (isSunlight: number): number {
    if (isSunlight === 1) {
        return 1;
    } else {
        return 0;
    }
}