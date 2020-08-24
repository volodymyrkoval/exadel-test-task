/* eslint-disable class-methods-use-this */
import { Middleware, ExpressErrorMiddlewareInterface, BadRequestError } from 'routing-controllers';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import * as _ from 'lodash';
import { Logger } from '@overnightjs/logger';
import { NotFoundError, CustomError } from '../../errors/errors';

@Middleware({ type: 'after' })
export default class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: Error, request: Request, response: Response) {
    let statusCode = 500;
    let message : any = STATUS_CODES[statusCode];

    if (error instanceof NotFoundError) {
      statusCode = 404;
      message = error.message;
    } else if (error instanceof BadRequestError) {
      statusCode = 400;
      const errors = _.result(error, 'errors') as object[];
      message = errors.map((e: any) => Object.values(e.constraints).join(', ')).join('. ');
    } else if (!(error instanceof CustomError)) {
      Logger.Err(`Unhandled Error: ${error}`);
      Logger.Err(`Unhandled Error: ${error.stack}`);
    }

    response.status(statusCode).json({ error: message, status: statusCode });
  }
}
