import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Dsyeuthich } from './dsyeuthich.entity';
@Module({ imports: [TypeOrmModule.forFeature([Dsyeuthich])], providers: [WishlistService], controllers: [WishlistController] })
export class WishlistModule { }
