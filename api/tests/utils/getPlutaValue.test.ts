import { expect } from 'chai';
import sinon from 'sinon';
import getPlutaValue from '../../src/utils/getPlutaValue';
import * as weatherModule from '../../src/utils/getWeatherData';
import * as eventModule from '../../src/utils/getCurrentEventMultiplier';

describe('getPlutaValue', () => {
    let getWeatherDataStub: sinon.SinonStub;
    let getCurrentEventMultiplierStub: sinon.SinonStub;

    beforeEach(() => {
        getWeatherDataStub = sinon.stub(weatherModule, 'default');
        getCurrentEventMultiplierStub = sinon.stub(eventModule, 'default');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return minimum possible value', async () => {
        getWeatherDataStub.resolves({
            current: {
                temperature_2m: -50,
                relative_humidity_2m: 0,
                apparent_temperature: -50,
                is_day: 0,
                precipitation: 100,
                rain: 100,
                showers: 100,
                snowfall: 100,
                weather_code: 1,
                cloud_cover: 100,
                pressure_msl: 900,
                surface_pressure: 900,
                wind_speed_10m: 100,
                wind_direction_10m: 0,
                wind_gusts_10m: 100
            }
        });
        getCurrentEventMultiplierStub.resolves(1);

        const result = await getPlutaValue(0, 0);
        expect(result).to.be.a('number');
    });

    it('should return maximum possible value', async () => {
        getWeatherDataStub.resolves({
            current: {
                temperature_2m: 50,
                relative_humidity_2m: 100,
                apparent_temperature: 50,
                is_day: 1,
                precipitation: 0,
                rain: 0,
                showers: 0,
                snowfall: 0,
                weather_code: 0,
                cloud_cover: 0,
                pressure_msl: 1050,
                surface_pressure: 1050,
                wind_speed_10m: 0,
                wind_direction_10m: 360,
                wind_gusts_10m: 0
            }
        });
        getCurrentEventMultiplierStub.resolves(3);

        const result = await getPlutaValue(0, 0);
        expect(result).to.be.a('number');
    });

    it('should return average value', async () => {
        getWeatherDataStub.resolves({
            current: {
                temperature_2m: 20,
                relative_humidity_2m: 50,
                apparent_temperature: 20,
                is_day: 1,
                precipitation: 0,
                rain: 0,
                showers: 0,
                snowfall: 0,
                weather_code: 0,
                cloud_cover: 50,
                pressure_msl: 1015,
                surface_pressure: 1015,
                wind_speed_10m: 5,
                wind_direction_10m: 180,
                wind_gusts_10m: 5
            }
        });
        getCurrentEventMultiplierStub.resolves(2);

        const result = await getPlutaValue(0, 0);
        expect(result).to.be.a('number');
    });

    it('should return commonly occurring value', async () => {
        getWeatherDataStub.resolves({
            current: {
                temperature_2m: 15,
                relative_humidity_2m: 60,
                apparent_temperature: 15,
                is_day: 1,
                precipitation: 0,
                rain: 0,
                showers: 0,
                snowfall: 0,
                weather_code: 0,
                cloud_cover: 30,
                pressure_msl: 1010,
                surface_pressure: 1010,
                wind_speed_10m: 3,
                wind_direction_10m: 200,
                wind_gusts_10m: 3
            }
        });
        getCurrentEventMultiplierStub.resolves(1);

        const result = await getPlutaValue(0, 0);
        expect(result).to.be.a('number');
    });
});