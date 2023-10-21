import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { getRMQConfig } from './configs/rabbitmq.config'
import { RMQModule } from 'nestjs-rmq'
import { BlockchainController } from './presentation/blockchain.controller'

@Module({
  providers: [],
  controllers: [BlockchainController],
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    RMQModule.forRootAsync(getRMQConfig()),
  ],
})
export class AppModule { }
