import GoogleAnalyticsService from "@/ThirdPartyServices/GoogleAnalyticsService";
import {
  AdminAnalyticsSnapshot,
  AnalyticsRange,
} from "@/types/adminAnalytics";
import UserService from "./UserService";

class AdminAnalyticsService {
  private readonly googleAnalyticsService =
    GoogleAnalyticsService.getInstance();
  private readonly userService = new UserService();

  async getSnapshot(range: AnalyticsRange): Promise<AdminAnalyticsSnapshot> {
    const [google, internal] = await Promise.all([
      this.googleAnalyticsService.getSnapshot(range),
      this.userService.getAnalyticsSnapshot(range),
    ]);

    return {
      range,
      generatedAt: new Date().toISOString(),
      google,
      internal,
    };
  }
}

export default AdminAnalyticsService;
