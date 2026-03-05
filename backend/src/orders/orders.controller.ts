import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
    constructor(private svc: OrdersService) { }
    @Post('checkout') checkout(@Request() req: any, @Body() dto: any) { return this.svc.checkout(req.user.ma_user, dto); }
    @Get('my') getMyOrders(@Request() req: any) { return this.svc.findMyOrders(req.user.ma_user); }
    @Get('my/:id') getMyOrder(@Request() req: any, @Param('id', ParseIntPipe) id: number) { return this.svc.findMyOrder(req.user.ma_user, id); }
    @Get() @UseGuards(RolesGuard) @Roles('admin') async findAll(@Query() q: any) { const [data, total] = await this.svc.findAll(q); return { data, total }; }
    @Get(':id') @UseGuards(RolesGuard) @Roles('admin') findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }
    @Put(':id/status') @UseGuards(RolesGuard) @Roles('admin') updateStatus(@Param('id', ParseIntPipe) id: number, @Body('trang_thai') tt: string) { return this.svc.updateStatus(id, tt); }
}
