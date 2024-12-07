/**
 * Base repository for read operations.
 * Generic implementation for any TypeORM entity.
 * @template T - Entity type.
 * @template ID - Primary key type.
 */
export interface IReadRepository<T, ID> {
  /**
   * Dynamically handles methods starting with "findBy".
   * Parses the method name to construct a query with the specified conditions.
   * @param methodName - The name of the dynamic method (e.g., 'findByNameOrEmail').
   * @param params - The parameters to match the fields in the dynamic method name.
   * @return {Promise<T[]>} A promise resolving to the array of matching entities.
   */
  dynamicFind(methodName: string, params: any[]): Promise<T[]>;
  /**
   * Retrieve all entities.
   * @return {Promise<T[]>} A promise resolving to an array of all entities.
   */
  findAll(): Promise<T[]>;

  /**
   * Retrieve all entities, optionally including soft-deleted ones.
   * @param includeSoftDeleted - Whether to include soft-deleted entities.
   * @return {Promise<T[]>} A promise resolving to an array of all entities.
   */
  findAll(includeSoftDeleted: boolean): Promise<T[]>;

  /**
   * Retrieve an entity by its ID.
   * @param id - The ID of the entity to retrieve.
   * @return {Promise<T | null>} A promise resolving to the entity or null if not found.
   */
  findOneById(id: ID): Promise<T | null>;

  // /**
  //  * Retrieve entities by a specific field and value.
  //  * @param field - The field to filter by.
  //  * @param value - The value of the field to match.
  //  * @return {Promise<T[]>} A promise resolving to an array of matching entities.
  //  */
  // findBy(field: keyof T, value: T[keyof T]): Promise<T[]>;

  /**
   * Retrieve entities matching multiple conditions.
   * @param conditions - A partial object containing the conditions to match.
   * @return {Promise<T[]>} A promise resolving to an array of matching entities.
   */
  findByConditions(conditions: FindOptionsWhere<T>): Promise<T[]>;

  /**
   * Retrieve entities in a paginated format.
   * @param skip - The number of records to skip.
   * @param take - The number of records to retrieve.
   * @return {Promise<T[]>} A promise resolving to an array of paginated entities.
   */
  findPaginated(skip: number, take: number): Promise<T[]>;

  /**
   * Retrieve all entities sorted by a specified field.
   * @param sortBy - The field to sort by.
   * @param order - The sorting order ('ASC' for ascending, 'DESC' for descending).
   * @return {Promise<T[]>} A promise resolving to an array of sorted entities.
   */
  findAllSorted(sortBy: keyof T, order: 'ASC' | 'DESC'): Promise<T[]>;

  // /**
  //  * Retrieve the first entity matching a specific field and value.
  //  * @param field - The field to filter by.
  //  * @param value - The value of the field to match.
  //  * @return {Promise<T | null>} A promise resolving to the first matching entity or null if not found.
  //  */
  // findFirst(field: keyof T, value: T[keyof T]): Promise<T | null>;

  /**
   * Check if an entity exists by a specific field and value.
   * @param field - The field to filter by.
   * @param value - The value of the field to match.
   * @return {Promise<boolean>} A promise resolving to true if the entity exists, false otherwise.
   */
  existsBy(field: keyof T, value: T[keyof T]): Promise<boolean>;

  /**
   * Count entities matching specific conditions.
   * @param conditions - A partial object containing the conditions to match.
   * @return {Promise<number>} A promise resolving to the count of matching entities.
   */
  countByConditions(conditions: FindOptionsWhere<T>): Promise<number>;

  /**
   * Retrieve distinct values for a specific field.
   * @param field - The field to retrieve distinct values for.
   * @return {Promise<T[]>} A promise resolving to an array of distinct entities.
   */
  findDistinct(field: keyof T): Promise<T[]>;

  /**
   * Paginate and sort results using skip and take.
   * @param skip - The number of records to skip.
   * @param take - The number of records to retrieve.
   * @param sortBy - The field to sort by.
   * @param order - The sorting direction ('ASC' or 'DESC').
   * @return {Promise<T[]>} A promise resolving to the paginated and sorted results.
   */
  findPaginatedAndSorted(
    skip: number,
    take: number,
    sortBy: keyof T,
    order: 'ASC' | 'DESC'
  ): Promise<T[]>;

  /**
   * Paginate results using page number and items per page, with sorting.
   * @param page - The current page number (1-based index).
   * @param itemsPerPage - The number of items to retrieve per page.
   * @param sortBy - The field to sort by.
   * @param order - The sorting direction ('ASC' or 'DESC').
   * @return {Promise<{ data: T[], total: number, totalPages: number }>} A promise resolving to paginated results and metadata.
   */
  findWithPagination(
    page: number,
    itemsPerPage: number,
    sortBy: keyof T,
    order: 'ASC' | 'DESC'
  ): Promise<{ data: T[]; total: number; totalPages: number }>;

  /**
   * Count all entities in the repository.
   * @return {Promise<number>} A promise resolving to the total count of entities.
   */
  count(): Promise<number>;
}
