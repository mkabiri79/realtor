import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKetDto, SignInDto, SignUpDto } from './dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User, UserClaim } from 'src/user/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  async signUp(
    @Body() body: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signUp(body, userType);
  }
  @Post('/signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKetDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('/me')
  me(@User() user: UserClaim) {
    return user;
  }
}
