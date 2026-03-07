// mocks/mock-employee-analytics.ts
// Deterministic 90-day mock data for employee analytics.
// Uses a seeded PRNG (mulberry32) so data never changes between renders.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DailyEmployeeData {
  date: string; // "YYYY-MM-DD"
  totalEmployees: number;
  active: number;
  onboarding: number;
  onLeave: number;
  departments: {
    Engineering: number;
    Marketing: number;
    HR: number;
    Finance: number;
    Sales: number;
    Legal: number;
  };
  employmentTypes: {
    fullTime: number;
    partTime: number;
    contract: number;
    intern: number;
  };
  performance: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
}

// ─── Seeded PRNG ──────────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function distribute(
  rng: () => number,
  total: number,
  ratios: number[],
): number[] {
  const rawWeights = ratios.map((r) => r + (rng() - 0.5) * r * 0.15);
  const sum = rawWeights.reduce((a, b) => a + b, 0);
  const distributed = rawWeights.map((w) => Math.round((w / sum) * total));

  // Fix rounding residual
  const diff = total - distributed.reduce((a, b) => a + b, 0);
  distributed[0] += diff;

  return distributed;
}

// ─── Generator ────────────────────────────────────────────────────────────────

const TOTAL_DAYS = 120; // Generate 120 days so we always have 90+ usable days
const SEED = 20260305;

function generateData(): DailyEmployeeData[] {
  const rng = mulberry32(SEED);
  const data: DailyEmployeeData[] = [];

  // End date: 2026-03-05
  // Start date: 120 days prior
  const endDate = new Date(2026, 2, 5); // Mar 5, 2026
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - TOTAL_DAYS + 1);

  let baseTotal = 850;

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);

    // Gradual growth: ~0–5 employees per week
    if (i > 0 && i % 7 === 0) {
      baseTotal += randInt(rng, 0, 5);
    }

    const totalEmployees = baseTotal + randInt(rng, -1, 1);
    const onboarding = randInt(rng, 6, 18);
    const onLeave = randInt(rng, 4, 14);
    const active = totalEmployees - onboarding - onLeave;

    // Department distribution (Engineering heaviest)
    const deptRatios = [0.3, 0.15, 0.1, 0.12, 0.2, 0.08]; // Eng, Mkt, HR, Fin, Sales, Legal
    const deptValues = distribute(rng, totalEmployees, deptRatios);

    // Employment type distribution
    const empTypeRatios = [0.65, 0.15, 0.12, 0.08]; // FT, PT, Contract, Intern
    const empTypeValues = distribute(rng, totalEmployees, empTypeRatios);

    // Performance distribution: excellent ~20%, good ~40%, average ~30%, poor ~10%
    const perfRatios = [0.2, 0.4, 0.3, 0.1];
    const perfValues = distribute(rng, totalEmployees, perfRatios);

    data.push({
      date: dateStr,
      totalEmployees,
      active: Math.max(active, 0),
      onboarding,
      onLeave,
      departments: {
        Engineering: deptValues[0],
        Marketing: deptValues[1],
        HR: deptValues[2],
        Finance: deptValues[3],
        Sales: deptValues[4],
        Legal: deptValues[5],
      },
      employmentTypes: {
        fullTime: empTypeValues[0],
        partTime: empTypeValues[1],
        contract: empTypeValues[2],
        intern: empTypeValues[3],
      },
      performance: {
        excellent: perfValues[0],
        good: perfValues[1],
        average: perfValues[2],
        poor: perfValues[3],
      },
    });
  }

  return data;
}

/** Pre-generated deterministic employee analytics data (120 days). */
export const EMPLOYEE_ANALYTICS_DATA: DailyEmployeeData[] = generateData();
