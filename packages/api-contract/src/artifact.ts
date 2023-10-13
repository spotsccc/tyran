import { Shop } from 'contracts'

export type BoughtEvent = { buyer: string; tokenId: string }
export type PlacedEvent = { seller: string; tokenId: string; price: string }
export type BoughtFromMarketEvent = {
  buyer: string
  tokenId: string
  seller: string
  price: string
}

export type ArtifactRaw = [[bigint, bigint, bigint], bigint, bigint]

export enum Rarity {
  common = 'common',
  rare = 'rare',
  epic = 'epic',
  legendary = 'legendary',
  mystery = 'mystery',
}

export enum Property {
  common = 'common',
  enchanted = 'enchanted',
  cursed = 'cursed',
  magic = 'magic',
}

export enum Gem {
  yellow = 'yellow',
  green = 'green',
  blue = 'blue',
  red = 'red',
  empty = 'empty',
}

type GemRaw = '0' | '1' | '2' | '3' | '4'
type RarityRaw = '0' | '1' | '2' | '3' | '4'
type PropertyRaw = '0' | '1' | '2' | '3'

const GEM_MAPPER = {
  '0': Gem.empty,
  '1': Gem.yellow,
  '2': Gem.green,
  '3': Gem.blue,
  '4': Gem.red,
}

const RARITY_MAPPER = {
  '0': Rarity.common,
  '1': Rarity.rare,
  '2': Rarity.epic,
  '3': Rarity.legendary,
  '4': Rarity.mystery,
}

const PROPERTY_MAPPER = {
  '0': Property.common,
  '1': Property.enchanted,
  '2': Property.cursed,
  '3': Property.magic,
}

export type Artifact = {
  id: string
  name: string
  rarity: Rarity
  property: Property
  gems: Array<Gem>
  owner: string
}

export function artifactMap({
  artifactRow,
  id,
  owner,
}: {
  artifactRow: Shop.WeaponStructOutput
  id: string
  owner: string
}): Artifact {
  return {
    gems: artifactRow.gems.map((gem) => GEM_MAPPER[gem.toString() as GemRaw]),
    rarity: RARITY_MAPPER[artifactRow.rarity.toString() as RarityRaw],
    property: PROPERTY_MAPPER[artifactRow.property.toString() as PropertyRaw],
    name: 'Frostmorn',
    id: id.toString(),
    owner,
  }
}
