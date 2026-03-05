import { Controller, Get, Put, Param, Body, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private svc: PaymentsService) { }
    @Get() @Roles('admin') async findAll(@Query() q: any) { const [data, total] = await this.svc.findAll(q); return { data, total }; }
    @Put(':id/status') @Roles('admin') updateStatus(@Param('id', ParseIntPipe) id: number, @Body('trang_thai') tt: string) { return this.svc.updateStatus(id, tt); }
}
