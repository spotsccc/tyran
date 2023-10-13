import { Controller, Get } from '@nestjs/common'
import { GetLotsResponse, createSuccessResponse } from 'api-contract'
import { LotsService } from '@/application/lots.service'

@Controller('/api/lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) { }

  @Get('')
  public async getLots(): Promise<GetLotsResponse> {
    const lots = await this.lotsService.getLots()
    return createSuccessResponse({ data: lots })
  }
}
