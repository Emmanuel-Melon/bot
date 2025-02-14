import { v4 as uuidv4 } from 'uuid';
import { User, CreateUser, UpdateUser } from '../../modules/user/schema';

// In-memory storage for demonstration
const users: User[] = [];

export class UserService {
  async create(data: CreateUser): Promise<User> {
    const user: User = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return users;
  }

  async findById(id: string): Promise<User | null> {
    return users.find(user => user.id === id) || null;
  }

  async update(id: string, data: UpdateUser): Promise<User | null> {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...data,
      updatedAt: new Date(),
    };
    users[index] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }
}
