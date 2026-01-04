import fs from "fs";
import path from "path";
import { Store, StoreAdapter } from "../types";

const dataDir = path.resolve(process.cwd(), "data");
const filePath = path.join(dataDir, "applications.json");


export class FileStore implements StoreAdapter {
  read(): Store {
    return readStore();
  }

  write(store: Store): void {
    writeStore(store);
  }
}

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify({ applications: [] }, null, 2)
    );
  }
}

function readStore(): Store {
  try {
    ensureStore();
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);

    return {
      applications: Array.isArray(parsed.applications)
        ? parsed.applications
        : [],
    };
  } catch (e) {
    console.error("readStore failed", e);
    return { applications: [] };
  }
}

function writeStore(store: Store) {
  try {
    ensureStore();
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error("writeStore failed", e);
    throw e;
  }
}
