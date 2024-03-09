import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionsLoggerFitler extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('Exceptions throw', exception);
    super.catch(exception, host);
  }
}
