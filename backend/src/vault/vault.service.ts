import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateVaultEntryDto } from './dto/create-vault-entry.dto.js';
import { UpdateVaultEntryDto } from './dto/update-vault-entry.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity.js';
import { VaultEntry } from './entities/vault-entry.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class VaultService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(VaultEntry)
    private vaultsRepo: Repository<VaultEntry>,
  ) {}

  async create(userId: string, dto: CreateVaultEntryDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const entry = this.vaultsRepo.create({
      userId,
      iv: Buffer.from(dto.iv, 'base64'),
      ciphertext: Buffer.from(dto.ciphertext, 'base64'),
    });

    return this.vaultsRepo.save(entry);
  }

  async findAllForUser(userId: string) {
    const entries = await this.vaultsRepo.find({ where: { userId } });

    return entries.map((entry) => ({
      id: entry.id,
      ciphertext: entry.ciphertext.toString('base64'),
      iv: entry.iv.toString('base64'),
    }));
  }

  async update(userId: string, entryId: string, dto: UpdateVaultEntryDto) {
    const entry = await this.findOwnedEntry(userId, entryId);

    entry.iv = Buffer.from(dto.iv, 'base64');
    entry.ciphertext = Buffer.from(dto.ciphertext, 'base64');

    const saved = await this.vaultsRepo.save(entry);

    return {
      id: saved.id,
      ciphertext: saved.ciphertext.toString('base64'),
      iv: saved.iv.toString('base64'),
    };
  }

  async remove(userId: string, entryId: string) {
    const entry = await this.findOwnedEntry(userId, entryId);
    await this.vaultsRepo.remove(entry);
    return { message: 'Deleted successfully' };
  }

  private async findOwnedEntry(userId: string, entryId: string) {
    const entry = await this.vaultsRepo.findOne({ where: { id: entryId } });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('You do not own this entry');
    }

    return entry;
  }
}