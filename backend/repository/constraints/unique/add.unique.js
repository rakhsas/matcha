import pool from '../../../src/config/database.js'; // Assuming pool is already defined

// Function to check if a unique constraint already exists
async function constraintExists(tableName, constraintName) {
    const query = `
        SELECT COUNT(*)
        FROM information_schema.table_constraints
        WHERE table_name = $1
        AND constraint_name = $2;
    `;

    const result = await pool.query(query, [tableName, constraintName]);
    return result.rows[0].count > 0;
}

// Function to remove duplicates
async function removeDuplicates(column) {
    const removeDuplicatesQuery = `
        DELETE FROM users u1
        USING users u2
        WHERE u1.id < u2.id
        AND u1.${column} = u2.${column};
    `;
    await pool.query(removeDuplicatesQuery);
    console.log(`Duplicates in ${column} removed successfully.`);
}

// Function to add the unique constraint 
async function addUniqueConstraint(tableName, column) {
    const constraintName = `unique_${column}`;

    try {
        // Step 1: Check if the constraint already exists
        const exists = await constraintExists(tableName, constraintName);
        if (exists) {
            // console.log(`Constraint ${constraintName} already exists on ${tableName}.${column}`);
            return;
        }

        // Step 2: Check for duplicates
        const checkDuplicatesQuery = `
            SELECT ${column}, COUNT(*)
            FROM ${tableName}
            GROUP BY ${column}
            HAVING COUNT(*) > 1;
        `;
        const duplicatesResult = await pool.query(checkDuplicatesQuery);

        if (duplicatesResult.rows.length > 0) {
            console.log(`Duplicates found in ${column}, removing duplicates...`);
            // Remove duplicates
            await removeDuplicates(column);
        }

        // Step 3: Add the unique constraint 
        const addConstraintQuery = `
            ALTER TABLE ${tableName}
            ADD CONSTRAINT ${constraintName} UNIQUE (${column});
        `;
        await pool.query(addConstraintQuery);
        console.log(`UNIQUE constraint added to ${column} column on table ${tableName}`);
    } catch (error) {
        console.error(`Error adding UNIQUE constraint: ${error.message}`);
    }
}


export {
    addUniqueConstraint,
    removeDuplicates,
    constraintExists
}
// export 