import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  PipeTransform,
  Query,
} from '@nestjs/common'
import {
  Artifact,
  BoughtFromMarketEvent,
  GetArtifactResponse,
  GetArtifactsResponse,
  PlacedEvent,
  createSuccessResponse,
} from 'api-contract'
import { ArtifactsService, Filter } from '@/application/artifacts.service'
import { Order } from '@/application/repositories.interface'
import { ExtendedMessage, RMQMessage, RMQRoute, RMQService } from 'nestjs-rmq'

@Injectable()
export class OrderParsePipe implements PipeTransform {
  transform(value: unknown) {
    if (!value) {
      return Order.direct
    }
    if (value !== Order.direct && value !== Order.reverse) {
      throw new BadRequestException(
        `Order can be only ${Order.reverse} or ${Order.direct}`,
      )
    }
    return value
  }
}

@Injectable()
export class RarityParsePipe implements PipeTransform {
  transform(value: unknown) {
    const RARITY_VALUES = ['common', 'rare', 'epic', 'legendary', 'mystery']
    if (!value) {
      return []
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('Rarity has bad type')
    }
    const arr = value.split(',')
    if (arr.some((v) => !RARITY_VALUES.includes(v))) {
      throw new BadRequestException(
        `Rarity should contain only ${RARITY_VALUES.join(', ')}`,
      )
    }
    return arr
  }
}

@Injectable()
export class PropertyParsePipe implements PipeTransform {
  transform(value: unknown) {
    const PROPERTY_VALUES = ['common', 'cursed', 'magic', 'enchanted']
    if (!value) {
      return []
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('Rarity has bad type')
    }
    const arr = value.split(',')
    if (arr.some((v) => !PROPERTY_VALUES.includes(v))) {
      throw new BadRequestException(
        `Rarity should contain only ${PROPERTY_VALUES.join(', ')}`,
      )
    }
    return arr
  }
}

@Controller('/api/artifacts')
export class ArtifactsController {
  constructor(
    private readonly artifactsService: ArtifactsService,
    private readonly rmqService: RMQService,
  ) { }

  @Get('')
  public async getArtifacts(
    @Query('owner', new ParseArrayPipe({ items: String, separator: ',' }))
    owner: Array<string>,
    @Query('count', new ParseIntPipe()) count: number,
    @Query('offset', new ParseIntPipe()) offset: number,
    @Query('rarity', RarityParsePipe)
    rarity: Array<string>,
    @Query('property', PropertyParsePipe)
    property: Array<string>,
    @Query('order', new OrderParsePipe()) order: Order,
  ): Promise<GetArtifactsResponse> {
    const filters = this.queryParamsToFiltersMap({ owner, property, rarity })
    const artifacts = await this.artifactsService.getByFilters({
      filters,
      count,
      offset,
      order,
    })
    return createSuccessResponse({
      data: artifacts,
    })
  }

  @Get('/:id')
  public async getArtifact(
    @Param('id') id: string,
  ): Promise<GetArtifactResponse> {
    const artifact = await this.artifactsService.getById({ id })
    return createSuccessResponse({
      data: artifact,
    })
  }

  @RMQRoute('artifacts.minted', { manualAck: true })
  public async minted(artifact: Artifact) {
    console.log('\n', artifact, '\n')
    try {
      await this.artifactsService.mint(artifact)
    } catch (error) {
      throw new Error('Minted artifact event not processd', { cause: error })
    }
  }

  @RMQRoute('artifacts.bought')
  public async bought(event: BoughtFromMarketEvent) {
    try {
      await this.artifactsService.buyFromMarket({
        artifactId: event.tokenId,
        price: event.price,
        buyer: event.buyer,
        seller: event.seller,
      })
    } catch (error) {
      throw new Error('Bought artifact event not processd', { cause: error })
    }
  }

  @RMQRoute('artifacts.placed', { manualAck: true })
  public async placed(event: PlacedEvent) {
    console.log('\n', event, '\n')
    try {
      console.log('\n', event, '\n')
      await this.artifactsService.placeToMarket({
        artifactId: event.tokenId,
        seller: event.seller,
        price: event.price,
      })
    } catch (error) {
      throw new Error('Placed artifact event not processd', { cause: error })
    }
  }

  private queryParamsToFiltersMap({
    owner,
    property,
    rarity,
  }: {
    owner: Array<string>
    property: Array<string>
    rarity: Array<string>
  }): Array<Filter> {
    return [
      ...owner.map((owner) => ({ owner })),
      ...(rarity ?? []).map((rarity) => ({ rarity })),
      ...(property ?? []).map((property) => ({ property })),
    ]
  }
}
