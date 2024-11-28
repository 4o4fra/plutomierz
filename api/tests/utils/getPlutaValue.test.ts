import {expect} from 'chai';
import sinon from 'sinon';
import getPlutaValue from '../../src/utils/getPlutaValue';
import * as weatherModule from '../../src/utils/getWeatherData';
import * as eventModule from '../../src/utils/getCurrentEventMultiplier';

describe('getPlutaValue - tests for every hour of the year', () => {
    let getWeatherDataStub: sinon.SinonStub;
    let getCurrentEventMultiplierStub: sinon.SinonStub;
    let clock: sinon.SinonFakeTimers;

    let minEver = Number.POSITIVE_INFINITY;
    let maxEver = Number.NEGATIVE_INFINITY;
    let totalSum = 0;
    let totalCount = 0;

    beforeEach(() => {
        getWeatherDataStub = sinon.stub(weatherModule, 'default');
        getCurrentEventMultiplierStub = sinon.stub(eventModule, 'default');
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        sinon.restore();
    });

    const testCases = [];
    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
            for (let hour = 0; hour < 24; hour++) {
                testCases.push({month, day, hour});
            }
        }
    }

    testCases.forEach(({month, day, hour}) => {
        it(`should log min/max/avg value for month ${month + 1}, day ${day}, and hour ${hour}`, async () => {
            clock.setSystemTime(new Date(2023, month, day, hour, 0, 0));
            getWeatherDataStub.resolves({
                current: {
                    temperature_2m: 5,
                    relative_humidity_2m: 50,
                    apparent_temperature: 5,
                    is_day: 0,
                    precipitation: 100,
                    rain: 100,
                    showers: 100,
                    snowfall: 0,
                    weather_code: 2,
                    cloud_cover: 100,
                    pressure_msl: 0,
                    surface_pressure: 1005,
                    wind_speed_10m: 20,
                    wind_direction_10m: 200,
                    wind_gusts_10m: 50
                }
            });
            getCurrentEventMultiplierStub.resolves(1);

            const minResult = await getPlutaValue(0, 0);

            getWeatherDataStub.resolves({
                current: {
                    temperature_2m: 50,
                    relative_humidity_2m: 0,
                    apparent_temperature: 50,
                    is_day: 1,
                    precipitation: 0,
                    rain: 0,
                    showers: 0,
                    snowfall: 0,
                    weather_code: 0,
                    cloud_cover: 0,
                    pressure_msl: 1020,
                    surface_pressure: 1020,
                    wind_speed_10m: 0,
                    wind_direction_10m: 0,
                    wind_gusts_10m: 20
                }
            });

            const maxResult = await getPlutaValue(0, 0);

            const avgResult = (minResult + maxResult) / 2;

            minEver = Math.min(minEver, minResult);
            maxEver = Math.max(maxEver, maxResult);
            totalSum += avgResult;
            totalCount++;

            expect(minResult).to.be.a('number');
            expect(maxResult).to.be.a('number');
        });
    });

    after(() => {
        const overallAvg = totalSum / totalCount;
        console.log(`Min Ever: ${minEver}, Max Ever: ${maxEver}, Avg Ever: ${overallAvg}`);
    });
});