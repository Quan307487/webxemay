import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Thuonghieu } from './thuonghieu.entity';
@Module({ imports: [TypeOrmModule.forFeature([Thuonghieu])], providers: [BrandsService], controllers: [BrandsController], exports: [BrandsService] })
export class BrandsModule { }
