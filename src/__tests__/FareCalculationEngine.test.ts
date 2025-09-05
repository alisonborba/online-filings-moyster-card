import { FareCalculationEngine } from '../FareCalculationEngine';
import { Journey } from '../domain/Journey';
import { Zone } from '../domain/Zone';

describe('FareCalculationEngine', () => {
    let engine: FareCalculationEngine;

    beforeEach(() => {
        engine = new FareCalculationEngine();
    });

    describe('calculateFare', () => {
        it('should return zero fare for empty journey list', () => {
            const result = engine.calculateFare([]);
            expect(result.totalFare.amount).toBe(0);
            expect(result.journeyFares.size).toBe(0);
        });

        it('should calculate fare for single journey', () => {
            const journey = new Journey(
                new Date('2024-01-15T08:00:00Z'), // Monday 08:00 (peak)
                Zone.ZONE_1,
                Zone.ZONE_2
            );

            const result = engine.calculateFare([journey]);
            expect(result.totalFare.amount).toBe(35); // Peak fare for 1-2
        });

        it('should apply daily capping correctly', () => {
            // Create journeys that will exceed daily cap for 1-2 (120)
            const journeys = [
                new Journey(new Date('2024-01-15T08:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-15T09:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-15T10:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-15T11:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35 (total: 140, but capped at 120)
                new Journey(new Date('2024-01-15T12:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 0 (capped)
            ];

            const result = engine.calculateFare(journeys);
            expect(result.totalFare.amount).toBe(120); // Daily cap reached
        });

        it('should apply weekly capping correctly', () => {
            // Create journeys across a week that will exceed weekly cap for 1-2 (600)
            const journeys = [
                // Monday - 4 journeys at 35 each = 140, but daily cap is 120
                new Journey(new Date('2024-01-15T08:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-15T09:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-15T10:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-15T11:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 15 (capped to reach 120)

                // Tuesday - 4 journeys at 35 each = 140, but daily cap is 120
                new Journey(new Date('2024-01-16T08:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-16T09:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-16T10:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-16T11:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 15 (capped to reach 120)

                // Wednesday - 4 journeys at 35 each = 140, but daily cap is 120
                new Journey(new Date('2024-01-17T08:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-17T09:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-17T10:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-17T11:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 15 (capped to reach 120)

                // Thursday - 4 journeys at 35 each = 140, but daily cap is 120
                new Journey(new Date('2024-01-18T08:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-18T09:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-18T10:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-18T11:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 15 (capped to reach 120)

                // Friday - 2 journeys at 35 each = 70 (weekly cap reached)
                new Journey(new Date('2024-01-19T08:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35
                new Journey(new Date('2024-01-19T09:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 35 (total weekly: 580)

                // Saturday - should be free due to weekly cap
                new Journey(new Date('2024-01-20T08:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 20 (weekly cap reached at 600)
                new Journey(new Date('2024-01-20T09:00:00Z'), Zone.ZONE_2, Zone.ZONE_1), // 0 (weekly cap exceeded)
            ];

            const result = engine.calculateFare(journeys);
            expect(result.totalFare.amount).toBe(600); // Weekly cap reached
        });

        it('should handle mixed zone journeys correctly', () => {
            const journeys = [
                // Some 1-1 journeys (daily cap 100)
                new Journey(new Date('2024-01-15T08:00:00Z'), Zone.ZONE_1, Zone.ZONE_1), // 30
                new Journey(new Date('2024-01-15T09:00:00Z'), Zone.ZONE_1, Zone.ZONE_1), // 30
                new Journey(new Date('2024-01-15T10:00:00Z'), Zone.ZONE_1, Zone.ZONE_1), // 30

                // One 1-2 journey (changes daily cap to 120)
                new Journey(new Date('2024-01-15T11:00:00Z'), Zone.ZONE_1, Zone.ZONE_2), // 35

                // More 1-1 journeys (now under 1-2 daily cap)
                new Journey(new Date('2024-01-15T12:00:00Z'), Zone.ZONE_1, Zone.ZONE_1), // 25
                new Journey(new Date('2024-01-15T13:00:00Z'), Zone.ZONE_1, Zone.ZONE_1), // 25
            ];

            const result = engine.calculateFare(journeys);
            // Total should be: 30 + 30 + 30 + 35 + 25 + 25 = 175, but capped at 120
            expect(result.totalFare.amount).toBe(120);
        });

        it('should sort journeys by date and time', () => {
            const journeys = [
                new Journey(new Date('2024-01-15T10:00:00Z'), Zone.ZONE_1, Zone.ZONE_2), // 35
                new Journey(new Date('2024-01-15T08:00:00Z'), Zone.ZONE_1, Zone.ZONE_2), // 35
                new Journey(new Date('2024-01-15T09:00:00Z'), Zone.ZONE_1, Zone.ZONE_2), // 35
            ];

            const result = engine.calculateFare(journeys);
            // Should be sorted and daily cap applied (3 * 35 = 105, under cap of 120)
            expect(result.totalFare.amount).toBe(105);
        });
    });
});
