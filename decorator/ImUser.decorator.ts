import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ImUser = createParamDecorator(
  (data: 'email' | null, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) {
      return request.user;
    }

    return request.user ? request.user[data] : null;
  },
);
