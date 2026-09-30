import { Module } from '@nestjs/common';
import { VaultController } from './vault.controller.js';
import { VaultService } from './vault.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultEntry } from './entities/vault-entry.entity.js';
import { User } from '../auth/entities/user.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([VaultEntry, User]), AuthModule],
  controllers: [VaultController],
  providers: [VaultService, JwtAuthGuard],
})
export class VaultModule {}
