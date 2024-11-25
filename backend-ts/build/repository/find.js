var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config as pool } from "../core/dbconfig/config";
const findById = (tableName, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM ${tableName} WHERE id = $1`;
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null; // No record found
        }
        return result.rows[0];
    }
    catch (error) {
        console.error(`Error finding record by ID in ${tableName}`, error);
        throw error;
    }
});
// Find all records
const findAll = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM ${tableName}`;
        const result = yield pool.query(query);
        return result.rows;
    }
    catch (error) {
        console.error(`Error finding all records in ${tableName}`, error);
        throw error;
    }
});
// Find one record based on a condition
const findOne = (tableName, conditionColumn, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT * FROM ${tableName} WHERE ${conditionColumn} = $1`;
        const result = yield pool.query(query, [value]);
        if (result.rows.length === 0) {
            return null; // No record found
        }
        return result.rows[0];
    }
    catch (error) {
        console.error(`Error finding record in ${tableName} by ${conditionColumn}`, error);
        throw error;
    }
});
const findOneByCondition = (tableName, condition) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);
        const conditionClause = conditionKeys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const query = `SELECT * FROM ${tableName} WHERE ${conditionClause} LIMIT 1`;
        const result = yield pool.query(query, conditionValues);
        if (result.rows.length > 0) {
            // console.log(`Found ${result.rows.length} record(s) in ${tableName}`);
            return result.rows[0];
        }
        else {
            // console.log(`No records found in ${tableName} matching condition`);
            return null;
        }
    }
    catch (error) {
        console.error(`Error in findByCondition for ${tableName}:`, error);
        throw error;
    }
});
const count = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `SELECT COUNT(*) FROM ${tableName}`;
        const result = yield pool.query(query);
        return parseInt(result.rows[0].count);
    }
    catch (error) {
        console.error(`Error counting records in ${tableName}`, error);
        throw error;
    }
});
export { findById, findAll, findOne, findOneByCondition, count };
