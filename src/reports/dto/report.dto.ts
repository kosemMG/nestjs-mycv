import { Expose, Transform, TransformFnParams } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  @Transform(({ obj }: TransformFnParams) => obj.user.id)
  userId: number;
  @Expose()
  approved: boolean;
}