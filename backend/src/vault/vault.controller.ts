import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { VaultService } from './vault.service.js';
import { CreateVaultEntryDto } from './dto/create-vault-entry.dto.js';
import { UpdateVaultEntryDto } from './dto/update-vault-entry.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';
import type { Request } from 'express';

@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateVaultEntryDto, @Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.vaultService.create(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.vaultService.findAllForUser(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVaultEntryDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).sub;
    return this.vaultService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.vaultService.remove(userId, id);
  }
}