import { Journey } from '../domain/Journey';
import { ZonePair } from '../domain/Zone';
import { Fare } from '../domain/Fare';
import { TimeService } from './TimeService';

/**
 * Service for calculating base fares based on zones and time
 */
export class FareCalculationService {
    private static readonly FARE_TABLE = new Map<string, { peak: number; offPeak: number }>([
        ['1-1', { peak: 30, offPeak: 25 }],
        ['1-2', { peak: 35, offPeak: 30 }],
        ['2-1', { peak: 35, offPeak: 30 }],
        ['2-2', { peak: 25, offPeak: 20 }],
    ]);

    /**
     * Calculates the base fare for a journey
     */
    static calculateBaseFare(journey: Journey): Fare {
        const zonePair = journey.getZonePair();
        const fareKey = zonePair.getKey();

        const fareData = this.FARE_TABLE.get(fareKey);
        if (!fareData) {
            throw new Error(`No fare data found for zone pair: ${fareKey}`);
        }

        const isPeak = TimeService.isPeakHour(journey);
        const amount = isPeak ? fareData.peak : fareData.offPeak;

        return Fare.fromAmount(amount);
    }

    /**
     * Gets the daily cap for a zone pair
     */
    static getDailyCap(zonePair: ZonePair): Fare {
        const capKey = zonePair.getKey();
        const dailyCaps = new Map<string, number>([
            ['1-1', 100],
            ['1-2', 120],
            ['2-1', 120],
            ['2-2', 80],
        ]);

        const cap = dailyCaps.get(capKey);
        if (!cap) {
            throw new Error(`No daily cap found for zone pair: ${capKey}`);
        }

        return Fare.fromAmount(cap);
    }

    /**
     * Gets the weekly cap for a zone pair
     */
    static getWeeklyCap(zonePair: ZonePair): Fare {
        const capKey = zonePair.getKey();
        const weeklyCaps = new Map<string, number>([
            ['1-1', 500],
            ['1-2', 600],
            ['2-1', 600],
            ['2-2', 400],
        ]);

        const cap = weeklyCaps.get(capKey);
        if (!cap) {
            throw new Error(`No weekly cap found for zone pair: ${capKey}`);
        }

        return Fare.fromAmount(cap);
    }

    /**
     * Determines the applicable zone pair for capping based on the farthest journey
     * The cap that is applicable for a day/week is based on the farthest journey
     */
    static getApplicableZonePairForCapping(zonePairs: ZonePair[]): ZonePair {
        if (zonePairs.length === 0) {
            throw new Error('No zone pairs provided for capping calculation');
        }

        // Find the zone pair that involves the highest zone number
        let maxZone = 0;
        let applicableZonePair = zonePairs[0];

        for (const zonePair of zonePairs) {
            const maxZoneInPair = zonePair.getMaxZone();
            if (maxZoneInPair > maxZone) {
                maxZone = maxZoneInPair;
                applicableZonePair = zonePair;
            }
        }

        return applicableZonePair;
    }
}
