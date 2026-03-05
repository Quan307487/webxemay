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
        if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');
        if (user.status === 'banned') throw new UnauthorizedException('Tài khoản đã bị khoá');
        if (user.status === 'inactive') throw new UnauthorizedException('Tài khoản đã bị vô hiệu hoá');
        return { ma_user: payload.sub, email: payload.email, quyen: payload.quyen };
    }
}
