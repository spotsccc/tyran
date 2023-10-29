import {
  BadRequestException,
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
import { RMQRoute } from 'nestjs-rmq'
import {
  GemParsePipe,
  OrderParsePipe,
  PropertyParsePipe,
  RarityParsePipe,
} from '@/shared/lib/pipes'

@Controller('/api/artifacts')
export class ArtifactsController {
  constructor(private readonly artifactsService: ArtifactsService) {}

  @Get('')
  public async getArtifacts(
    @Query('owner', new ParseArrayPipe({ items: String, separator: ',' }))
    owner: Array<string>,
    @Query('count', new ParseIntPipe()) count: number,
    @Query('offset', new ParseIntPipe()) offset: number,
    @Query('gem', GemParsePipe) gem: Array<string>,
    @Query('rarity', RarityParsePipe)
    rarity: Array<string>,
    @Query('property', PropertyParsePipe)
    property: Array<string>,
    @Query('order', new OrderParsePipe()) order: Order,
  ): Promise<GetArtifactsResponse> {
    const filters = this.queryParamsToFiltersMap({
      owner,
      property,
      rarity,
      gem,
    })
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

  @RMQRoute('artifacts.minted')
  public async minted(artifact: Artifact) {
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

  @RMQRoute('artifacts.placed')
  public async placed(event: PlacedEvent) {
    try {
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
    gem,
  }: {
    owner: Array<string>
    property: Array<string>
    rarity: Array<string>
    gem: Array<string>
  }): Array<Filter> {
    return [
      ...owner.map((owner) => ({ owner })),
      ...(rarity ?? []).map((rarity) => ({ rarity })),
      ...(property ?? []).map((property) => ({ property })),
      ...(gem ?? []).map((gem) => ({ gem })),
    ]
  }
}
