import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { BaseContract } from 'ethers'
import { artifacts, ethers } from 'hardhat'

async function deploy() {
  const [deployer] = await ethers.getSigners()
  console.log(`Deploying with ${await deployer.getAddress()}`)

  const TyranShop = await ethers.deployContract('Shop', deployer)
  await TyranShop.waitForDeployment()
  await saveFrontendFiles({ Shop: TyranShop })
}

async function saveFrontendFiles(contracts: Record<string, BaseContract>) {
  const contractsDirPath = join(__dirname, '..', 'artifacts', 'contracts')
  if (!existsSync(contractsDirPath)) {
    mkdirSync(contractsDirPath)
  }
  for (const [name, contract] of Object.entries(contracts)) {
    const contractDirPath = join(contractsDirPath, `${name}.sol`)
    if (!existsSync(contractDirPath)) {
      mkdirSync(contractDirPath)
    }
    const contractAddressFilePath = join(contractDirPath, 'address.ts')
    writeFileSync(
      contractAddressFilePath,
      `export const address = '${await contract.getAddress()}'`,
    )
  }
}

deploy()
