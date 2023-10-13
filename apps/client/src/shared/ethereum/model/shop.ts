import { BoughtEvent } from 'api-contract'
import { Shop, shopAddress, shopJson } from 'contracts'
import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from 'effector'
import { ethers, parseUnits, Signer } from 'ethers'
import { SelectedAccountError, ShopNotInitialized } from '../errors'
import { $$account } from './account'

const $shop = createStore<Shop | null>(null)
const $error = createStore<Error | null>(null)

const shopInitialized = createEvent<Shop>()
const shopInitializationFailed = createEvent<Error>()
const init = createEvent()
const bought = createEvent<BoughtEvent>()
// todo: Добавить нормальные типы
const approved = createEvent<any>()
const approvedForAll = createEvent<any>()
const boughtFromSeller = createEvent<any>()
const placed = createEvent<any>()
const transferred = createEvent<any>()

const initShopFx = createEffect(
  async ({ selectedAccount }: { selectedAccount: Signer | null }) => {
    if (selectedAccount === null) {
      throw new SelectedAccountError(
        'Try init artifact-filler with null selected account.ts',
      )
    }
    const shop = new ethers.Contract(
      shopAddress,
      shopJson.abi,
      selectedAccount,
    ) as unknown as Shop
    const approvalBounded = scopeBind(approved)
    const transferredBounded = scopeBind(transferred)
    const placedBounded = scopeBind(placed)
    const boughtFromSellerBounded = scopeBind(boughtFromSeller)
    const approvalForAllBounded = scopeBind(approvedForAll)
    await shop.on(shop.filters.Approval, approvalBounded)
    await shop.on(shop.filters.ApprovalForAll, approvalForAllBounded)
    await shop.on(shop.filters.Placed, placedBounded)
    await shop.on(shop.filters.Transfer, transferredBounded)
    await shop.on(shop.filters.BoughtFromSeller, boughtFromSellerBounded)
    return shop
  },
)

const buyArtifactFromMarketFx = attach({
  effect: createEffect(
    async ({
      shop,
      tokenId,
      value,
    }: {
      shop: Shop | null
      tokenId: string
      value: string
    }) => {
      if (shop === null) {
        throw new ShopNotInitialized(
          'Try buy artifact from market before shop initialized',
        )
      }
      return await shop.buyFromSeller(tokenId, { value })
    },
  ),
  source: {
    shop: $shop,
  },
  mapParams({ tokenId, value }: { tokenId: string; value: string }, { shop }) {
    return { tokenId, shop, value }
  },
})

const buyArtifactFx = attach({
  effect: createEffect(async ({ shop }: { shop: Shop | null }) => {
    if (shop === null) {
      throw new ShopNotInitialized(
        'Try buy artifact before artifact-filler initialized',
      )
    }
    await shop.buy({ value: parseUnits('1.0', 18), gasLimit: 30000000 })
  }),
  source: { shop: $shop },
})

const ownerOfFx = attach({
  effect: createEffect(
    async ({ shop, id }: { shop: Shop | null; id: string }) => {
      if (shop === null) {
        throw new ShopNotInitialized(
          'Try get owner of artifact before artifact-filler initialized',
        )
      }
      return await shop.ownerOf(id)
    },
  ),
  source: { shop: $shop },
  mapParams({ id }: { id: string }, { shop }) {
    return { id, shop }
  },
})

const placeArtifactFx = attach({
  effect: createEffect(
    async ({
      shop,
      id,
      price,
    }: {
      shop: Shop | null
      id: string
      price: string
    }) => {
      if (shop === null) {
        throw new ShopNotInitialized(
          'Try place artifact before artifact-filler initialized',
        )
      }
      await shop.placeToMarket(id, price)
    },
  ),
  source: { shop: $shop },
  mapParams({ id, price }: { id: string; price: string }, { shop }) {
    return { id, price, shop }
  },
})

const getArtifactFx = attach({
  effect: createEffect(
    async ({ shop, id }: { shop: Shop | null; id: string }) => {
      if (shop === null) {
        throw new ShopNotInitialized(
          'Try get artifact before artifact-filler initialized',
        )
      }
      return await shop.getWeapon(id)
    },
  ),
  source: { shop: $shop },
  mapParams({ id }: { id: string }, { shop }) {
    return { id, shop }
  },
})

sample({
  clock: init,
  source: $$account.outputs.$selected,
  fn: (selectedAccount) => ({ selectedAccount }),
  target: initShopFx,
})

sample({
  clock: initShopFx.doneData,
  target: [$shop, shopInitialized],
})

sample({
  clock: initShopFx.failData,
  target: [shopInitializationFailed, $error],
})

export const $$shop = {
  inputs: {
    init,
    buyArtifactFx,
    ownerOfFx,
    placeArtifactFx,
    getArtifactFx,
    buyArtifactFromMarketFx,
  },
  outputs: {
    shopInitialized,
    shopInitializationFailed,
    transferred,
    approved,
    approvedForAll,
    placed,
    bought,
    boughtFromSeller,
    $error,
  },
}
