import { Artifact, Gem, Property, Rarity } from 'api-contract'

import {
  LightningIcon,
  RombIcon,
  PuzzleIcon,
  Skull,
  EpicBackground,
  LegendaryBackground,
  RareBackground,
  MysteryBackground,
  Star,
  Spiral,
  YellowGem,
  GreenGem,
  BlueGem,
  RedGem,
} from '../assets'

export type ArtifactCardProps = {} & Artifact

export function ArtifactCard({
  property,
  id,
  rarity,
  name,
  gems,
}: ArtifactCardProps) {
  return (
    <div className="border-2 h-0 border-gray-600 pb-[120%] rounded-3xl relative bg-base-white/10 overflow-hidden">
      <RarityBackground rarity={rarity} />
      <PropertyBackground property={property} />
      <img
        src="/public/blade.png"
        alt="blade"
        className="absolute w-[100%] h-[100%] right-[-5%]"
      />
      <p className="absolute top-4 left-4 text-xl font-bold w-4">{name}</p>
      <div className="absolute top-4 right-4">
        <div className="px-2 py-1 bg-base-white rounded-xl">
          <p className="text-base-black text-xs">#{id}</p>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <LightningIcon />
          <p className="text-xs">{rarity}</p>
        </div>
        <div className="flex items-center gap-2">
          <PuzzleIcon />
          <p className="text-xs">{property}</p>
        </div>
        {gems.some((gem) => gem !== Gem.empty) && (
          <div className="flex items-center gap-2">
            <RombIcon fill="#ffffff" width="16" height="16" />
            <Gems gems={gems} />
          </div>
        )}
      </div>
      <p className="absolute bottom-4 right-4 text-lg font-bold">0.95 ETH</p>
    </div>
  )
}

function PropertyBackground({ property }: { property: Property }) {
  switch (property) {
    case Property.enchanted:
      return <Spiral className="absolute h-[100%] w-[100%]" />
    case Property.cursed:
      return <Skull className="absolute right-0 h-[70%] w-[70%]" />
    case Property.magic:
      return <Star className="absolute right-0 h-[70%] w-[70%]" />
    case Property.common:
    default:
      return null
  }
}

function RarityBackground({ rarity }: { rarity: Rarity }) {
  switch (rarity) {
    case Rarity.common:
      return (
        <div className="absolute right-0 top-0 bg-[#F6F6F6] blur-[50px] w-[80%] h-[60%]" />
      )
    case Rarity.rare:
      return (
        <RareBackground className="absolute left-0 top-0 h-[100%] w-[100%]" />
      )
    case Rarity.epic:
      return (
        <EpicBackground className="absolute left-0 top-0 h-[100%] w-[100%]" />
      )
    case Rarity.legendary:
      return (
        <LegendaryBackground className="absolute left-0 top-0 h-[100%] w-[100%]" />
      )
    case Rarity.mystery:
      return (
        <MysteryBackground className="absolue left-0 top-0 h-[100%] w-[100%]" />
      )
    default:
      return (
        <div className="absolute right-0 top-0 bg-[#F6F6F6] blur-[50px] w-[80%] h-[60%]" />
      )
  }
}

function Gems({ gems }: { gems: Array<Gem> }) {
  return (
    <div className="flex gap-1">
      {gems.map((gem) => {
        switch (gem) {
          case Gem.yellow:
            return <YellowGem />
          case Gem.green:
            return <GreenGem />
          case Gem.blue:
            return <BlueGem />
          case Gem.red:
            return <RedGem />
          case Gem.empty:
          default:
            return null
        }
      })}
    </div>
  )
}
