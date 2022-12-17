import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToClass } from 'class-transformer';

export function Serialise<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerialiseInterceptor<T>(dto));
}

export class SerialiseInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {
  }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(map((entity: T) =>
      plainToClass(this.dto, entity, { excludeExtraneousValues: true })));
  }
}