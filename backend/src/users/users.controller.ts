import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

    @Post('me/avatar')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/avatars',
            filename: (req, file, cb) => cb(null, `avatar-${Date.now()}${extname(file.originalname)}`),
        }),
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    }))
    async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const url = `/uploads/avatars/${file.filename}`;
        return this.svc.updateAvatar(req.user.ma_user, url);
    }

    // Admin: quản lý tất cả users
    @Get() @Roles('admin') findAll(@Query() query: any) { return this.svc.findAll(query); }
    @Get(':id') @Roles('admin') findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }
    @Put(':id') @Roles('admin') update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.adminUpdate(id, dto); }
    @Put(':id/status') @Roles('admin') updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) { return this.svc.updateStatus(id, status); }
    @Delete(':id') @Roles('admin') remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }

    @Get('debug/:id') findOneDebug(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }
}
