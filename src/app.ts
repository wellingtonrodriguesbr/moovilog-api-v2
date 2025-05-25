import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyRateLimit from '@fastify/rate-limit'

import { env } from '@/core/config/env'

export const app = fastify({
  logger: true,
})

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  keyGenerator: request => request.ip,
  errorResponseBuilder: (request, context) => {
    return { error: 'Too many requests', retryIn: context.after }
  },
})

app.addHook('onRequest', async (request, reply) => {
  const referer = request.headers['referer']
  const origin = request.headers['origin']

  if (
    (!referer && !origin) ||
    (origin && !env.ALLOWED_ORIGIN_URL.includes(origin)) ||
    (referer && !referer.startsWith(env.ALLOWED_ORIGIN_URL))
  ) {
    reply.code(403).send({ error: 'Forbidden' })
  }
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '7d',
  },
})

app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET_KEY,
  hook: 'onRequest',
})

app.register(fastifyCors, {
  origin: env.ALLOWED_ORIGIN_URL,
  credentials: true,
})
