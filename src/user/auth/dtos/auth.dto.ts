import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
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
}

export class SignInDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
