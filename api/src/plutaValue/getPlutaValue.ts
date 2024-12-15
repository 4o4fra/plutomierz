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
        // apparent_temperature: apparentTemperature = 0,
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

    let multipliers: { [key: string]: number } = {};
    let specialMultipliers: { [key: string]: number } = {}; // those aren't counted to the balance pluta, because of their special nature

    let bonuses: { [key: string]: number } = {};

    // time sinus bonuses
    multipliers["evening"] = 5
    bonuses["evening"] = calcSinusoidalBonusBetweenHoursFactor(time, 1700, 2300, 1) * multipliers["evening"]

    multipliers["lateNight"]  = 5 // if it's not late night, it's a bonus
    bonuses["lateNight"] = (1 - calcSinusoidalBonusBetweenHoursFactor(time, 330, 630, 1)) * multipliers["lateNight"]

    multipliers["weekendNight"] = 20
    bonuses["weekendNight"] = calcWeekendNightFactor(time, day) * multipliers["weekendNight"]

    // breaks
    multipliers["break"] = 20
    bonuses["break"] = calcBreakFactor(time) * multipliers["break"]

    // days
    multipliers["day"] = 8
    bonuses["day"] = calcDayFactor(day) * multipliers["day"]

    // months
    multipliers["month"] = 5
    bonuses["month"] = calcMonthFactor(Number(String(date).slice(4,6))) * multipliers["month"]

    // sunlight
    multipliers["sunlight"] = 5
    bonuses["sunlight"] = calcSunlightFactor(isSunlight) * multipliers["sunlight"];

    // uv index
    multipliers["uvIndex"] = 10
    bonuses["uvIndex"] = calcUvFactor(uvIndex) * multipliers["uvIndex"]

    // rain
    multipliers["rain"] = 10 // if there's no rain, it's a bonus
    bonuses["rain"] = calcRainFactor(rain) * multipliers["rain"];

    // shower
    multipliers["rain"] = 5 // if there's no shower, it's a bonus
    bonuses["rain"] = calcRainFactor(showers) * multipliers["rain"];

    // snow
    multipliers["snow"] = 20;
    bonuses["snow"] = calcSnowFactor(snowfall) * multipliers["snow"];

    // temperature
    multipliers["temperature"] = 15
    bonuses["temperature"] = calcTemperatureFactor(temperature) * multipliers["temperature"]

    // TODO: REWORK THIS to consider if it's good to have cooler or hotter than it is
    // Easter egg, temperature anomaly
    // specialMultipliers["temperatureAnomaly"] = 50
    // bonuses["temperatureAnomaly"] = apparentTemperature > temperature + 5 ? specialMultipliers["temperatureAnomaly"] : 0

    // clouds
    multipliers["clouds"] = 5
    bonuses["clouds"] = calcTheMoreTheWorseFactor(cloudCover) * multipliers["clouds"]

    // humidity
    multipliers["humidity"] = 5
    bonuses["humidity"] = calcTheMoreTheWorseFactor(relativeHumidity) * multipliers["humidity"]

    // weather code (sus)
    multipliers["weatherCode"] = 3
    bonuses["weatherCode"] = calcTheMoreTheWorseFactor(weatherCode) * multipliers["weatherCode"]

    // wind direction
    multipliers["windDirection"] = 5
    bonuses["windDirection"] = calcWindDirectionFactor(windDirection10m) * multipliers["windDirection"]

    // wind speed
    multipliers["windSpeed"] = 5
    const maxAccountedWindSpeed = 25 // (m/s)
    bonuses["windSpeed"] = calcWindFactor(windSpeed10m, maxAccountedWindSpeed) * multipliers["windSpeed"]

    // wind gust
    multipliers["windGust"] = 5
    const maxAccountedGustSpeed = 50 // (m/s)
    bonuses["windGust"] = calcWindFactor(windGusts10m, maxAccountedGustSpeed) * multipliers["windGust"]

    // random deviation
    specialMultipliers["deviationMin"] = -2
    specialMultipliers["deviationMax"] = 2
    bonuses["deviation"] = Math.random() * (specialMultipliers["deviationMax"] - specialMultipliers["deviationMin"]) + specialMultipliers["deviationMin"]

    // random pluta time
    specialMultipliers["plutaTimeMax"] = 30
    const {factor: plutaTimeFactorWithoutPlutaConcentration, plutaConcentration: plutaTimePlutaConcentration} = calcRandomPlutaTimeFactor(date, time)
    multipliers["plutaTime"] = specialMultipliers["plutaTimeMax"] * plutaTimePlutaConcentration
    bonuses["plutaTime"] = plutaTimeFactorWithoutPlutaConcentration * multipliers["plutaTime"]

    // base pluta to make overall plutas higher
    const basePluta = 15;

    let maxPluta = 0
    for (const multiplier in multipliers) {
        maxPluta += multipliers[multiplier];
    }

    const balancePluta = -maxPluta / 3;

    let plutaValue = basePluta + balancePluta;
    for (const bonus in bonuses) {
        plutaValue += bonuses[bonus];
    }
    plutaValue = Math.round(plutaValue * 10) / 10;

    let plutaDev = `
    ## ${plutaValue} Plut
    \`\`\`ts
    "basePluta": ${basePluta}
    "maxPluta": ${maxPluta}
    "balancePluta": ${balancePluta}
    \n`;

    for (const bonus in bonuses) {
        plutaDev += `\t"${bonus}": ${bonuses[bonus]}\n`;
    }

    plutaDev += `\`\`\``;

    return {plutaValue, plutaDev};
};

export default getPlutaValue;
