import { Artifact, Gem, Property, Rarity } from 'api-contract'
import { Link } from 'atomic-router-react'
import { cva } from 'class-variance-authority'
import { weiToEth } from '@/shared/lib/price'
import { artifactRoute } from '@/shared/router'
import { ReactComponent as GemIcon } from '../assets/gem.svg'

export type Props = Omit<Artifact, 'owner' | 'isOnSell'> & {
  price?: string
}

const rarityStyles = cva(
  'w-full h-7 p-1 rounded-b-lg flex flex-col items-center',
  {
    variants: {
      rarity: {
        [Rarity.common]: 'bg-gray-300',
        [Rarity.rare]: 'bg-primary-400',
        [Rarity.epic]: 'bg-purple-400',
        [Rarity.legendary]: 'bg-orange-dark-300',
        [Rarity.mystery]: 'bg-warning-300',
      },
    },
  },
)

const cardStyles = cva('w-full rounded-lg flex flex-col', {
  variants: {
    property: {
      [Property.common]: 'shadow-xl',
      [Property.cursed]: 'shadow-border shadow-gray-900',
      [Property.enchanted]: 'shadow-border shadow-success-900',
      [Property.magic]: 'shadow-border shadow-warning-800',
    },
  },
})

const gemStyles = cva('fill-base-white', {
  variants: {
    color: {
      [Gem.red]: 'fill-error-600',
      [Gem.green]: 'fill-success-600',
      [Gem.blue]: 'fill-primary-600',
      [Gem.yellow]: 'fill-warning-600',
      [Gem.empty]: '',
    },
  },
})

export function ArtifactCard({ rarity, property, gems, price, id }: Props) {
  return (
    <Link
      to={artifactRoute}
      params={{ id }}
      data-ti="artifact-card"
      className={cardStyles({ property })}
    >
      <div data-ti="image" className="w-full pb-[100%]" />
      <div data-ti="rarity" className={rarityStyles({ rarity })}>
        <div data-ti="gems" className="flex">
          {gems.map((gem, index) => {
            return <GemIcon key={index} className={gemStyles({ color: gem })} />
          })}
        </div>
        {price && (
          <p data-ti="price" className="text-xs">
            {`${weiToEth(price)} eth`}
          </p>
        )}
      </div>
    </Link>
  )
}
