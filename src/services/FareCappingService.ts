import { Journey } from '../domain/Journey';
import { ZonePair } from '../domain/Zone';
import { Fare } from '../domain/Fare';
import { FareCalculationService } from './FareCalculationService';
import { isSameDay, startOfWeek, endOfWeek } from 'date-fns';

/**
 * Service for handling fare capping logic
 */
export class FareCappingService {
    /**
     * Applies daily capping to a list of journeys
     */
    static applyDailyCapping(journeys: Journey[]): Map<string, Fare> {
        const dailyFares = new Map<string, Fare>();
        const journeysByDate = this.groupJourneysByDate(journeys);

        for (const [dateKey, dayJourneys] of journeysByDate) {
            const zonePairs = dayJourneys.map(j => j.getZonePair());
            const applicableZonePair = FareCalculationService.getApplicableZonePairForCapping(zonePairs);
            const dailyCap = FareCalculationService.getDailyCap(applicableZonePair);

            let totalFareForDay = Fare.zero();
            const cappedFares = new Map<string, Fare>();

            for (const journey of dayJourneys) {
                const baseFare = FareCalculationService.calculateBaseFare(journey);
                const journeyKey = this.getJourneyKey(journey);

                // Check if we've already hit the daily cap
                if (totalFareForDay.isGreaterThan(dailyCap) || totalFareForDay.equals(dailyCap)) {
                    cappedFares.set(journeyKey, Fare.zero());
                } else {
                    const remainingCap = dailyCap.subtract(totalFareForDay);
                    const cappedFare = baseFare.min(remainingCap);
                    cappedFares.set(journeyKey, cappedFare);
                    totalFareForDay = totalFareForDay.add(cappedFare);
                }
            }

            // Store the total fare for this day
            dailyFares.set(dateKey, totalFareForDay);
        }

        return dailyFares;
    }

    /**
     * Applies weekly capping to daily fares
     */
    static applyWeeklyCapping(dailyFares: Map<string, Fare>, journeys: Journey[]): Map<string, Fare> {
        const weeklyFares = new Map<string, Fare>();
        const journeysByWeek = this.groupJourneysByWeek(journeys);

        for (const [weekKey, weekJourneys] of journeysByWeek) {
            const zonePairs = weekJourneys.map(j => j.getZonePair());
            const applicableZonePair = FareCalculationService.getApplicableZonePairForCapping(zonePairs);
            const weeklyCap = FareCalculationService.getWeeklyCap(applicableZonePair);

            let totalFareForWeek = Fare.zero();
            const weeklyCappedFares = new Map<string, Fare>();

            // Get all daily fares for this week
            const weekDailyFares = new Map<string, Fare>();
            for (const [dateKey, dailyFare] of dailyFares) {
                const journeyDate = new Date(dateKey);
                const weekStart = startOfWeek(journeyDate, { weekStartsOn: 1 }); // Monday
                const weekEnd = endOfWeek(journeyDate, { weekStartsOn: 1 }); // Sunday

                if (journeyDate >= weekStart && journeyDate <= weekEnd) {
                    weekDailyFares.set(dateKey, dailyFare);
                }
            }

            // Apply weekly capping
            for (const [dateKey, dailyFare] of weekDailyFares) {
                if (totalFareForWeek.isGreaterThan(weeklyCap) || totalFareForWeek.equals(weeklyCap)) {
                    weeklyCappedFares.set(dateKey, Fare.zero());
                } else {
                    const remainingWeeklyCap = weeklyCap.subtract(totalFareForWeek);
                    const weeklyCappedDailyFare = dailyFare.min(remainingWeeklyCap);
                    weeklyCappedFares.set(dateKey, weeklyCappedDailyFare);
                    totalFareForWeek = totalFareForWeek.add(weeklyCappedDailyFare);
                }
            }

            // Store the weekly capped fares
            for (const [dateKey, fare] of weeklyCappedFares) {
                weeklyFares.set(dateKey, fare);
            }
        }

        return weeklyFares;
    }

    /**
     * Groups journeys by date
     */
    private static groupJourneysByDate(journeys: Journey[]): Map<string, Journey[]> {
        const grouped = new Map<string, Journey[]>();

        for (const journey of journeys) {
            const dateKey = journey.getDate().toISOString().split('T')[0];
            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, []);
            }
            grouped.get(dateKey)!.push(journey);
        }

        return grouped;
    }

    /**
     * Groups journeys by week (Monday to Sunday)
     */
    private static groupJourneysByWeek(journeys: Journey[]): Map<string, Journey[]> {
        const grouped = new Map<string, Journey[]>();

        for (const journey of journeys) {
            const weekStart = startOfWeek(journey.dateTime, { weekStartsOn: 1 }); // Monday
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!grouped.has(weekKey)) {
                grouped.set(weekKey, []);
            }
            grouped.get(weekKey)!.push(journey);
        }

        return grouped;
    }

    /**
     * Generates a unique key for a journey
     */
    private static getJourneyKey(journey: Journey): string {
        return `${journey.dateTime.toISOString()}-${journey.fromZone}-${journey.toZone}`;
    }
}
