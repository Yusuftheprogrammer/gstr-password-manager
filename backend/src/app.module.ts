import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { VaultModule } from './vault/vault.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    AuthModule,
    VaultModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}