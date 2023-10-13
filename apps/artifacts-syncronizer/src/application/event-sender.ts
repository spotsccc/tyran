import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class EventSender {
  constructor(@Inject('RABBIT_MQ') private readonly rabbitMq: ClientProxy) {
    setTimeout(this.sendEvent.bind(this), 12000)
  }

  public sendEvent() {
    console.log('123')
    this.rabbitMq.emit('bought', { message: 'kek' })
  }
}
