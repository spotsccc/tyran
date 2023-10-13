import { StoryObj } from '@storybook/react'
import { Gem, Property, Rarity } from 'api-contract'
import { ArtifactCard } from './card'

export default {
  component: ArtifactCard,
  title: 'Artifact',
  tags: ['autodocs'],
}

type Story = StoryObj<typeof ArtifactCard>

export const Default: Story = {
  args: {
    name: 'Frost morn',
    gems: [Gem.red, Gem.empty, Gem.empty],
    rarity: Rarity.legendary,
    property: Property.enchanted,
  },
  render: (args) => {
    return (
      <div className="w-14 h-15">
        <ArtifactCard {...args} />
      </div>
    )
  },
}
