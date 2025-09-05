import { Journey } from './domain/Journey';
import { Fare, FareCalculationResult } from './domain/Fare';
import { FareCalculationService } from './services/FareCalculationService';
import { FareCappingService } from './services/FareCappingService';

/**
 * Main fare calculation engine for MoysterCard
 */
export class FareCalculationEngine {
    /**
     * Calculates the total fare for a list of journeys
     */
    calculateFare(journeys: Journey[]): FareCalculationResult {
        if (journeys.length === 0) {
            return new FareCalculationResult(
                Fare.zero(),
                new Map(),
                new Map(),
                new Map()
            );
        }

        // Sort journeys by date and time
        const sortedJourneys = [...journeys].sort((a, b) =>
            a.dateTime.getTime() - b.dateTime.getTime()
        );

        // Apply daily capping
        const dailyCaps = FareCappingService.applyDailyCapping(sortedJourneys);

        // Apply weekly capping
        const weeklyCaps = FareCappingService.applyWeeklyCapping(dailyCaps, sortedJourneys);

        // Calculate individual journey fares with capping applied
        const journeyFares = this.calculateIndividualJourneyFares(sortedJourneys, weeklyCaps);

        // Calculate total fare
        const totalFare = this.calculateTotalFare(journeyFares);

        return new FareCalculationResult(
            totalFare,
            dailyCaps,
            weeklyCaps,
            journeyFares
        );
    }

    /**
     * Calculates individual journey fares with capping applied
     */
    private calculateIndividualJourneyFares(
        journeys: Journey[],
        weeklyCaps: Map<string, Fare>
    ): Map<string, Fare> {
        const journeyFares = new Map<string, Fare>();
        const dailyTotals = new Map<string, Fare>();
        const weeklyTotals = new Map<string, Fare>();

        // Group journeys by week to determine applicable zone pair for weekly capping
        const journeysByWeek = this.groupJourneysByWeek(journeys);
        const weeklyZonePairs = new Map<string, any>();

        for (const [weekKey, weekJourneys] of journeysByWeek) {
            const zonePairs = weekJourneys.map(j => j.getZonePair());
            const applicableZonePair = FareCalculationService.getApplicableZonePairForCapping(zonePairs);
            weeklyZonePairs.set(weekKey, applicableZonePair);
        }

        for (const journey of journeys) {
            const dateKey = journey.getDate().toISOString().split('T')[0];
            const weekStart = this.getWeekStart(journey.dateTime);
            const weekKey = weekStart.toISOString().split('T')[0];

            const baseFare = FareCalculationService.calculateBaseFare(journey);
            const journeyKey = this.getJourneyKey(journey);

            // Get current daily total
            const currentDailyTotal = dailyTotals.get(dateKey) || Fare.zero();

            // Get current weekly total
            const currentWeeklyTotal = weeklyTotals.get(weekKey) || Fare.zero();

            // Get daily cap for this journey's zone pair
            const zonePair = journey.getZonePair();
            const dailyCap = FareCalculationService.getDailyCap(zonePair);

            // Get weekly cap for the applicable zone pair for this week
            const weeklyZonePair = weeklyZonePairs.get(weekKey);
            const weeklyCap = FareCalculationService.getWeeklyCap(weeklyZonePair);

            // Calculate remaining daily cap
            const remainingDailyCap = dailyCap.subtract(currentDailyTotal);

            // Calculate remaining weekly cap
            const remainingWeeklyCap = weeklyCap.subtract(currentWeeklyTotal);

            // Apply daily capping first
            const dailyCappedFare = baseFare.min(remainingDailyCap);

            // Then apply weekly capping
            const weeklyCappedFare = dailyCappedFare.min(remainingWeeklyCap);

            journeyFares.set(journeyKey, weeklyCappedFare);

            // Update daily and weekly totals
            dailyTotals.set(dateKey, currentDailyTotal.add(weeklyCappedFare));
            weeklyTotals.set(weekKey, currentWeeklyTotal.add(weeklyCappedFare));
        }

        return journeyFares;
    }

    /**
     * Calculates the total fare from individual journey fares
     */
    private calculateTotalFare(journeyFares: Map<string, Fare>): Fare {
        let total = Fare.zero();
        for (const fare of journeyFares.values()) {
            total = total.add(fare);
        }
        return total;
    }

    /**
     * Groups journeys by week (Monday to Sunday)
     */
    private groupJourneysByWeek(journeys: Journey[]): Map<string, Journey[]> {
        const grouped = new Map<string, Journey[]>();

        for (const journey of journeys) {
            const weekStart = this.getWeekStart(journey.dateTime);
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!grouped.has(weekKey)) {
                grouped.set(weekKey, []);
            }
            grouped.get(weekKey)!.push(journey);
        }

        return grouped;
    }

    /**
     * Gets the start of the week (Monday) for a given date
     */
    private getWeekStart(date: Date): Date {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const weekStart = new Date(date);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }

    /**
     * Generates a unique key for a journey
     */
    private getJourneyKey(journey: Journey): string {
        return `${journey.dateTime.toISOString()}-${journey.fromZone}-${journey.toZone}`;
    }
}
