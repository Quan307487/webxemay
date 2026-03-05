import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
    constructor(private svc: BrandsService) { }
    @Get() findAll(@Query('active') active?: string) { return this.svc.findAll(active === '1'); }
    @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }
    @Post() @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') create(@Body() dto: any) { return this.svc.create(dto); }
    @Put(':id') @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.update(id, dto); }
    @Delete(':id') @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}
