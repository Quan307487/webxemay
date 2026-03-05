import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Tonkho } from './tonkho.entity';
@Module({ imports: [TypeOrmModule.forFeature([Tonkho])], providers: [InventoryService], controllers: [InventoryController] })
export class InventoryModule { }
