import { ConfigModule, ConfigService } from '@nestjs/config'
import { KnexModuleAsyncOptions } from 'nest-knexjs'

export function getKnexConfig(): KnexModuleAsyncOptions {
  return {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      config: {
        client: 'pg',
        connection: {
          port: configService.getOrThrow('DATABASE_PORT'),
          host: configService.getOrThrow('DATABASE_HOST'),
          user: configService.getOrThrow('DATABASE_USER'),
          password: configService.getOrThrow('DATABASE_PASSWORD'),
          database: configService.getOrThrow('DATABASE'),
        },
      },
    }),
  }
}
