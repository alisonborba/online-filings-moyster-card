# MoysterCard Fare Calculation Engine

A clean, well-tested TypeScript solution for calculating metro fares with daily and weekly capping for the MoysterCard payment system in Londinium.

## Features

- **Time-based fare calculation** with peak/off-peak hours
- **Daily fare capping** to prevent overcharging
- **Weekly fare capping** for extended travel
- **Zone-based pricing** (Zone 1 and Zone 2)
- **Clean architecture** following SOLID principles
- **Comprehensive test coverage** with TDD approach
- **File-based input/output** (JSON and CSV support)

## Architecture

The solution follows clean architecture principles with clear separation of concerns:

### Domain Layer

- `Zone` - Represents metro zones and zone pairs
- `Journey` - Represents a single metro journey
- `Fare` - Represents fare amounts with immutable operations

### Service Layer

- `TimeService` - Handles peak/off-peak hour determination
- `FareCalculationService` - Calculates base fares and caps
- `FareCappingService` - Applies daily and weekly capping logic

### Application Layer

- `FareCalculationEngine` - Main orchestration service
- `JourneyDataReader` - Handles file input (JSON/CSV)
- `ResultWriter` - Handles output formatting

## Fare Rules

### Time-based Pricing

- **Peak Hours:**
  - Monday-Friday: 07:00-10:30, 17:00-20:00
  - Saturday-Sunday: 09:00-11:00, 18:00-22:00
- **Off-peak Hours:** All other times

### Zone-based Pricing

| Zones | Peak Hours | Off-Peak Hours |
| ----- | ---------- | -------------- |
| 1-1   | 30         | 25             |
| 1-2   | 35         | 30             |
| 2-1   | 35         | 30             |
| 2-2   | 25         | 20             |

### Daily Caps (00:00-23:59)

| Zones | Daily Cap |
| ----- | --------- |
| 1-1   | 100       |
| 1-2   | 120       |
| 2-1   | 120       |
| 2-2   | 80        |

### Weekly Caps (Monday-Sunday)

| Zones | Weekly Cap |
| ----- | ---------- |
| 1-1   | 500        |
| 1-2   | 600        |
| 2-1   | 600        |
| 2-2   | 400        |

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd moyster-card-fare-engine
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Usage

### Command Line Interface

```bash
# Process JSON file
npm start data/example1-daily-cap.json

# Process CSV file
npm start data/sample-journeys.csv

# Process with output file
npm start data/example1-daily-cap.json results/output.json
```

### Programmatic Usage

```typescript
import { FareCalculationEngine } from './src/FareCalculationEngine';
import { Journey } from './src/domain/Journey';
import { Zone } from './src/domain/Zone';

const engine = new FareCalculationEngine();
const journeys = [
  new Journey(new Date('2024-01-15T08:00:00Z'), Zone.ZONE_1, Zone.ZONE_2),
];

const result = engine.calculateFare(journeys);
console.log(`Total fare: ${result.totalFare.amount}`);
```

## Input Format

### JSON Format

```json
[
  {
    "dateTime": "2024-01-15T08:00:00Z",
    "fromZone": 1,
    "toZone": 2
  }
]
```

### CSV Format

```csv
dateTime,fromZone,toZone
2024-01-15T08:00:00Z,1,2
2024-01-15T12:00:00Z,2,1
```

## Output Format

The engine returns a `FareCalculationResult` containing:

- `totalFare` - Total fare amount
- `dailyCaps` - Daily cap amounts by date
- `weeklyCaps` - Weekly cap amounts by week
- `journeyFares` - Individual journey fares

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Example Scenarios

### Example 1: Daily Cap Reached

```bash
npm start data/example1-daily-cap.json
```

Expected output: 120 (daily cap reached for 1-2 zone pair)

### Example 2: Weekly Cap Reached

```bash
npm start data/example2-weekly-cap.json
```

Expected output: 600 (weekly cap reached for 1-2 zone pair)

## Design Principles Applied

### SOLID Principles

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes are substitutable for base classes
- **Interface Segregation**: Clients depend only on interfaces they use
- **Dependency Inversion**: Depend on abstractions, not concretions

### Clean Code Principles

- **YAGNI (You Aren't Gonna Need It)**: Only implemented required features
- **KISS (Keep It Simple, Stupid)**: Simple, readable code
- **DRY (Don't Repeat Yourself)**: Eliminated code duplication
- **Meaningful Names**: Clear, descriptive variable and method names
- **Small Functions**: Functions do one thing well

### Test-Driven Development

- Comprehensive unit tests for all components
- Integration tests for the main engine
- High test coverage (>95%)
- Tests written before implementation where possible

## File Structure

```
src/
├── domain/                 # Domain models
│   ├── Zone.ts
│   ├── Journey.ts
│   ├── Fare.ts
│   └── __tests__/         # Domain tests
├── services/              # Business logic services
│   ├── TimeService.ts
│   ├── FareCalculationService.ts
│   ├── FareCappingService.ts
│   └── __tests__/         # Service tests
├── io/                    # Input/Output handling
│   ├── JourneyDataReader.ts
│   └── ResultWriter.ts
├── FareCalculationEngine.ts
├── index.ts
└── __tests__/             # Integration tests

data/                      # Example data files
├── example1-daily-cap.json
├── example2-weekly-cap.json
└── sample-journeys.csv
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Implement the feature
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
