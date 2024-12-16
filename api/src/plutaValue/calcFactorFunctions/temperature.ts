export default function calcTemperatureFactor(temperature: number): number{
    let warm: number = -(Math.abs((temperature - 20) / 20)) + 1
    let cold: number = -(Math.abs((temperature + 5) / 5)) + 1

    cold = cold > 1 ? 1 : cold
    warm = warm > 1 ? 1 : warm

    return warm > cold ? warm : cold
}