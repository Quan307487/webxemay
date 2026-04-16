import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders/orders.service';

@ApiTags('VNPay Public')
@Controller('vnpay-public')
export class VnpayPublicController {
    constructor(private ordersSvc: OrdersService) { }

    @Get('vnpay-return')
    async vnpayReturn(@Query() query: any) {
        return this.ordersSvc.vnpayReturn(query);
    }

    @Get('vnpay-ipn')
    async vnpayIpn(@Query() query: any) {
        return this.ordersSvc.vnpayIpn(query);
    }
}
