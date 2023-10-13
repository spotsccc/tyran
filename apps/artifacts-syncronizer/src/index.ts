import amqp from 'amqplib'
import { BoughtEvent, BoughtFromMarketEvent, PlacedEvent } from 'api-contract'
import { JsonRpcProvider, Contract } from 'ethers'
import {
  Shop,
  shopAddress,
  shopJson,
  TypedContractEvent,
  TypedEventLog,
} from 'contracts'
import { Logger, pino } from 'pino'

export interface IMessageSender {
  connect: () => Promise<void>
  bought: (e: BoughtEvent) => void
  boughtFromMarket: (e: BoughtFromMarketEvent) => void
  placed: (e: PlacedEvent) => void
}

export class RabbitMessageSender {
  private connection: amqp.Connection | null = null
  private channel: amqp.Channel | null = null

  constructor(private readonly host: string) { }

  /**
   * @throws
   */
  public async connect() {
    this.connection = await amqp.connect(this.host)
    this.channel = await this.connection.createChannel()
    await this.assertQueues()
  }

  private async assertQueues() {
    await this.channel?.assertQueue('bought')
    await this.channel?.assertQueue('boughtFromMarket')
    await this.channel?.assertQueue('placed')
  }

  public bought(event: BoughtEvent) {
    this.channel?.sendToQueue('bought', Buffer.from(JSON.stringify(event)))
  }

  public placed(event: PlacedEvent) {
    this.channel?.sendToQueue('placed', Buffer.from(JSON.stringify(event)))
  }

  public boughtFromMarket(event: BoughtFromMarketEvent) {
    this.channel?.sendToQueue(
      'boughtFromMarket',
      Buffer.from(JSON.stringify(event)),
    )
  }
}

export class ProviderListener {
  private startedBlockNumber = 0

  constructor(
    private readonly messageSender: IMessageSender,
    private readonly provider: JsonRpcProvider,
    private readonly shop: Shop,
    private readonly logger: Logger,
  ) { }

  public async listen() {
    await this.messageSender.connect()
    this.startedBlockNumber = await this.provider.getBlockNumber()
    await this.subscribeBought()
    await this.subscribePlaced()
    await this.subscribeBoughtFromMarket()

    console.log('1')
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
      console.log(132)
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
        console.log('sooka')
        this.logger.info(
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

  private onBought = (event: BoughtEvent) => {
    this.messageSender.bought(event)
    this.logger.info({ event }, '"Bought" event processed')
  }

  private onPlacedToMarket = (event: PlacedEvent) => {
    this.messageSender.placed(event)
    this.logger.info({ event }, '"Placed" event processed')
  }

  private onBoughtFromMarket = (event: BoughtFromMarketEvent) => {
    this.messageSender.boughtFromMarket(event)
    this.logger.info({ event }, '"BoughtFromMarket" event processed')
  }
}

async function main() {
  const logger = pino()
  const messageSender = new RabbitMessageSender(process.env.RABBITMQ_URL!)
  const ethersProvider = new JsonRpcProvider(process.env.HARDHAT_URL!)

  const shopContract = new Contract(
    shopAddress,
    shopJson.abi,
    ethersProvider,
  ) as unknown as Shop

  const providerListener = new ProviderListener(
    messageSender,
    ethersProvider,
    shopContract,
    logger,
  )

  await providerListener.listen()
}

main()
