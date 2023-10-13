import { cva } from 'class-variance-authority'
import {
  PropsWithChildren,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Cross, ShevronDown } from '@/shared/ui/select/assets'

export type SelectOptionProps<Id extends string, Title extends string> = {
  option: Option<Id, Title>
  onSelect: (option: Option<Id, Title>) => void
  selected: boolean
}

const selectOptionStyle = cva(
  'w-full h-8 flex hover:bg-gray-100 items-center px-2 rounded-md',
  {
    variants: {
      selected: {
        true: 'bg-gray-100',
      },
    },
  },
)

export function SelectOption<Id extends string, Title extends string>({
  option: { id, title },
  onSelect,
  selected,
}: SelectOptionProps<Id, Title>) {
  return (
    <button
      key={id}
      onClick={() => onSelect({ id, title })}
      className={selectOptionStyle({ selected })}
    >
      {title}
    </button>
  )
}

export type SelectedTokenProps<Id extends string, Title extends string> = {
  option: Option<Id, Title>
}

export function SelectedToken<Id extends string, Title extends string>({
  option,
}: SelectedTokenProps<Id, Title>) {
  return (
    <div className="h-5 px-2 py-1 border-1 border-gray-300 flex items-center rounded-md text-xs">
      {option.title}
    </div>
  )
}

type MultiSelectProps<Id extends string, Title extends string> = {
  onSelect: (option: Option<Id, Title>) => void
  options: Array<Option<Id, Title>>
  selected: Array<Option<Id, Title>>
  clear: () => void
  placeholder: string
  size?: 'sm' | 'md' | 'lg'
}

export type Option<Id extends string, Title extends string> = {
  id: Id
  title: Title
}

export function MultiSelect<Id extends string, Title extends string>({
  options,
  onSelect,
  selected,
  clear,
  placeholder,
}: MultiSelectProps<Id, Title>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function outsideClickHandler(e: MouseEvent) {
      if (
        !contentRef.current?.contains(e.target as Node) &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('click', outsideClickHandler, {
        capture: true,
      })
      return () =>
        document.removeEventListener('click', outsideClickHandler, {
          capture: true,
        })
    }
  }, [isOpen])

  const OptionsArray = () => (
    <div className="w-15 max-h-17 h-fit border-1 border-gray-200 rounded-lg flex flex-col shadow-lg gap-1 p-1 bg-base-white">
      {options.map((option) => (
        <SelectOption
          key={option.id}
          option={option}
          onSelect={onSelect}
          selected={Boolean(
            selected.find((selectedOption) => selectedOption.id === option.id),
          )}
        />
      ))}
    </div>
  )

  return (
    <Popup
      isOpen={isOpen}
      content={<OptionsArray />}
      containerRef={containerRef}
      contentRef={contentRef}
    >
      <div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          ref={containerRef}
          className="w-15 min-h-[40px] h-fit box-border border-1 border-gray-300 rounded-lg flex p-2 items-center gap-1 justify-between"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((option) => (
                <SelectedToken key={option.id} option={option} />
              ))}
            </div>
          ) : (
            <p className="text-sm">{placeholder}</p>
          )}
          <div className="flex">
            {selected.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clear()
                }}
              >
                <Cross />
              </button>
            )}
            <button>
              <ShevronDown />
            </button>
          </div>
        </div>
      </div>
    </Popup>
  )
}

export type PopupProps = PropsWithChildren<{
  isOpen: boolean
  content: ReactElement<any, any>
  contentRef: RefObject<HTMLDivElement>
  containerRef: RefObject<HTMLElement>
}>

export function Popup({
  children,
  content,
  isOpen,
  contentRef,
  containerRef,
}: PopupProps) {
  const [popupRoot, setPopupRoot] = useState<Element | null>(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      setPopupRoot(document.querySelector('#portal')!)
      const resizeObserver = new ResizeObserver(() => {
        setX(containerRef.current?.offsetLeft ?? 0)
        setY(
          (containerRef.current?.offsetTop ?? 0) +
            (containerRef.current?.offsetHeight ?? 0) +
            4,
        )
      })
      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [containerRef.current])

  return (
    <>
      {children}
      {isOpen &&
        popupRoot &&
        createPortal(
          <div
            ref={contentRef}
            className="z-10 absolute"
            style={{ left: x, top: y }}
          >
            {content}
          </div>,
          popupRoot,
        )}
    </>
  )
}
