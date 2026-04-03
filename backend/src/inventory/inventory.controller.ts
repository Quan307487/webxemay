import { Controller, Get, Put, Delete, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('inventory')
export class InventoryController {
    constructor(private svc: InventoryService) { }
    @Get() findAll() { return this.svc.findAll(); }
    @Put() update(@Body() dto: { ma_sanpham: number; soluong_tonkho: number }) { return this.svc.update(dto.ma_sanpham, dto.soluong_tonkho); }
    @Delete() async deleteAll() {
        try {
            return await this.svc.deleteAll();
        } catch (e: any) {
            throw new HttpException({ error: 'DB_DELETE_FAILED', detail: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
