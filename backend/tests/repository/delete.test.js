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

describe('Repository deletion from Tables Test', () => {
    beforeAll(async () => {
        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE,
                email VARCHAR(255),
                firstName VARCHAR(255),
                lastName VARCHAR(255)
            );
        `);
        console.log = jest.fn();
    });
    beforeEach(async () => {
        pool.query = jest.fn();
    });
    it('Delete By Id Test Success', async () => {
        const User = {
            username: 'testuser1',
            email: 'test@t.t',
            firstName: 'Test',
            lastName: 'User'
        }
        pool.query.mockResolvedValue({ rows: [User], rowCount: 1 });

        const result = await repository.deleteById('users', 1);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(User);
    });

    it('Delete By Id case No record Found', async() => {
        pool.query.mockResolvedValue({ rowCount: 0 });
        const result = await repository.deleteById('users', 1);
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(undefined)
    })

    it('Delete By Id Case Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"))
        const result = await repository.deleteById('users', 1);
        expect(result).toBeUndefined()
    })
    // test DeleteByUserName
    it('Delete By Username Case No record', async () => {
        pool.query.mockResolvedValue({ rowCount: 0 });
        const result = await repository.deleteByUserName('users', 'test');
        expect(result).toBeUndefined();
    })

    it('Delete By Username Case Valid', async () => {
        const mockResult = {
            username: 'test'
        }
        pool.query.mockResolvedValue({ rows: [mockResult], rowsCount: 1 });
        const result = await repository.deleteByUserName('', '');
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(mockResult);
    })
    it('Delete By Username Case Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"))
        const result = await repository.deleteByUserName('', '');
        expect(result).toBeUndefined()
    })
    // test DeleteByEmail
    it('Delete By Email Case No record', async () => {
        pool.query.mockResolvedValue({ rowCount: 0 });
        const result = await repository.deleteByEmail('users', 'test');
        expect(result).toBeUndefined();
    })
    it('Delete By Email Case Valid', async () => {
        const mockResult = {
            email: 'test'
        }
        pool.query.mockResolvedValue({ rows: [mockResult], rowsCount: 1 });
        const result = await repository.deleteByEmail('', '');
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toBe(mockResult);
    })
    it('Delete By Email Case Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"))
        const result = await repository.deleteByEmail('', '');
        expect(result).toBeUndefined()
    })

    // Test the deleteAll method
    it('Delete all users', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

        const result = await repository.deleteAll('users');

        expect(pool.query).toHaveBeenCalledTimes(1);  // Ensure query is called once
        expect(result).toBe(false);  // Validate result
    });
    it('Delete all users case Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("Connection Error"))
        const result = await repository.deleteAll('users');
        expect(result).toBe(false)
    });
});