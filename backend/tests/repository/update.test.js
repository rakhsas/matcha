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
describe('Repository Update Test', () => {
    beforeEach(() => {
      pool.query = jest.fn();
    });
    // update
    it('Update test Success', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });
      const result = await repository.update(expect.any(String), expect.any(Object), expect.any(Object));
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(result).toBe(true)
    })

    it('Update test case no record found', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });
      const result = await repository.update(expect.any(String), expect.any(Object), expect.any(Object));
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(result).toBe(false)
    });

    it('Update test case Exception Throws', async () => {
      pool.query.mockRejectedValue(new Error("error"));
      // expect(pool.query).toHaveBeenCalledTimes(1);
      await expect(repository.update(expect.any(String), expect.any(Object), expect.any(Object))).rejects.toThrow("error")
    });

      // updateOrInsert
    it('should return true when a record is updated', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [ expect.any(Object) ], rowCount: 1 })
        .mockResolvedValueOnce({ rowCount: 1 });
      const result = await repository.updateOrInsert(expect.any(String), expect.any(Object), expect.any(Object));
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(result).toBe(true)
    })
    it('should return the newly inserted record', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [ ], rowCount: 0 })
        .mockResolvedValueOnce({ rows: [ expect.any(Object)] });
      const result = await repository.updateOrInsert(expect.any(String), expect.any(Object), expect.any(Object));
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual(expect.any(Object))
    })
    it ('should throw an exeption', async () => {
      pool.query.mockRejectedValue(new Error(expect.any(String)));
      await expect(repository.updateOrInsert(expect.any(String), expect.any(Object), expect.any(Object))).rejects.toThrow(expect.anything())
    });
});