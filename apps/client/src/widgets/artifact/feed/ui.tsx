import { ArtifactList } from '@/entities/artifact'
import { modelView } from 'effector-factorio'
import { GemOptions, PropertyOptions, RarityOptions, factory } from './model'
import { useUnit } from 'effector-react'
import { CrossIcon, FiltersIcon } from '@/shared/assets'
import { ChangeEventHandler, useEffect, useRef } from 'react'
import { cx } from 'class-variance-authority'
import { Filter } from '@/shared/lib/filter'
import { Button } from '@/shared/ui/button'

export type SearchInputProps = {
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  className?: string
  onIconClick?: () => void
}

export function SearchInput({ value, onChange, className }: SearchInputProps) {
  const { $filtersOpened } = factory.useModel()
  const { filtersOpened } = useUnit({ filtersOpened: $filtersOpened })
  return (
    <div
      className={`relative ${filtersOpened && 'opacity-0 pointer-events-none'}`}
    >
      <FiltersIcon className="absolute top-4 right-6 md:hidden" />
      <input
        onChange={onChange}
        value={value}
        placeholder="Search by name"
        className={cx(
          className,
          'w-full text-base-white bg-base-black border-base-white h-9 opacity-50',
          'focus:opacity-100 focus:outline-none',
          'max-md:rounded-xxl max-md:border-1 max-md:px-6',
          'md:border-b-2 md:text-2xl',
        )}
      />
    </div>
  )
}

function useOutsideClick() {
  const { outsideFiltersClicked } = factory.useModel()
  const { outsideClickHandler } = useUnit({
    outsideClickHandler: outsideFiltersClicked,
  })
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function clickHandler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        outsideClickHandler()
      }
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [outsideClickHandler])

  return { ref }
}

function useKeydownPress() {
  const { $filtersOpened, enterKeyPress, escKeyPress } = factory.useModel()

  const { filtersOpened, onEscKeyPress, onEnterKeyPress } = useUnit({
    filtersOpened: $filtersOpened,
    onEnterKeyPress: enterKeyPress,
    onEscKeyPress: escKeyPress,
  })

  useEffect(() => {
    function keydownHandler(e: KeyboardEvent) {
      switch (e.key) {
        case 'Enter':
          onEnterKeyPress()
          break
        case 'Escape':
          onEscKeyPress()
          break
        default:
      }
    }

    if (filtersOpened) {
      document.addEventListener('keydown', keydownHandler)
    } else {
      document.removeEventListener('keydown', keydownHandler)
    }
    return () => document.removeEventListener('keydown', keydownHandler)
  }, [filtersOpened, onEnterKeyPress, onEscKeyPress])
}

export function Controls() {
  const { $filtersOpened, filtersButtonClicked } = factory.useModel()

  const { filtersOpened, openFilters } = useUnit({
    filtersOpened: $filtersOpened,
    openFilters: filtersButtonClicked,
  })

  useKeydownPress()
  const { ref } = useOutsideClick()

  return (
    <div ref={ref} className="relative mb-9">
      <div className={`flex justify-between ${filtersOpened && 'opacity-0'}`}>
        <button
          onClick={openFilters}
          className="border-1 border-base-white rounded-full px-6 py-3 text-sm"
        >
          Filters
        </button>
        <button className="border-1 border-base-white rounded-full px-6 py-3">
          <span className="opacity-50">Sort by: </span>NAME
        </button>
      </div>
      {filtersOpened && <Filters />}
    </div>
  )
}

function Filters() {
  const {
    $rarityFilter,
    $filtersOpened,
    raritySelected,
    $propertyFilter,
    $gemFilter,
    gemSelected,
    propertySelected,
    apllyFilterClicked,
    clearFiltersButtonsClicked,
  } = factory.useModel()

  const {
    selectGem,
    gemFilter,
    selectRarity,
    selectProperty,
    rarityFilter,
    propertyFiler,
    applyFilters,
    clearFilters,
  } = useUnit({
    gemFilter: $gemFilter,
    selectGem: gemSelected,
    selectProperty: propertySelected,
    propertyFiler: $propertyFilter,
    rarityFilter: $rarityFilter,
    selectRarity: raritySelected,
    filtersOpened: $filtersOpened,
    applyFilters: apllyFilterClicked,
    clearFilters: clearFiltersButtonsClicked,
  })

  return (
    <div className="absolute w-[100vw] top-0 -left-6 px-6 pb-6 backdrop-blur-md bg-base-black/20 z-10">
      <div className="flex justify-between border-b-2 pb-3 border-base-white/20 mb-8">
        <p className="text-2xl opacity-50 font-medium">Filters</p>
        <button
          onClick={clearFilters}
          className="p-2 bg-base-black/20 rounded-md"
        >
          <CrossIcon width={24} height={24} />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <FilterRow
          conditions={RarityOptions}
          filter={rarityFilter}
          onConditionClick={({ condition }) =>
            selectRarity({ value: condition })
          }
          name="rarity"
        />
        <FilterRow
          conditions={PropertyOptions}
          filter={propertyFiler}
          onConditionClick={({ condition }) =>
            selectProperty({ value: condition })
          }
          name="property"
        />
        <FilterRow
          conditions={GemOptions}
          filter={gemFilter}
          onConditionClick={({ condition }) => selectGem({ value: condition })}
          name="gem"
        />
        <Button active={true} onClick={applyFilters}>
          Apply filters
        </Button>
      </div>
    </div>
  )
}

type FilterRowProps<Condition> = {
  name: string
  conditions: Array<Condition>
  filter: Filter<Condition>
  onConditionClick: (v: { condition: Condition }) => void
}

function FilterRow<Condition>({
  name,
  filter,
  conditions,
  onConditionClick,
}: FilterRowProps<Condition>) {
  function isConditionSelected(condition: Condition) {
    return Boolean(filter.find(({ value }) => condition === value))
  }
  return (
    <div>
      <p className="text-sm text-base-white/50 mb-3">{name.toUpperCase()}</p>
      <div className="flex gap-2">
        {conditions.map((condition) => (
          <Button
            key={condition as string}
            pressed={isConditionSelected(condition)}
            onClick={() => onConditionClick({ condition })}
          >
            {(condition as string).toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  )
}

export const ArtifactFeed = modelView(factory, () => {
  const { $artifactsIds, $artifactsEntities } = factory.useModel()
  const { ids } = useUnit({ ids: $artifactsIds })
  return (
    <>
      <SearchInput className="mb-6" />
      <Controls />
      <ArtifactList ids={ids} $artifacts={$artifactsEntities} />
    </>
  )
})
