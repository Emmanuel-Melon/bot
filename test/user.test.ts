import { test } from 'tap';
import { UserService } from '../src/services/user';

test('UserService', async (t) => {
  const userService = new UserService();

  t.test('create user', async (t) => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const user = await userService.create(userData);
    t.ok(user.id, 'should have an id');
    t.equal(user.name, 'Jane Doe', 'should have correct name');
    t.equal(user.email, userData.email, 'should have correct email');
    t.ok(user.createdAt instanceof Date, 'should have createdAt date');
    t.ok(user.updatedAt instanceof Date, 'should have updatedAt date');
  });

  t.test('find all users', async (t) => {
    const users = await userService.findAll();
    t.ok(Array.isArray(users), 'should return an array');
  });
});
