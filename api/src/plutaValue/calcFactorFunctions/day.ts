export default function calcDayFactor (day: number): number {
    return ({
        1: 0.75, // monday
        2: 0, // tuesday
        3: 1, // wednesday
        4: 0.25, // thursday
        5: 0.75, // friday
        6: 1, // saturday
        7: 1, // sunday
    }[day] || 0);
}