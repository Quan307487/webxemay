import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Donhang } from '../orders/donhang.entity';
import { Sanpham } from '../products/sanpham.entity';
@Module({ imports: [TypeOrmModule.forFeature([Donhang, Sanpham])], providers: [ReportsService], controllers: [ReportsController] })
export class ReportsModule { }
