const LONG_BREAK_START = 1145;
const LONG_BREAK_END = 1200;
const ALMOST_LONG_BREAK_START = 1135;
const ALMOST_LONG_BREAK_END = 1215;

const regularBreaks = [
    [805, 815], [900, 910], [955, 1005], [1050, 1100],
    [1250, 1300], [1345, 1355], [1440, 1450], [1535, 1545]
];

export default function calcBreakFactor(time: number): number {
    const longBreakFactorial = 1;
    const almostLongBreakFactorial = 0.5;
    const shortBreakFactorial = 0.25;

    if (LONG_BREAK_START <= time && time <= LONG_BREAK_END) {
        return longBreakFactorial;
    } else if ((ALMOST_LONG_BREAK_START <= time && time < LONG_BREAK_START) || (LONG_BREAK_END < time && time <= ALMOST_LONG_BREAK_END)) {
        return almostLongBreakFactorial;
    } else {
        for (const [start, end] of regularBreaks) {
            if (start <= time && time <= end) {
                return shortBreakFactorial;
            }
        }
    }

    return 0;
}