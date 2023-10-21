import { RombIcon } from '@/shared/assets'
import { cx } from 'class-variance-authority'

export type AvatarProps = {
  className?: string
  username: string | null
  address: string | null
}

export function Avatar({ className }: AvatarProps) {
  return (
    <div className={cx(className, 'flex gap-4 md:flex-col md:items-center')}>
      <img
        className="rounded-full border-1 border-base-white w-10 h-10 md:w-14 md:h-14"
        alt="avatar"
      />
      <div className="md:flex md:items-center md:flex-col">
        <div className="text-base-white mb-2">Username</div>
        <div className="flex gap-1 text-sm items-center text-base-white opacity-50">
          <RombIcon />
          ADDRESS
        </div>
      </div>
    </div>
  )
}
