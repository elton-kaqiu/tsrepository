import { Repository, ObjectLiteral, QueryRunner, ObjectId } from 'typeorm';
import { ITSRepository } from '../interfaces/_index';
import { ReadRepository, WriteRepository } from './_index';

export class TSRepository<
  T extends ObjectLiteral,
  ID extends string | number | Date | ObjectId,
> implements ITSRepository<T, ID>
{
  private readonly readRepository: ReadRepository<T, ID>;
  private readonly writeRepository: WriteRepository<T, ID>;

  constructor(repository: Repository<T>) {
    this.readRepository = new ReadRepository(repository);
    this.writeRepository = new WriteRepository(repository);
  }
  dynamicFind(methodName: string, params: any[]): Promise<T[]> {
    return this.readRepository.dynamicFind(methodName, params);
  }

  // Read operations (delegate to ReadRepository)
  findAll(includeSoftDeleted?: boolean): Promise<T[]> {
    return this.readRepository.findAll(includeSoftDeleted);
  }

  findOneById(id: ID): Promise<T | null> {
    return this.readRepository.findOneById(id);
  }

  findByConditions(conditions: Partial<T>): Promise<T[]> {
    return this.readRepository.findByConditions(conditions);
  }

  findPaginated(skip: number, take: number): Promise<T[]> {
    return this.readRepository.findPaginated(skip, take);
  }

  findAllSorted(sortBy: keyof T, order: 'ASC' | 'DESC'): Promise<T[]> {
    return this.readRepository.findAllSorted(sortBy, order);
  }

  existsBy(field: keyof T, value: T[keyof T]): Promise<boolean> {
    return this.readRepository.existsBy(field, value);
  }

  countByConditions(conditions: Partial<T>): Promise<number> {
    return this.readRepository.countByConditions(conditions);
  }

  findDistinct(field: keyof T): Promise<any[]> {
    return this.readRepository.findDistinct(field);
  }

  findPaginatedAndSorted(
    skip: number,
    take: number,
    sortBy: keyof T,
    order: 'ASC' | 'DESC'
  ): Promise<T[]> {
    return this.readRepository.findPaginatedAndSorted(
      skip,
      take,
      sortBy,
      order
    );
  }

  findWithPagination(
    page: number,
    itemsPerPage: number,
    sortBy: keyof T,
    order: 'ASC' | 'DESC'
  ): Promise<{ data: T[]; total: number; totalPages: number }> {
    return this.readRepository.findWithPagination(
      page,
      itemsPerPage,
      sortBy,
      order
    );
  }

  count(): Promise<number> {
    return this.readRepository.count();
  }

  // Write operations (delegate to WriteRepository)
  save(entity: T, transaction?: QueryRunner): Promise<T> {
    return this.writeRepository.save(entity, transaction);
  }

  saveAll(entities: T[], transaction?: QueryRunner): Promise<T[]> {
    return this.writeRepository.saveAll(entities, transaction);
  }

  updateById(
    id: ID,
    partialEntity: Partial<T>,
    transaction?: QueryRunner
  ): Promise<void> {
    return this.writeRepository.updateById(id, partialEntity, transaction);
  }

  deleteById(id: ID, transaction?: QueryRunner): Promise<void> {
    return this.writeRepository.deleteById(id, transaction);
  }

  deleteByConditions(
    conditions: Partial<T>,
    transaction?: QueryRunner
  ): Promise<void> {
    return this.writeRepository.deleteByConditions(conditions, transaction);
  }

  deleteAll(transaction?: QueryRunner): Promise<void> {
    return this.writeRepository.deleteAll(transaction);
  }

  softDeleteById(id: ID, transaction?: QueryRunner): Promise<void> {
    return this.writeRepository.softDeleteById(id, transaction);
  }

  restoreById(id: ID, transaction?: QueryRunner): Promise<void> {
    return this.writeRepository.restoreById(id, transaction);
  }

  executeInTransaction(
    operation: (transaction: QueryRunner) => Promise<void>
  ): Promise<void> {
    return this.writeRepository.executeInTransaction(operation);
  }
}
