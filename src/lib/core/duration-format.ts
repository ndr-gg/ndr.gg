import {Duration} from "luxon";

export const toAbsHumanDuration = (start: any, end: any): string => {
    // Better Duration.toHuman support https://github.com/moment/luxon/issues/1134
    const duration = end.diff(start).shiftTo('days', 'hours', 'minutes', 'seconds').toObject();
    const prefix = start > end ? 'in ' : '';
    const suffix = end > start ? ' ago' : '';

    if ('seconds' in duration) {
        duration.seconds = Math.round(duration.seconds!);
    }

    const cleanedDuration = Object.fromEntries(
        Object.entries(duration)
            .filter(([_key, value]) => value !== 0)
            .map(([key, value]) => [key, Math.abs(value as number)])
    );

    if (Object.keys(cleanedDuration).length === 0) {
        cleanedDuration.seconds = 0;
    }

    const human = Duration.fromObject(cleanedDuration).toHuman();
    return `${prefix}${human}${suffix}`;
};