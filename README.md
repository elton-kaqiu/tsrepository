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

### **Read and Write Repository**

#### **UserRepository Implementation**

Create a custom repository by extending `TSRepository`:

```typescript
import { TSRepository } from 'tsrepository';
import { User } from '../entities/User';

export class UserRepository extends TSRepository<User, number> {
  async findActiveUsers(): Promise<User[]> {
    return this.findByConditions({ isActive: true });
  }
}
```

#### **Using the Repository**

```typescript
import { UserRepository } from './repositories/UserRepository';
import { AppDataSource } from './data-source';

const userRepository = new UserRepository(AppDataSource.getRepository(User));

// Create a new user
await userRepository.save({ name: 'John Doe', email: 'john.doe@example.com' });

// Find all active users
const activeUsers = await userRepository.findActiveUsers();
console.log(activeUsers);
```

---

### **Dynamic Query Generation**

TSRepository supports dynamic query generation based on method names. For example:

```typescript
async findByNameOrEmail(name: string, email: string): Promise<User[]> {
  return this.findByConditions({ name, email });
}
```

You can define methods such as `findByNameAndEmailOrPhone` dynamically based on field names and logical operators (`AND`/`OR`) in the method name. TSRepository will parse the method name and construct the appropriate query automatically.

---

## **License**

MIT
