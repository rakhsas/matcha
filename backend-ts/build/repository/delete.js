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
function deleteById(tableName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
            const result = yield pool.query(query, [id]);
            if (result.rowCount === 0) {
                console.log(`No record found with id ${id} in ${tableName}`);
                return;
            }
            console.log('User deleted by id:', id);
            return result.rows[0];
        }
        catch (error) {
            console.error(`Error deleting record with id ${id} from ${tableName}`, error);
            // throw new Error(`Error deleting record with id ${id} from ${tableName}`)
        }
    });
}
function deleteByUserName(tableName, username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `DELETE FROM ${tableName} WHERE username = $1 RETURNING *`;
            const result = yield pool.query(query, [username]);
            if (result.rowCount === 0) {
                console.log(`No record found with username ${username} in ${tableName}`);
                return;
            }
            console.log('User deleted by username:', username);
            return result.rows[0];
        }
        catch (error) {
            console.error(`Error deleting record with name ${username} from ${tableName}`, error);
        }
    });
}
function deleteByEmail(tableName, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `DELETE FROM ${tableName} WHERE email = $1 RETURNING *`;
            const result = yield pool.query(query, [email]);
            if (result.rowCount === 0) {
                console.log(`No record found with email ${email} in ${tableName}`);
                return;
            }
            console.log('User deleted by email:', email);
            return result.rows[0];
        }
        catch (error) {
            console.error(`Error deleting record with email ${email} from ${tableName}`, error);
        }
    });
}
function deleteAll(tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const query = `DELETE FROM ${tableName} RETURNING *`;
            const result = yield pool.query(query);
            return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        catch (error) {
            console.error(`Error deleting all records from ${tableName}`, error);
            return false;
        }
    });
}
export { deleteById, deleteByUserName, deleteByEmail, deleteAll };
