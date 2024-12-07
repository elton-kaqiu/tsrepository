/**
 * Base repository for write operations.
 * Generic implementation for any ORM or transaction mechanism.
 * @template T - Entity type.
 * @template ID - Primary key type.
 */
export interface IWriteRepository<T, ID> {
  /**
   * Save or update an entity.
   * @param entity - The entity to save or update.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<T>} A promise resolving to the saved entity.
   */
  save(entity: T, transaction?: any): Promise<T>;

  /**
   * Save or update multiple entities.
   * @param entities - An array of entities to save or update.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<T[]>} A promise resolving to an array of saved entities.
   */
  saveAll(entities: T[], transaction?: any): Promise<T[]>;

  /**
   * Update an entity by its ID with partial data.
   * @param id - The ID of the entity to update.
   * @param partialEntity - The partial data to update the entity with.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<void>} A promise resolving when the update is complete.
   */
  updateById(
    id: ID,
    partialEntity: Partial<T>,
    transaction?: any
  ): Promise<void>;

  /**
   * Delete an entity by its ID.
   * @param id - The ID of the entity to delete.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<void>} A promise resolving when the deletion is complete.
   */
  deleteById(id: ID, transaction?: any): Promise<void>;

  /**
   * Delete entities matching specific conditions.
   * @param conditions - A partial object containing the conditions to match.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<void>} A promise resolving when the deletion is complete.
   */
  deleteByConditions(conditions: Partial<T>, transaction?: any): Promise<void>;

  /**
   * Delete all entities.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<void>} A promise resolving when all entities are deleted.
   */
  deleteAll(transaction?: any): Promise<void>;

  /**
   * Soft delete an entity by its ID.
   * @param id - The ID of the entity to soft delete.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<void>} A promise resolving when the soft deletion is complete.
   */
  softDeleteById(id: ID, transaction?: any): Promise<void>;

  /**
   * Restore a soft-deleted entity by its ID.
   * @param id - The ID of the entity to restore.
   * @param transaction - An optional transaction context for the operation.
   * @return {Promise<void>} A promise resolving when the restoration is complete.
   */
  restoreById(id: ID, transaction?: any): Promise<void>;

  /**
   * Execute a set of operations within a transaction.
   * @param operation - A function containing the transactional operations.
   * @return {Promise<void>} A promise resolving when the transaction completes.
   */
  executeInTransaction(
    operation: (transaction: any) => Promise<void>
  ): Promise<void>;
}
