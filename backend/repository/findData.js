import pool from "../src/config/database.js";

// Find by ID
const findById = async (tableName, id) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE id = $1`;
        const result = await pool.query(query, [id]);

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
const findAll = async (tableName) => {
    try {
        const query = `SELECT * FROM ${tableName}`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error(`Error finding all records in ${tableName}`, error);
        throw error;
    }
};

// Find one record based on a condition
const findOne = async (tableName, conditionColumn, value) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE ${conditionColumn} = $1`;
        const result = await pool.query(query, [value]);

        if (result.rows.length === 0) {
            return null; // No record found
        }
        return result.rows[0];
    } catch (error) {
        console.error(`Error finding record in ${tableName} by ${conditionColumn}`, error);
        throw error;
    }
};

const findOneByCondition = async (tableName, condition) => {
    try {
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);

        const conditionClause = conditionKeys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const query = `SELECT * FROM ${tableName} WHERE ${conditionClause} LIMIT 1`;

        const result = await pool.query(query, conditionValues);

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

const count = async (tableName) => {
    try {
        const query = `SELECT COUNT(*) FROM ${tableName}`;
        const result = await pool.query(query);

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