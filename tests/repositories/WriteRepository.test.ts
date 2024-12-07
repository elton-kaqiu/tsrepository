import { Repository, QueryRunner } from 'typeorm';
import { WriteRepository } from '../../src/repositories/WriteRepository';

describe('WriteRepository', () => {
  let mockRepository: jest.Mocked<Repository<any>>;
  let mockTransaction: jest.Mocked<QueryRunner>;
  let writeRepository: WriteRepository<any, number>;

  beforeEach(() => {
    // Mock the QueryRunner
    mockTransaction = {
      manager: {
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;

    // Mock the Repository
    mockRepository = {
      manager: {
        connection: {
          createQueryRunner: jest.fn() as jest.Mock, // Explicitly cast as jest.Mock
        },
      },
    } as unknown as jest.Mocked<Repository<any>>;

    // Mock createQueryRunner to return the mockTransaction
    (
      mockRepository.manager.connection.createQueryRunner as jest.Mock
    ).mockReturnValue(mockTransaction);

    writeRepository = new WriteRepository(mockRepository);
  });

  it('should execute operations within a transaction', async () => {
    const operation = jest.fn();

    // Execute the transactional operation
    await writeRepository.executeInTransaction(operation);

    // Assertions
    expect(mockTransaction.startTransaction).toHaveBeenCalled();
    expect(operation).toHaveBeenCalledWith(mockTransaction);
    expect(mockTransaction.commitTransaction).toHaveBeenCalled();
    expect(mockTransaction.release).toHaveBeenCalled();
  });
});
