import fs from "fs";
import os from "os";
import path from "path";
import { beforeAll, afterAll } from "vitest";

let tempDir: string;

beforeAll(() => {
  tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "kyc-store-")
  );

  process.env.KYC_DATA_DIR = tempDir;
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});
