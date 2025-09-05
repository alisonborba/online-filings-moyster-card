import { Fare } from '../Fare';

describe('Fare', () => {
    describe('constructor', () => {
        it('should create fare with valid amount', () => {
            const fare = new Fare(100);
            expect(fare.amount).toBe(100);
        });

        it('should throw error for negative amount', () => {
            expect(() => new Fare(-10)).toThrow('Fare amount cannot be negative');
        });
    });

    describe('zero', () => {
        it('should create zero fare', () => {
            const fare = Fare.zero();
            expect(fare.amount).toBe(0);
        });
    });

    describe('fromAmount', () => {
        it('should create fare from amount', () => {
            const fare = Fare.fromAmount(50);
            expect(fare.amount).toBe(50);
        });
    });

    describe('add', () => {
        it('should add two fares', () => {
            const fare1 = new Fare(30);
            const fare2 = new Fare(20);
            const result = fare1.add(fare2);

            expect(result.amount).toBe(50);
        });

        it('should not modify original fares', () => {
            const fare1 = new Fare(30);
            const fare2 = new Fare(20);
            fare1.add(fare2);

            expect(fare1.amount).toBe(30);
            expect(fare2.amount).toBe(20);
        });
    });

    describe('subtract', () => {
        it('should subtract fares', () => {
            const fare1 = new Fare(50);
            const fare2 = new Fare(20);
            const result = fare1.subtract(fare2);

            expect(result.amount).toBe(30);
        });

        it('should not return negative fare', () => {
            const fare1 = new Fare(20);
            const fare2 = new Fare(50);
            const result = fare1.subtract(fare2);

            expect(result.amount).toBe(0);
        });
    });

    describe('min', () => {
        it('should return minimum of two fares', () => {
            const fare1 = new Fare(30);
            const fare2 = new Fare(20);
            const result = fare1.min(fare2);

            expect(result.amount).toBe(20);
        });
    });

    describe('isZero', () => {
        it('should correctly identify zero fare', () => {
            const zeroFare = new Fare(0);
            const nonZeroFare = new Fare(10);

            expect(zeroFare.isZero()).toBe(true);
            expect(nonZeroFare.isZero()).toBe(false);
        });
    });

    describe('isGreaterThan', () => {
        it('should correctly compare fares', () => {
            const fare1 = new Fare(30);
            const fare2 = new Fare(20);

            expect(fare1.isGreaterThan(fare2)).toBe(true);
            expect(fare2.isGreaterThan(fare1)).toBe(false);
            expect(fare1.isGreaterThan(fare1)).toBe(false);
        });
    });

    describe('equals', () => {
        it('should correctly compare equal fares', () => {
            const fare1 = new Fare(30);
            const fare2 = new Fare(30);
            const fare3 = new Fare(20);

            expect(fare1.equals(fare2)).toBe(true);
            expect(fare1.equals(fare3)).toBe(false);
        });
    });

    describe('toString', () => {
        it('should return string representation', () => {
            const fare = new Fare(30);
            expect(fare.toString()).toBe('30');
        });
    });
});
