import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.parsed",
    migrations: {
        path: 'prisma/migrations',
        seed: 'prisma/seedUser.ts'
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});