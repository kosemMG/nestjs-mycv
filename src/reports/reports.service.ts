import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EstimateCriteriaDto } from './dto/estimate-criteria.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private readonly repo: Repository<Report>) {
  }

  public async addReportToDb(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save<Report>(report);
  }

  public async changeApproval(id: number, approved: boolean): Promise<Report> {
    const report = await this.repo.findOneBy({ id })
    if (!report) throw new NotFoundException('Report not found');
    report.approved = approved;
    return this.repo.save<Report>(report);
  }

  public async getEstimate({ make, model, year, lng, lat, mileage }: EstimateCriteriaDto): Promise<Partial<Report>> {
    return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne<Partial<Report>>();
  }
}