import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  authHash: string;

  @IsString()
  @IsNotEmpty()
  authSalt: string;

  @IsString()
  @IsNotEmpty()
  encryptionSalt: string;
}
