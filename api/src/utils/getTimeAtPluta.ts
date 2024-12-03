import {toZonedTime} from 'date-fns-tz';

const getTimeAtPluta = (): Date => {
    const timezone = 'Europe/Warsaw';
    const now = new Date();
    return toZonedTime(now, timezone);
};

export default getTimeAtPluta;