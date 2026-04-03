import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET', 'webxemay_secret'),
        });
    }

    async validate(payload: any) {
        const user = await this.userRepo.findOne({ where: { ma_user: payload.sub } });
        if (!user) throw new UnauthorizedException('ACCOUNT_NOT_FOUND: Tài khoản không tồn tại');
        if (user.status === 'banned') throw new UnauthorizedException('ACCOUNT_BANNED: Tài khoản của bạn đã bị khóa bởi quản trị viên.');
        if (user.status === 'inactive') throw new UnauthorizedException('ACCOUNT_INACTIVE: Tài khoản này hiện đang tạm ngưng hoạt động.');
        return { ma_user: payload.sub, email: payload.email, quyen: payload.quyen };
    }
}
