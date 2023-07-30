import { Shop } from '../typechain-types'
import { Signer } from 'ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'

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
    await shop.connect(signer1).buy({ value: 100000 })

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
})
