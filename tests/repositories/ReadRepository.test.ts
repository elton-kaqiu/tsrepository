import { Repository } from 'typeorm';
import { ReadRepository } from '../../src/repositories/ReadRepository';

describe('ReadRepository', () => {
  let mockRepository: jest.Mocked<Repository<any>>;
  let readRepository: ReadRepository<any, number>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      countBy: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{ field: 'value' }]),
      })),
    } as unknown as jest.Mocked<Repository<any>>;

    readRepository = new ReadRepository(mockRepository);
  });

  it('should retrieve all entities', async () => {
    const entities = [{ id: 1 }, { id: 2 }];
    mockRepository.find.mockResolvedValue(entities);

    const result = await readRepository.findAll();
    expect(result).toEqual(entities);
    expect(mockRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should retrieve an entity by ID', async () => {
    const entity = { id: 1 };
    mockRepository.findOneBy.mockResolvedValue(entity);

    const result = await readRepository.findOneById(1);
    expect(result).toEqual(entity);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should find entities by conditions', async () => {
    const entities = [{ id: 1, name: 'John' }];
    mockRepository.find.mockResolvedValue(entities);

    const result = await readRepository.findByConditions({ name: 'John' });
    expect(result).toEqual(entities);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { name: 'John' },
    });
  });

  it('should check if an entity exists', async () => {
    mockRepository.countBy.mockResolvedValue(1);

    const result = await readRepository.existsBy('name', 'John');
    expect(result).toBe(true);
    expect(mockRepository.countBy).toHaveBeenCalledWith({ name: 'John' });
  });
});
