import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { MaKhuyenmai } from './ma-khuyenmai.entity';
@Module({ imports: [TypeOrmModule.forFeature([MaKhuyenmai])], providers: [CouponsService], controllers: [CouponsController] })
export class CouponsModule { }
