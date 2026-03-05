import { Controller, Get, Post, Put, Body, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
    constructor(private svc: CouponsService) { }
    @Post('validate') validate(@Body() dto: { ma_giamgia: string; tong_tien: number }) { return this.svc.validate(dto.ma_giamgia, dto.tong_tien); }
    @Get() @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') findAll() { return this.svc.findAll(); }
    @Post() @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') create(@Body() dto: any) { return this.svc.create(dto); }
    @Put(':id') @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.update(id, dto); }
}
