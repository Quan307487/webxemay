import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(dto: { ten_user: string; email: string; password: string; hovaten?: string; SDT?: string }) {
        const exist = await this.userRepo.findOne({ where: [{ email: dto.email }, { ten_user: dto.ten_user }] });
        if (exist) throw new ConflictException('Email hoặc tên đăng nhập đã tồn tại');
        const hash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({ ...dto, password_hash: hash });
        const saved = await this.userRepo.save(user);
        return this.generateToken(saved);
    }

    async login(dto: { email: string; password: string }) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Email không tồn tại');
        if (user.status === 'banned') throw new UnauthorizedException('Tài khoản đã bị khoá');
        if (user.status === 'inactive') throw new UnauthorizedException('Tài khoản đã bị vô hiệu hoá');
        const ok = await bcrypt.compare(dto.password, user.password_hash);
        if (!ok) throw new UnauthorizedException('Mật khẩu không đúng');
        return this.generateToken(user);
    }

    private generateToken(user: User) {
        const payload = { sub: user.ma_user, email: user.email, quyen: user.quyen };
        return {
            access_token: this.jwtService.sign(payload),
            user: { ma_user: user.ma_user, ten_user: user.ten_user, email: user.email, hovaten: user.hovaten, quyen: user.quyen, status: user.status },
        };
    }
}
