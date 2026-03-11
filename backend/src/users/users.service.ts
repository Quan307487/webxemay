import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    findAll(query?: { search?: string; status?: string }) {
        const qb = this.repo.createQueryBuilder('u');
        if (query?.search) qb.andWhere('(u.ten_user LIKE :s OR u.email LIKE :s OR u.hovaten LIKE :s)', { s: `%${query.search}%` });
        if (query?.status) qb.andWhere('u.status = :st', { st: query.status });
        qb.orderBy('u.ngay_lap', 'DESC');
        return qb.select(['u.ma_user', 'u.ten_user', 'u.email', 'u.hovaten', 'u.SDT', 'u.diachi', 'u.quyen', 'u.status', 'u.ngay_lap']).getMany();
    }

    async findOne(id: number) {
        const u = await this.repo.findOne({ where: { ma_user: id } });
        if (!u) throw new NotFoundException('Không tìm thấy người dùng');
        return u;
    }

    async updateProfile(id: number, dto: Partial<User>) {
        delete (dto as any).password_hash;
        delete (dto as any).quyen;
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async changePassword(id: number, dto: { old_password: string; new_password: string }) {
        const u = await this.repo.findOne({ where: { ma_user: id } });
        if (!u) throw new NotFoundException('Không tìm thấy người dùng');
        const ok = await bcrypt.compare(dto.old_password, u.password_hash);
        if (!ok) throw new ForbiddenException('Mật khẩu cũ không đúng');
        const hash = await bcrypt.hash(dto.new_password, 10);
        await this.repo.update(id, { password_hash: hash });
        return { message: 'Đổi mật khẩu thành công' };
    }

    async updateStatus(id: number, status: string) {
        await this.repo.update(id, { status } as any);
        return this.findOne(id);
    }

    async deactivate(id: number) {
        await this.repo.update(id, { status: 'inactive' } as any);
        return { message: 'Tài khoản đã bị vô hiệu hoá' };
    }

    async adminUpdate(id: number, dto: Partial<User>) {
        // Allows updating quyen, status, hovaten, etc.
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async updateAvatar(id: number, url: string) {
        await this.repo.update(id, { hinh_anh: url });
        return this.findOne(id);
    }

    async remove(id: number) {
        const u = await this.findOne(id);
        if (u.quyen === 'admin') throw new ForbiddenException('Không thể xóa tài khoản quản trị viên');
        await this.repo.delete(id);
        return { message: 'Đã xóa người dùng thành công' };
    }
}
