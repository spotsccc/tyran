import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EventSender } from './application/event-sender'

@Module({
  providers: [EventSender],
  imports: [
    ClientsModule.register([
      {
        name: 'RABBIT_MQ',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://rabbitmq:5672'],
          queue: 'bought',
        },
      },
    ]),
  ],
})
export class AppModule { }
