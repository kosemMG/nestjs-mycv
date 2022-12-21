import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class EstimateCriteriaDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }: TransformFnParams) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2030)
  year: number;

  @Transform(({ value }: TransformFnParams) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }: TransformFnParams) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @Transform(({ value }: TransformFnParams) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;
}