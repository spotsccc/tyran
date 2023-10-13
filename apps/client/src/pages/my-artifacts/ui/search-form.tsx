import { reflect } from '@effector/reflect'
import { Property, Rarity } from 'api-contract'
import { Filter } from '@/shared/lib/filter'
import { voidFn } from '@/shared/lib/void'
import { Button } from '@/shared/ui/button'
import { MultiSelect } from '@/shared/ui/select'
import {
  $propertyFilter,
  $rarityFilter,
  propertyClearButtonClicked,
  propertySelected,
  rarityClearButtonClicked,
  raritySelected,
  searchButtonClicked,
} from '../model'

const rarityOptions = [
  { title: Rarity.common, id: Rarity.common },
  { title: Rarity.rare, id: Rarity.rare },
  { title: Rarity.epic, id: Rarity.epic },
  { title: Rarity.legendary, id: Rarity.legendary },
  { title: Rarity.mystery, id: Rarity.mystery },
]
const propertyOptions = [
  { title: Property.common, id: Property.common },
  { title: Property.enchanted, id: Property.enchanted },
  { title: Property.magic, id: Property.magic },
  { title: Property.cursed, id: Property.cursed },
]

const SearchButton = reflect({
  view: Button,
  bind: {
    title: 'Search',
    onClick: searchButtonClicked.prepend(voidFn),
    className: 'w-full',
  },
})

const PropertySelect = reflect({
  view: MultiSelect,
  bind: {
    options: propertyOptions,
    selected: $propertyFilter,
    // reflect can't calculate type of options because of generic type, so we need to help him
    onSelect: propertySelected.prepend((v) => v as Filter<Property>),
    clear: propertyClearButtonClicked,
    placeholder: 'Choose property',
  },
})

const RaritySelect = reflect({
  view: MultiSelect,
  bind: {
    options: rarityOptions,
    selected: $rarityFilter,
    // reflect can't calculate type of options because of generic type, so we need to help him
    onSelect: raritySelected.prepend((v) => v as Filter<Rarity>),
    clear: rarityClearButtonClicked,
    placeholder: 'Choose rarity',
  },
})

export function SearchForm() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      <RaritySelect />
      <PropertySelect />
      <SearchButton />
    </div>
  )
}
