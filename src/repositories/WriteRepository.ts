import { Repository, ObjectLiteral, QueryRunner, ObjectId } from 'typeorm';
import { IWriteRepository } from '../interfaces/_index';

export class WriteRepository<
  T extends ObjectLiteral,
  ID extends string | number | Date | ObjectId,
> implements IWriteRepository<T, ID>
{
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async save(entity: T, transaction?: QueryRunner): Promise<T> {
    if (transaction) {
      return transaction.manager.save(entity);
    }
    return this.repository.save(entity);
  }

  async saveAll(entities: T[], transaction?: QueryRunner): Promise<T[]> {
    if (transaction) {
      return transaction.manager.save(entities);
    }
    return this.repository.save(entities);
  }

  async updateById(
    id: ID,
    partialEntity: Partial<T>,
    transaction?: QueryRunner
  ): Promise<void> {
    if (transaction) {
      await transaction.manager.update(
        this.repository.target,
        id,
        partialEntity
      );
    } else {
      await this.repository.update(id, partialEntity);
    }
  }

  async deleteById(id: ID, transaction?: QueryRunner): Promise<void> {
    if (transaction) {
      await transaction.manager.delete(this.repository.target, id);
    } else {
      await this.repository.delete(id);
    }
  }

  async deleteByConditions(
    conditions: Partial<T>,
    transaction?: QueryRunner
  ): Promise<void> {
    if (transaction) {
      await transaction.manager.delete(this.repository.target, conditions);
    } else {
      await this.repository.delete(conditions);
    }
  }

  async deleteAll(transaction?: QueryRunner): Promise<void> {
    if (transaction) {
      await transaction.manager.clear(this.repository.target);
    } else {
      await this.repository.clear();
    }
  }

  async softDeleteById(id: ID, transaction?: QueryRunner): Promise<void> {
    if (transaction) {
      await transaction.manager.softDelete(this.repository.target, id);
    } else {
      await this.repository.softDelete(id);
    }
  }

  async restoreById(id: ID, transaction?: QueryRunner): Promise<void> {
    if (transaction) {
      await transaction.manager.restore(this.repository.target, id);
    } else {
      await this.repository.restore(id);
    }
  }

  async executeInTransaction(
    operation: (transaction: QueryRunner) => Promise<void>
  ): Promise<void> {
    const transaction = this.repository.manager.connection.createQueryRunner();
    await transaction.startTransaction();
    try {
      await operation(transaction);
      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw error;
    } finally {
      await transaction.release();
    }
  }
}
