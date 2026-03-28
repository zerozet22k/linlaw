export const ANALYTICS_RANGES = ["7d", "30d"] as const;

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export function normalizeAnalyticsRange(
  value?: string | null
): AnalyticsRange {
  return value === "7d" ? "7d" : "30d";
}

export function getAnalyticsRangeDays(range: AnalyticsRange): number {
  return range === "7d" ? 7 : 30;
}

export interface AnalyticsTrafficPoint {
  date: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
}

export interface AnalyticsSignupPoint {
  date: string;
  users: number;
}

export interface AnalyticsPageStat {
  path: string;
  views: number;
  activeUsers: number;
}

export interface AnalyticsDimensionStat {
  label: string;
  value: number;
}

export interface GoogleAnalyticsOverview {
  activeUsers: number;
  totalUsers: number;
  sessions: number;
  pageViews: number;
  engagementRate: number;
  averageSessionDuration: number;
}

export interface GoogleAnalyticsSnapshot {
  configured: boolean;
  measurementId: string | null;
  propertyId: string | null;
  error: string | null;
  overview: GoogleAnalyticsOverview;
  realtimeActiveUsers: number;
  trend: AnalyticsTrafficPoint[];
  topPages: AnalyticsPageStat[];
  countries: AnalyticsDimensionStat[];
  devices: AnalyticsDimensionStat[];
}

export interface RecentAccountStat {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  createdAt: string | null;
  roles: string[];
}

export interface InternalAnalyticsSnapshot {
  totalUsers: number;
  guestUsers: number;
  staffUsers: number;
  systemUsers: number;
  recentSignups7d: number;
  recentSignups30d: number;
  recentSignupsInRange: number;
  usersWithDevices: number;
  storedDevices: number;
  signupTrend: AnalyticsSignupPoint[];
  recentUsers: RecentAccountStat[];
}

export interface AdminAnalyticsSnapshot {
  range: AnalyticsRange;
  generatedAt: string;
  google: GoogleAnalyticsSnapshot;
  internal: InternalAnalyticsSnapshot;
}
