import admin from "firebase-admin";
import { getStorage, Storage } from "firebase-admin/storage";
import {
  FIREBASE_SETTINGS_KEYS,
  FIREBASE_SETTINGS_TYPES,
} from "@/config/CMS/settings/keys/FIREBASE_SETTINGS_KEYS";
import SettingRepository from "@/repositories/SettingRepository";

class FirebaseService {
  private static instance: FirebaseService;
  private settingRepository: SettingRepository;
  private app: admin.app.App | null = null;
  private bucket: ReturnType<Storage["bucket"]> | null = null;
  private activeSignature: string | null = null;
  private initPromise: Promise<void> | null = null;
  private static readonly APP_NAME = "linlaw-storage";

  private constructor() {
    this.settingRepository = new SettingRepository();
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private normalizeBucketName(bucket?: string) {
    return String(bucket ?? "")
      .trim()
      .replace(/^gs:\/\//, "")
      .replace(/\/+$/, "");
  }

  private normalizePrivateKey(privateKey?: string) {
    return String(privateKey ?? "").replace(/\\n/g, "\n").trim();
  }

  private async getFirebaseConfig() {
    const firebaseConfig = (await this.settingRepository.findByKey(
      FIREBASE_SETTINGS_KEYS.FIREBASE
    )) as FIREBASE_SETTINGS_TYPES[typeof FIREBASE_SETTINGS_KEYS.FIREBASE] | null;

    const bucket = this.normalizeBucketName(firebaseConfig?.bucket);
    const projectId = String(firebaseConfig?.serviceAccount?.project_id ?? "").trim();
    const clientEmail = String(firebaseConfig?.serviceAccount?.client_email ?? "").trim();
    const privateKey = this.normalizePrivateKey(
      firebaseConfig?.serviceAccount?.private_key
    );

    if (!bucket || !projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase settings are incomplete.");
    }

    return {
      bucket,
      serviceAccount: {
        projectId,
        clientEmail,
        privateKey,
      } satisfies admin.ServiceAccount,
      signature: JSON.stringify({
        bucket,
        projectId,
        clientEmail,
        privateKey,
      }),
    };
  }

  async isFirebaseAvailable(): Promise<boolean> {
    try {
      await this.getFirebaseConfig();
      return true;
    } catch {
      return false;
    }
  }

  async initFirebase() {
    const firebaseConfig = await this.getFirebaseConfig();
    if (
      this.bucket &&
      this.app &&
      this.activeSignature === firebaseConfig.signature
    ) {
      return;
    }

    if (this.initPromise) {
      await this.initPromise;
      if (
        this.bucket &&
        this.app &&
        this.activeSignature === firebaseConfig.signature
      ) {
        return;
      }
    }

    this.initPromise = (async () => {
      const existingApp = admin.apps.find(
        (app) => app != null && app.name === FirebaseService.APP_NAME
      );
      if (existingApp) {
        await existingApp.delete();
      }

      this.app = admin.initializeApp(
        {
          credential: admin.credential.cert(firebaseConfig.serviceAccount),
          storageBucket: firebaseConfig.bucket,
        },
        FirebaseService.APP_NAME
      );

      this.bucket = getStorage(this.app).bucket(firebaseConfig.bucket);
      this.activeSignature = firebaseConfig.signature;
    })();

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  getBucket(): ReturnType<Storage["bucket"]> {
    if (!this.bucket) {
      throw new Error("Firebase has not been initialized.");
    }
    return this.bucket;
  }

  async generateSignedUrl(
    filePath: string,
    contentType: string
  ): Promise<string> {
    if (!this.bucket) {
      await this.initFirebase();
    }

    if (!this.bucket) {
      throw new Error("Firebase bucket not initialized.");
    }

    const file = this.bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    return url;
  }
}

export default FirebaseService;
