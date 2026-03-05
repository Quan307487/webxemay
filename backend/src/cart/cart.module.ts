import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Giohang } from './giohang.entity';
import { Chitietgiohang } from './chitietgiohang.entity';
import { Sanpham } from '../products/sanpham.entity';
@Module({ imports: [TypeOrmModule.forFeature([Giohang, Chitietgiohang, Sanpham])], providers: [CartService], controllers: [CartController] })
export class CartModule { }
