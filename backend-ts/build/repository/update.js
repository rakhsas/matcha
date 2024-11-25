var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Logger } from "@nestjs/common";
import { config as pool } from "../core/dbconfig/config";
const update = (tableName, data, condition) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = Object.keys(data);
        const values = Object.values(data);
        // Construct the SET clause by joining the field names and placeholders
        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const differentClause = keys.map((key, index) => `${key} != $${index + 1}`).join(' AND ');
        // Construct the condition clause (e.g., WHERE id = $...)
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);
        const conditionClause = conditionKeys.map((key, index) => `${key} = $${keys.length + index + 1}`).join(' AND ');
        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${conditionClause} AND ${differentClause}`;
        console.log(query);
        // Combine values from data and condition for the query
        const combinedValues = [...values, ...conditionValues];
        const result = yield pool.query(query, combinedValues);
        if (result.rowCount === 0) {
            console.log(`No record found in ${tableName} with the given condition:`, condition);
            return false;
        }
        Logger.log(`Record updated in ${tableName} table.`);
        return result.rowCount !== null && result.rowCount > 0;
    }
    catch (error) {
        console.error(`Error updating record in ${tableName}:`, error);
        throw error;
    }
});
// updateOrInsert.js
const updateOrInsert = (tableName, data, condition) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the record exists based on the condition
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);
        const conditionClause = conditionKeys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const checkQuery = `SELECT * FROM ${tableName} WHERE ${conditionClause}`;
        console.log(checkQuery, conditionValues);
        const checkResult = yield pool.query(checkQuery, conditionValues);
        if (checkResult.rows.length > 0) {
            // Record exists, perform an update
            const keys = Object.keys(data);
            const values = Object.values(data);
            const setClause = keys.map((key, index) => `${key} = $${index + 1 + conditionKeys.length}`).join(', ');
            // Update query: number of placeholders should match the number of values provided
            const updateQuery = `UPDATE ${tableName} SET ${setClause} WHERE ${conditionClause}`;
            // Combine the values for update: first the condition values, then the data values
            const combinedValues = [...conditionValues, ...values]; // conditionValues first
            // Execute the update query
            const updateResult = yield pool.query(updateQuery, combinedValues);
            // console.log(`Record updated in ${tableName} table.`);
            return updateResult.rowCount !== null && updateResult.rowCount > 0; // Return true if any row was updated
        }
        else {
            // Record does not exist, perform an insert
            const keys = Object.keys(data);
            const values = Object.values(data);
            const columns = keys.join(', ');
            const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
            const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
            const insertResult = yield pool.query(insertQuery, values);
            console.log(`New record inserted in ${tableName} table.`);
            return insertResult.rows[0]; // Return the newly inserted record
        }
    }
    catch (error) {
        console.error(`Error in updateOrInsert operation for ${tableName}:`, error);
        throw error;
    }
});
export { updateOrInsert, update, };
