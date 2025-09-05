// Represents a metro zone
export enum Zone {
    ZONE_1 = 1,
    ZONE_2 = 2,
}

/**
 * Zone pair for fare calculation
 */
export class ZonePair {
    constructor(
        public readonly from: Zone,
        public readonly to: Zone
    ) { }

    /**
     * Creates a zone pair from zone numbers
     */
    static fromZones(from: number, to: number): ZonePair {
        return new ZonePair(from as Zone, to as Zone);
    }

    /**
     * Gets the zone pair key for fare lookup
     */
    getKey(): string {
        return `${this.from}-${this.to}`;
    }

    /**
     * Checks if this is a cross-zone journey
     */
    isCrossZone(): boolean {
        return this.from !== this.to;
    }

    /**
     * Gets the maximum zone involved in this journey
     */
    getMaxZone(): Zone {
        return Math.max(this.from, this.to) as Zone;
    }

    /**
     * Checks if this journey involves zone 1
     */
    involvesZone1(): boolean {
        return this.from === Zone.ZONE_1 || this.to === Zone.ZONE_1;
    }

    /**
     * Checks if this journey involves zone 2
     */
    involvesZone2(): boolean {
        return this.from === Zone.ZONE_2 || this.to === Zone.ZONE_2;
    }

    equals(other: ZonePair): boolean {
        return this.from === other.from && this.to === other.to;
    }
}
