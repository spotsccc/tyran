import { normalizeArtifacts, normalizeLots } from '@/shared/lib/normilizer'
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { GetLotsData } from 'api-contract'
import { ArtifactsRepository } from '@/infrastructure/artifacts.repository'
import { LotsRepository } from '@/infrastructure/lots.repository'
import { ARTIFACTS_REPOSITORY, LOTS_REPOSITORY } from './repositories.interface'

@Injectable()
export class LotsService {
  private readonly logger = new Logger(LotsService.name)

  constructor(
    @Inject(ARTIFACTS_REPOSITORY)
    private readonly artifactsRepository: ArtifactsRepository,
    @Inject(LOTS_REPOSITORY) private readonly lotsRepository: LotsRepository,
  ) { }

  public async getLots(): Promise<GetLotsData> {
    this.logger.log('getLots process started')
    try {
      const lots = await this.lotsRepository.getByFilter()
      const artifacts = await this.artifactsRepository.getByIds({
        ids: lots.map(({ artifactId }) => artifactId),
      })
      this.logger.log('getLots processed')
      return {
        lots: normalizeLots({ lots }),
        artifacts: normalizeArtifacts({ artifacts }),
      }
    } catch (error) {
      this.logger.error('getLots failed')
      throw new InternalServerErrorException('getLots failed', { cause: error })
    }
  }
}
