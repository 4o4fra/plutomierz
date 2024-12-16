import sinusoidalBonusBetweenHours from "./sinusoidalBonusBetweenHours";

export default function randomPlutaTime(date: number, time: number): { plutaConcentration: number; factor: number; plutaTimeStart: number; plutaTimeEnd: number; } {
    const minDifference = 30
    const maxDifference = 12*60 // 12h

    // generate pseudo random time start
    let timeStartInMinutes = ((Math.sin(date)/2)+0.5) * 10000;
    timeStartInMinutes = timeStartInMinutes - Math.floor(timeStartInMinutes); // this is done for more random results
    timeStartInMinutes = Math.floor(timeStartInMinutes * (24*60 - minDifference))

    // calculate the maxDifference possible after start has been generated
    const maxDifferencePossible = 24*60 - timeStartInMinutes

    // generate pseudo random time end
    let timeEndInMinutes = ((Math.sin(date-1)/2)+0.5) * 10000;
    timeEndInMinutes = timeEndInMinutes - Math.floor(timeEndInMinutes); // this is done for more random results
    timeEndInMinutes = timeStartInMinutes + Math.floor(timeEndInMinutes * (maxDifference < maxDifferencePossible ? maxDifference : maxDifferencePossible))

    // ensure the time difference is at least minimum set, only after it has been calculated to bump the chance for minimum difference
    let difference = timeEndInMinutes - timeStartInMinutes
    if(difference < 30) {
        timeEndInMinutes = timeStartInMinutes + 30
        difference = 30
    }

    // convert to time HHMM
    const plutaTimeStart = Number(String(timeStartInMinutes / 60 - ((timeStartInMinutes % 60)/60)) + String(timeStartInMinutes % 60).padStart(2, '0'));
    const plutaTimeEnd = Number(String(timeEndInMinutes / 60 - ((timeEndInMinutes % 60)/60)) + String(timeEndInMinutes % 60).padStart(2, '0'));

    // calculate the factor and pluta concentration (the winder the difference the less concentrated the pluta is)
    const plutaConcentration = (maxDifference - difference + minDifference) / maxDifference;
    const factor = sinusoidalBonusBetweenHours(time, plutaTimeStart, plutaTimeEnd, 1)

    // console.log(`Pluta time: ${plutaTimeStart} - ${plutaTimeEnd}`)
    // console.log(`Pluta concentration: ${plutaConcentration}`)
    // console.log(`Pluta factor: ${factor}`)
    return {factor, plutaConcentration, plutaTimeStart, plutaTimeEnd}
}