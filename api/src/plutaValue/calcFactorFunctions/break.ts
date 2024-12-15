export default function calcBreakFactor (time: number): number {
    let factor: number = 0

    const longBreakFactorial:number = 1
    const almostLongBreakFactorial:number = 0.5
    const shortBreakFactorial:number = 0.25

    let regularBreaks = [[805, 815], [900, 910], [955, 1005], [1050, 1100], [1250, 1300], [1345, 1355], [1440, 1450], [1535, 1545]]

    // Between 11:45 and 12:00 is max bonus (long break)
    if (1145 <= time && time <= 1200) {
        factor = longBreakFactorial
    }
    // 10min before the long break is a big bonus
    else if ((1135 <= time && time < 1145) || (1200 < time && time <= 1215)) {
        factor = almostLongBreakFactorial
    }
    else {
        // on every other break there's a smaller boost
        for (const timeBreak of regularBreaks) {
            if (timeBreak[0] <= time && time <= timeBreak[1]) {
                factor = shortBreakFactorial
                return factor
            }
        }
    }

    return factor
}