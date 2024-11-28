import getWeatherData from "./getWeatherData";
import getCurrentEventMultiplier from "./getCurrentEventMultiplier";

const getNewPlutaValue = async (latitude: number, longitude: number) => {
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
        wind_gusts_10m: windGusts10m = 0
    } = weatherData.current || {};

    const now = new Date();

    // breaks
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeMultiplier = 20
    const timeBonus = calcTimeFactor(hours,minutes) * timeMultiplier

    // days
    const dayMultiplier = 8
    const dayBonus = calcDayFactor(now.getDay()) * dayMultiplier

    // months
    const month = now.getMonth();
    const monthMultiplier = 10
    const monthBonus = calcMonthFactor(month) * monthMultiplier

    // sunlight
    const sunlightMultiplier = 5
    const sunlightBonus = isSunlight ? sunlightMultiplier : 0;

    // rain
    const rainMultiplier = 10
    const rainBonus = (rain > 1 ? 0 : 1-rain) * rainMultiplier;

    // shower
    const showersMultiplier = 5
    const showersBonus = (showers > 1 ? 0 : 1-showers) * showersMultiplier;

    // snow
    const snowMultiplier = 12;
    const snowBonus = (snowfall > 1 ? 1 : snowfall) * snowMultiplier;

    // temperature
    const temperatureMultiplier = 10
    const temperatureBonus = calcTempFactor(temperature)

    // easter egg, temperature anomaly
    const temperatureAnomalyMultiplier = 50
    const temperatureAnomalyBonus = apparentTemperature > temperature+5 ? temperatureAnomalyMultiplier : 0

    // clouds
    const cloudMultiplier = 5
    const cloudBonus = ((100 - cloudCover)/100) * cloudMultiplier

    // humidity
    const humidityMultiplier = 5
    const humidityBonus = ((100 - relativeHumidity)/100) * cloudMultiplier

    // weather code (sus)
    const codeMultiplier = 3
    const codeBonus = weatherCode/100*codeMultiplier

    // wind direction
    const windDirectionMultiplier = 5
    const windDirectionBonus = (0.5 - 0.5 * Math.cos((Math.PI / 90) * windDirection10m)) * windDirectionMultiplier;

    // wind speed
    const windSpeedMultiplier = 5
    const maxAccouncedWindSpeed = 25 // (m/s)
    const windSpeedBonus = (windSpeed10m > maxAccouncedWindSpeed ? 1 : windSpeed10m/maxAccouncedWindSpeed) * windSpeedMultiplier

    // wind gust
    const windGustsMultiplier = 5
    const maxAccouncedGustSpeed = 50 // (m/s)
    const windGustsBonus = (windGusts10m > maxAccouncedGustSpeed ? 1 : windGusts10m/maxAccouncedGustSpeed) * windGustsMultiplier;

    // random diviation
    const diviationMin = -2
    const diviationMax = 2
    const diviation = Math.random() * (diviationMax - diviationMin) + diviationMin

    //const eventMultiplier = await getCurrentEventMultiplier();
    //const maxPluty = timeMultiplier + dayMultiplier + monthMultiplier + sunlightMultiplier + rainMultiplier + showersMultiplier + snowMultiplier + temperatureMultiplier + cloudMultiplier + humidityMultiplier + codeMultiplier + windDirectionMultiplier + windSpeedMultiplier + windGustsMultiplier;
    const pluty = timeBonus + dayBonus + monthBonus + sunlightBonus + rainBonus + showersBonus + snowBonus + temperatureBonus + temperatureAnomalyBonus + cloudBonus + humidityBonus + codeBonus + windDirectionBonus + windSpeedBonus + windGustsBonus - diviation;
    //console.log(`Max Plut: ${maxPluty}`)
    //console.log(`Plut: ${pluty}`)

    return pluty;
};

const calcTimeFactor = (hour: number, minute: number): number => {
    const godzina: number =  Number(String(hour)+String(minute))
    let factor: number = 0

    let przerwyBezDlugiej = [[805,815],[900,910],[955,1005],[1050,1100],[1250,1300], [1345,1355],[1440,1450],[1535,1545]]

    // Between 11:45 and 12:00 is max bonus (long break)
    if(1145<=godzina && godzina<=1200){
        factor = 1
    }

    // 10min before the long break is a big bonus
    else if((1135<godzina && godzina<1145) || (1200<godzina && godzina<1215)){
        factor = 0.5
    }

    // on every other break there's a smaller boost
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

const calcDayFactor = (day: number): number => ({
    1: 0.75,
    2: 0,
    3: 1,
    4: 0.25,
    5: 0.75,
    6: 1,
    7: 1,
}[day] || 0);

const calcTempFactor = (temperature: number): number => {
    let cieplo: number = -(Math.abs((temperature-20)/20))+1
    let zimno: number = -(Math.abs((temperature-20)/20))+1

    zimno = zimno > 1 ? 1 : zimno
    cieplo = cieplo > 1 ? 1 : cieplo

    return cieplo > zimno ? cieplo : zimno
}

export default getNewPlutaValue;
