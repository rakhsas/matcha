import { newDb } from 'pg-mem';

// Create an in-memory database
const db = newDb();
const pgClient = db.public;

// Mock the pool interface
const mockPool = {
  query: pgClient.query.bind(pgClient),  // Bind the query method to pgClient
  connect: jest.fn().mockResolvedValue({  // Mock connect method
    release: jest.fn(),  // If you need to release the connection
  }),
  end: jest.fn(),  // Mock end if needed in your code
};

export default mockPool;
