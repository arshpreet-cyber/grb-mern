import { defineConfig } from '@prisma/config'

export default defineConfig({
  migrate: {
    url: process.env.DIRECT_URL,
  },
})