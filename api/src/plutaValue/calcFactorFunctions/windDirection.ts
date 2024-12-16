export default function calcWindDirectionFactor(windDirection10m: number): number {
    // max EAST-WEST, min NORTH-SOUTH
    return (0.5 - 0.5 * Math.cos((Math.PI / 90) * windDirection10m));
}
