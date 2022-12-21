import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Serialise } from '../interceptors/serialise.interceptor';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { EstimateCriteriaDto } from './dto/estimate-criteria.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialise(ReportDto)
  public async addReport(@Body() body: CreateReportDto, @CurrentUser() user: User): Promise<Report> {
    return this.reportsService.addReportToDb(body, user);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  public async approveReport(@Param('id') id: number, @Body() body: ApproveReportDto): Promise<Report> {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  public async getEstimate(@Query() criteria: EstimateCriteriaDto): Promise<Partial<Report>> {
    return this.reportsService.getEstimate(criteria);
  }
}