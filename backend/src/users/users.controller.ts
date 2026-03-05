import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private svc: UsersService) { }

    // Customer: xem profile của mình
    @Get('me') getMe(@Request() req: any) { return this.svc.findOne(req.user.ma_user); }
    @Put('me') updateMe(@Request() req: any, @Body() dto: any) { return this.svc.updateProfile(req.user.ma_user, dto); }
    @Put('me/password') changePassword(@Request() req: any, @Body() dto: any) { return this.svc.changePassword(req.user.ma_user, dto); }
    @Delete('me') deactivate(@Request() req: any) { return this.svc.deactivate(req.user.ma_user); }

    // Admin: quản lý tất cả users
    @Get() @Roles('admin') findAll(@Query() query: any) { return this.svc.findAll(query); }
    @Get(':id') @Roles('admin') findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }
    @Put(':id/status') @Roles('admin') updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) { return this.svc.updateStatus(id, status); }
}
