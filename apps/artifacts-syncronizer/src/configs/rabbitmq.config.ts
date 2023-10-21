import { IRMQServiceAsyncOptions } from 'nestjs-rmq'
import { ConfigService, ConfigModule } from '@nestjs/config'

export function getRMQConfig(): IRMQServiceAsyncOptions {
  return {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory(configService: ConfigService) {
      return {
        connectionOptions: {
          keepAlive: true,
        },
        exchangeName: configService.getOrThrow('RABBITMQ_EXCHANGE'),
        connections: [
          {
            login: configService.getOrThrow('RABBITMQ_DEFAULT_USER'),
            password: configService.getOrThrow('RABBITMQ_DEFAULT_PASSWORD'),
            host: configService.getOrThrow('RABBITMQ_HOST'),
          },
        ],
        service: 'artifacts-syncronizer',
      }
    },
  }
}
