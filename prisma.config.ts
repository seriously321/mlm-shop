import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: 'postgresql://postgres:Saha080807@localhost:5432/mlm_shop?schema=public',
  },
})