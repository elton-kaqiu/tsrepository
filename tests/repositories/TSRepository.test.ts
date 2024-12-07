import { TSRepository } from '../../src/repositories/TSRepository';
import { Repository } from 'typeorm';

describe('TSRepository', () => {
  let mockRepository: jest.Mocked<Repository<any>>;
  let tsRepository: TSRepository<any, number>;

  beforeEach(() => {
    // Mock the Repository methods
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<any>>;

    tsRepository = new TSRepository(mockRepository);
  });

  it('should save and retrieve an entity', async () => {
    const entity = { id: 1, name: 'John Doe' };

    // Mock `save` and `find` methods
    mockRepository.save.mockResolvedValue(entity);
    mockRepository.find.mockResolvedValue([entity]);

    const saved = await tsRepository.save(entity);
    const all = await tsRepository.findAll();

    expect(saved).toEqual(entity);
    expect(all).toContainEqual(entity);

    // Verify the mock methods were called
    expect(mockRepository.save).toHaveBeenCalledWith(entity);
    expect(mockRepository.find).toHaveBeenCalled();
  });
});
