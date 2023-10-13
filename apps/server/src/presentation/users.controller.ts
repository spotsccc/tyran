import { Controller, Get, Param, Post } from '@nestjs/common'
import { GetUserResponse, createSuccessResponse } from 'api-contract'
import { UsersService } from '@/application/users.service'

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/:address')
  public async createUser(@Param('address') address: string) {
    return this.usersService.createUser({ address })
  }

  @Get('/:address')
  public async getUser(
    @Param('address') address: string,
  ): Promise<GetUserResponse> {
    const user = await this.usersService.getUser({ address })
    return createSuccessResponse({ data: user })
  }
}
