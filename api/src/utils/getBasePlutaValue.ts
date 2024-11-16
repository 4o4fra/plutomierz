import getWeatherData from "./getWeatherData";

const getBasePlutaValue = async (latitude: number, longitude: number) => {
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
    const month = now.getMonth();

    const hourMultiplier = (hours >= 4 && hours < 8) ? -8 : (hours >= 12 && hours < 18) ? 4 : (hours >= 18 && hours < 24) ? 8 : 0;
    const monthMultiplier = (month >= 2 && month <= 4) ? 2 : (month >= 5 && month <= 7) ? 5 : (month >= 8 && month <= 10) ? 4 : 3;
    const temperatureMultiplier = (temperature > 20) ? 5 : (temperature > 10 || temperature < 0) ? 2 : 0;
    const precipitationMultiplier = (precipitation > 0) ? -1.5 : (cloudCover < 20) ? 2 : 0;
    const humidityMultiplier = (relativeHumidity > 80) ? -1 : (relativeHumidity < 30) ? 1 : 0;
    const windSpeedMultiplier = (windSpeed10m > 10) ? -0.5 : (windSpeed10m < 3) ? 0.5 : 0;
    const pressureMslMultiplier = (pressureMsl > 1015) ? 0.2 : (pressureMsl < 1000) ? 1.4 : 0;
    const surfacePressureMultiplier = (surfacePressure > 1015) ? 0.2 : (surfacePressure < 1000) ? 1.4 : 0;
    const apparentTemperatureMultiplier = (apparentTemperature > 25) ? 3 : (apparentTemperature < 0) ? -3 : 0;
    const dayMultiplier = isDay ? 1 : -1;
    const rainMultiplier = rain > 0 ? -1.5 : 0;
    const showersMultiplier = showers > 0 ? -1.5 : 0;
    const snowfallMultiplier = snowfall > 0 ? -2 : 0;
    const weatherCodeMultiplier = weatherCode === 0 ? 2 : -2;
    const windDirectionMultiplier = windDirection10m > 180 ? 0.5 : -0.5;
    const windGustsMultiplier = windGusts10m > 15 ? -1 : 0;

    return hourMultiplier + monthMultiplier + temperatureMultiplier + precipitationMultiplier + humidityMultiplier + windSpeedMultiplier + pressureMslMultiplier + surfacePressureMultiplier + apparentTemperatureMultiplier + dayMultiplier + rainMultiplier + showersMultiplier + snowfallMultiplier + weatherCodeMultiplier + windDirectionMultiplier + windGustsMultiplier;
};

export default getBasePlutaValue;