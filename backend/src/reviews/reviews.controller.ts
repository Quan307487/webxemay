import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private svc: ReviewsService) { }
    @Get('product/:id') getByProduct(@Param('id', ParseIntPipe) id: number) { return this.svc.findByProduct(id); }
    @Get('my') @ApiBearerAuth() @UseGuards(AuthGuard('jwt')) getMyReviews(@Request() req: any) { return this.svc.findMyReviews(req.user.ma_user); }
    @Post() @ApiBearerAuth() @UseGuards(AuthGuard('jwt')) create(@Request() req: any, @Body() dto: any) { return this.svc.create(req.user.ma_user, dto); }
    @Put(':id') @ApiBearerAuth() @UseGuards(AuthGuard('jwt')) update(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.update(id, req.user.ma_user, dto); }
    @Delete(':id') @ApiBearerAuth() @UseGuards(AuthGuard('jwt')) delete(@Request() req: any, @Param('id', ParseIntPipe) id: number) { return this.svc.delete(id, req.user.ma_user); }
    // Admin
    @Get() @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') async findAll(@Query() q: any) { const [data, total] = await this.svc.findAll(q); return { data, total }; }
    @Put(':id/approve') @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') approve(@Param('id', ParseIntPipe) id: number) { return this.svc.approve(id); }
    @Put(':id/reject') @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') reject(@Param('id', ParseIntPipe) id: number) { return this.svc.reject(id); }
    @Delete('admin/:id') @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin') adminDelete(@Param('id', ParseIntPipe) id: number) { return this.svc.adminDelete(id); }
}
