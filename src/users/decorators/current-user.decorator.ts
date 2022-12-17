import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext) => {
  return context.switchToHttp().getRequest().currentUser;
});