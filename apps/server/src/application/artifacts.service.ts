import { Artifact, GetArtifactData, GetArtifactsData } from 'api-contract'
import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { normalizeArtifacts, normalizeLots } from '@/shared/lib/normilizer'
import {
  ARTIFACTS_REPOSITORY,
  IArtifactsRepository,
  ILotsRepository,
  ISaleRecordsRepository,
  LOTS_REPOSITORY,
  SALE_RECORDS_REPOSITORY,
} from './repositories.interface'
import { Inject, Logger } from '@nestjs/common'

export type Filter = {
  name?: string
  id?: string
  rarity?: string
  property?: string
  isOnSell?: boolean
  gem?: string
  owner?: string
}

export enum Order {
  direct = 'direct',
  reverse = 'reverse',
}

/**
 * @description Represent all function that user can do with artifacts.
 */
export class ArtifactsService {
  private readonly logger = new Logger(ArtifactsService.name)

  constructor(
    @Inject(ARTIFACTS_REPOSITORY)
    private readonly artifactsRepository: IArtifactsRepository,
    @Inject(LOTS_REPOSITORY) private readonly lotsRepository: ILotsRepository,
    @Inject(SALE_RECORDS_REPOSITORY)
    private readonly saleRecordsRepository: ISaleRecordsRepository,
  ) { }

  public async getById({ id }: { id: string }): Promise<GetArtifactData> {
    this.logger.log({ id }, '"getById" process started')
    try {
      const artifact = await this.artifactsRepository.getById({ id })
      if (!artifact) {
        throw new NotFoundException(`Artifact with id = ${id} not found`)
      }
      const lot = await this.lotsRepository.getByArtifactId({
        artifactId: artifact.id,
      })
      this.logger.log({ artifact, lot }, '"getById" processed')
      return { lot, artifact }
    } catch (error) {
      this.logger.error({ error }, '"getById" failed')
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(
        `Can't get artifact by id = ${id}`,
        {
          cause: error,
        },
      )
    }
  }

  public async mint(artifact: Artifact): Promise<void> {
    this.logger.log({ artifact }, 'artifact insertion started')
    try {
      await this.artifactsRepository.insert(artifact)
    } catch (error) {
      this.logger.log({ artifact }, 'artifact insertion failed')
      throw new InternalServerErrorException('artifact insertion failed', {
        cause: error,
      })
    }
  }

  public async buyFromMarket({
    artifactId,
    buyer,
    seller,
    price,
  }: {
    artifactId: string
    buyer: string
    price: string
    seller: string
  }) {
    try {
      const lot = await this.lotsRepository.getByArtifactId({
        artifactId,
      })
      if (!lot) {
        throw new NotFoundException(
          `Lot with artifactId = ${artifactId} not found`,
        )
      }
      await this.artifactsRepository.update({
        id: artifactId,
        artifact: { owner: buyer },
      })
      await this.lotsRepository.deleteByArtifactId({ artifactId })
      await this.saleRecordsRepository.insert({
        seller,
        buyer,
        price,
        artifactId,
        saleDate: new Date().toISOString(),
        lotCreationDate: lot.creationDate,
      })
      this.logger.log(
        { buyer, artifactId, seller, price },
        '"boughtFromMarket" event processed',
      )
    } catch (error) {
      this.logger.error(error, '"boughtFromMarket" event process failed')
      throw error
    }
  }

  public placeToMarket = async ({
    seller,
    artifactId,
    price,
  }: {
    seller: string
    artifactId: string
    price: string
  }) => {
    this.logger.log(
      {
        seller,
        artifactId,
        price,
      },
      '"placed" event process started',
    )
    try {
      await this.lotsRepository.insert({
        price,
        artifactId,
        creationDate: new Date().toISOString(),
      })
      this.logger.log(
        {
          price,
          artifactId,
        },
        '"placed" event processed',
      )
    } catch (error) {
      this.logger.error(error, '"placed" event process failed')
      throw error
    }
  }

  public async getByFilters({
    filters,
    count,
    offset,
    order,
  }: {
    filters: Array<Filter>
    count: number
    offset: number
    order: Order
  }): Promise<GetArtifactsData> {
    this.logger.log(
      { filters, count, offset, order },
      '"getByFilters" process started',
    )
    try {
      const artifacts = await this.artifactsRepository.getByFilters({
        filters,
        count,
        offset,
        order,
      })
      const normalizedArtifacts = normalizeArtifacts({ artifacts })
      const lots = await this.lotsRepository.getByArtifactIds({
        artifactIds: normalizedArtifacts.ids,
      })
      const normalizedLots = normalizeLots({ lots })
      this.logger.log(
        { normalizedArtifacts, normalizedLots },
        '"getByFilters" processed',
      )
      return {
        lots: normalizedLots,
        artifacts: normalizedArtifacts,
      }
    } catch (error) {
      this.logger.error(
        { error, filters, count, offset, order },
        '"getByFilters" failed',
      )
      throw new InternalServerErrorException('"getByFilters" failed', {
        cause: error,
      })
    }
  }
}
