import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force-load ./uploader/.env (this file’s folder)
dotenv.config({ path: path.join(__dirname, ".env") });


const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim();
const MONGODB_NAME = (process.env.MONGODB_NAME || "blank_app").trim();

const FROM =
  "https://firebasestorage.googleapis.com/v0/b/testing123-64452.firebasestorage.app/o/";
const TO =
  "https://firebasestorage.googleapis.com/v0/b/lin-law-app-2026.firebasestorage.app/o/";

if (!MONGODB_URI) {
  console.error("❌ Missing env: MONGODB_URI (or MONGO_URI)");
  process.exit(1);
}

function rewriteDeep<T>(v: T): T {
  if (typeof v === "string") {
    return (v.includes(FROM) ? v.split(FROM).join(TO) : v) as unknown as T;
  }

  if (Array.isArray(v)) {
    let changed = false;
    const out = v.map((x) => {
      const nx = rewriteDeep(x);
      if (nx !== x) changed = true;
      return nx;
    });
    return (changed ? out : v) as unknown as T;
  }

  if (v && typeof v === "object") {
    const obj = v as any;
    let changed = false;
    const out: any = Array.isArray(obj) ? [] : {};

    for (const key of Object.keys(obj)) {
      const oldVal = obj[key];
      const newVal = rewriteDeep(oldVal);
      out[key] = newVal;
      if (newVal !== oldVal) changed = true;
    }

    return (changed ? out : v) as T;
  }

  return v;
}

async function run() {
  console.log(`🔗 Connecting to MongoDB [db=${MONGODB_NAME}]`);
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_NAME });

  const db = mongoose.connection.db;
  if (!db) throw new Error("No db handle");

  // Safer: only scan the collections that actually contain URLs
  const targetCollections = ["pages", "relatedbusinesses", "settings", "files", "newsletters"];

  console.log("FROM:", FROM);
  console.log("TO:  ", TO);
  console.log("Collections:", targetCollections.join(", "));

  for (const name of targetCollections) {
    // skip missing collections
    const exists = (await db.listCollections({ name }).toArray()).length > 0;
    if (!exists) {
      console.log(`${name}: (skip, not found)`);
      continue;
    }

    const col = db.collection(name);

    // No $where (it’s slow + sometimes blocked). Just scan the collection.
    const cursor = col.find({});

    let scanned = 0;
    let updated = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc) break;
      scanned++;

      const rewritten = rewriteDeep(doc);
      if (rewritten !== doc) {
        await col.replaceOne({ _id: doc._id }, rewritten);
        updated++;
      }
    }

    console.log(`${name}: scanned=${scanned} updated=${updated}`);
  }

  await mongoose.disconnect();
  console.log("✅ Done.");
}

run().catch(async (e) => {
  console.error("❌", e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
