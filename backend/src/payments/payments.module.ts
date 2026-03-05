import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Thanhtoan } from './thanhtoan.entity';
@Module({ imports: [TypeOrmModule.forFeature([Thanhtoan])], providers: [PaymentsService], controllers: [PaymentsController], exports: [PaymentsService] })
export class PaymentsModule { }
