import { NestFactory } from '@nestjs/core'
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify'
import { App } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    App,
    new FastifyAdapter(),
  )

  app.enableCors()

  await app.listen(4000, '0.0.0.0')
}

bootstrap().catch(console.log)
