import { Artifact } from 'api-contract'

import { LightningIcon, RombIcon, PuzzleIcon } from '../assets'

export type ArtifactCardProps = {} & Artifact

export function ArtifactCard({
  property,
  id,
  rarity,
  name,
}: ArtifactCardProps) {
  return (
    <div className="border-2 h-0 border-gray-600 pb-[120%] rounded-3xl relative bg-[#ffffff1a]">
      <div className="absolute w-[80%] h-[80%] top-0 left-[48px] bg-[#ffaeae38] rounded-full blur-3xl" />
      <img
        src="/public/blade.png"
        alt="blade"
        className="absolute bottom-0 right-4"
      />
      <p className="absolute top-4 left-4 text-xl font-bold w-4">{name}</p>
      <div className="absolute top-4 right-4">
        <div className="px-2 py-1 bg-base-white rounded-xl">
          <p className="text-base-black text-xs">#{id}</p>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <LightningIcon />
          <p className="text-xs">{rarity}</p>
        </div>
        <div className="flex items-center gap-1">
          <PuzzleIcon />
          <p className="text-xs">{property}</p>
        </div>
        <div className="flex items-center gap-1">
          <RombIcon fill="#ffffff" width="16" height="16" />
          <p className="text-xs">Red</p>
        </div>
      </div>
      <p className="absolute bottom-4 right-4 text-lg font-bold">0.95 ETH</p>
    </div>
  )
}
