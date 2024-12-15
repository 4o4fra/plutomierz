import getWeatherData from "./utils/getWeatherData";
import getTimeAtPluta from "./utils/getTimeAtPluta";

import calcDayFactor from "./calcFactorFunctions/day";
import calcMonthFactor from "./calcFactorFunctions/month";
import calcTemperatureFactor from "./calcFactorFunctions/temperature";
import calcSinusoidalBonusBetweenHoursFactor from "./calcFactorFunctions/sinusoidalBonusBetweenHours";
import calcWeekendNightFactor from "./calcFactorFunctions/weekendNight";
import calcBreakFactor from "./calcFactorFunctions/break";
import calcRandomPlutaTimeFactor from "./calcFactorFunctions/randomPlutaTime";
import calcWindFactor from "./calcFactorFunctions/wind";
import calcWindDirectionFactor from "./calcFactorFunctions/windDirection";
import calcTheMoreTheWorseFactor from "./calcFactorFunctions/theMoreTheWorse";
import calcSnowFactor from "./calcFactorFunctions/snow";
import calcRainFactor from "./calcFactorFunctions/rain";
import calcUvFactor from "./calcFactorFunctions/uv";
import calcSunlightFactor from "./calcFactorFunctions/sunlight";

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
    const time: number = Number(
        String(hour) +
        String(minute).padStart(2, '0')
    );
    const day = now.getDay() == 0 ? 7 : now.getDay();
    // format date to be YYYYMMDD
    const date = Number(
        String(now.getFullYear()) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0')
    );

    // time sinus bonuses
    const lateNightMultiplier = 5 // if it's not late night, it's a bonus
    const lateNightBonus = (1 - calcSinusoidalBonusBetweenHoursFactor(time, 330, 630, 1)) * lateNightMultiplier
    const eveningMultiplier = 5
    const eveningBonus = calcSinusoidalBonusBetweenHoursFactor(time, 1700, 2300, 1) * eveningMultiplier
    const weekendNightMultiplier = 20
    const weekendNightBonus = calcWeekendNightFactor(time, day) * weekendNightMultiplier

    // breaks
    const timeMultiplier = 20
    const timeBonus = calcBreakFactor(time) * timeMultiplier

    // days
    const dayMultiplier = 8
    const dayBonus = calcDayFactor(day) * dayMultiplier

    // months
    const monthMultiplier = 5
    const monthBonus = calcMonthFactor(Number(String(date).slice(4,6))) * monthMultiplier

    // sunlight
    const sunlightMultiplier = 5
    const sunlightBonus = calcSunlightFactor(isSunlight) * sunlightMultiplier;

    // uv index
    const uvIndexMultiplier = 10
    const uvIndexBonus = calcUvFactor(uvIndex) * uvIndexMultiplier

    // rain
    const rainMultiplier = 10 // if there's no rain, it's a bonus
    const rainBonus = calcRainFactor(rain) * rainMultiplier;

    // shower
    const showersMultiplier = 5 // if there's no shower, it's a bonus
    const showersBonus = calcRainFactor(showers) * showersMultiplier;

    // snow
    const snowMultiplier = 20;
    const snowBonus = calcSnowFactor(snowfall) * snowMultiplier;

    // temperature
    const temperatureMultiplier = 15
    const temperatureBonus = calcTemperatureFactor(temperature)

    // TODO: REWORK THIS to consider if it's good to have cooler or hotter than it is
    // Easter egg, temperature anomaly
    const temperatureAnomalyMultiplier = 50
    const temperatureAnomalyBonus = apparentTemperature > temperature + 5 ? temperatureAnomalyMultiplier : 0

    // clouds
    const cloudMultiplier = 5
    const cloudBonus = calcTheMoreTheWorseFactor(cloudCover) * cloudMultiplier

    // humidity
    const humidityMultiplier = 5
    const humidityBonus = calcTheMoreTheWorseFactor(relativeHumidity) * cloudMultiplier

    // weather code (sus)
    const codeMultiplier = 3
    const codeBonus = calcTheMoreTheWorseFactor(weatherCode) * codeMultiplier

    // wind direction
    const windDirectionMultiplier = 5
    const windDirectionBonus = calcWindDirectionFactor(windDirection10m) * windDirectionMultiplier

    // wind speed
    const windSpeedMultiplier = 5
    const maxAccountedWindSpeed = 25 // (m/s)
    const windSpeedBonus = calcWindFactor(windSpeed10m, maxAccountedWindSpeed) * windSpeedMultiplier

    // wind gust
    const windGustsMultiplier = 5
    const maxAccountedGustSpeed = 50 // (m/s)
    const windGustsBonus = calcWindFactor(windGusts10m, maxAccountedGustSpeed) * windGustsMultiplier

    // random deviation
    const deviationMin = -2
    const deviationMax = 2
    const deviation = Math.random() * (deviationMax - deviationMin) + deviationMin

    // random pluta time
    const plutaTimeMaxMultiplier = 30
    const {factor: plutaTimeFactorWithoutPlutaConcentration, plutaConcentration: plutaTimePlutaConcentration} = calcRandomPlutaTimeFactor(date, time)
    const plutaTimeMultiplier = plutaTimeMaxMultiplier * plutaTimePlutaConcentration
    const plutaTimeBonus = plutaTimeFactorWithoutPlutaConcentration * plutaTimeMultiplier

    //const eventMultiplier = await getCurrentEventMultiplier();
    const basePluta = 15;
    const maxPluta = parseFloat((weekendNightMultiplier + timeMultiplier + dayMultiplier + monthMultiplier + sunlightMultiplier + uvIndexMultiplier + ((rainMultiplier + showersMultiplier) > snowMultiplier ? (rainMultiplier + showersMultiplier) : snowMultiplier) + temperatureMultiplier + cloudMultiplier + humidityMultiplier + codeMultiplier + windDirectionMultiplier + windSpeedMultiplier + windGustsMultiplier + lateNightMultiplier + eveningMultiplier).toFixed(1));
    const balancePluta = -maxPluta / 2;

    const plutaValue = parseFloat((weekendNightBonus + basePluta + balancePluta + timeBonus + dayBonus + monthBonus + sunlightBonus + uvIndexBonus + rainBonus + showersBonus + snowBonus + temperatureBonus + temperatureAnomalyBonus + cloudBonus + humidityBonus + codeBonus + windDirectionBonus + windSpeedBonus + windGustsBonus + deviation + lateNightBonus+ eveningBonus + plutaTimeBonus).toFixed(1));

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

export default getPlutaValue;
