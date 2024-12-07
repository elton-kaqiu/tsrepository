# **TSRepository**

**TSRepository** is a lightweight, TypeScript-based repository pattern library for [TypeORM](https://typeorm.io/). It provides a clean and reusable abstraction for database operations, supporting both read and write operations.

## **Features**

- Generic repository implementation.
- Supports CRUD operations and transactional operations.
- Dynamic query generation based on method names (e.g., `findByNameOrEmail`).
- Soft delete and restoration of entities.
- Fully TypeScript-typed for better developer experience.

---

## **Installation**

```bash
npm install tsrepository
```

### **Peer Dependencies**

Ensure the following packages are installed:

- `typeorm`
- `reflect-metadata`

```bash
npm install typeorm reflect-metadata
```

---

## **Usage**

### **Setup**

1. **Initialize TypeORM Connection**
   Ensure TypeORM is configured in your project:

   ```typescript
   import { DataSource } from 'typeorm';

   const AppDataSource = new DataSource({
     type: 'mysql', // or your database type
     host: 'localhost',
     port: 3306,
     username: 'your_username',
     password: 'your_password',
     database: 'your_database',
     entities: ['./entities/*.ts'],
     synchronize: true, // Use only in development
   });

   await AppDataSource.initialize();
   ```

2. **Define an Entity**

   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity()
   export class User {
     @PrimaryGeneratedColumn()
     id!: number;

     @Column()
     name!: string;

     @Column()
     email!: string;

     @Column({ default: true })
     isActive!: boolean;
   }
   ```

---

### **Core Methods**

TSRepository provides a comprehensive set of methods out of the box:

#### **Read Operations**

- `findAll(includeSoftDeleted?: boolean): Promise<T[]>`
- `findOneById(id: ID): Promise<T | null>`
- `findBy(field: keyof T, value: T[keyof T]): Promise<T[]>`
- `findByConditions(conditions: Partial<T>): Promise<T[]>`
- `findPaginated(skip: number, take: number): Promise<T[]>`
- `findAllSorted(sortBy: keyof T, order: 'ASC' | 'DESC'): Promise<T[]>`
- `findFirst(field: keyof T, value: T[keyof T]): Promise<T | null>`
- `existsBy(field: keyof T, value: T[keyof T]): Promise<boolean>`
- `countByConditions(conditions: Partial<T>): Promise<number>`
- `findDistinct(field: keyof T): Promise<any[]>`
- `findPaginatedAndSorted(skip: number, take: number, sortBy: keyof T, order: 'ASC' | 'DESC'): Promise<T[]>`
- `findWithPagination(page: number, itemsPerPage: number, sortBy: keyof T, order: 'ASC' | 'DESC'): Promise<{ data: T[]; total: number; totalPages: number }> `

#### **Write Operations**

- `save(entity: T, transaction?: QueryRunner): Promise<T>`
- `saveAll(entities: T[], transaction?: QueryRunner): Promise<T[]>`
- `updateById(id: ID, partialEntity: Partial<T>, transaction?: QueryRunner): Promise<void>`
- `deleteById(id: ID, transaction?: QueryRunner): Promise<void>`
- `deleteByConditions(conditions: Partial<T>, transaction?: QueryRunner): Promise<void>`
- `deleteAll(transaction?: QueryRunner): Promise<void>`
- `softDeleteById(id: ID, transaction?: QueryRunner): Promise<void>`
- `restoreById(id: ID, transaction?: QueryRunner): Promise<void>`
- `executeInTransaction(operation: (transaction: QueryRunner) => Promise<void>): Promise<void>`

---

### **Custom Repositories**

#### **Creating Custom Interfaces and Repositories**

1. **Define a Custom Interface**
   Extend `ITSRepository` to add specific methods:

   ```typescript
   import { ITSRepository } from 'tsrepository';
   import { User } from '../entities/User';

   export interface IUserRepository extends ITSRepository<User, number> {
     findByNameOrEmail(name: string, email: string): Promise<User[]>;
   }
   ```

2. **Create a Custom Repository**
   Extend `TSRepository` and implement the custom interface:

   ```typescript
   import { TSRepository } from 'tsrepository';
   import { User } from '../entities/User';
   import { IUserRepository } from './interfaces/IUserRepository';

   export class UserRepository
     extends TSRepository<User, number>
     implements IUserRepository
   {
     async findByNameOrEmail(name: string, email: string): Promise<User[]> {
       return this.findByConditions([{ name }, { email }]);
     }
   }
   ```

3. **Dependency Injection (DI) Example**

   Using Dependency Injection, inject the `IUserRepository` interface to ensure loose coupling and testability.

   **Service Layer Example**

   ```typescript
   import { IUserRepository } from './interfaces/IUserRepository';
   import { User } from './entities/User';

   export class UserService {
     constructor(private readonly userRepository: IUserRepository) {}

     async findActiveUsers(): Promise<User[]> {
       return this.userRepository.findByConditions({ isActive: true });
     }

     async findUserByNameOrEmail(name: string, email: string): Promise<User[]> {
       return this.userRepository.findByNameOrEmail(name, email);
     }
   }
   ```

   **Binding Example** (Using a DI container like `typedi` or `inversify`):

   ```typescript
   import { Container } from 'typedi';
   import { UserRepository } from './repositories/UserRepository';

   Container.set('IUserRepository', new UserRepository(/* pass repository */));

   const userService = new UserService(Container.get('IUserRepository'));
   ```

   Injecting the `IUserRepository` ensures your service layer only depends on the abstraction and not the concrete implementation, following best practices for clean architecture.

---

### **Dynamic Query Generation**

TSRepository supports dynamic query generation for methods like `findByNameOrEmailAndPhone`. The method name dictates the query logic, using the following conventions:

- **Fields**: Define the properties of the entity.
- **Logical Operators**: Use `And` and `Or` to combine conditions.

#### Example

```typescript
// Method: findByNameOrEmailAndPhone
const users = await userRepository.findByNameOrEmailAndPhone(
  'John',
  'john@example.com',
  '123456789'
);
```

This dynamically generates a query to find users by name or email and phone.

---

## **License**

MIT
