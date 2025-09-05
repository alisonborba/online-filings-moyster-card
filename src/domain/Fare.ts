export class Fare {
    constructor(public readonly amount: number) {
        if (amount < 0) {
            throw new Error('Fare amount cannot be negative');
        }
    }

    static zero(): Fare {
        return new Fare(0);
    }

    static fromAmount(amount: number): Fare {
        return new Fare(amount);
    }

    add(other: Fare): Fare {
        return new Fare(this.amount + other.amount);
    }

    subtract(other: Fare): Fare {
        const result = this.amount - other.amount;
        return new Fare(Math.max(0, result));
    }

    min(other: Fare): Fare {
        return new Fare(Math.min(this.amount, other.amount));
    }

    isZero(): boolean {
        return this.amount === 0;
    }

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

export class FareCalculationResult {
    constructor(
        public readonly totalFare: Fare,
        public readonly dailyCaps: Map<string, Fare>,
        public readonly weeklyCaps: Map<string, Fare>,
        public readonly journeyFares: Map<string, Fare>
    ) { }

    getTotalAmount(): number {
        return this.totalFare.amount;
    }
}
