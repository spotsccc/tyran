import { MintArtifact } from '@/features/artifact/mint'
import { PageLayout } from '@/widgets/page-layout/ui'

export function MintArtifactPage() {
  return (
    <PageLayout>
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-[48px] md:text-[64px] font-medium mt-10 text-center">
          Generate your NFT
        </h1>
        <p className="opacity-40 text-lg mt-5 text-center">
          To generate an NFT, attach the wallet and click Generate
        </p>
        <MintArtifact className="mt-13 mb-13 shadow-border md:shadow-borderXl text-xs" />
      </div>
    </PageLayout>
  )
}
