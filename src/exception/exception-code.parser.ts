import {
  DomainException,
  ForbiddenException,
  InvalidArgumentException,
  NotFoundException,
  PersistanceException,
  ValidationException,
} from '@power-cms/common/domain';
import { Errors } from 'moleculer';
import { isInstanceOf } from './instance.parser';

export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export const getErrorCode = (error: object): HttpCode => {
  if (error instanceof Errors.MoleculerError) {
    return error.code;
  }

  if (isInstanceOf(error, NotFoundException)) {
    return HttpCode.NOT_FOUND;
  }

  if (isInstanceOf(error, ValidationException)) {
    return HttpCode.BAD_REQUEST;
  }

  if (isInstanceOf(error, PersistanceException)) {
    return HttpCode.INTERNAL_ERROR;
  }

  if (isInstanceOf(error, InvalidArgumentException)) {
    return HttpCode.BAD_REQUEST;
  }

  if (isInstanceOf(error, ForbiddenException)) {
    return HttpCode.FORBIDDEN;
  }

  if (isInstanceOf(error, DomainException)) {
    return HttpCode.INTERNAL_ERROR;
  }

  return HttpCode.INTERNAL_ERROR;
};
