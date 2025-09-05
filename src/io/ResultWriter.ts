import { FareCalculationResult } from '../domain/Fare';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service for writing calculation results to files
 */
export class ResultWriter {
    /**
     * Writes the calculation result to a JSON file
     */
    static toJsonFile(result: FareCalculationResult, filePath: string): void {
        try {
            const output = {
                totalFare: result.totalFare.amount,
                dailyCaps: Object.fromEntries(result.dailyCaps),
                weeklyCaps: Object.fromEntries(result.weeklyCaps),
                journeyFares: Object.fromEntries(result.journeyFares),
                summary: {
                    totalAmount: result.totalFare.amount,
                    totalJourneys: result.journeyFares.size,
                    dailyCapCount: result.dailyCaps.size,
                    weeklyCapCount: result.weeklyCaps.size
                }
            };

            fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
        } catch (error) {
            throw new Error(`Failed to write result to JSON file: ${error}`);
        }
    }

    /**
     * Writes the calculation result to a text file
     */
    static toTextFile(result: FareCalculationResult, filePath: string): void {
        try {
            let content = `MoysterCard Fare Calculation Result\n`;
            content += `=====================================\n\n`;
            content += `Total Fare: ${result.totalFare.amount}\n`;
            content += `Total Journeys: ${result.journeyFares.size}\n\n`;

            content += `Daily Caps:\n`;
            for (const [date, fare] of result.dailyCaps) {
                content += `  ${date}: ${fare.amount}\n`;
            }

            content += `\nWeekly Caps:\n`;
            for (const [week, fare] of result.weeklyCaps) {
                content += `  ${week}: ${fare.amount}\n`;
            }

            content += `\nIndividual Journey Fares:\n`;
            for (const [journey, fare] of result.journeyFares) {
                content += `  ${journey}: ${fare.amount}\n`;
            }

            fs.writeFileSync(filePath, content);
        } catch (error) {
            throw new Error(`Failed to write result to text file: ${error}`);
        }
    }

    /**
     * Writes the calculation result to console
     */
    static toConsole(result: FareCalculationResult): void {
        console.log(`\nMoysterCard Fare Calculation Result`);
        console.log(`=====================================`);
        console.log(`Total Fare: ${result.totalFare.amount}`);
        console.log(`Total Journeys: ${result.journeyFares.size}`);

        if (result.dailyCaps.size > 0) {
            console.log(`\nDaily Caps:`);
            for (const [date, fare] of result.dailyCaps) {
                console.log(`  ${date}: ${fare.amount}`);
            }
        }

        if (result.weeklyCaps.size > 0) {
            console.log(`\nWeekly Caps:`);
            for (const [week, fare] of result.weeklyCaps) {
                console.log(`  ${week}: ${fare.amount}`);
            }
        }
    }
}
