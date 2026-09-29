import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetSaltDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}