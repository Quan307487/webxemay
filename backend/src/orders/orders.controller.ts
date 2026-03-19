import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(private svc: OrdersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('checkout') checkout(@Request() req: any, @Body() dto: any) {
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        if (ip === '::1') ip = '127.0.0.1';
        return this.svc.checkout(req.user.ma_user, dto, ip as string);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my') getMyOrders(@Request() req: any) { return this.svc.findMyOrders(req.user.ma_user); }

    @UseGuards(AuthGuard('jwt'))
    @Get('my/:id') getMyOrder(@Request() req: any, @Param('id', ParseIntPipe) id: number) { return this.svc.findMyOrder(req.user.ma_user, id); }

    @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    @Get() async findAll(@Query() q: any) { const [data, total] = await this.svc.findAll(q); return { data, total }; }

    @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

    @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    @Put(':id/status') updateStatus(@Param('id', ParseIntPipe) id: number, @Body('trang_thai') tt: string) { return this.svc.updateStatus(id, tt); }

    @Get('vnpay-return')
    async vnpayReturn(@Query() query: any) {
        return this.svc.vnpayReturn(query);
    }

    @Get('vnpay-ipn')
    async vnpayIpn(@Query() query: any) {
        return this.svc.vnpayIpn(query);
    }
}
