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
describe('Repository Insert Test', () => {
    // beforeAll(async () => {
    //     await pool.query(`
    //         CREATE TABLE users (
    //             id SERIAL PRIMARY KEY,
    //             username VARCHAR(255) UNIQUE,
    //             email VARCHAR(255),
    //             firstName VARCHAR(255),
    //             lastName VARCHAR(255)
    //         );
    //     `);
    //     console.log = jest.fn();
    // });
    // afterAll(() => {
    //     console.log = originalConsoleLog;  // Restore original console.log after tests
    // })

    beforeEach(() => {
        pool.query = jest.fn();
    });

    it('Create users table', async () => {
        pool.query.mockResolvedValue({});

        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE,
                email VARCHAR(255),
                firstName VARCHAR(255),
                lastName VARCHAR(255)
            );
        `);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE users'));
    });

    

    // Test the save method
    it('Insert a new user', async () => {
        const newUser = {
            username: 'testuser1',
            email: 'test@t.t',
            firstName: 'Test',
            lastName: 'User',
        };
        pool.query.mockResolvedValue({ rows: [newUser], rowCount: 1 });

        const result = await repository.save('users', newUser);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(newUser);
    });
    it('Insert Exception Throw constraint violation', async () => {
        pool.query.mockRejectedValue(new Error('duplicate key value violates unique constraint'));
        expect(await repository.save('users', {})).toBeUndefined()
    });
    it('Insert Exception Throw', async () => {
        pool.query.mockRejectedValue(new Error("error"));
        expect(await repository.save('users', {})).toBeUndefined()
    });
});