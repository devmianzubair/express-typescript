import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import HttpException from "../exceptions/HttpException";

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      })
  }
}

export default validationMiddleware;
