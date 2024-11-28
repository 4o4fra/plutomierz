import getWeatherData from "./getWeatherData";
import getCurrentEventMultiplier from "./getCurrentEventMultiplier";
import { group, time } from "console";

const getNewPlutaValue = async (latitude: number, longitude: number) => {
    const weatherData = await getWeatherData(latitude, longitude);
    const {
        temperature_2m: temperature = 0,
        relative_humidity_2m: relativeHumidity = 0,
        apparent_temperature: apparentTemperature = 0,
        is_day: isSunlight = 0,
        precipitation = 0,
        rain = 0,
        showers = 0,
        snowfall = 0,
        weather_code: weatherCode = 0,
        cloud_cover: cloudCover = 0,
        wind_speed_10m: windSpeed10m = 0,
        wind_direction_10m: windDirection10m = 0,
        wind_gusts_10m: windGusts10m = 0
    } = weatherData.current || {};

    const now = new Date();
    const seconds = now.getSeconds();

    // breaks
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeMultiplier = 20
    const timeBonus = calcTimeFactor(hours,minutes) * timeMultiplier

    // months
    const month = now.getMonth();
    const monthMultiplier = 10
    const monthBonus = calcMonthFactor(month) * monthMultiplier

    // sunlight
    const sunlightMultiplier = 5
    const sunlightBonus = isSunlight ? sunlightMultiplier : 0;


    const temperatureFactor = (temperature > 20) ? 15 : (temperature > 10 || temperature < 0) ? 10 : -10;
    const precipitationFactor = (precipitation > 0) ? -10 : (cloudCover < 20) ? 10 : 2;
    const humidityFactor = (relativeHumidity > 80) ? 0 : (relativeHumidity < 30) ? 3 : 2;
    const windSpeedFactor = (windSpeed10m > 10) ? -10 : (windSpeed10m < 3) ? 10 : 2;
    const apparentTemperatureFactor = (apparentTemperature > 25) ? 10 : (apparentTemperature < 0) ? 2 : -4;
    const rainFactor = rain > 0 ? -10 : 8;
    const showersFactor = showers > 0 ? -10 : 5;
    const snowfallFactor = snowfall > 0 ? 12 : -2;
    const weatherCodeFactor = weatherCode === 0 ? 5 : -2;
    const windDirectionFactor = windDirection10m > 180 ? 3 : 5;
    const windGustsFactor = windGusts10m > 15 ? -10 : 6;

    const weekendMultiplier = (now.getDay() === 5 || now.getDay() === 0 || now.getDay() === 6) ? 2 : 1;

    const eventMultiplier = await getCurrentEventMultiplier();

    return eventMultiplier * weekendMultiplier * (timeBonus + monthBonus + temperatureFactor + precipitationFactor + humidityFactor + windSpeedFactor + apparentTemperatureFactor + sunlightBonus + rainFactor + showersFactor + snowfallFactor + weatherCodeFactor + windDirectionFactor + windGustsFactor);
};

const calcTimeFactor = (hour: number, minute: number): number => {
    const godzina: number =  Number(String(hour)+String(minute))
    let factor: number = 0

    let przerwyBezDlugiej = [[805,815],[900,910],[955,1005],[1050,1100],[1250,1300],
                            [1345,1355],[1440,1450],[1535,1545]]

    // Między 11:45 a 12:00 jest max bonus
    if(1145<=godzina && godzina<=1200){
        factor = 1
    }

    // 10min przed i po długą przerwą mają duży bonus
    else if((1135<godzina && godzina<1145) || (1200<godzina && godzina<1215)){
        factor = 0.5
    }

    // bonus pluty na innych przerwach. Taki mniejszy
    else{
        for(const przerwa of przerwyBezDlugiej){
            if(przerwa[0] <= godzina && godzina <= przerwa[1]){
                factor = 0.25
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

export default getNewPlutaValue;
