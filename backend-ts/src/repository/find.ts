import { config as pool } from "../core/dbconfig/config";
import pg from "pg";

const findById = async (tableName: string, id: string) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE id = $1`;
        const result = await (pool as pg.Pool).query(query, [id]);

        if (result.rows.length === 0) {
            return null; // No record found
        }
        return result.rows[0];
    } catch (error) {
        console.error(`Error finding record by ID in ${tableName}`, error);
        throw error;
    }
};

// Find all records
const findAll = async (tableName: string) => {
    try {
        const query = `SELECT * FROM ${tableName}`;
        const result = await (pool as pg.Pool).query(query);
        return result.rows;
    } catch (error) {
        console.error(`Error finding all records in ${tableName}`, error);
        throw error;
    }
};

// Find one record based on a condition
const findOne = async (tableName: string, conditionColumn: string, value: string) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE ${conditionColumn} = $1`;
        const result = await (pool as pg.Pool).query(query, [value]);

        if (result.rows.length === 0) {
            return null; // No record found
        }
        return result.rows[0];
    } catch (error) {
        console.error(`Error finding record in ${tableName} by ${conditionColumn}`, error);
        throw error;
    }
};

const findOneByCondition = async (tableName: string, condition: any) => {
    try {
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);

        const conditionClause = conditionKeys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const query = `SELECT * FROM ${tableName} WHERE ${conditionClause} LIMIT 1`;

        const result = await (pool as pg.Pool).query(query, conditionValues);

        if (result.rows.length > 0) {
            // console.log(`Found ${result.rows.length} record(s) in ${tableName}`);
            return result.rows[0];
        } else {
            // console.log(`No records found in ${tableName} matching condition`);
            return null;
        }
    } catch (error) {
        console.error(`Error in findByCondition for ${tableName}:`, error);
        throw error;
    }
};

const count = async (tableName: string) => {
    try {
        const query = `SELECT COUNT(*) FROM ${tableName}`;
        const result = await (pool as pg.Pool).query(query);

        return parseInt(result.rows[0].count);

    } catch (error) {
        console.error(`Error counting records in ${tableName}`, error);
        throw error;
    }
}

export {
    findById,
    findAll,
    findOne,
    findOneByCondition,
    count
}