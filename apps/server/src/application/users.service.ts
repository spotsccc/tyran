import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { IUsersRepository, USERS_REPOSITORY } from './repositories.interface'
import { FILE_STORAGE, IFileStorage } from './file-storage.interface'
import { User } from 'api-contract'
import { Readable as ReadableStream } from 'node:stream'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(FILE_STORAGE) private readonly fileStorage: IFileStorage,
  ) { }

  public async createUser({ address }: { address: string }) {
    this.logger.log({ address }, 'createUser process started')
    try {
      const user = await this.usersRepository.getByAddress({ address })
      if (!user) {
        this.logger.log(
          { address },
          `user with address ${address} not found, create new user`,
        )
        await this.usersRepository.insert({
          address,
          username: `user-${address}`,
          avatar: `http://localhost:4000/api/users/${address}/avatar`,
        })
        this.logger.log({ address }, 'user successfully created')
      }
      this.logger.log({ address }, 'createUser processed')
    } catch (error) {
      this.logger.error({ error, address }, 'createUser failed')
      throw new InternalServerErrorException('createUser failed', {
        cause: error,
      })
    }
  }

  public async getUser({ address }: { address: string }): Promise<User> {
    this.logger.log({ address }, 'getUser process started')
    try {
      console.log(address)
      const user = await this.usersRepository.getByAddress({ address })
      if (!user) {
        throw new NotFoundException(`User with address ${address} not found`)
      }
      this.logger.log({ address, user }, 'getUser processed')
      return user
    } catch (error) {
      console.log({ error, address })
      this.logger.error({ error, address }, 'getUser failed')
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('getUser failed', { cause: error })
    }
  }

  public async updateAvatar({
    address,
    avatar,
  }: {
    address: string
    avatar: ReadableStream
  }): Promise<void> {
    this.logger.log({ address }, 'updateAvatar process started')
    try {
      await this.fileStorage.saveFile({ id: address, fileStream: avatar })
      this.logger.log({ address }, 'updateAvatar precessed')
    } catch (error) {
      this.logger.error({ error }, 'updateAvatar process failed')
      throw new InternalServerErrorException('updateAvatar process failed', {
        cause: error,
      })
    }
  }

  public async getAvatar({ address }: { address: string }) {
    this.logger.log({ address }, 'getAvatar process started')
    try {
      const avatar = await this.fileStorage.getFile({ id: address })
      this.logger.log({ address }, 'getAvatar processed')
      return avatar
    } catch (error) {
      this.logger.error({ address, error }, 'getAvatar process failed')
      throw new InternalServerErrorException('getAvatar process failed', {
        cause: error,
      })
    }
  }
}
