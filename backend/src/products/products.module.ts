import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Sanpham } from './sanpham.entity';
import { Hinhanh } from './hinhanh.entity';
import { Tonkho } from '../inventory/tonkho.entity';
@Module({ imports: [TypeOrmModule.forFeature([Sanpham, Hinhanh, Tonkho])], providers: [ProductsService], controllers: [ProductsController], exports: [ProductsService] })
export class ProductsModule { }
