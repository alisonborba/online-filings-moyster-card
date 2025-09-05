import { Journey } from '../domain/Journey';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for journey data
 */
export interface JourneyData {
    dateTime: string;
    fromZone: number;
    toZone: number;
}

/**
 * Service for reading journey data from files
 */
export class JourneyDataReader {
    /**
     * Reads journey data from a JSON file
     */
    static fromJsonFile(filePath: string): Journey[] {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const data: JourneyData[] = JSON.parse(fileContent);
            return data.map(journeyData => Journey.fromData(journeyData));
        } catch (error) {
            throw new Error(`Failed to read journey data from JSON file: ${error}`);
        }
    }

    /**
     * Reads journey data from a CSV file
     */
    static fromCsvFile(filePath: string): Journey[] {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const lines = fileContent.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            const journeys: Journey[] = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const journeyData: JourneyData = {
                    dateTime: values[0],
                    fromZone: parseInt(values[1]),
                    toZone: parseInt(values[2])
                };

                journeys.push(Journey.fromData(journeyData));
            }

            return journeys;
        } catch (error) {
            throw new Error(`Failed to read journey data from CSV file: ${error}`);
        }
    }

    /**
     * Reads journey data from a file (auto-detects format)
     */
    static fromFile(filePath: string): Journey[] {
        const ext = path.extname(filePath).toLowerCase();

        switch (ext) {
            case '.json':
                return this.fromJsonFile(filePath);
            case '.csv':
                return this.fromCsvFile(filePath);
            default:
                throw new Error(`Unsupported file format: ${ext}. Supported formats: .json, .csv`);
        }
    }
}
