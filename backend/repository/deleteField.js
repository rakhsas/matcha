import pool from "../src/config/database.js";


async function deleteById(tableName, id) {
    try {
        const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;

        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            console.log(`No record found with id ${id} in ${tableName}`);
            return; 
        }
        console.log('User deleted by id:', id);
        return result.rows[0];
    } catch (error) {
        console.error(`Error deleting record with id ${id} from ${tableName}`, error);
        // throw new Error(`Error deleting record with id ${id} from ${tableName}`)
    }
}

async function deleteByUserName(tableName, username) {
    try {
        const query = `DELETE FROM ${tableName} WHERE username = $1 RETURNING *`;

        const result = await pool.query(query, [username]);
        if (result.rowCount === 0) {
            console.log(`No record found with username ${username} in ${tableName}`);
            return;
        }
        console.log('User deleted by username:', username);
        return result.rows[0];

    } catch (error) {
        console.error(`Error deleting record with name ${username} from ${tableName}`, error);
    }
}

async function deleteByEmail(tableName, email) {
    try {
        const query = `DELETE FROM ${tableName} WHERE email = $1 RETURNING *`;

        const result = await pool.query(query, [email]);

        if (result.rowCount === 0) {
            console.log(`No record found with email ${email} in ${tableName}`);
            return;
        }

        console.log('User deleted by email:', email);
        return result.rows[0];
    } catch (error) {
        console.error(`Error deleting record with email ${email} from ${tableName}`, error);
    }
}

async function deleteAll(tableName) {
    try {
        const query = `DELETE FROM ${tableName} RETURNING *`;
        const result = await pool.query(query);
        return result.rowCount > 0;
    }
    catch (error) {
        console.error(`Error deleting all records from ${tableName}`, error);
        return false;
    }
}

export {
    deleteById,
    deleteByUserName,
    deleteByEmail,
    deleteAll
};
