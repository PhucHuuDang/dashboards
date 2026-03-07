// mocks/mock-dashboard-analytics.ts
// Deterministic 120-day mock data for main dashboard metrics.

export interface DailyDashboardData {
  date: string; // "YYYY-MM-DD"
  visitors: {
    desktop: number;
    mobile: number;
    total: number;
  };
  browsers: {
    chrome: number;
    safari: number;
    firefox: number;
    edge: number;
    other: number;
  };
  orders: number;
  products: number;
  revenue: number;
}

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

  const diff = total - distributed.reduce((a, b) => a + b, 0);
  distributed[0] += diff;

  return distributed;
}

const TOTAL_DAYS = 120;
const SEED = 20260306;

function generateDashboardData(): DailyDashboardData[] {
  const rng = mulberry32(SEED);
  const data: DailyDashboardData[] = [];

  const endDate = new Date(2026, 2, 6); // March 6, 2026
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - TOTAL_DAYS + 1);

  let cumulativeProducts = 200;

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);

    const desktop = randInt(rng, 100, 500);
    const mobile = randInt(rng, 150, 600);
    const totalVisitors = desktop + mobile;

    const browserRatios = [0.45, 0.25, 0.15, 0.1, 0.05];
    const browserValues = distribute(rng, totalVisitors, browserRatios);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const ordersMultiplier = isWeekend ? 1.5 : 1.0;
    const orders = Math.floor(randInt(rng, 10, 50) * ordersMultiplier);

    if (i % 14 === 0) cumulativeProducts += randInt(rng, 0, 3);

    const revenue = Math.floor(orders * randInt(rng, 50, 150));

    data.push({
      date: dateStr,
      visitors: {
        desktop,
        mobile,
        total: totalVisitors,
      },
      browsers: {
        chrome: browserValues[0],
        safari: browserValues[1],
        firefox: browserValues[2],
        edge: browserValues[3],
        other: browserValues[4],
      },
      orders,
      products: cumulativeProducts,
      revenue,
    });
  }

  return data;
}

export const DASHBOARD_ANALYTICS_DATA: DailyDashboardData[] =
  generateDashboardData();
