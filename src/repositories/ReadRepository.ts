import { FindOptionsWhere, ObjectId, ObjectLiteral, Repository } from 'typeorm';
import { IReadRepository } from '../interfaces/_index';

export class ReadRepository<
  T extends ObjectLiteral,
  ID extends string | number | Date | ObjectId,
> implements IReadRepository<T, ID>
{
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;

    return new Proxy(this, {
      get: (target, prop: string) => {
        if (typeof target[prop as keyof ReadRepository<T, ID>] === 'function') {
          return target[prop as keyof ReadRepository<T, ID>];
        }
        if (prop.startsWith('findBy')) {
          return (...args: any[]) => target.dynamicFind(prop, args);
        }
        return target[prop as keyof ReadRepository<T, ID>];
      },
    });
  }
  async dynamicFind(methodName: string, params: any[]): Promise<T[]> {
    const conditionPart = methodName.slice('findBy'.length);
    const conditions = this.parseConditions(conditionPart);

    const queryBuilder = this.repository.createQueryBuilder('entity');
    conditions.forEach((condition, index) => {
      const { field, logic } = condition;
      const paramName = `${field}${index}`;
      const clause = `entity.${field} = :${paramName}`;

      if (index === 0) {
        queryBuilder.where(clause, { [paramName]: params[index] });
      } else {
        if (logic === 'AND') {
          queryBuilder.andWhere(clause, { [paramName]: params[index] });
        } else if (logic === 'OR') {
          queryBuilder.orWhere(clause, { [paramName]: params[index] });
        }
      }
    });
    return queryBuilder.getMany();
  }

  /**
   * Parses a method name like 'NameOrEmailAndPhoneNumber' into fields and logical operators.
   * @param conditionPart - The part of the method name after 'findBy'.
   * @return {Array<{ field: string, logic: 'AND' | 'OR' }>} Parsed conditions.
   */
  private parseConditions(
    conditionPart: string
  ): { field: string; logic: 'AND' | 'OR' }[] {
    const parts = conditionPart.split('/(AND|OR)/');

    return parts.reduce<{ field: string; logic: 'AND' | 'OR' }[]>(
      (acc, part, index) => {
        if (index % 2 === 0) {
          const field = part.charAt(0).toLocaleLowerCase() + part.slice(1);
          const logic =
            (parts[index + 1]?.toUpperCase() as 'AND' | 'OR') || 'AND';
          acc.push({ field, logic });
        }
        return acc;
      },
      []
    );
  }

  async findAll(includeSoftDeleted?: boolean): Promise<T[]> {
    if (includeSoftDeleted) {
      return this.repository.find({ withDeleted: true });
    }
    return this.repository.find();
  }
  async findOneById(id: ID): Promise<T | null> {
    return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  // async findBy(field: keyof T, value: T[keyof T]): Promise<T[]> {
  //   const whereCondition = { [field]: value } as FindOptionsWhere<T>;
  //   return this.repository.find({ where: whereCondition });
  // }

  async findByConditions(conditions: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where: conditions });
  }

  async findPaginated(skip: number, take: number): Promise<T[]> {
    return this.repository.find({ skip, take });
  }

  async findAllSorted(
    sortBy: keyof T,
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<T[]> {
    return this.repository.find({ order: { [sortBy]: order } as any });
  }

  async existsBy(field: keyof T, value: T[keyof T]): Promise<boolean> {
    const count = await this.repository.countBy({ [field]: value } as any);
    return count > 0;
  }

  async countByConditions(conditions: FindOptionsWhere<T>): Promise<number> {
    return this.repository.countBy(conditions);
  }

  async findDistinct(field: keyof T): Promise<any[]> {
    const rawResults = await this.repository
      .createQueryBuilder('entity')
      .select(`DISTINCT(entity.${String(field)})`, field as string)
      .getRawMany();
    return rawResults.map((result) => result[field]);
  }

  async findPaginatedAndSorted(
    skip: number,
    take: number,
    sortBy: keyof T,
    order: 'ASC' | 'DESC'
  ): Promise<T[]> {
    return this.repository.find({
      skip,
      take,
      order: { [sortBy]: order } as any,
    });
  }

  async findWithPagination(
    page: number,
    itemsPerPage: number,
    sortBy: keyof T,
    order: 'ASC' | 'DESC'
  ): Promise<{ data: T[]; total: number; totalPages: number }> {
    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    const [data, total] = await this.repository.findAndCount({
      skip,
      take,
      order: { [sortBy]: order } as any,
    });

    const totalPages = Math.ceil(total / itemsPerPage);
    return { data, total, totalPages };
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
