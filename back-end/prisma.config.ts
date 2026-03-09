import { defineConfig } from '@prisma/config'
import dotenv from 'dotenv'

// Load .env variables
dotenv.config()

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!, // must exist
  },
})