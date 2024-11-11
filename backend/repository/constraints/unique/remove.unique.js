import pool from '../../../src/config/database.js'; // Assuming pool is already defined

// Function to remove the unique constraint 
async function removeUniqueConstraint(tableName, column) {
    const constraintName = `unique_${column}`;

    try {

        // Step 3: remove the unique constraint 
        const addConstraintQuery = `
            ALTER TABLE ${tableName}
            DROP CONSTRAINT ${constraintName};
        `;
        await pool.query(addConstraintQuery);
        console.log(`UNIQUE constraint removed to ${column} column on table ${tableName}`);
    } catch (error) {
        console.error(`Error removing UNIQUE constraint: ${error.message}`);
    }
}

// Example usage for  adding unique constraint to the 'lastname' column
// addUniqueConstraint('users', 'lastname');
export default removeUniqueConstraint;
