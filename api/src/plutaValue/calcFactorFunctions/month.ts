export default function calcMonthFactor (month: number): number {
    return ({
        1: 0.5,
        2: 0.2,
        3: 0,
        4: 0.9,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 0.75,
        10: 0.5,
        11: 0,
        12: 0.85
    }[month] || 0);
}