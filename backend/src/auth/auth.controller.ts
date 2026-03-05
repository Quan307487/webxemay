import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: { ten_user: string; email: string; password: string; hovaten?: string; SDT?: string }) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: { email: string; password: string }) {
        return this.authService.login(dto);
    }
}
