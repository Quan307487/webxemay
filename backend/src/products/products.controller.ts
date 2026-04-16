import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private svc: ProductsService) { }

    @Get()
    async findAll(@Query() query: any) {
        const [data, total] = await this.svc.findAll(query);
        return { data, total };
    }

    // ✅ Các route cụ thể (static) phải đứng TRƯỚC route động (:id)
    // để NestJS không match nhầm "images" vào param :id

    @Delete('images/:ma_anh')
    @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    removeImage(@Param('ma_anh', ParseIntPipe) ma_anh: number) {
        return this.svc.removeImage(ma_anh);
    }

    @Put('images/:ma_anh')
    @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    updateImage(@Param('ma_anh', ParseIntPipe) ma_anh: number, @Body() dto: any) {
        return this.svc.updateImage(ma_anh, dto);
    }

    // ---- Route động ----

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.svc.findOne(id);
    }

    @Post()
    @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    create(@Body() dto: any) { return this.svc.create(dto); }

    @Put(':id')
    @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.svc.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }

    @Get(':id/images')
    async getProductImages(@Param('id', ParseIntPipe) id: number) {
        const product = await this.svc.findOne(id);
        return product.hinhanh || [];
    }

    @Post(':id/images')
    @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        limits: { fileSize: 50 * 1024 * 1024 }, // Increase to 50MB
    }))
    async uploadImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        if (!file) throw new BadRequestException('Không nhận được file ảnh');
        const url = `/uploads/products/${file.filename}`;
        return this.svc.addImage(id, url, body.is_main === 'true' || body.is_main === true, body.mo_ta_anh);
    }

    @Put(':id/images/:ma_anh/main')
    @ApiBearerAuth() @UseGuards(AuthGuard('jwt'), RolesGuard) @Roles('admin')
    setMain(
        @Param('id', ParseIntPipe) id: number,
        @Param('ma_anh', ParseIntPipe) ma_anh: number,
    ) { return this.svc.setMainImage(id, ma_anh); }
}
