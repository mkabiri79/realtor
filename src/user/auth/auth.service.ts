import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignUpParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}
interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signUp(
    { email, password, phone, name }: SignUpParams,
    userType: UserType,
  ) {
    const userExist = await this.getUserByEmail(email);
    if (userExist) {
      throw new BadRequestException({ massege: 'email exist!', status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });
    return this.generateJWT({ name: user.name, id: user.id });
  }

  async signIn({ email, password }: SignInParams) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException('invalid credential', 400);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new HttpException('invalid credential', 400);
    }
    return this.generateJWT({ name: user.name, id: user.id });
  }

  async getUserByEmail(email) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async generateJWT(payload: object) {
    return jwt.sign(payload, process.env.JSON_TOKEN_KEY, {
      expiresIn: 360000,
    });
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
