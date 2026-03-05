import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Danhmuc } from './danhmuc.entity';
@Module({ imports: [TypeOrmModule.forFeature([Danhmuc])], providers: [CategoriesService], controllers: [CategoriesController], exports: [CategoriesService] })
export class CategoriesModule { }
