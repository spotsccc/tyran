import { Shop } from '../typechain-types'
import { Signer } from 'ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

describe('Shop', () => {
  let shop: Shop
  let owner: Signer
  let signer1: Signer
  let signer2: Signer

  beforeEach(async () => {
    ;[owner, signer1, signer2] = await ethers.getSigners()
    shop = await ethers.deployContract('Shop', owner)
    await shop.waitForDeployment()
  })

  it('it should be possible to buy the NFT', async () => {
    await expect(shop.connect(signer1).buy({ value: 100000 }))
      .to.emit(shop, 'Bought')
      .withArgs(await signer1.getAddress(), 0)

    expect(await shop.ownerOf(0)).to.eq(await signer1.getAddress())
    const weapon = await shop.getWeapon(0)
    expect(Array.isArray(weapon[0])).to.be.true
    expect(weapon[0].length).to.eq(3)
    expect(typeof weapon[0][0]).to.eq('bigint')
    expect(typeof weapon[0][1]).to.eq('bigint')
    expect(typeof weapon[0][2]).to.eq('bigint')
    expect(typeof weapon[1]).to.eq('bigint')
    expect(typeof weapon[2]).to.eq('bigint')
  })

  it('should revert transaction if sent not enough funds', async () => {
    await expect(shop.connect(signer1).buy({ value: 100 })).to.revertedWith(
      'Not enough funds!',
    )
  })

  it('should be possible to place weapon for sale', async () => {
    const tokenId = 0
    const price = 10000000
    await shop.connect(signer1).buy({ value: 100000 })
    await expect(shop.connect(signer1).placeToMarket(tokenId, price))
      .to.emit(shop, 'Placed')
      .withArgs(await signer1.getAddress(), price, tokenId)
    expect(await shop.getApproved(tokenId)).to.eq(await shop.getAddress())
    const placedItem = await shop.getPlacedItem(tokenId)
    expect(placedItem[0]).eq(await signer1.getAddress())
    expect(placedItem[1]).eq(price)
    expect(placedItem[2]).eq(tokenId)
  })

  it("should revert transaction if user try to place token that he don't own", async () => {
    await shop.connect(signer1).buy({ value: 100000 })
    await expect(shop.connect(signer2).placeToMarket(0, 1)).revertedWith(
      'Access denied!',
    )
  })

  it('should be possible to buy item from seller', async () => {
    const price = 10000000
    const tokenId = 0
    await shop.connect(signer1).buy({ value: 100000 })
    await shop.connect(signer1).placeToMarket(tokenId, price)

    const tx = shop.connect(signer2).buyFromSeller(tokenId, { value: price })
    await expect(tx)
      .to.emit(shop, 'BoughtFromSeller')
      .withArgs(
        await signer1.getAddress(),
        await signer2.getAddress(),
        price,
        tokenId,
      )
    await expect(tx).to.changeEtherBalance(signer1, price)
    expect(await shop.ownerOf(tokenId)).to.eq(await signer2.getAddress())
    expect(await shop.getApproved(tokenId)).to.eq(ZERO_ADDRESS)
    const placedItem = await shop.getPlacedItem(tokenId)
    expect(placedItem[0]).to.eq(ZERO_ADDRESS)
  })

  it('should revert transaction if owner of token changed', async () => {
    const price = 10000000
    const tokenId = 0
    await shop.connect(signer1).buy({ value: 100000 })
    await shop.connect(signer1).placeToMarket(tokenId, price)
    await shop
      .connect(signer1)
      .transferFrom(
        await signer1.getAddress(),
        await signer2.getAddress(),
        tokenId,
      )

    await expect(
      shop.connect(signer2).buyFromSeller(tokenId, { value: price }),
    ).to.be.revertedWith('Owner of item changed!')
  })

  it('should revert transaction if not enough funds', async () => {
    const price = 10000000
    const tokenId = 0
    await shop.connect(signer1).buy({ value: 100000 })
    await shop.connect(signer1).placeToMarket(tokenId, price)

    await expect(
      shop.connect(signer2).buyFromSeller(tokenId, { value: price - 1 }),
    ).to.be.revertedWith('Not enough funds!')
  })
})
