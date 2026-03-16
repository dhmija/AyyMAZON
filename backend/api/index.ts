import fs from "fs";
import path from "path";

import app from "../src/config/app";

// On Vercel the filesystem is read-only except /tmp.
// We bundle the pre-seeded SQLite database via vercel.json includeFiles and
// copy it to /tmp so Prisma can both read AND write during a function instance.
// PrismaClient only opens the file on the first query (it's lazy), so copying
// here at module-load time (before any request is handled) is safe.
try {
  const dest = "/tmp/dev.db";
  if (!fs.existsSync(dest)) {
    for (const src of [
      path.join(process.cwd(), "prisma/dev.db"),
      path.join(__dirname, "../prisma/dev.db"),
    ]) {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        break;
      }
    }
  }
} catch {
  // Non-fatal: Prisma will surface a connection error on the first failing query.
}

export default app;
