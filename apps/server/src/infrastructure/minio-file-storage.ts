import { Readable as ReadableStream } from 'node:stream'
import { IFileStorage } from '@/application/file-storage.interface'
import { MinioService } from 'nestjs-minio-client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MinioFileStorage implements IFileStorage {
  constructor(private readonly minio: MinioService) { }

  public async getFile({ id }: { id: string }) {
    const isBucketExist = await this.minio.client.bucketExists('avatar')
    if (!isBucketExist) {
      await this.minio.client.makeBucket('avatar')
    }
    return this.minio.client.getObject('avatar', id)
  }

  public async saveFile({
    id: name,
    fileStream,
  }: {
    id: string
    fileStream: ReadableStream
  }) {
    const isBucketExist = await this.minio.client.bucketExists('avatar')
    if (!isBucketExist) {
      await this.minio.client.makeBucket('avatar')
    }
    await this.minio.client.putObject('avatar', name, fileStream)
  }
}
