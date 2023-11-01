import { PropsWithChildren } from 'react'
import { Header } from '../header'
import { cx } from 'class-variance-authority'
import { Footer } from '../footer'

export type PageLayoutProps = PropsWithChildren<{
  headerClassName?: string
  className?: string
}>

export function PageLayout({
  children,
  headerClassName,
  className,
}: PageLayoutProps) {
  return (
    <div className={cx(className, 'flex px-8 py-7 md:w-screen md:h-screen flex-col')}>
      <Header className={cx(headerClassName)} />
      <div className="w-full h-full overflow-y-auto">{children}</div>
      <Footer />
    </div>
  )
}
