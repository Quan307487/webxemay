import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Tonkho } from './tonkho.entity';
import { Sanpham } from '../products/sanpham.entity';
@Module({ imports: [TypeOrmModule.forFeature([Tonkho, Sanpham])], providers: [InventoryService], controllers: [InventoryController] })
export class InventoryModule { }
