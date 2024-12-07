import { IReadRepository, IWriteRepository } from './_index';
export interface ITSRepository<T, ID>
  extends IWriteRepository<T, ID>,
    IReadRepository<T, ID> {}
