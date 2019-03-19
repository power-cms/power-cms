import { DomainException, NotFoundException } from '@power-cms/common/domain';
import { isInstanceOf } from './instance.parser';

describe('Instance parser', () => {
  it('Parses simple exception classes', () => {
    expect(isInstanceOf(new DomainException(), DomainException)).toEqual(true);
  });

  it('Parses extending exception classes', () => {
    expect(isInstanceOf(new NotFoundException(), NotFoundException)).toEqual(true);
    expect(isInstanceOf(new NotFoundException(), DomainException)).toEqual(true);
  });
});
