import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('wishlist')
export class WishlistController {
    constructor(private svc: WishlistService) { }
    @Get() findAll(@Request() req: any) { return this.svc.findAll(req.user.ma_user); }
    @Post('toggle') toggle(@Request() req: any, @Body('ma_sanpham') ma_sanpham: number) { return this.svc.toggle(req.user.ma_user, ma_sanpham); }
    @Delete(':id') remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) { return this.svc.remove(id, req.user.ma_user); }
}
