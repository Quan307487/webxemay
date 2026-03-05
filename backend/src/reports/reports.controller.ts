import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('reports')
export class ReportsController {
    constructor(private svc: ReportsService) { }
    @Get('dashboard') getDashboard() { return this.svc.getDashboard(); }
}
