import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.usersRepo.findOne({
      where: { email: dto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const authHash = await bcrypt.hash(dto.authHash, 8);

    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      authHash,
      authSalt: Buffer.from(dto.authSalt, 'base64'),
      encryptionSalt: Buffer.from(dto.encryptionSalt, 'base64'),
    });

    await this.usersRepo.save(user);

    return { message: 'Registered successfully' };
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      encryptionSalt: user.encryptionSalt.toString('base64'),
    };
  }

  async getAuthSalt(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.authSalt.toString('base64');
  }

  async validateUser(email: string, authHash: string) {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(authHash, user.authHash);

    if (!isMatch) {
      return null;
    }

    return user;
  }
}
