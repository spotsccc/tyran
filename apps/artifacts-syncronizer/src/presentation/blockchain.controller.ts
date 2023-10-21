import { Controller, Logger } from '@nestjs/common'
import {
  BoughtEvent,
  BoughtFromMarketEvent,
  PlacedEvent,
  artifactMap,
} from 'api-contract'
import {
  Shop,
  TypedContractEvent,
  TypedEventLog,
  shopAddress,
  shopJson,
} from 'contracts'
import { Contract, JsonRpcProvider } from 'ethers'
import { RMQService } from 'nestjs-rmq'

@Controller()
export class BlockchainController {
  private readonly logger = new Logger()
  private readonly provider: JsonRpcProvider
  private readonly shop: Shop
  private startedBlockNumber = 0

  constructor(private readonly rmqService: RMQService) {
    this.provider = new JsonRpcProvider(process.env.BLOCKCHAIN_URL)
    this.shop = new Contract(
      shopAddress,
      shopJson.abi,
      this.provider,
    ) as unknown as Shop
    console.log('constructor')
    this.listen()
  }

  public async listen() {
    this.startedBlockNumber = await this.provider.getBlockNumber()
    await this.subscribeBought()
    await this.subscribePlaced()
    await this.subscribeBoughtFromMarket()

    /* Workaround for https://github.com/ethers-io/ethers.js/issues/2338
     * Resubscribe to events every minute, to prevent subscribe crushing.
     */
    setInterval(async () => {
      this.startedBlockNumber = await this.provider.getBlockNumber()
      await this.resubscribeBought()
      await this.resubscribePlaced()
      await this.resubscribeBoughtFromMarket()
    }, 60000)
  }

  private async subscribeBought() {
    const onBoughtFiltered = this.filterOutdatedEvents(this.onBought)
    await this.shop.on(this.shop.filters.Bought, (buyer, tokenId, event) => {
      onBoughtFiltered({ buyer, tokenId: tokenId.toString() }, event)
    })
  }

  private async resubscribeBought() {
    await this.shop.removeAllListeners(this.shop.filters.Bought)
    await this.subscribeBought()
  }

  private async subscribePlaced() {
    const onPlacedToMarketFiltered = this.filterOutdatedEvents(
      this.onPlacedToMarket,
    )

    await this.shop.on(
      this.shop.filters.Placed,
      (seller, price, tokenId, event) =>
        onPlacedToMarketFiltered(
          { seller, tokenId: tokenId.toString(), price: price.toString() },
          event,
        ),
    )
  }

  private async resubscribePlaced() {
    await this.shop.removeAllListeners(this.shop.filters.Placed)
    await this.subscribePlaced()
  }

  private async subscribeBoughtFromMarket() {
    const onBoughtFromMarketFiltered = this.filterOutdatedEvents(
      this.onBoughtFromMarket,
    )
    await this.shop.on(
      this.shop.filters.BoughtFromSeller,
      (seller, buyer, price, tokenId, event) =>
        onBoughtFromMarketFiltered(
          {
            seller,
            buyer,
            tokenId: tokenId.toString(),
            price: price.toString(),
          },
          event,
        ),
    )
  }

  private async resubscribeBoughtFromMarket() {
    await this.shop.removeAllListeners(this.shop.filters.BoughtFromSeller)
    await this.subscribeBoughtFromMarket()
  }

  /**
   * @description Filter outdated events.
   * @param eventHandler
   */
  private filterOutdatedEvents =
    <T>(eventHandler: (data: T) => void) =>
    async (eventData: T, event: TypedEventLog<TypedContractEvent>) => {
      const block = await event.getBlock()
      this.logger.log(
        {
          eventData,
          eventBlock: block.number,
          startedBlockNumber: this.startedBlockNumber,
        },
        `"${event.eventName}" event fired`,
      )
      /* Prevent processing outdated events.
       * Process events if event block number more than number of block when subscription started.
       */
      if (block.number > this.startedBlockNumber) {
        eventHandler(eventData)
      }
    }

  private onBought = async (event: BoughtEvent) => {
    const artifactRaw = await this.shop.getWeapon(event.tokenId)
    const artifact = artifactMap({
      artifactRaw,
      id: event.tokenId.toString(),
      owner: event.buyer.toString(),
    })
    this.rmqService.notify('artifacts.minted', {
      ...artifact,
      rarity: artifact.rarity,
    })
    this.logger.log({ event }, '"Bought" event processed')
  }

  private onPlacedToMarket = (event: PlacedEvent) => {
    this.rmqService.notify('artifacts.placed', event)
    this.logger.log({ event }, '"Placed" event processed')
  }

  private onBoughtFromMarket = (event: BoughtFromMarketEvent) => {
    this.rmqService.notify('artifacts.bought', event)
    this.logger.log({ event }, '"BoughtFromMarket" event processed')
  }
}
