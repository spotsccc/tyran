import { Meta, StoryObj } from '@storybook/react'
import { TestComponent } from './test'
import { within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

const meta: Meta<typeof TestComponent> = {
  title: 'TestComponent',
  component: TestComponent,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TestComponent>

export const Primary: Story = {
  args: {
    title: 'kek',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('header')).toBeInTheDocument()
  },
}
