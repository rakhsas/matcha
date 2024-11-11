import { UsernameExistsException } from "../src/shared/exceptions/auth.exception.js";
import pool from "../src/config/database.js";


async function save(tableName, data) {
    try {
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);

        const placeHolders = values
            .map((_, index) => `$${index + 1}`)
            .join(', ');

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeHolders}) RETURNING *`;

        const result = await pool.query(query, values);

        // console.log(`Data inserted into ${tableName}`, result.rows[0]);

        return result.rows[0];

    } catch (error) {
        if (error.message && error.message.startsWith(`duplicate key value violates unique constraint`)) {
            // console.log(`Error inserting data into ${tableName} details: `, error.detail)
            throw new UsernameExistsException();
        } else {
            throw error;
            // console.log(`An unexpected error occurred while inserting data into ${tableName}:`, error.message);
        }
    }
}

export default save;