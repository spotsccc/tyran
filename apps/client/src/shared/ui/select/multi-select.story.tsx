import { StoryObj } from '@storybook/react'
import { createEvent, createStore, fork, sample } from 'effector'
import { Provider, useUnit } from 'effector-react'
import { MultiSelect, Option } from './multi-select'

export default {
  component: MultiSelect,
  title: 'MultiSelect',
  tags: ['autodocs'],
}

type Story = StoryObj<typeof MultiSelect>

const $selected = createStore<Array<Option<string, string>>>([])

const optionSelected = createEvent<Option<string, string>>()
const crossClicked = createEvent()

sample({
  clock: optionSelected,
  source: $selected,
  fn(selected, option) {
    if (selected.findIndex(({ id }) => id === option.id) !== -1) {
      return selected.filter(({ id }) => id !== option.id)
    }
    return [...selected, option]
  },
  target: $selected,
})

sample({
  clock: crossClicked,
  target: $selected.reinit!,
})

const scope = fork()

export const Default: Story = {
  args: {
    options: [
      { id: 'common', title: 'common' },
      { id: 'rare', title: 'rare' },
      { id: 'epic', title: 'epic' },
      { id: 'legendary', title: 'legendary' },
      { id: 'mystery', title: 'mystery' },
    ],
  },
  render({ options }) {
    return (
      <Provider value={scope}>
        <MultiSelectBound options={options} />
      </Provider>
    )
  },
}

type Props = {
  options: Array<Option<string, string>>
}

function MultiSelectBound({ options }: Props) {
  const { onSelect, selected, clear } = useUnit({
    onSelect: optionSelected,
    selected: $selected,
    clear: crossClicked,
  })
  return (
    <MultiSelect
      options={options}
      onSelect={onSelect}
      selected={selected}
      clear={clear}
      placeholder="select rarity"
    />
  )
}
