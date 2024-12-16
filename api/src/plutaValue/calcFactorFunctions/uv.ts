export default function calcUvFactor (uvIndex: number): number {
   return (-((uvIndex / 3.5) - 1) * ((uvIndex / 3.5) - 1) + 1)
}