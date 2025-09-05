import { Journey } from '../domain/Journey';

/**
 * Service for determining peak/off-peak hours
 */
export class TimeService {
    /**
     * Checks if a journey is during peak hours
     */
    static isPeakHour(journey: Journey): boolean {
        if (journey.isWeekday()) {
            return this.isWeekdayPeakHour(journey);
        } else {
            return this.isWeekendPeakHour(journey);
        }
    }

    /**
     * Checks if a journey is during weekday peak hours
     * Monday - Friday 07:00 - 10:30, 17:00 - 20:00
     */
    private static isWeekdayPeakHour(journey: Journey): boolean {
        const timeInMinutes = journey.getTimeInMinutes();

        // 07:00 - 10:30 (420 - 630 minutes)
        const morningPeakStart = 7 * 60; // 420 minutes
        const morningPeakEnd = 10 * 60 + 30; // 630 minutes

        // 17:00 - 20:00 (1020 - 1200 minutes)
        const eveningPeakStart = 17 * 60; // 1020 minutes
        const eveningPeakEnd = 20 * 60; // 1200 minutes

        return (timeInMinutes >= morningPeakStart && timeInMinutes <= morningPeakEnd) ||
            (timeInMinutes >= eveningPeakStart && timeInMinutes <= eveningPeakEnd);
    }

    /**
     * Checks if a journey is during weekend peak hours
     * Saturday - Sunday 09:00 - 11:00, 18:00 - 22:00
     */
    private static isWeekendPeakHour(journey: Journey): boolean {
        const timeInMinutes = journey.getTimeInMinutes();

        // 09:00 - 11:00 (540 - 660 minutes)
        const morningPeakStart = 9 * 60; // 540 minutes
        const morningPeakEnd = 11 * 60; // 660 minutes

        // 18:00 - 22:00 (1080 - 1320 minutes)
        const eveningPeakStart = 18 * 60; // 1080 minutes
        const eveningPeakEnd = 22 * 60; // 1320 minutes

        return (timeInMinutes >= morningPeakStart && timeInMinutes <= morningPeakEnd) ||
            (timeInMinutes >= eveningPeakStart && timeInMinutes <= eveningPeakEnd);
    }

    /**
     * Checks if a journey is during off-peak hours
     */
    static isOffPeakHour(journey: Journey): boolean {
        return !this.isPeakHour(journey);
    }
}
