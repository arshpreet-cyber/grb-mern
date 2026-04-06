import path from "node:path";
import { defineConfig } from "prisma/config";

const connectionString =
  "postgresql://postgres.ulnxqgklfkmgbdbddmuj:2tNsW2iWNcbJ%2FHJ@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: connectionString,
  },
});
