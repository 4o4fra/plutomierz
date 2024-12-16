export default function calcWindFactor(wind10m: number, maxAccountedSpeed: number): number {
    return (wind10m > maxAccountedSpeed ? 0 : (maxAccountedSpeed - wind10m) / maxAccountedSpeed)
}