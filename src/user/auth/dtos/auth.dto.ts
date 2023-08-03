import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/09[0-3][0-9]-?[0-9]{3}-?[0-9]{4}/, {
    message: 'phone must be valid phone number',
  })
  phone: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SignInDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
export class GenerateProductKetDto {
  @IsEnum(UserType)
  userType: UserType;

  @IsEmail()
  email: string;
}
