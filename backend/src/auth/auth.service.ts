import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
        private mailService: MailService,
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

    async forgotPassword(email: string) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            // Tránh user enumeration bằng cách vẫn trả về success giả
            return { message: 'Nếu email tồn tại, một mã khôi phục sẽ được gửi đi.' };
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // 1 giờ hiệu lực

        user.reset_token = token;
        user.reset_token_expires = expires;
        await this.userRepo.save(user);

        await this.mailService.sendResetPasswordEmail(email, token);
        return { message: 'Mã khôi phục đã được gửi tới email của bạn.' };
    }

    async resetPassword(dto: { token: string; newPass: string }) {
        const user = await this.userRepo.findOne({
            where: { reset_token: dto.token }
        });

        if (!user || !user.reset_token_expires || user.reset_token_expires < new Date()) {
            throw new ConflictException('Mã khôi phục không hợp lệ hoặc đã hết hạn.');
        }

        user.password_hash = await bcrypt.hash(dto.newPass, 10);
        user.reset_token = null;
        user.reset_token_expires = null;
        await this.userRepo.save(user);

        return { message: 'Mật khẩu đã được thay đổi thành công.' };
    }

    async directResetPassword(dto: { email: string; newPass: string }) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new UnauthorizedException('Email không tồn tại trong hệ thống.');
        }

        user.password_hash = await bcrypt.hash(dto.newPass, 10);
        // Xóa luôn các token reset nếu có
        user.reset_token = null;
        user.reset_token_expires = null;

        await this.userRepo.save(user);
        return { message: 'Mật khẩu đã được cập nhật trực tiếp thành công.' };
    }
}
