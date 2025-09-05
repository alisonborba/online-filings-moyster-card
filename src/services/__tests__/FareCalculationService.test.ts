import { FareCalculationService } from '../FareCalculationService';
import { Journey } from '../../domain/Journey';
import { Zone, ZonePair } from '../../domain/Zone';
import { Fare } from '../../domain/Fare';

describe('FareCalculationService', () => {
    describe('calculateBaseFare', () => {
        describe('peak hours', () => {
            it('should calculate correct peak fare for 1-1', () => {
                const journey = new Journey(
                    new Date('2024-01-15T08:00:00Z'), // Monday 08:00 (peak)
                    Zone.ZONE_1,
                    Zone.ZONE_1
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(30);
            });

            it('should calculate correct peak fare for 1-2', () => {
                const journey = new Journey(
                    new Date('2024-01-15T08:00:00Z'), // Monday 08:00 (peak)
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(35);
            });

            it('should calculate correct peak fare for 2-1', () => {
                const journey = new Journey(
                    new Date('2024-01-15T08:00:00Z'), // Monday 08:00 (peak)
                    Zone.ZONE_2,
                    Zone.ZONE_1
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(35);
            });

            it('should calculate correct peak fare for 2-2', () => {
                const journey = new Journey(
                    new Date('2024-01-15T08:00:00Z'), // Monday 08:00 (peak)
                    Zone.ZONE_2,
                    Zone.ZONE_2
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(25);
            });
        });

        describe('off-peak hours', () => {
            it('should calculate correct off-peak fare for 1-1', () => {
                const journey = new Journey(
                    new Date('2024-01-15T12:00:00Z'), // Monday 12:00 (off-peak)
                    Zone.ZONE_1,
                    Zone.ZONE_1
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(25);
            });

            it('should calculate correct off-peak fare for 1-2', () => {
                const journey = new Journey(
                    new Date('2024-01-15T12:00:00Z'), // Monday 12:00 (off-peak)
                    Zone.ZONE_1,
                    Zone.ZONE_2
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(30);
            });

            it('should calculate correct off-peak fare for 2-1', () => {
                const journey = new Journey(
                    new Date('2024-01-15T12:00:00Z'), // Monday 12:00 (off-peak)
                    Zone.ZONE_2,
                    Zone.ZONE_1
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(30);
            });

            it('should calculate correct off-peak fare for 2-2', () => {
                const journey = new Journey(
                    new Date('2024-01-15T12:00:00Z'), // Monday 12:00 (off-peak)
                    Zone.ZONE_2,
                    Zone.ZONE_2
                );

                const fare = FareCalculationService.calculateBaseFare(journey);
                expect(fare.amount).toBe(20);
            });
        });
    });

    describe('getDailyCap', () => {
        it('should return correct daily cap for 1-1', () => {
            const zonePair = new ZonePair(Zone.ZONE_1, Zone.ZONE_1);
            const cap = FareCalculationService.getDailyCap(zonePair);
            expect(cap.amount).toBe(100);
        });

        it('should return correct daily cap for 1-2', () => {
            const zonePair = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);
            const cap = FareCalculationService.getDailyCap(zonePair);
            expect(cap.amount).toBe(120);
        });

        it('should return correct daily cap for 2-1', () => {
            const zonePair = new ZonePair(Zone.ZONE_2, Zone.ZONE_1);
            const cap = FareCalculationService.getDailyCap(zonePair);
            expect(cap.amount).toBe(120);
        });

        it('should return correct daily cap for 2-2', () => {
            const zonePair = new ZonePair(Zone.ZONE_2, Zone.ZONE_2);
            const cap = FareCalculationService.getDailyCap(zonePair);
            expect(cap.amount).toBe(80);
        });
    });

    describe('getWeeklyCap', () => {
        it('should return correct weekly cap for 1-1', () => {
            const zonePair = new ZonePair(Zone.ZONE_1, Zone.ZONE_1);
            const cap = FareCalculationService.getWeeklyCap(zonePair);
            expect(cap.amount).toBe(500);
        });

        it('should return correct weekly cap for 1-2', () => {
            const zonePair = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);
            const cap = FareCalculationService.getWeeklyCap(zonePair);
            expect(cap.amount).toBe(600);
        });

        it('should return correct weekly cap for 2-1', () => {
            const zonePair = new ZonePair(Zone.ZONE_2, Zone.ZONE_1);
            const cap = FareCalculationService.getWeeklyCap(zonePair);
            expect(cap.amount).toBe(600);
        });

        it('should return correct weekly cap for 2-2', () => {
            const zonePair = new ZonePair(Zone.ZONE_2, Zone.ZONE_2);
            const cap = FareCalculationService.getWeeklyCap(zonePair);
            expect(cap.amount).toBe(400);
        });
    });

    describe('getApplicableZonePairForCapping', () => {
        it('should return zone pair with highest zone for capping', () => {
            const zonePairs = [
                new ZonePair(Zone.ZONE_1, Zone.ZONE_1),
                new ZonePair(Zone.ZONE_1, Zone.ZONE_2),
                new ZonePair(Zone.ZONE_2, Zone.ZONE_2)
            ];

            const applicable = FareCalculationService.getApplicableZonePairForCapping(zonePairs);
            expect(applicable.getKey()).toBe('1-2'); // Should be 1-2 as it involves zone 2
        });

        it('should return single zone pair when only one provided', () => {
            const zonePairs = [new ZonePair(Zone.ZONE_1, Zone.ZONE_1)];
            const applicable = FareCalculationService.getApplicableZonePairForCapping(zonePairs);
            expect(applicable.getKey()).toBe('1-1');
        });

        it('should throw error for empty array', () => {
            expect(() => {
                FareCalculationService.getApplicableZonePairForCapping([]);
            }).toThrow('No zone pairs provided for capping calculation');
        });
    });
});
