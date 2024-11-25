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
export const save = (tableName, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeHolders = values
            .map((_, index) => `$${index + 1}`)
            .join(', ');
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeHolders}) RETURNING *`;
        console.log(values);
        const result = yield pool.query(query, values);
        // console.log(`Data inserted into ${tableName}`, result.rows[0]);
        return result.rows[0];
    }
    catch (error) {
        if (error.message && error.message.startsWith(`duplicate key value violates unique constraint`)) {
            // console.log(`Error inserting data into ${tableName} details: `, error.detail)
            throw error;
            // throw new UsernameExistsException();
        }
        else {
            throw error;
            // console.log(`An unexpected error occurred while inserting data into ${tableName}:`, error.message);
        }
    }
});
