import { FareCalculationEngine } from './FareCalculationEngine';
import { JourneyDataReader } from './io/JourneyDataReader';
import { ResultWriter } from './io/ResultWriter';
import * as path from 'path';

class MoysterCardApp {
    private engine: FareCalculationEngine;

    constructor() {
        this.engine = new FareCalculationEngine();
    }

    processJourneyFile(inputFile: string, outputFile?: string): void {
        try {
            console.log(`Reading journey data from: ${inputFile}`);
            const journeys = JourneyDataReader.fromFile(inputFile);

            console.log(`Processing ${journeys.length} journeys...`);
            const result = this.engine.calculateFare(journeys);

            console.log(`Total fare calculated: ${result.totalFare.amount}`);

            // Write results
            if (outputFile) {
                const ext = path.extname(outputFile).toLowerCase();
                if (ext === '.json') {
                    ResultWriter.toJsonFile(result, outputFile);
                } else {
                    ResultWriter.toTextFile(result, outputFile);
                }
                console.log(`Results written to: ${outputFile}`);
            } else {
                ResultWriter.toConsole(result);
            }

        } catch (error) {
            console.error(`Error processing journey file: ${error}`);
            process.exit(1);
        }
    }

    run(): void {
        console.log('process.argv.slice(2)', process.argv);
        const args = process.argv.slice(2);
        console.log('args', args);

        if (args.length === 0) {
            console.log('Usage: npm start <input-file> [output-file]');
            console.log('Example: npm start data/journeys.json results/output.json');
            process.exit(1);
        }

        const inputFile = args[0];
        const outputFile = args[1];

        this.processJourneyFile(inputFile, outputFile);
    }
}

const app = new MoysterCardApp();
app.run();

export { MoysterCardApp };
