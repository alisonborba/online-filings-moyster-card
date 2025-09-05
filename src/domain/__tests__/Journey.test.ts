import { Journey } from '../Journey';
import { Zone } from '../Zone';

describe('Journey', () => {
    describe('fromData', () => {
        it('should create journey from string date', () => {
            const data = {
                dateTime: '2024-01-15T10:30:00Z',
                fromZone: 1,
                toZone: 2
            };

            const journey = Journey.fromData(data);

            expect(journey.fromZone).toBe(Zone.ZONE_1);
            expect(journey.toZone).toBe(Zone.ZONE_2);
            expect(journey.dateTime).toEqual(new Date('2024-01-15T10:30:00Z'));
        });

        it('should create journey from Date object', () => {
            const date = new Date('2024-01-15T10:30:00Z');
            const data = {
                dateTime: date,
                fromZone: 1,
                toZone: 2
            };

            const journey = Journey.fromData(data);

            expect(journey.fromZone).toBe(Zone.ZONE_1);
            expect(journey.toZone).toBe(Zone.ZONE_2);
            expect(journey.dateTime).toBe(date);
        });
    });

    describe('getZonePair', () => {
        it('should return correct zone pair', () => {
            const journey = new Journey(new Date(), Zone.ZONE_1, Zone.ZONE_2);
            const zonePair = journey.getZonePair();

            expect(zonePair.from).toBe(Zone.ZONE_1);
            expect(zonePair.to).toBe(Zone.ZONE_2);
        });
    });

    describe('getDate', () => {
        it('should return date without time', () => {
            const dateTime = new Date('2024-01-15T14:30:45Z');
            const journey = new Journey(dateTime, Zone.ZONE_1, Zone.ZONE_2);
            const date = journey.getDate();

            expect(date.getHours()).toBe(0);
            expect(date.getMinutes()).toBe(0);
            expect(date.getSeconds()).toBe(0);
            expect(date.getMilliseconds()).toBe(0);
        });
    });

    describe('getDayOfWeek', () => {
        it('should return correct day of week', () => {
            // Monday
            const monday = new Date('2024-01-15T10:30:00Z');
            const journey1 = new Journey(monday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey1.getDayOfWeek()).toBe(1);

            // Sunday
            const sunday = new Date('2024-01-14T10:30:00Z');
            const journey2 = new Journey(sunday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey2.getDayOfWeek()).toBe(0);
        });
    });

    describe('getTimeInMinutes', () => {
        it('should return correct time in minutes', () => {
            const dateTime = new Date('2024-01-15T14:30:00Z');
            const journey = new Journey(dateTime, Zone.ZONE_1, Zone.ZONE_2);

            expect(journey.getTimeInMinutes()).toBe(14 * 60 + 30); // 870 minutes
        });
    });

    describe('isWeekday', () => {
        it('should correctly identify weekdays', () => {
            // Monday
            const monday = new Date('2024-01-15T10:30:00Z');
            const journey1 = new Journey(monday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey1.isWeekday()).toBe(true);

            // Friday
            const friday = new Date('2024-01-19T10:30:00Z');
            const journey2 = new Journey(friday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey2.isWeekday()).toBe(true);

            // Saturday
            const saturday = new Date('2024-01-20T10:30:00Z');
            const journey3 = new Journey(saturday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey3.isWeekday()).toBe(false);

            // Sunday
            const sunday = new Date('2024-01-21T10:30:00Z');
            const journey4 = new Journey(sunday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey4.isWeekday()).toBe(false);
        });
    });

    describe('isWeekend', () => {
        it('should correctly identify weekends', () => {
            // Monday
            const monday = new Date('2024-01-15T10:30:00Z');
            const journey1 = new Journey(monday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey1.isWeekend()).toBe(false);

            // Saturday
            const saturday = new Date('2024-01-20T10:30:00Z');
            const journey2 = new Journey(saturday, Zone.ZONE_1, Zone.ZONE_2);
            expect(journey2.isWeekend()).toBe(true);
        });
    });
});
