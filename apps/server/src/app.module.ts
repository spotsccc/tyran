import { Module } from '@nestjs/common'
import { MinioModule } from 'nestjs-minio-client'
import { UsersController } from '@/presentation/users.controller'
import { KnexModule } from 'nest-knexjs'
import {
  ARTIFACTS_REPOSITORY,
  LOTS_REPOSITORY,
  SALE_RECORDS_REPOSITORY,
  USERS_REPOSITORY,
} from '@/application/repositories.interface'
import { UsersRepository } from '@/infrastructure/users.repository'
import { FILE_STORAGE } from '@/application/file-storage.interface'
import { MinioFileStorage } from '@/infrastructure/minio-file-storage'
import { LotsRepository } from '@/infrastructure/lots.repository'
import { ArtifactsRepository } from '@/infrastructure/artifacts.repository'
import { UsersService } from '@/application/users.service'
import { SaleRecordsRepository } from '@/infrastructure/sale-records.repository'
import { ArtifactsController } from '@/presentation/artifacts.controller'
import { ArtifactsService } from '@/application/artifacts.service'
import { LotsService } from '@/application/lots.service'
import { LotsController } from '@/presentation/lots.controller'
import { ConfigModule } from '@nestjs/config'
import { getMinioConfig } from './configs/minio.config'
import { getKnexConfig } from './configs/knex.config'
import { RMQModule } from 'nestjs-rmq'
import { getRMQConfig } from './configs/rmq.config'

@Module({
  controllers: [UsersController, ArtifactsController, LotsController],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: FILE_STORAGE,
      useClass: MinioFileStorage,
    },
    {
      provide: LOTS_REPOSITORY,
      useClass: LotsRepository,
    },
    {
      provide: ARTIFACTS_REPOSITORY,
      useClass: ArtifactsRepository,
    },
    {
      provide: SALE_RECORDS_REPOSITORY,
      useClass: SaleRecordsRepository,
    },
    ArtifactsService,
    UsersService,
    LotsService,
  ],
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    MinioModule.registerAsync(getMinioConfig()),
    KnexModule.forRootAsync(getKnexConfig()),
    RMQModule.forRootAsync(getRMQConfig()),
  ],
})
export class App { }
