import { IRMQServiceAsyncOptions } from 'nestjs-rmq'
import { ConfigService, ConfigModule } from '@nestjs/config'

export function getRMQConfig(): IRMQServiceAsyncOptions {
  return {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory(configService: ConfigService) {
      return {
        exchangeName: configService.getOrThrow('RABBITMQ_EXCHANGE'),
        connections: [
          {
            login: configService.getOrThrow('RABBITMQ_DEFAULT_USER'),
            password: configService.getOrThrow('RABBITMQ_DEFAULT_PASSWORD'),
            host: configService.getOrThrow('RABBITMQ_HOST'),
          },
        ],
        queueName: configService.getOrThrow('RABBITMQ_QUEUE'),
        service: 'MONO',
      }
    },
  }
}
