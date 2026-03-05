import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thanhtoan } from './thanhtoan.entity';

@Injectable()
export class PaymentsService {
    constructor(@InjectRepository(Thanhtoan) private repo: Repository<Thanhtoan>) { }
    findAll(query: any = {}) {
        const qb = this.repo.createQueryBuilder('tt').leftJoinAndSelect('tt.donhang', 'dh');
        if (query.trang_thai) qb.andWhere('tt.trang_thai = :tt', { tt: query.trang_thai });
        return qb.orderBy('tt.ngay_thanhtoan', 'DESC').getManyAndCount();
    }
    findMyPayments(ma_donhang: number) { return this.repo.find({ where: { ma_donhang }, relations: ['donhang'] }); }
    async updateStatus(id: number, trang_thai: string) {
        await this.repo.update(id, { trang_thai } as any);
        return this.repo.findOne({ where: { ma_thanhtoan: id } });
    }
}
