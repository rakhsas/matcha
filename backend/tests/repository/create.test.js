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

describe('Repository Creation Tables Test', () => {
    beforeEach(async () => {
        pool.query = jest.fn();
        console.log = jest.fn();

    });

    it('Create table test', async () => {
        pool.query.mockResolvedValue({ command: 'CREATE', rowCount: null, oid: null, rows: [], fields: [] })
        const testModel = {
            tableName: 'test',
            columns: {
                id: 'SERIAL PRIMARY KEY',
                label: 'VARCHAR(100) NOT NULL',
            },
            createTableQuery() {
                const columns = Object.entries(this.columns)
                    .map(([column, type]) => `${column} ${type}`)
                    .join(', ');
                return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns})`;
            }
        }
        const result = await repository.createTable(testModel);
        expect(pool.query).toHaveBeenCalled()
        expect(pool.query).toHaveBeenCalledTimes(1)
        expect(result).toBe(true);
    })

    it('Create table test with error', async () => {
        pool.query.mockRejectedValue(new Error('Error creating table'))
        const testModel = {
            tableName: 'test',
            columns: {
                id: 'SERIAL PRIMARY KEY',
                label: 'VARCHAR(100) NOT NULL',
            },
            createTableQuery() {
                const columns = Object.entries(this.columns)
                    .map(([column, type]) => `${column} ${type}`)
                    .join(', ');
                return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns})`;
            }
        }
        try {
            await repository.createTable(testModel);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

});