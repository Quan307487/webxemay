import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Donhang } from './donhang.entity';
import { Chitietdonhang } from './chitietdonhang.entity';
import { Sanpham } from '../products/sanpham.entity';
import { Giohang } from '../cart/giohang.entity';
import { Chitietgiohang } from '../cart/chitietgiohang.entity';
import { Thanhtoan } from '../payments/thanhtoan.entity';
@Module({ imports: [TypeOrmModule.forFeature([Donhang, Chitietdonhang, Sanpham, Giohang, Chitietgiohang, Thanhtoan])], providers: [OrdersService], controllers: [OrdersController], exports: [OrdersService] })
export class OrdersModule { }
