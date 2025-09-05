import { TimeService } from '../TimeService';
import { Journey } from '../../domain/Journey';
import { Zone } from '../../domain/Zone';

describe('TimeService', () => {
    describe('isPeakHour', () => {
        describe('weekday peak hours', () => {
            it('should identify morning peak hour (07:00 - 10:30)', () => {
                // Monday 08:00 - should be peak
                const journey1 = new Journey(
                    new Date('2024-01-15T08:00:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey1)).toBe(true);

                // Monday 10:30 - should be peak
                const journey2 = new Journey(
                    new Date('2024-01-15T10:30:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey2)).toBe(true);

                // Monday 07:00 - should be peak
                const journey3 = new Journey(
                    new Date('2024-01-15T07:00:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey3)).toBe(true);
            });

            it('should identify evening peak hour (17:00 - 20:00)', () => {
                // Monday 18:00 - should be peak
                const journey1 = new Journey(
                    new Date('2024-01-15T18:00:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey1)).toBe(true);

                // Monday 17:00 - should be peak
                const journey2 = new Journey(
                    new Date('2024-01-15T17:00:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey2)).toBe(true);

                // Monday 20:00 - should be peak
                const journey3 = new Journey(
                    new Date('2024-01-15T20:00:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey3)).toBe(true);
            });

            it('should identify off-peak hours on weekdays', () => {
                // Monday 06:59 - should be off-peak
                const journey1 = new Journey(
                    new Date('2024-01-15T06:59:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey1)).toBe(false);

                // Monday 10:31 - should be off-peak
                const journey2 = new Journey(
                    new Date('2024-01-15T10:31:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey2)).toBe(false);

                // Monday 16:59 - should be off-peak
                const journey3 = new Journey(
                    new Date('2024-01-15T16:59:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey3)).toBe(false);

                // Monday 20:01 - should be off-peak
                const journey4 = new Journey(
                    new Date('2024-01-15T20:01:00Z'), // Monday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey4)).toBe(false);
            });
        });

        describe('weekend peak hours', () => {
            it('should identify morning peak hour (09:00 - 11:00)', () => {
                // Saturday 10:00 - should be peak
                const journey1 = new Journey(
                    new Date('2024-01-20T10:00:00Z'), // Saturday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey1)).toBe(true);

                // Sunday 09:00 - should be peak
                const journey2 = new Journey(
                    new Date('2024-01-21T09:00:00Z'), // Sunday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey2)).toBe(true);

                // Sunday 11:00 - should be peak
                const journey3 = new Journey(
                    new Date('2024-01-21T11:00:00Z'), // Sunday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey3)).toBe(true);
            });

            it('should identify evening peak hour (18:00 - 22:00)', () => {
                // Saturday 19:00 - should be peak
                const journey1 = new Journey(
                    new Date('2024-01-20T19:00:00Z'), // Saturday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey1)).toBe(true);

                // Sunday 18:00 - should be peak
                const journey2 = new Journey(
                    new Date('2024-01-21T18:00:00Z'), // Sunday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey2)).toBe(true);

                // Sunday 22:00 - should be peak
                const journey3 = new Journey(
                    new Date('2024-01-21T22:00:00Z'), // Sunday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey3)).toBe(true);
            });

            it('should identify off-peak hours on weekends', () => {
                // Saturday 08:59 - should be off-peak
                const journey1 = new Journey(
                    new Date('2024-01-20T08:59:00Z'), // Saturday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey1)).toBe(false);

                // Saturday 11:01 - should be off-peak
                const journey2 = new Journey(
                    new Date('2024-01-20T11:01:00Z'), // Saturday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey2)).toBe(false);

                // Sunday 17:59 - should be off-peak
                const journey3 = new Journey(
                    new Date('2024-01-21T17:59:00Z'), // Sunday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey3)).toBe(false);

                // Sunday 22:01 - should be off-peak
                const journey4 = new Journey(
                    new Date('2024-01-21T22:01:00Z'), // Sunday
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );
                expect(TimeService.isPeakHour(journey4)).toBe(false);
            });
        });
    });

    describe('isOffPeakHour', () => {
        it('should return opposite of isPeakHour', () => {
            // Peak hour
            const peakJourney = new Journey(
                new Date('2024-01-15T08:00:00Z'), // Monday 08:00
                Zone.ZONE_1,
                Zone.ZONE_2
            );
            expect(TimeService.isOffPeakHour(peakJourney)).toBe(false);

            // Off-peak hour
            const offPeakJourney = new Journey(
                new Date('2024-01-15T12:00:00Z'), // Monday 12:00
                Zone.ZONE_1,
                Zone.ZONE_2
            );
            expect(TimeService.isOffPeakHour(offPeakJourney)).toBe(true);
        });
    });
});
