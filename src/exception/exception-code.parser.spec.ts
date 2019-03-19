import { Errors } from 'moleculer';
import {
  NotFoundException,
  PersistanceException,
  InvalidArgumentException,
  ForbiddenException,
  DomainException,
  ValidationException,
} from '@power-cms/common/domain';
import { getErrorCode } from './exception-code.parser';

describe('Exception code parser', () => {
  it('Parses code properly', () => {
    const fakeJoiError = {
      name: 'Test',
      message: 'test',
      details: [],
      annotate: () => 'test',
      isJoi: true,
      _object: {},
    };

    expect(getErrorCode(new Errors.MoleculerError('Error', 123))).toBe(123);
    expect(getErrorCode(new NotFoundException())).toBe(404);
    expect(getErrorCode(ValidationException.fromJoiError(fakeJoiError))).toBe(400);
    expect(getErrorCode(new PersistanceException())).toBe(500);
    expect(getErrorCode(new InvalidArgumentException())).toBe(400);
    expect(getErrorCode(new DomainException())).toBe(500);
    expect(getErrorCode(new Error())).toBe(500);
  });
});
