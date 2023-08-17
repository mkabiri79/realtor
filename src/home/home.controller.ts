import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  Param,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { UserType, propertyType } from '@prisma/client';
import { User, UserClaim } from 'src/user/decorator/user.decorator';
import { Roles } from 'src/decorators/role.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: propertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(propertyType && { propertyType }),
      ...(price && { price }),
    };

    return this.homeService.getAllHomes(filters);
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }
  @Roles(UserType.REALTOR)
  @Post()
  ceateHome(@Body() body: CreateHomeDto, @User() user: UserClaim) {
    return this.homeService.createHome(body, user.id);
  }
  @Roles(UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserClaim,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.updateHome(id, body);
  }
  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deletaHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserClaim,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }
  @Roles(UserType.BUYER)
  @Post('/inquirre/:id')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserClaim,
    @Body() { message }: InquireDto,
  ) {
    this.homeService.inquire(user, homeId, message);
  }
}
