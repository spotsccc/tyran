import { Signer } from 'ethers'
import { ethers } from 'hardhat'
import { ERC721 } from '../typechain-types'
import { expect } from 'chai'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

describe('ERC721', () => {
  let owner: Signer
  let client1: Signer
  let client2: Signer
  let erc721: ERC721

  beforeEach(async () => {
    ;[owner, client1, client2] = await ethers.getSigners()
    erc721 = await ethers.deployContract(
      'ERC721',
      ['test name', 'test symbol'],
      owner,
    )
    await erc721.waitForDeployment()
  })

  it('should be deployed with correct properties', async () => {
    expect(await erc721.owner()).to.eq(await owner.getAddress())
    expect(await erc721.name()).to.eq('test name')
    expect(await erc721.symbol()).to.eq('test symbol')
  })

  it('should be possible to safe mint a token by owner', async () => {
    const client1Address = await client1.getAddress()

    await expect(erc721.connect(owner).safeMint(client1Address, 1))
      .to.emit(erc721, 'Minted')
      .withArgs(client1Address, 1)
    expect(await erc721.ownerOf(1)).to.eq(client1Address)
    expect(await erc721.balanceOf(client1Address)).to.eq(1)
  })

  it('transaction should be reverted if not owner try to mint', async () => {
    const client1Address = await client1.getAddress()

    await expect(
      erc721.connect(client1).safeMint(client1Address, 0),
    ).to.be.revertedWith('Access denied!')
  })

  it('transaction should be reverted if try to mint token that already exist', async () => {
    const client1Address = await client1.getAddress()

    await erc721.connect(owner).safeMint(client1Address, 0)
    await expect(
      erc721.connect(owner).safeMint(client1Address, 0),
    ).to.be.revertedWith('Token already exist!')
  })

  it('should be possible to approve access to token by token owner', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()
    await erc721.connect(owner).safeMint(ownerAddress, 0)

    await expect(erc721.approve(client1Address, 0))
      .to.emit(erc721, 'Approval')
      .withArgs(ownerAddress, client1Address, 0)
    expect(await erc721.getApproved(0)).to.eq(client1Address)
  })

  it('transaction should be reverted if not owner try to approve access to token', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()
    await erc721.connect(owner).safeMint(ownerAddress, 0)

    await expect(
      erc721.connect(client1).approve(client1Address, 0),
    ).to.be.revertedWith('Access denied!')
  })

  it('transaction should be reverted if try to approve access to token that not exist', async () => {
    const client1Address = await client1.getAddress()

    await expect(
      erc721.connect(client1).approve(client1Address, 0),
    ).to.be.revertedWith('Access denied!')
  })

  it('should be possible to set approve for all to true', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()

    await expect(erc721.connect(owner).setApprovalForAll(client1Address, true))
      .to.emit(erc721, 'ApprovalForAll')
      .withArgs(ownerAddress, client1Address, true)
    expect(await erc721.isApprovedForAll(ownerAddress, client1Address)).to.eq(
      true,
    )
  })

  it('should be possible to set approve for all to false', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()

    await expect(erc721.connect(owner).setApprovalForAll(client1Address, false))
      .to.emit(erc721, 'ApprovalForAll')
      .withArgs(ownerAddress, client1Address, false)
    expect(await erc721.isApprovedForAll(ownerAddress, client1Address)).to.eq(
      false,
    )
  })

  it('should be possible to approve access to token by operator who has access for all', async () => {
    const client1Address = await client1.getAddress()
    const client2Address = await client2.getAddress()
    const ownerAddress = await owner.getAddress()

    await erc721.connect(owner).safeMint(ownerAddress, 0)
    await erc721.connect(owner).setApprovalForAll(client1Address, true)
    await erc721.connect(client1).approve(client2Address, 0)

    expect(await erc721.getApproved(0)).to.eq(client2Address)
  })

  it('should be possible to transfer token by owner', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()

    await erc721.connect(owner).safeMint(ownerAddress, 0)

    await expect(
      erc721.connect(owner).safeTransferFrom(ownerAddress, client1Address, 0),
    )
      .to.emit(erc721, 'Transfer')
      .withArgs(ownerAddress, client1Address, 0)
    expect(await erc721.ownerOf(0)).to.eq(client1Address)
    expect(await erc721.balanceOf(client1Address)).to.eq(1)
    expect(await erc721.balanceOf(ownerAddress)).to.eq(0)
  })

  it('should be possible to transfer token by operator who has access for all', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()

    await erc721.connect(owner).safeMint(ownerAddress, 0)
    await erc721.connect(owner).setApprovalForAll(client1Address, true)

    await expect(
      erc721.connect(client1).safeTransferFrom(ownerAddress, client1Address, 0),
    )
      .to.emit(erc721, 'Transfer')
      .withArgs(ownerAddress, client1Address, 0)
    expect(await erc721.ownerOf(0)).to.eq(client1Address)
    expect(await erc721.balanceOf(client1Address)).to.eq(1)
    expect(await erc721.balanceOf(ownerAddress)).to.eq(0)
  })

  it('should be possible to transfer token with approve', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()

    await erc721.connect(owner).safeMint(ownerAddress, 0)
    await erc721.connect(owner).approve(client1Address, 0)

    await expect(
      erc721.connect(client1).safeTransferFrom(ownerAddress, client1Address, 0),
    )
      .to.emit(erc721, 'Transfer')
      .withArgs(ownerAddress, client1Address, 0)
    expect(await erc721.ownerOf(0)).to.eq(client1Address)
    expect(await erc721.getApproved(0)).to.eq(ZERO_ADDRESS)
    expect(await erc721.balanceOf(client1Address)).to.eq(1)
    expect(await erc721.balanceOf(ownerAddress)).to.eq(0)
  })

  it('transaction should be reverted if try to transfer token without approve', async () => {
    const client1Address = await client1.getAddress()
    const ownerAddress = await owner.getAddress()

    await erc721.connect(owner).safeMint(ownerAddress, 0)
    await expect(
      erc721.connect(client1).safeTransferFrom(ownerAddress, client1Address, 0),
    ).to.be.revertedWith('Access denied!')
  })
})
