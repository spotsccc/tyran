import { ConfigService, ConfigModule } from '@nestjs/config'

export function getMinioConfig() {
  return {
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      endPoint: configService.getOrThrow('MINIO_HOST'),
      port: parseInt(configService.getOrThrow('MINIO_PORT')),
      useSSL: false,
      accessKey: configService.getOrThrow('MINIO_ACCESS_KEY'),
      secretKey: configService.getOrThrow('MINIO_SECRET_KEY'),
    }),
  }
}
