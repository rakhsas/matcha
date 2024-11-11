import pool from './../../../mockDatabase'; ``
// import {  } from '../../../../repository/constraints';
// import the constraint module
import repository from '../../../../repository';
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
jest.mock('../../../../repository/constraints/unique/index.js', () => ({
	add: jest.fn(),
	remove: jest.fn(),
	removeDuplicates: jest.fn(),
	isConstraintExisting: jest.fn(),
}));
describe('Repository Update Test', () => {
	beforeEach(() => {
		pool.query = jest.fn();
	});
	it('Should return true', () => {
		
	})
});