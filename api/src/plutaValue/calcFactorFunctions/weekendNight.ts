import sinusoidalBonusBetweenHours from "./sinusoidalBonusBetweenHours";

export default function weekendNight(time: number, day: number): number {
    if( 5 <= day && day <= 7 ) {
        if ( 1800 <= time && time <= 2100 ){
            return sinusoidalBonusBetweenHours(time, 1800, 2400, 1)
        }
        else if ( day != 7 ){
            if ( 200 <= time && time <= 400){
                return sinusoidalBonusBetweenHours(time, 0, 400, 1)
            }
            else if ( time >= 2100 || time <= 200){
                return 1
            }
        }
    }
    return 0
}