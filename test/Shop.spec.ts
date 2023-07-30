import { Shop } from '../typechain-types'
import { Signer } from 'ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
import exp from 'constants'

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
})
