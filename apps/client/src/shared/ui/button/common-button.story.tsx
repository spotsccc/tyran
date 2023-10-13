import { StoryObj } from '@storybook/react'
import { Button } from './common-button'

export default {
  component: Button,
  title: 'Button',
  tags: ['autodocs'],
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    size: 'sm',
    color: 'blue',
    type: 'primary',
    title: 'Buy artifact',
  },
}
