import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVaultEntryDto {
  @IsString()
  @IsNotEmpty()
  ciphertext: string;

  @IsString()
  @IsNotEmpty()
  iv: string;
}