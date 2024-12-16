export default function calcSnowFactor(snowfall: number): number {
    return snowfall > 1 ? 1 : snowfall;
}