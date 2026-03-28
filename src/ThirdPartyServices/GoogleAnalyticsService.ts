import { BetaAnalyticsDataClient } from "@google-analytics/data";

import {
  AnalyticsRange,
  AnalyticsTrafficPoint,
  getAnalyticsRangeDays,
  GoogleAnalyticsSnapshot,
} from "@/types/adminAnalytics";

type GoogleAnalyticsConfig = {
  propertyId: string;
  projectId?: string;
  clientEmail: string;
  privateKey: string;
  measurementId: string | null;
  signature: string;
};

const EMPTY_OVERVIEW = {
  activeUsers: 0,
  totalUsers: 0,
  sessions: 0,
  pageViews: 0,
  engagementRate: 0,
  averageSessionDuration: 0,
};

function daysAgoUtc(daysAgo: number): Date {
  const now = new Date();
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

function buildDateSeries(days: number): string[] {
  const start = daysAgoUtc(days - 1);
  return Array.from({ length: days }, (_, index) => {
    const point = new Date(start);
    point.setUTCDate(start.getUTCDate() + index);
    return point.toISOString().slice(0, 10);
  });
}

function toNumber(value?: string | null): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatGaDate(value?: string | null): string {
  const raw = String(value ?? "").trim();
  if (!/^\d{8}$/.test(raw)) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService;
  private client: BetaAnalyticsDataClient | null = null;
  private activeSignature: string | null = null;

  static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService();
    }
    return GoogleAnalyticsService.instance;
  }

  private normalizePrivateKey(privateKey?: string) {
    return String(privateKey ?? "").replace(/\\n/g, "\n").trim();
  }

  private getConfig(): GoogleAnalyticsConfig | null {
    const rawJson = String(
      process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON ?? ""
    ).trim();

    let serviceAccount: Record<string, unknown> | null = null;
    if (rawJson) {
      serviceAccount = JSON.parse(rawJson) as Record<string, unknown>;
    }

    const measurementId =
      String(process.env.NEXT_PUBLIC_GA_ID ?? "").trim() || null;
    const propertyId = String(
      process.env.GOOGLE_ANALYTICS_PROPERTY_ID ??
        process.env.GA4_PROPERTY_ID ??
        ""
    ).trim();
    const projectId = String(
      process.env.GOOGLE_ANALYTICS_PROJECT_ID ??
        serviceAccount?.project_id ??
        ""
    ).trim();
    const clientEmail = String(
      process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL ??
        serviceAccount?.client_email ??
        ""
    ).trim();
    const privateKey = this.normalizePrivateKey(
      process.env.GOOGLE_ANALYTICS_PRIVATE_KEY ??
        serviceAccount?.private_key?.toString()
    );

    if (!propertyId || !clientEmail || !privateKey) {
      return null;
    }

    return {
      propertyId,
      projectId: projectId || undefined,
      clientEmail,
      privateKey,
      measurementId,
      signature: JSON.stringify({
        propertyId,
        projectId,
        clientEmail,
        privateKey,
      }),
    };
  }

  private async getClient(config: GoogleAnalyticsConfig) {
    if (!this.client || this.activeSignature !== config.signature) {
      this.client = new BetaAnalyticsDataClient({
        projectId: config.projectId,
        credentials: {
          client_email: config.clientEmail,
          private_key: config.privateKey,
        },
      });
      this.activeSignature = config.signature;
      await this.client.initialize();
    }

    return this.client;
  }

  async getSnapshot(range: AnalyticsRange): Promise<GoogleAnalyticsSnapshot> {
    let config: GoogleAnalyticsConfig | null = null;

    try {
      config = this.getConfig();
    } catch (error) {
      console.error("Failed to parse Google Analytics credentials:", error);
      return {
        configured: false,
        measurementId: String(process.env.NEXT_PUBLIC_GA_ID ?? "").trim() || null,
        propertyId: null,
        error: "Google Analytics credentials could not be parsed.",
        overview: EMPTY_OVERVIEW,
        realtimeActiveUsers: 0,
        trend: [],
        topPages: [],
        countries: [],
        devices: [],
      };
    }

    if (!config) {
      return {
        configured: false,
        measurementId: String(process.env.NEXT_PUBLIC_GA_ID ?? "").trim() || null,
        propertyId: null,
        error: null,
        overview: EMPTY_OVERVIEW,
        realtimeActiveUsers: 0,
        trend: [],
        topPages: [],
        countries: [],
        devices: [],
      };
    }

    try {
      const client = await this.getClient(config);
      const days = getAnalyticsRangeDays(range);
      const property = `properties/${config.propertyId}`;

      const [batchResponse, realtimeResponse] = await Promise.all([
        client.batchRunReports({
          property,
          requests: [
            {
              dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
              metrics: [
                { name: "activeUsers" },
                { name: "totalUsers" },
                { name: "sessions" },
                { name: "screenPageViews" },
                { name: "engagementRate" },
                { name: "averageSessionDuration" },
              ],
            },
            {
              dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
              dimensions: [{ name: "date" }],
              metrics: [
                { name: "activeUsers" },
                { name: "sessions" },
                { name: "screenPageViews" },
              ],
              orderBys: [{ dimension: { dimensionName: "date" } }],
            },
            {
              dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
              dimensions: [{ name: "pagePath" }],
              metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
              limit: 10,
            },
            {
              dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
              dimensions: [{ name: "country" }],
              metrics: [{ name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
              limit: 6,
            },
            {
              dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
              dimensions: [{ name: "deviceCategory" }],
              metrics: [{ name: "activeUsers" }],
              orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
              limit: 6,
            },
          ],
        }),
        client.runRealtimeReport({
          property,
          metrics: [{ name: "activeUsers" }],
        }),
      ]);

      const reports = batchResponse[0].reports ?? [];
      const overviewRow = reports[0]?.rows?.[0];
      const overview = {
        activeUsers: toNumber(overviewRow?.metricValues?.[0]?.value),
        totalUsers: toNumber(overviewRow?.metricValues?.[1]?.value),
        sessions: toNumber(overviewRow?.metricValues?.[2]?.value),
        pageViews: toNumber(overviewRow?.metricValues?.[3]?.value),
        engagementRate: toNumber(overviewRow?.metricValues?.[4]?.value),
        averageSessionDuration: toNumber(overviewRow?.metricValues?.[5]?.value),
      };

      const trendMap = new Map<string, AnalyticsTrafficPoint>();
      for (const row of reports[1]?.rows ?? []) {
        const date = formatGaDate(row.dimensionValues?.[0]?.value);
        trendMap.set(date, {
          date,
          activeUsers: toNumber(row.metricValues?.[0]?.value),
          sessions: toNumber(row.metricValues?.[1]?.value),
          pageViews: toNumber(row.metricValues?.[2]?.value),
        });
      }

      const trend = buildDateSeries(days).map((date) => {
        return (
          trendMap.get(date) ?? {
            date,
            activeUsers: 0,
            sessions: 0,
            pageViews: 0,
          }
        );
      });

      const topPages = (reports[2]?.rows ?? []).map((row) => ({
        path: String(row.dimensionValues?.[0]?.value || "/").trim() || "/",
        views: toNumber(row.metricValues?.[0]?.value),
        activeUsers: toNumber(row.metricValues?.[1]?.value),
      }));

      const countries = (reports[3]?.rows ?? []).map((row) => ({
        label: String(row.dimensionValues?.[0]?.value || "Unknown").trim() || "Unknown",
        value: toNumber(row.metricValues?.[0]?.value),
      }));

      const devices = (reports[4]?.rows ?? []).map((row) => ({
        label: String(row.dimensionValues?.[0]?.value || "Unknown").trim() || "Unknown",
        value: toNumber(row.metricValues?.[0]?.value),
      }));

      const realtimeRow = realtimeResponse[0].rows?.[0];

      return {
        configured: true,
        measurementId: config.measurementId,
        propertyId: config.propertyId,
        error: null,
        overview,
        realtimeActiveUsers: toNumber(realtimeRow?.metricValues?.[0]?.value),
        trend,
        topPages,
        countries,
        devices,
      };
    } catch (error) {
      console.error("Failed to load Google Analytics data:", error);
      return {
        configured: true,
        measurementId: config.measurementId,
        propertyId: config.propertyId,
        error: "Google Analytics data could not be loaded.",
        overview: EMPTY_OVERVIEW,
        realtimeActiveUsers: 0,
        trend: [],
        topPages: [],
        countries: [],
        devices: [],
      };
    }
  }
}

export default GoogleAnalyticsService;
