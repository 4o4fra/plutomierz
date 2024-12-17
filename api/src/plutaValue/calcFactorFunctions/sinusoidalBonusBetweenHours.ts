export default function sinusoidalBonusBetweenHours(currentTime:number, timeStart:number, timeEnd:number, numberOfBumps: number): number {
    // the minimums will be at the start and end of the time frame, as well as halfway between bumps of sin
    // the maximums will be at the bumps of sin
    // to imagine this I will provide an example:
    // if there's just 1 bump, it will be in the middle of the timeframe
    // if there are 2 bumps, you will have to divide the timeframe in 2, so in the middle you will have a minimum, and in the middles of the 2 halves there will be bumps
    let factor:number = 0
    if(timeStart <= currentTime && currentTime <= timeEnd) {
        const progressThroughTheTimeFrame = (currentTime - timeStart) / (timeEnd - timeStart)
        factor = (Math.sin(((2*numberOfBumps) * Math.PI * (progressThroughTheTimeFrame + (0.75/numberOfBumps))))) / 2 + 0.5
    }
    return factor
}