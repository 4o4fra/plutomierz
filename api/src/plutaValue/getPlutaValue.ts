import getWeatherData from "./utils/getWeatherData";
import getTimeAtPluta from "./utils/getTimeAtPluta";

const getPlutaValue = async (latitude: number, longitude: number) => {
    const weatherData = await getWeatherData(latitude, longitude);
    const {
        temperature_2m: temperature = 0,
        relative_humidity_2m: relativeHumidity = 0,
        apparent_temperature: apparentTemperature = 0,
        is_day: isSunlight = 0,
        rain = 0,
        showers = 0,
        snowfall = 0,
        weather_code: weatherCode = 0,
        cloud_cover: cloudCover = 0,
        wind_speed_10m: windSpeed10m = 0,
        wind_direction_10m: windDirection10m = 0,
        wind_gusts_10m: windGusts10m = 0,
        uv_index_clear_sky: uvIndex = 0
    } = weatherData.current || {};

    const now = await getTimeAtPluta();
    const hour = now.getHours();
    const minute = now.getMinutes();
    // format time to a more comparable format of 000 - 2359 (00:00 - 23:59)
    const time: number = Number(String(hour) + String(minute < 10 ? "0" + minute : minute))

    // time sinus bonuses
    const lateNightMultiplier = 5 // if it's not late night, it's a bonus
    const lateNightBonus = (1 - calcSinusoidalBonusBetweenHoursFactor(time, 330, 630, 1)) * lateNightMultiplier
    const eveningMultiplier = 5
    const eveningBonus = calcSinusoidalBonusBetweenHoursFactor(time, 1700, 2200, 1) * eveningMultiplier

    // breaks
    const timeMultiplier = 20
    const timeBonus = calcTimeFactor(time) * timeMultiplier

    // days
    const day = now.getDay();
    const dayMultiplier = 8
    const dayBonus = calcDayFactor(day) * dayMultiplier

    // months
    const month = now.getMonth() + 1; // +1 because months are 0-indexed
    const monthMultiplier = 5
    const monthBonus = calcMonthFactor(month) * monthMultiplier

    // sunlight
    const sunlightMultiplier = 5
    const sunlightBonus = isSunlight ? sunlightMultiplier : 0;

    // uv index
    const uvIndexMultiplier = 10
    const uvIndexBonus = (-((uvIndex / 3.5) - 1) * ((uvIndex / 3.5) - 1) + 1) * uvIndexMultiplier

    // rain
    const rainMultiplier = 10 // if there's no rain, it's a bonus
    const rainBonus = (rain > 1 ? 0 : 1 - rain) * rainMultiplier;

    // shower
    const showersMultiplier = 5 // if there's no shower, it's a bonus
    const showersBonus = (showers > 1 ? 0 : 1 - showers) * showersMultiplier;

    // snow
    const snowMultiplier = 20;
    const snowBonus = (snowfall > 1 ? 1 : snowfall) * snowMultiplier;

    // temperature
    const temperatureMultiplier = 15
    const temperatureBonus = calcTemperatureFactor(temperature)

    // Easter egg, temperature anomaly
    const temperatureAnomalyMultiplier = 50
    const temperatureAnomalyBonus = apparentTemperature > temperature + 5 ? temperatureAnomalyMultiplier : 0

    // clouds
    const cloudMultiplier = 5
    const cloudBonus = ((100 - cloudCover) / 100) * cloudMultiplier

    // humidity
    const humidityMultiplier = 5
    const humidityBonus = ((100 - relativeHumidity) / 100) * cloudMultiplier

    // weather code (sus)
    const codeMultiplier = 3
    const codeBonus = ((100 - weatherCode) / 100) * codeMultiplier

    // wind direction
    const windDirectionMultiplier = 5
    const windDirectionBonus = (0.5 - 0.5 * Math.cos((Math.PI / 90) * windDirection10m)) * windDirectionMultiplier;

    // wind speed
    const windSpeedMultiplier = 5
    const maxAccountedWindSpeed = 25 // (m/s)
    const windSpeedBonus = (windSpeed10m > maxAccountedWindSpeed ? 0 : (maxAccountedWindSpeed - windSpeed10m) / maxAccountedWindSpeed) * windSpeedMultiplier

    // wind gust
    const windGustsMultiplier = 5
    const maxAccountedGustSpeed = 50 // (m/s)
    const windGustsBonus = (windGusts10m > maxAccountedGustSpeed ? 0 : (maxAccountedGustSpeed - windGusts10m) / maxAccountedGustSpeed) * windGustsMultiplier;

    // random deviation
    const deviationMin = -2
    const deviationMax = 2
    const deviation = Math.random() * (deviationMax - deviationMin) + deviationMin

    //const eventMultiplier = await getCurrentEventMultiplier();
    const basePluta = 15;
    const maxPluta = parseFloat((timeMultiplier + dayMultiplier + monthMultiplier + sunlightMultiplier + uvIndexMultiplier + ((rainMultiplier + showersMultiplier) > snowMultiplier ? (rainMultiplier + showersMultiplier) : snowMultiplier) + temperatureMultiplier + cloudMultiplier + humidityMultiplier + codeMultiplier + windDirectionMultiplier + windSpeedMultiplier + windGustsMultiplier + lateNightMultiplier + eveningMultiplier).toFixed(1));
    const balancePluta = -maxPluta / 2;

    const plutaValue = parseFloat((basePluta + balancePluta + timeBonus + dayBonus + monthBonus + sunlightBonus + uvIndexBonus + rainBonus + showersBonus + snowBonus + temperatureBonus + temperatureAnomalyBonus + cloudBonus + humidityBonus + codeBonus + windDirectionBonus + windSpeedBonus + windGustsBonus + deviation + lateNightBonus+ eveningBonus).toFixed(1));

    const plutaDev = `
    ## ${plutaValue} Plut
    \`\`\`ts
    time = ${timeBonus}
    day = ${dayBonus}
    month = ${monthBonus}
    sunlight = ${sunlightBonus}
    uv index = ${uvIndexBonus}
    rain = ${rainBonus}
    showers = ${showersBonus}
    snow = ${snowBonus}
    temperature = ${temperatureBonus}
    temperature anomaly = ${temperatureAnomalyBonus}
    clouds = ${cloudBonus}
    humidity = ${humidityBonus}
    code = ${codeBonus}
    wind direction = ${windDirectionBonus}
    wind speed = ${windSpeedBonus}
    wind gusts = ${windGustsBonus}
    deviation = ${deviation}     
    
    basePluta = ${basePluta}
    maxPluta = ${maxPluta}
    balancePluta = ${balancePluta}
    \`\`\``;

    return {plutaValue, plutaDev};
};

const calcTimeFactor = (time: number): number => {
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

const calcMonthFactor = (month: number): number => ({
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

const calcDayFactor = (day: number): number => ({
    0: 1, // sunday
    1: 0.75, // monday
    2: 0, // tuesday
    3: 1, // wednesday
    4: 0.25, // thursday
    5: 0.75, // friday
    6: 1, // saturday
}[day] || 0);

const calcTemperatureFactor = (temperature: number): number => {
    let warm: number = -(Math.abs((temperature - 20) / 20)) + 1
    let cold: number = -(Math.abs((temperature + 5) / 5)) + 1

    cold = cold > 1 ? 1 : cold
    warm = warm > 1 ? 1 : warm

    return warm > cold ? warm : cold
}

const calcSinusoidalBonusBetweenHoursFactor = (currentTime:number, timeStart:number, timeEnd:number, numberOfBumps: number): number => {
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

export default getPlutaValue;
