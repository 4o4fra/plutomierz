import getWeatherData from "./getWeatherData";
import getCurrentEventMultiplier from "./getCurrentEventMultiplier";

const getPlutaValue = async (latitude: number, longitude: number) => {
    const weatherData = await getWeatherData(latitude, longitude);
    const {
        temperature_2m: temperature = 0,
        relative_humidity_2m: relativeHumidity = 0,
        apparent_temperature: apparentTemperature = 0,
        is_day: isDay = 0,
        precipitation = 0,
        rain = 0,
        showers = 0,
        snowfall = 0,
        weather_code: weatherCode = 0,
        cloud_cover: cloudCover = 0,
        pressure_msl: pressureMsl = 0,
        surface_pressure: surfacePressure = 0,
        wind_speed_10m: windSpeed10m = 0,
        wind_direction_10m: windDirection10m = 0,
        wind_gusts_10m: windGusts10m = 0
    } = weatherData.current || {};

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const month = now.getMonth();

    const hourFactor = (hours >= 4 && hours < 8) ? -10 : (hours >= 12 && hours < 18) ? 6 : (hours >= 18 && hours < 24) ? 12 : 0;
    const monthFactor = (month >= 2 && month <= 4) ? 2 : (month >= 5 && month <= 7) ? 5 : (month >= 8 && month <= 10) ? 4 : 3;
    const temperatureFactor = (temperature > 20) ? 8 : (temperature > 10 || temperature < 0) ? 4 : -2;
    const precipitationFactor = (precipitation > 0) ? -1.5 : (cloudCover < 20) ? 2 : 0;
    const humidityFactor = (relativeHumidity > 80) ? -1 : (relativeHumidity < 30) ? 1 : 0;
    const windSpeedFactor = (windSpeed10m > 10) ? -0.5 : (windSpeed10m < 3) ? 0.5 : 0;
    const pressureMslFactor = (pressureMsl > 1015) ? 2 : (pressureMsl < 1000) ? 1 : 0;
    const surfacePressureFactor = (surfacePressure > 1015) ? 0.2 : (surfacePressure < 1000) ? 1.4 : 0;
    const apparentTemperatureFactor = (apparentTemperature > 25) ? 3 : (apparentTemperature < 0) ? -3 : 0;
    const dayFactor = isDay ? 1 : -1;
    const rainFactor = rain > 0 ? -1.5 : 0;
    const showersFactor = showers > 0 ? -1.5 : 0;
    const snowfallFactor = snowfall > 0 ? -2 : 0;
    const weatherCodeFactor = weatherCode === 0 ? 2 : -2;
    const windDirectionFactor = windDirection10m > 180 ? 0.5 : -0.5;
    const windGustsFactor = windGusts10m > 15 ? -1 : 0;

    const shortcutMultiplier = (hours == 11 && minutes >= 45 || hours == 12 && minutes <= 15) ? 5 : 1;
    const weekendMultiplier = (now.getDay() === 5 || now.getDay() === 0 || now.getDay() === 6) ? 2 : 1;

    const eventMultiplier = await getCurrentEventMultiplier();

    return eventMultiplier * weekendMultiplier * shortcutMultiplier * (hourFactor + monthFactor + temperatureFactor + precipitationFactor + humidityFactor + windSpeedFactor + pressureMslFactor + surfacePressureFactor + apparentTemperatureFactor + dayFactor + rainFactor + showersFactor + snowfallFactor + weatherCodeFactor + windDirectionFactor + windGustsFactor);
};

export default getPlutaValue;