import { ZonePair } from './Zone';

/**
 * Represents a fare amount
 */
export class Fare {
    constructor(public readonly amount: number) {
        if (amount < 0) {
            throw new Error('Fare amount cannot be negative');
        }
    }

    /**
     * Creates a zero fare
     */
    static zero(): Fare {
        return new Fare(0);
    }

    /**
     * Creates a fare from a number
     */
    static fromAmount(amount: number): Fare {
        return new Fare(amount);
    }

    /**
     * Adds another fare to this fare
     */
    add(other: Fare): Fare {
        return new Fare(this.amount + other.amount);
    }

    /**
     * Subtracts another fare from this fare
     */
    subtract(other: Fare): Fare {
        const result = this.amount - other.amount;
        return new Fare(Math.max(0, result));
    }

    /**
     * Gets the minimum of this fare and another fare
     */
    min(other: Fare): Fare {
        return new Fare(Math.min(this.amount, other.amount));
    }

    /**
     * Checks if this fare is zero
     */
    isZero(): boolean {
        return this.amount === 0;
    }

    /**
     * Checks if this fare is greater than another fare
     */
    isGreaterThan(other: Fare): boolean {
        return this.amount > other.amount;
    }

    equals(other: Fare): boolean {
        return this.amount === other.amount;
    }

    toString(): string {
        return this.amount.toString();
    }
}

/**
 * Represents a fare calculation result
 */
export class FareCalculationResult {
    constructor(
        public readonly totalFare: Fare,
        public readonly dailyCaps: Map<string, Fare>,
        public readonly weeklyCaps: Map<string, Fare>,
        public readonly journeyFares: Map<string, Fare>
    ) { }

    /**
     * Gets the total fare as a number
     */
    getTotalAmount(): number {
        return this.totalFare.amount;
    }
}
