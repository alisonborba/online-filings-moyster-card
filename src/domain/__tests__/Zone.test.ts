import { Zone, ZonePair } from '../Zone';

describe('Zone', () => {
    describe('ZonePair', () => {
        it('should create a zone pair from zones', () => {
            const zonePair = ZonePair.fromZones(1, 2);
            expect(zonePair.from).toBe(Zone.ZONE_1);
            expect(zonePair.to).toBe(Zone.ZONE_2);
        });

        it('should generate correct key for zone pair', () => {
            const zonePair1 = new ZonePair(Zone.ZONE_1, Zone.ZONE_1);
            const zonePair2 = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);
            const zonePair3 = new ZonePair(Zone.ZONE_2, Zone.ZONE_1);
            const zonePair4 = new ZonePair(Zone.ZONE_2, Zone.ZONE_2);

            expect(zonePair1.getKey()).toBe('1-1');
            expect(zonePair2.getKey()).toBe('1-2');
            expect(zonePair3.getKey()).toBe('2-1');
            expect(zonePair4.getKey()).toBe('2-2');
        });

        it('should correctly identify cross-zone journeys', () => {
            const sameZone = new ZonePair(Zone.ZONE_1, Zone.ZONE_1);
            const crossZone = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);

            expect(sameZone.isCrossZone()).toBe(false);
            expect(crossZone.isCrossZone()).toBe(true);
        });

        it('should correctly identify max zone', () => {
            const zonePair1 = new ZonePair(Zone.ZONE_1, Zone.ZONE_1);
            const zonePair2 = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);
            const zonePair3 = new ZonePair(Zone.ZONE_2, Zone.ZONE_1);

            expect(zonePair1.getMaxZone()).toBe(Zone.ZONE_1);
            expect(zonePair2.getMaxZone()).toBe(Zone.ZONE_2);
            expect(zonePair3.getMaxZone()).toBe(Zone.ZONE_2);
        });

        it('should correctly identify zone involvement', () => {
            const zonePair1 = new ZonePair(Zone.ZONE_1, Zone.ZONE_1);
            const zonePair2 = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);
            const zonePair3 = new ZonePair(Zone.ZONE_2, Zone.ZONE_2);

            expect(zonePair1.involvesZone1()).toBe(true);
            expect(zonePair1.involvesZone2()).toBe(false);

            expect(zonePair2.involvesZone1()).toBe(true);
            expect(zonePair2.involvesZone2()).toBe(true);

            expect(zonePair3.involvesZone1()).toBe(false);
            expect(zonePair3.involvesZone2()).toBe(true);
        });

        it('should correctly compare zone pairs', () => {
            const zonePair1 = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);
            const zonePair2 = new ZonePair(Zone.ZONE_1, Zone.ZONE_2);
            const zonePair3 = new ZonePair(Zone.ZONE_2, Zone.ZONE_1);

            expect(zonePair1.equals(zonePair2)).toBe(true);
            expect(zonePair1.equals(zonePair3)).toBe(false);
        });
    });
});
