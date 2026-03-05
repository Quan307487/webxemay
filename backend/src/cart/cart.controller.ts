import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
    constructor(private svc: CartService) { }
    @Get() getCart(@Request() req: any) { return this.svc.getOrCreateCart(req.user.ma_user); }
    @Post('items') addItem(@Request() req: any, @Body() dto: { ma_sanpham: number; so_luong: number; mau_chon?: string }) { return this.svc.addItem(req.user.ma_user, dto.ma_sanpham, dto.so_luong, dto.mau_chon); }
    @Put('items/:id') updateItem(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body('so_luong') qty: number) { return this.svc.updateItem(req.user.ma_user, id, qty); }
    @Delete('items/:id') removeItem(@Request() req: any, @Param('id', ParseIntPipe) id: number) { return this.svc.removeItem(req.user.ma_user, id); }
    @Delete() clearCart(@Request() req: any) { return this.svc.clearCart(req.user.ma_user); }
}
