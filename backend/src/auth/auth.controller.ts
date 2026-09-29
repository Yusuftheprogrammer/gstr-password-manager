import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { GetSaltDto } from './dto/get-salt.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('salt')
  async getAuthSalt(@Body() dto: GetSaltDto) {
    const salt = await this.authService.getAuthSalt(dto.email);
    return { authSalt: salt };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
