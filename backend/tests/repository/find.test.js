import repository from '../../repository';  // Import the repository you're testing
import pool from '../mockDatabase';  // Import the mock database pool

// Mock setup for pg
jest.mock('pg', () => {
    const mPool = {
      query: jest.fn(),
      connect: jest.fn(),
      end: jest.fn(),
      on: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});
describe('Repository find Test', () => {
    beforeEach(async () => {
        pool.query = jest.fn();
    });

    it('Find By Id Test Success', async () => {
        const User = {
            username: 'testuser1',
            email: 'test@t.t',
            firstName: 'Test',
            lastName: 'User'
        }
        pool.query.mockResolvedValue({ rows: [User] });
        const result = await repository.findById('users', 1);
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(User);
    });

    it('Find By Id No Record', async () => {
        pool.query.mockResolvedValue({ rows: [] });
        const result = await repository.findById('users', 1);
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(null);
    })
    it('Find By Id Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"));
        await expect(repository.findById('users', 1)).rejects.toThrow("Connection Error");
    });
    // findALL Test

    it('Find All Test Success', async () => {
        const User = {
            username: 'testuser1',
            email: 'test@t.t',
            firstName: 'Test',
            lastName: 'User'
        }
        pool.query.mockResolvedValue({ rows: [User] });
        const result = await repository.findAll('users');
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual([User]);
    });
    it('Find By Id Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"));
        await expect(repository.findAll('users')).rejects.toThrow("Connection Error");
    });
    // findOne Test

    it('Find One Test Success', async () => {
        const User = {
            username: 'testuser1',
            email: 'test@t.t',
            firstName: 'Test',
            lastName: 'User'
        }
        pool.query.mockResolvedValue({ rows: [User] });
        const result = await repository.findOne('users', {username: 'testuser1'});
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(User);
    });

    it('Find One No Record', async () => {
        pool.query.mockResolvedValue({ rows: [] });
        const result = await repository.findOne('users', {username: 'testuser1'});
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(null);
    })

    it('Find One Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"));
        await expect(repository.findOne('users', {username: 'testuser1'})).rejects.toThrow("Connection Error");
    });
    // findOneByCondition Test
    it('Find One By Condition Test Success', async () => {
        const User = {
            username: 'testuser1',
            email: 'test@t.t',
            firstName: 'Test',
            lastName: 'User'
        }
        pool.query.mockResolvedValue({ rows: [User] });
        const result = await repository.findOneByCondition('users', 'username');
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(User);
    });
    it('Find One By Condition No Record', async () => {
        pool.query.mockResolvedValue({ rows: [] });
        const result = await repository.findOneByCondition('users', 'username');
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(null);
    })
    it('Find One By Condition Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"));
        await expect(repository.findOneByCondition('users', 'username')).rejects.toThrow("Connection Error");
    });
    it('Find By Condition Test Success', async () => {
        const object = {
            rows: [
              { count: '1' }
            ],
          };
        pool.query.mockResolvedValue(object);
        const result = await repository.count('users');
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(1);
    });
    it('Find By Condition Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"));
        await expect(repository.count('users')).rejects.toThrow("Connection Error");
    });
})
