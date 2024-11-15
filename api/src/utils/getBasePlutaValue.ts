import getWeatherData from "./getWeatherData";

const getBasePlutaValue = async (latitude: number, longitude: number) => {
    const weatherData = await getWeatherData(latitude, longitude);
    const temperature = weatherData.current?.temperature_2m ?? 0;
    const relativeHumidity = weatherData.current?.relative_humidity_2m ?? 0;
    const apparentTemperature = weatherData.current?.apparent_temperature ?? 0;
    const isDay = weatherData.current?.is_day ?? 0;
    const precipitation = weatherData.current?.precipitation ?? 0;
    const rain = weatherData.current?.rain ?? 0;
    const showers = weatherData.current?.showers ?? 0;
    const snowfall = weatherData.current?.snowfall ?? 0;
    const weatherCode = weatherData.current?.weather_code ?? 0;
    const cloudCover = weatherData.current?.cloud_cover ?? 0;
    const pressureMsl = weatherData.current?.pressure_msl ?? 0;
    const surfacePressure = weatherData.current?.surface_pressure ?? 0;
    const windSpeed10m = weatherData.current?.wind_speed_10m ?? 0;
    const windDirection10m = weatherData.current?.wind_direction_10m ?? 0;
    const windGusts10m = weatherData.current?.wind_gusts_10m ?? 0;

    console.log(temperature, relativeHumidity, apparentTemperature, isDay, precipitation, rain, showers, snowfall, weatherCode, cloudCover, pressureMsl, surfacePressure, windSpeed10m, windDirection10m, windGusts10m);

    const now = new Date();
    const hours = now.getHours();
    const month = now.getMonth();

    let basePluta = 0;

    if (hours >= 4 && hours < 8) {
        basePluta -= 8;
    } else if (hours >= 12 && hours < 18) {
        basePluta += 4;
    } else if (hours >= 18 && hours < 24) {
        basePluta += 8;
    }

    if (month >= 2 && month <= 4) {
        basePluta += 2;
    } else if (month >= 5 && month <= 7) {
        basePluta += 5;
    } else if (month >= 8 && month <= 10) {
        basePluta += 4;
    } else {
        basePluta += 3;
    }

    if (temperature > 20) {
        basePluta += 5;
    } else if (temperature > 10 || temperature < 0) {
        basePluta += 2;
    }

    if (precipitation > 0) {
        basePluta -= 1.5;
    } else if (cloudCover < 20) {
        basePluta += 2;
    }

    if (relativeHumidity > 80) {
        basePluta -= 1;
    } else if (relativeHumidity < 30) {
        basePluta += 1;
    }

    if (windSpeed10m > 10) {
        basePluta -= 0.5;
    } else if (windSpeed10m < 3) {
        basePluta += 0.5;
    }

    if (pressureMsl > 1015) {
        basePluta += 0.2;
    } else if (pressureMsl < 1000) {
        basePluta += 1.4;
    }

    if (surfacePressure > 1015) {
        basePluta += 0.2;
    } else if (surfacePressure < 1000) {
        basePluta += 1.4;
    }

    if (apparentTemperature > 25) {
        basePluta += 3;
    } else if (apparentTemperature < 0) {
        basePluta -= 3;
    }

    if (isDay) {
        basePluta += 1;
    } else {
        basePluta -= 1;
    }

    if (rain > 0) {
        basePluta -= 1.5;
    }

    if (showers > 0) {
        basePluta -= 1.5;
    }

    if (snowfall > 0) {
        basePluta -= 2;
    }

    if (weatherCode === 0) {
        basePluta += 2;
    } else if (weatherCode > 0) {
        basePluta -= 2;
    }

    if (windDirection10m > 180) {
        basePluta += 0.5;
    } else {
        basePluta -= 0.5;
    }

    if (windGusts10m > 15) {
        basePluta -= 1;
    }

    return basePluta;
};

export default getBasePlutaValue;