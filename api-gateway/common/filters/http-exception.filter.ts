import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let msg: any = exception;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      msg = exception.getResponse();
    }

    this.logger.error(`Status: ${status} - Error: ${JSON.stringify(msg)}`);

    res.status(status).json({
      timestamp: new Date().toISOString(),
      path: req.url,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      error: msg,
    });
  }
}
