import { app } from '@/app'
import { env } from '@/core/config/env'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => console.log(`\n\n [SERVER]: running on port ${env.PORT} 🔥 \n\n`))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
