import { Zone, ZonePair } from './Zone';

/**
 * Represents a single metro journey
 */
export class Journey {
    constructor(
        public readonly dateTime: Date,
        public readonly fromZone: Zone,
        public readonly toZone: Zone
    ) { }

    /**
     * Creates a journey from raw data
     */
    static fromData(data: {
        dateTime: string | Date;
        fromZone: number;
        toZone: number;
    }): Journey {
        const dateTime = typeof data.dateTime === 'string'
            ? new Date(data.dateTime)
            : data.dateTime;

        return new Journey(
            dateTime,
            data.fromZone as Zone,
            data.toZone as Zone
        );
    }

    /**
     * Gets the zone pair for this journey
     */
    getZonePair(): ZonePair {
        return new ZonePair(this.fromZone, this.toZone);
    }

    /**
     * Gets the date of this journey (without time)
     */
    getDate(): Date {
        const date = new Date(this.dateTime);
        // Use UTC methods to avoid timezone issues
        const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        return utcDate;
    }

    /**
     * Gets the day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
     */
    getDayOfWeek(): number {
        return this.dateTime.getDay();
    }

    /**
     * Gets the time in minutes since midnight
     */
    getTimeInMinutes(): number {
        return this.dateTime.getHours() * 60 + this.dateTime.getMinutes();
    }

    /**
     * Checks if this journey is on a weekday
     */
    isWeekday(): boolean {
        const day = this.getDayOfWeek();
        return day >= 1 && day <= 5; // Monday to Friday
    }

    /**
     * Checks if this journey is on a weekend
     */
    isWeekend(): boolean {
        return !this.isWeekday();
    }
}
